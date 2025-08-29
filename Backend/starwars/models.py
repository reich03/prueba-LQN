from django.db import models
from django.core.validators import URLValidator
import uuid


class Planet(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    rotation_period = models.CharField(max_length=20, blank=True, null=True)
    orbital_period = models.CharField(max_length=20, blank=True, null=True)
    diameter = models.CharField(max_length=20, blank=True, null=True)
    climate = models.CharField(max_length=100, blank=True, null=True)
    gravity = models.CharField(max_length=50, blank=True, null=True)
    terrain = models.CharField(max_length=100, blank=True, null=True)
    surface_water = models.CharField(max_length=20, blank=True, null=True)
    population = models.CharField(max_length=50, blank=True, null=True)
    swapi_url = models.URLField(blank=True, null=True, validators=[URLValidator()])
    created = models.DateTimeField(auto_now_add=True)
    edited = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class Film(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=100, unique=True)
    episode_id = models.IntegerField(unique=True)
    opening_crawl = models.TextField()
    director = models.CharField(max_length=100)
    producer = models.CharField(max_length=200)
    release_date = models.DateField()
    planets = models.ManyToManyField(Planet, related_name='films', blank=True)
    swapi_url = models.URLField(blank=True, null=True, validators=[URLValidator()])
    created = models.DateTimeField(auto_now_add=True)
    edited = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['episode_id']

    def __str__(self):
        return f"Episode {self.episode_id}: {self.title}"


class Person(models.Model):
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('hermaphrodite', 'Hermaphrodite'),
        ('none', 'None'),
        ('n/a', 'N/A'),
        ('unknown', 'Unknown'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    height = models.CharField(max_length=10, blank=True, null=True)
    mass = models.CharField(max_length=10, blank=True, null=True)
    hair_color = models.CharField(max_length=50, blank=True, null=True)
    skin_color = models.CharField(max_length=50, blank=True, null=True)
    eye_color = models.CharField(max_length=50, blank=True, null=True)
    birth_year = models.CharField(max_length=20, blank=True, null=True)
    gender = models.CharField(max_length=15, choices=GENDER_CHOICES, blank=True, null=True)
    homeworld = models.ForeignKey(Planet, on_delete=models.SET_NULL, null=True, blank=True, related_name='residents')
    films = models.ManyToManyField(Film, related_name='characters', blank=True)
    swapi_url = models.URLField(blank=True, null=True, validators=[URLValidator()])
    created = models.DateTimeField(auto_now_add=True)
    edited = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name

    @property
    def film_count(self):
        return self.films.count()


class Species(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, unique=True)
    classification = models.CharField(max_length=100, blank=True, null=True)
    designation = models.CharField(max_length=100, blank=True, null=True)
    average_height = models.CharField(max_length=20, blank=True, null=True)
    skin_colors = models.CharField(max_length=200, blank=True, null=True)
    hair_colors = models.CharField(max_length=200, blank=True, null=True)
    eye_colors = models.CharField(max_length=200, blank=True, null=True)
    average_lifespan = models.CharField(max_length=20, blank=True, null=True)
    homeworld = models.ForeignKey(Planet, on_delete=models.SET_NULL, null=True, blank=True)
    language = models.CharField(max_length=100, blank=True, null=True)
    people = models.ManyToManyField(Person, related_name='species', blank=True)
    films = models.ManyToManyField(Film, related_name='species', blank=True)
    swapi_url = models.URLField(blank=True, null=True, validators=[URLValidator()])
    created = models.DateTimeField(auto_now_add=True)
    edited = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        verbose_name_plural = "Species"

    def __str__(self):
        return self.name