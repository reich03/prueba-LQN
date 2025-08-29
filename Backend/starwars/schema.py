import graphene
from graphene import relay, ObjectType, String, Int, Field, List
from graphene_django import DjangoObjectType
from graphene_django import DjangoConnectionField
from django.db.models import Q
from .models import Person, Film, Planet, Species


class PersonType(DjangoObjectType):
    class Meta:
        model = Person
        interfaces = (relay.Node,)
        fields = '__all__'

    film_count = Int()

    def resolve_film_count(self, info):
        return self.films.count()


class FilmType(DjangoObjectType):
    class Meta:
        model = Film
        interfaces = (relay.Node,)
        fields = '__all__'

    character_count = Int()
    planet_count = Int()

    def resolve_character_count(self, info):
        return self.characters.count()

    def resolve_planet_count(self, info):
        return self.planets.count()


class PlanetType(DjangoObjectType):
    class Meta:
        model = Planet
        interfaces = (relay.Node,)
        fields = '__all__'

    resident_count = Int()
    film_count = Int()

    def resolve_resident_count(self, info):
        return self.residents.count()

    def resolve_film_count(self, info):
        return self.films.count()


class SpeciesType(DjangoObjectType):
    class Meta:
        model = Species
        interfaces = (relay.Node,)
        fields = '__all__'

    people_count = Int()
    film_count = Int()

    def resolve_people_count(self, info):
        return self.people.count()

    def resolve_film_count(self, info):
        return self.films.count()


# Mutations
class CreatePersonMutation(graphene.Mutation):
    class Arguments:
        name = String(required=True)
        height = String()
        mass = String()
        hair_color = String()
        skin_color = String()
        eye_color = String()
        birth_year = String()
        gender = String()
        homeworld_id = String()

    person = Field(PersonType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, name, **kwargs):
        try:
            homeworld = None
            if kwargs.get('homeworld_id'):
                try:
                    homeworld = Planet.objects.get(id=kwargs['homeworld_id'])
                except Planet.DoesNotExist:
                    return CreatePersonMutation(
                        success=False,
                        errors=["Planet not found"]
                    )

            person = Person.objects.create(
                name=name,
                height=kwargs.get('height'),
                mass=kwargs.get('mass'),
                hair_color=kwargs.get('hair_color'),
                skin_color=kwargs.get('skin_color'),
                eye_color=kwargs.get('eye_color'),
                birth_year=kwargs.get('birth_year'),
                gender=kwargs.get('gender'),
                homeworld=homeworld
            )

            return CreatePersonMutation(
                person=person,
                success=True,
                errors=[]
            )
        except Exception as e:
            return CreatePersonMutation(
                success=False,
                errors=[str(e)]
            )


class CreatePlanetMutation(graphene.Mutation):
    class Arguments:
        name = String(required=True)
        rotation_period = String()
        orbital_period = String()
        diameter = String()
        climate = String()
        gravity = String()
        terrain = String()
        surface_water = String()
        population = String()

    planet = Field(PlanetType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, name, **kwargs):
        try:
            planet = Planet.objects.create(
                name=name,
                rotation_period=kwargs.get('rotation_period'),
                orbital_period=kwargs.get('orbital_period'),
                diameter=kwargs.get('diameter'),
                climate=kwargs.get('climate'),
                gravity=kwargs.get('gravity'),
                terrain=kwargs.get('terrain'),
                surface_water=kwargs.get('surface_water'),
                population=kwargs.get('population')
            )

            return CreatePlanetMutation(
                planet=planet,
                success=True,
                errors=[]
            )
        except Exception as e:
            return CreatePlanetMutation(
                success=False,
                errors=[str(e)]
            )


class CreateFilmMutation(graphene.Mutation):
    class Arguments:
        title = String(required=True)
        episode_id = Int(required=True)
        opening_crawl = String(required=True)
        director = String(required=True)
        producer = String(required=True)
        release_date = String(required=True)
        planet_ids = List(String)
        character_ids = List(String)

    film = Field(FilmType)
    success = graphene.Boolean()
    errors = graphene.List(graphene.String)

    def mutate(self, info, title, episode_id, opening_crawl, director, producer, release_date, **kwargs):
        try:
            from datetime import datetime
            release_date_obj = datetime.strptime(release_date, '%Y-%m-%d').date()

            film = Film.objects.create(
                title=title,
                episode_id=episode_id,
                opening_crawl=opening_crawl,
                director=director,
                producer=producer,
                release_date=release_date_obj
            )

            if kwargs.get('planet_ids'):
                planets = Planet.objects.filter(id__in=kwargs['planet_ids'])
                film.planets.set(planets)

            if kwargs.get('character_ids'):
                characters = Person.objects.filter(id__in=kwargs['character_ids'])
                film.characters.set(characters)

            return CreateFilmMutation(
                film=film,
                success=True,
                errors=[]
            )
        except Exception as e:
            return CreateFilmMutation(
                success=False,
                errors=[str(e)]
            )


class Query(ObjectType):
    all_people = DjangoConnectionField(PersonType)
    all_films = DjangoConnectionField(FilmType)
    all_planets = DjangoConnectionField(PlanetType)
    all_species = DjangoConnectionField(SpeciesType)

    person = relay.Node.Field(PersonType)
    film = relay.Node.Field(FilmType)
    planet = relay.Node.Field(PlanetType)
    species = relay.Node.Field(SpeciesType)

    search_people = Field(List(PersonType), name=String())
    films_by_character = Field(List(FilmType), character_id=String(required=True))
    characters_in_film = Field(List(PersonType), film_id=String(required=True))

    def resolve_search_people(self, info, name=None):
        queryset = Person.objects.all()
        if name:
            queryset = queryset.filter(
                Q(name__icontains=name)
            ).distinct()
        return queryset

    def resolve_films_by_character(self, info, character_id):
        try:
            person = Person.objects.get(id=character_id)
            return person.films.all()
        except Person.DoesNotExist:
            return []

    def resolve_characters_in_film(self, info, film_id):
        try:
            film = Film.objects.get(id=film_id)
            return film.characters.all()
        except Film.DoesNotExist:
            return []


class Mutation(ObjectType):
    create_person = CreatePersonMutation.Field()
    create_planet = CreatePlanetMutation.Field()
    create_film = CreateFilmMutation.Field()


schema = graphene.Schema(query=Query, mutation=Mutation)