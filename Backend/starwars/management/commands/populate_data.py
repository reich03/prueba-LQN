from sys import stdout
import requests
from django.core.management.base import BaseCommand
from django.db import transaction
from starwars.models import Person, Film, Planet, Species
from datetime import datetime


class Command(BaseCommand):
    help = 'Populate database with Star Wars data from SWAPI'

    def add_arguments(self, parser):
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force repopulation even if data exists',
        )

    def handle(self, *args, **options):
        if not options['force'] and Person.objects.exists():
            self.stdout.write(
                self.style.WARNING('Database already populated. Use --force to repopulate.')
            )
            return

        self.stdout.write('Starting data population...')
        
        try:
            with transaction.atomic():
                if options['force']:
                    self.stdout.write('Clearing existing data...')
                    Person.objects.all().delete()
                    Film.objects.all().delete()
                    Planet.objects.all().delete()
                    Species.objects.all().delete()

                self.populate_planets()
                self.populate_films()
                self.populate_people()
                self.populate_species()
                self.link_relationships()

            self.stdout.write(
                self.style.SUCCESS('Successfully populated database with Star Wars data!')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error populating data: {str(e)}')
            )

    def fetch_all_pages(self, url):
        """Fetch all pages from SWAPI endpoint"""
        results = []
        while url:
            try:
                response = requests.get(url, timeout=10, verify=False)
                response.raise_for_status()
                data = response.json()
                results.extend(data['results'])
                url = data['next']
            except requests.RequestException as e:
                self.stdout.write(
                    self.style.ERROR(f'Error fetching {url}: {str(e)}')
                )
                break
        return results

    def populate_planets(self):
        self.stdout.write('Populating planets...')
        planets_data = self.fetch_all_pages('https://swapi.dev/api/planets/')
        
        for planet_data in planets_data:
            planet, created = Planet.objects.get_or_create(
                name=planet_data['name'],
                defaults={
                    'rotation_period': planet_data.get('rotation_period', ''),
                    'orbital_period': planet_data.get('orbital_period', ''),
                    'diameter': planet_data.get('diameter', ''),
                    'climate': planet_data.get('climate', ''),
                    'gravity': planet_data.get('gravity', ''),
                    'terrain': planet_data.get('terrain', ''),
                    'surface_water': planet_data.get('surface_water', ''),
                    'population': planet_data.get('population', ''),
                    'swapi_url': planet_data['url'],
                }
            )
            if created:
                self.stdout.write(f'  Created planet: {planet.name}')

    def populate_films(self):
        self.stdout.write('Populating films...')
        films_data = self.fetch_all_pages('https://swapi.dev/api/films/')
        
        for film_data in films_data:
            # Parse release date
            release_date = datetime.strptime(film_data['release_date'], '%Y-%m-%d').date()
            
            film, created = Film.objects.get_or_create(
                title=film_data['title'],
                defaults={
                    'episode_id': film_data['episode_id'],
                    'opening_crawl': film_data['opening_crawl'],
                    'director': film_data['director'],
                    'producer': film_data['producer'],
                    'release_date': release_date,
                    'swapi_url': film_data['url'],
                }
            )
            if created:
                self.stdout.write(f'  Created film: {film.title}')

    def populate_people(self):
        self.stdout.write('Populating people...')
        people_data = self.fetch_all_pages('https://swapi.dev/api/people/')
        
        for person_data in people_data:
            # Get homeworld if exists
            homeworld = None
            if person_data.get('homeworld'):
                try:
                    homeworld_response = requests.get(person_data['homeworld'], verify=False)
                    homeworld_data = homeworld_response.json()
                    homeworld = Planet.objects.get(name=homeworld_data['name'])
                except (requests.RequestException, Planet.DoesNotExist):
                    pass

            person, created = Person.objects.get_or_create(
                name=person_data['name'],
                defaults={
                    'height': person_data.get('height', ''),
                    'mass': person_data.get('mass', ''),
                    'hair_color': person_data.get('hair_color', ''),
                    'skin_color': person_data.get('skin_color', ''),
                    'eye_color': person_data.get('eye_color', ''),
                    'birth_year': person_data.get('birth_year', ''),
                    'gender': person_data.get('gender', ''),
                    'homeworld': homeworld,
                    'swapi_url': person_data['url'],
                }
            )
            if created:
                self.stdout.write(f'  Created person: {person.name}')

    def populate_species(self):
        self.stdout.write('Populating species...')
        species_data = self.fetch_all_pages('https://swapi.dev/api/species/')
        
        for species_item in species_data:
            # Get homeworld if exists
            homeworld = None
            if species_item.get('homeworld'):
                try:
                    homeworld_response = requests.get(species_item['homeworld'], verify=False)
                    homeworld_data = homeworld_response.json()
                    homeworld = Planet.objects.get(name=homeworld_data['name'])
                except (requests.RequestException, Planet.DoesNotExist):
                    pass

            species, created = Species.objects.get_or_create(
                name=species_item['name'],
                defaults={
                    'classification': species_item.get('classification', ''),
                    'designation': species_item.get('designation', ''),
                    'average_height': species_item.get('average_height', ''),
                    'skin_colors': species_item.get('skin_colors', ''),
                    'hair_colors': species_item.get('hair_colors', ''),
                    'eye_colors': species_item.get('eye_colors', ''),
                    'average_lifespan': species_item.get('average_lifespan', ''),
                    'language': species_item.get('language', ''),
                    'homeworld': homeworld,
                    'swapi_url': species_item['url'],
                }
            )
            if created:
                self.stdout.write(f'  Created species: {species.name}')

    def link_relationships(self):
        self.stdout.write('Linking relationships...')
        
        # Link people to films
        people_data = self.fetch_all_pages('https://swapi.dev/api/people/')
        for person_data in people_data:
            try:
                person = Person.objects.get(name=person_data['name'])
                for film_url in person_data['films']:
                    film_response = requests.get(film_url, verify=False)
                    film_data = film_response.json()
                    film = Film.objects.get(title=film_data['title'])
                    person.films.add(film)
            except (Person.DoesNotExist, Film.DoesNotExist, requests.RequestException):
                continue

        # Link planets to films
        films_data = self.fetch_all_pages('https://swapi.dev/api/films/')
        for film_data in films_data:
            try:
                film = Film.objects.get(title=film_data['title'])
                for planet_url in film_data['planets']:
                    planet_response = requests.get(planet_url, verify=False)
                    planet_data = planet_response.json()
                    planet = Planet.objects.get(name=planet_data['name'])
                    film.planets.add(planet)
            except (Film.DoesNotExist, Planet.DoesNotExist, requests.RequestException):
                continue

        # Link species to people and films
        species_data = self.fetch_all_pages('https://swapi.dev/api/species/')
        for species_item in species_data:
            try:
                species = Species.objects.get(name=species_item['name'])
                
                # Link to people
                for person_url in species_item['people']:
                    person_response = requests.get(person_url, verify=False)
                    person_data = person_response.json()
                    person = Person.objects.get(name=person_data['name'])
                    species.people.add(person)
                
                # Link to films
                for film_url in species_item['films']:
                    film_response = requests.get(film_url, verify=False)
                    film_data = film_response.json()
                    film = Film.objects.get(title=film_data['title'])
                    species.films.add(film)
                    
            except (Species.DoesNotExist, Person.DoesNotExist, Film.DoesNotExist, requests.RequestException):
                continue

        self.stdout.write('Relationships linked successfully!')