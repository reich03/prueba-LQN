from django.contrib import admin
from .models import Person, Film, Planet, Species


@admin.register(Planet)
class PlanetAdmin(admin.ModelAdmin):
    list_display = ['name', 'climate', 'terrain', 'population', 'created']
    list_filter = ['climate', 'created']
    search_fields = ['name', 'climate', 'terrain']
    readonly_fields = ['id', 'created', 'edited']
    filter_horizontal = []

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'climate', 'terrain')
        }),
        ('Physical Properties', {
            'fields': ('rotation_period', 'orbital_period', 'diameter', 'gravity', 'surface_water')
        }),
        ('Demographics', {
            'fields': ('population',)
        }),
        ('External Links', {
            'fields': ('swapi_url',)
        }),
        ('Metadata', {
            'fields': ('id', 'created', 'edited'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Film)
class FilmAdmin(admin.ModelAdmin):
    list_display = ['title', 'episode_id', 'director', 'release_date', 'created']
    list_filter = ['director', 'release_date', 'created']
    search_fields = ['title', 'director', 'producer', 'opening_crawl']
    readonly_fields = ['id', 'created', 'edited']
    filter_horizontal = ['planets']

    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'episode_id', 'release_date')
        }),
        ('Production', {
            'fields': ('director', 'producer')
        }),
        ('Content', {
            'fields': ('opening_crawl',)
        }),
        ('Relationships', {
            'fields': ('planets',)
        }),
        ('External Links', {
            'fields': ('swapi_url',)
        }),
        ('Metadata', {
            'fields': ('id', 'created', 'edited'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Person)
class PersonAdmin(admin.ModelAdmin):
    list_display = ['name', 'gender', 'birth_year', 'homeworld', 'film_count', 'created']
    list_filter = ['gender', 'homeworld', 'created']
    search_fields = ['name', 'birth_year']
    readonly_fields = ['id', 'film_count', 'created', 'edited']
    filter_horizontal = ['films']

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'gender', 'birth_year')
        }),
        ('Physical Characteristics', {
            'fields': ('height', 'mass', 'hair_color', 'skin_color', 'eye_color')
        }),
        ('Relationships', {
            'fields': ('homeworld', 'films')
        }),
        ('Statistics', {
            'fields': ('film_count',),
            'classes': ('collapse',)
        }),
        ('External Links', {
            'fields': ('swapi_url',)
        }),
        ('Metadata', {
            'fields': ('id', 'created', 'edited'),
            'classes': ('collapse',)
        }),
    )


@admin.register(Species)
class SpeciesAdmin(admin.ModelAdmin):
    list_display = ['name', 'classification', 'designation', 'homeworld', 'created']
    list_filter = ['classification', 'designation', 'homeworld', 'created']
    search_fields = ['name', 'classification', 'language']
    readonly_fields = ['id', 'created', 'edited']
    filter_horizontal = ['people', 'films']

    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'classification', 'designation', 'language')
        }),
        ('Physical Characteristics', {
            'fields': ('average_height', 'skin_colors', 'hair_colors', 'eye_colors', 'average_lifespan')
        }),
        ('Origin', {
            'fields': ('homeworld',)
        }),
        ('Relationships', {
            'fields': ('people', 'films')
        }),
        ('External Links', {
            'fields': ('swapi_url',)
        }),
        ('Metadata', {
            'fields': ('id', 'created', 'edited'),
            'classes': ('collapse',)
        }),
    )