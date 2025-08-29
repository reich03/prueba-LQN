import pytest
from django.test import TestCase
from graphene.test import Client
from graphql_relay import to_global_id
import json
from datetime import date

from starwars.models import Person, Film, Planet, Species
from starwars.schema import schema


class ModelsTestCase(TestCase):
    def setUp(self):
        self.planet = Planet.objects.create(
            name="Tatooine",
            climate="arid",
            terrain="desert",
            population="200000"
        )
        
        self.film = Film.objects.create(
            title="A New Hope",
            episode_id=4,
            opening_crawl="It is a period of civil war...",
            director="George Lucas",
            producer="Gary Kurtz, Rick McCallum",
            release_date=date(1977, 5, 25)
        )
        
        self.person = Person.objects.create(
            name="Luke Skywalker",
            height="172",
            mass="77",
            hair_color="blond",
            eye_color="blue",
            birth_year="19BBY",
            gender="male",
            homeworld=self.planet
        )

    def test_planet_creation(self):
        self.assertEqual(self.planet.name, "Tatooine")
        self.assertEqual(str(self.planet), "Tatooine")
        self.assertEqual(self.planet.climate, "arid")

    def test_film_creation(self):
        self.assertEqual(self.film.title, "A New Hope")
        self.assertEqual(self.film.episode_id, 4)
        self.assertEqual(str(self.film), "Episode 4: A New Hope")

    def test_person_creation(self):
        self.assertEqual(self.person.name, "Luke Skywalker")
        self.assertEqual(self.person.homeworld, self.planet)
        self.assertEqual(str(self.person), "Luke Skywalker")

    def test_relationships(self):
        # Add person to film
        self.person.films.add(self.film)
        self.film.planets.add(self.planet)
        
        # Test relationships
        self.assertIn(self.person, self.film.characters.all())
        self.assertIn(self.film, self.person.films.all())
        self.assertIn(self.planet, self.film.planets.all())
        
        # Test counts
        self.assertEqual(self.person.film_count, 1)

    def test_planet_residents(self):
        self.assertIn(self.person, self.planet.residents.all())


class GraphQLTestCase(TestCase):
    def setUp(self):
        self.client = Client(schema)
        
        # Create test data
        self.planet = Planet.objects.create(
            name="Alderaan",
            climate="temperate",
            terrain="grasslands, mountains",
            population="2000000000"
        )
        
        self.film = Film.objects.create(
            title="The Empire Strikes Back",
            episode_id=5,
            opening_crawl="It is a dark time for the Rebellion...",
            director="Irvin Kershner",
            producer="Gary Kurtz, Rick McCallum",
            release_date=date(1980, 5, 17)
        )
        
        self.person = Person.objects.create(
            name="Princess Leia",
            height="150",
            mass="49",
            hair_color="brown",
            eye_color="brown",
            birth_year="19BBY",
            gender="female",
            homeworld=self.planet
        )
        
        self.person.films.add(self.film)
        self.film.planets.add(self.planet)

    def test_query_all_people(self):
        query = '''
            query {
                allPeople {
                    edges {
                        node {
                            id
                            name
                            height
                            homeworld {
                                name
                            }
                        }
                    }
                }
            }
        '''
        
        result = self.client.execute(query)
        self.assertIsNone(result.get('errors'))
        
        people = result['data']['allPeople']['edges']
        self.assertEqual(len(people), 1)
        self.assertEqual(people[0]['node']['name'], 'Princess Leia')
        self.assertEqual(people[0]['node']['homeworld']['name'], 'Alderaan')

    def test_query_all_films(self):
        query = '''
            query {
                allFilms {
                    edges {
                        node {
                            id
                            title
                            episodeId
                            director
                            openingCrawl
                            characterCount
                            planetCount
                        }
                    }
                }
            }
        '''
        
        result = self.client.execute(query)
        self.assertIsNone(result.get('errors'))
        
        films = result['data']['allFilms']['edges']
        self.assertEqual(len(films), 1)
        self.assertEqual(films[0]['node']['title'], 'The Empire Strikes Back')
        self.assertEqual(films[0]['node']['characterCount'], 1)
        self.assertEqual(films[0]['node']['planetCount'], 1)

    def test_search_people(self):
        query = '''
            query {
                searchPeople(name: "Leia") {
                    id
                    name
                    filmCount
                }
            }
        '''
        
        result = self.client.execute(query)
        self.assertIsNone(result.get('errors'))
        
        people = result['data']['searchPeople']
        self.assertEqual(len(people), 1)
        self.assertEqual(people[0]['name'], 'Princess Leia')

    def test_films_by_character(self):
        query = f'''
            query {{
                filmsByCharacter(characterId: "{self.person.id}") {{
                    id
                    title
                    episodeId
                }}
            }}
        '''
        
        result = self.client.execute(query)
        self.assertIsNone(result.get('errors'))
        
        films = result['data']['filmsByCharacter']
        self.assertEqual(len(films), 1)
        self.assertEqual(films[0]['title'], 'The Empire Strikes Back')

    def test_characters_in_film(self):
        query = f'''
            query {{
                charactersInFilm(filmId: "{self.film.id}") {{
                    id
                    name
                    homeworld {{
                        name
                    }}
                }}
            }}
        '''
        
        result = self.client.execute(query)
        self.assertIsNone(result.get('errors'))
        
        characters = result['data']['charactersInFilm']
        self.assertEqual(len(characters), 1)
        self.assertEqual(characters[0]['name'], 'Princess Leia')


class MutationTestCase(TestCase):
    def setUp(self):
        self.client = Client(schema)
        
        self.planet = Planet.objects.create(
            name="Coruscant",
            climate="temperate",
            terrain="cityscape, mountains",
            population="1000000000000"
        )

    def test_create_person_mutation(self):
        mutation = f'''
            mutation {{
                createPerson(
                    name: "Anakin Skywalker"
                    height: "188"
                    mass: "84"
                    hairColor: "blond"
                    eyeColor: "blue"
                    birthYear: "41.9BBY"
                    gender: "male"
                    homeworldId: "{self.planet.id}"
                ) {{
                    success
                    errors
                    person {{
                        id
                        name
                        homeworld {{
                            name
                        }}
                    }}
                }}
            }}
        '''
        
        result = self.client.execute(mutation)
        self.assertIsNone(result.get('errors'))
        
        data = result['data']['createPerson']
        self.assertTrue(data['success'])
        self.assertEqual(data['errors'], [])
        self.assertEqual(data['person']['name'], 'Anakin Skywalker')
        self.assertEqual(data['person']['homeworld']['name'], 'Coruscant')
        
        # Verify person was created in database
        person = Person.objects.get(name='Anakin Skywalker')
        self.assertEqual(person.homeworld, self.planet)

    def test_create_planet_mutation(self):
        mutation = '''
            mutation {
                createPlanet(
                    name: "Naboo"
                    climate: "temperate"
                    terrain: "grassy hills, swamps, forests, mountains"
                    population: "4500000000"
                ) {
                    success
                    errors
                    planet {
                        id
                        name
                        climate
                    }
                }
            }
        '''
        
        result = self.client.execute(mutation)
        self.assertIsNone(result.get('errors'))
        
        data = result['data']['createPlanet']
        self.assertTrue(data['success'])
        self.assertEqual(data['errors'], [])
        self.assertEqual(data['planet']['name'], 'Naboo')
        
        # Verify planet was created in database
        planet = Planet.objects.get(name='Naboo')
        self.assertEqual(planet.climate, 'temperate')

    def test_create_film_mutation(self):
        mutation = f'''
            mutation {{
                createFilm(
                    title: "Revenge of the Sith"
                    episodeId: 3
                    openingCrawl: "War! The Republic is crumbling..."
                    director: "George Lucas"
                    producer: "Rick McCallum"
                    releaseDate: "2005-05-19"
                    planetIds: ["{self.planet.id}"]
                ) {{
                    success
                    errors
                    film {{
                        id
                        title
                        episodeId
                        planets {{
                            edges {{
                                node {{
                                    name
                                }}
                            }}
                        }}
                    }}
                }}
            }}
        '''
        
        result = self.client.execute(mutation)
        self.assertIsNone(result.get('errors'))
        
        data = result['data']['createFilm']
        self.assertTrue(data['success'])
        self.assertEqual(data['errors'], [])
        self.assertEqual(data['film']['title'], 'Revenge of the Sith')
        
        # Verify film was created and linked to planet
        film = Film.objects.get(title='Revenge of the Sith')
        self.assertIn(self.planet, film.planets.all())

    def test_create_person_with_invalid_planet(self):
        mutation = '''
            mutation {
                createPerson(
                    name: "Test Character"
                    homeworldId: "invalid-uuid"
                ) {
                    success
                    errors
                    person {
                        name
                    }
                }
            }
        '''
        
        result = self.client.execute(mutation)
        self.assertIsNone(result.get('errors'))
        
        data = result['data']['createPerson']
        self.assertFalse(data['success'])
        self.assertIn("Planet not found", data['errors'])
        self.assertIsNone(data['person'])


# Integration Tests
@pytest.mark.django_db
class IntegrationTestCase(TestCase):
    def setUp(self):
        self.client = Client(schema)
        
        # Create a complex scenario with multiple related objects
        self.planets = [
            Planet.objects.create(name="Tatooine", climate="arid"),
            Planet.objects.create(name="Alderaan", climate="temperate"),
            Planet.objects.create(name="Hoth", climate="frozen"),
        ]
        
        self.films = [
            Film.objects.create(
                title="A New Hope", episode_id=4,
                opening_crawl="It is a period of civil war...",
                director="George Lucas", producer="Gary Kurtz",
                release_date=date(1977, 5, 25)
            ),
            Film.objects.create(
                title="The Empire Strikes Back", episode_id=5,
                opening_crawl="It is a dark time for the Rebellion...",
                director="Irvin Kershner", producer="Gary Kurtz",
                release_date=date(1980, 5, 17)
            ),
        ]
        
        self.people = [
            Person.objects.create(
                name="Luke Skywalker", homeworld=self.planets[0]
            ),
            Person.objects.create(
                name="Princess Leia", homeworld=self.planets[1]
            ),
        ]
        
        # Create relationships
        for person in self.people:
            for film in self.films:
                person.films.add(film)
        
        for film in self.films:
            for planet in self.planets:
                film.planets.add(planet)

    def test_complex_query_with_relationships(self):
        query = '''
            query {
                allFilms {
                    edges {
                        node {
                            title
                            characters {
                                edges {
                                    node {
                                        name
                                        homeworld {
                                            name
                                        }
                                    }
                                }
                            }
                            planets {
                                edges {
                                    node {
                                        name
                                        residents {
                                            edges {
                                                node {
                                                    name
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        '''
        
        result = self.client.execute(query)
        self.assertIsNone(result.get('errors'))
        
        films = result['data']['allFilms']['edges']
        self.assertEqual(len(films), 2)
        
        # Verify each film has characters and planets
        for film_edge in films:
            film = film_edge['node']
            self.assertGreater(len(film['characters']['edges']), 0)
            self.assertGreater(len(film['planets']['edges']), 0)

    def test_search_and_filter_integration(self):
        # Search for Luke
        query = '''
            query {
                searchPeople(name: "Luke") {
                    name
                    films {
                        edges {
                            node {
                                title
                                episodeId
                            }
                        }
                    }
                }
            }
        '''
        
        result = self.client.execute(query)
        self.assertIsNone(result.get('errors'))
        
        people = result['data']['searchPeople']
        self.assertEqual(len(people), 1)
        self.assertEqual(people[0]['name'], 'Luke Skywalker')
        self.assertEqual(len(people[0]['films']['edges']), 2)