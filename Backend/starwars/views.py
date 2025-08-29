from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator
from django.db.models import Q
from .models import Person, Film, Planet, Species
import json


@csrf_exempt
@require_http_methods(["GET"])
def status_view(request):
    """API status endpoint"""
    return JsonResponse({
        'status': 'ok',
        'message': 'Star Wars API is running',
        'version': '1.0.0'
    })


@csrf_exempt
@require_http_methods(["GET"])
def stats_view(request):
    """API statistics endpoint"""
    try:
        stats = {
            'total_people': Person.objects.count(),
            'total_films': Film.objects.count(),
            'total_planets': Planet.objects.count(),
            'total_species': Species.objects.count(),
        }
        return JsonResponse(stats)
    except Exception as e:
        return JsonResponse({
            'error': 'Failed to fetch statistics',
            'message': str(e)
        }, status=500)


# NUEVOS ENDPOINTS PARA CUMPLIR ESPECÍFICAMENTE LOS REQUISITOS DEL CHALLENGE
@csrf_exempt
@require_http_methods(["GET"])
def characters_list_view(request):
    """
    Ver un listado de todos los personajes del universo Star Wars
    Con opción de filtrar por nombre (Requisito 1)
    GET /api/characters/?name=luke&page=1&page_size=10
    """
    try:
        # Filtros
        name_filter = request.GET.get('name', '')
        page = int(request.GET.get('page', 1))
        page_size = min(int(request.GET.get('page_size', 20)), 100)
        
        # Query optimizado con select_related y prefetch_related
        queryset = Person.objects.select_related('homeworld').prefetch_related('films')
        
        # Filtrar por nombre si se proporciona
        if name_filter:
            queryset = queryset.filter(name__icontains=name_filter)
        
        # Paginación
        paginator = Paginator(queryset, page_size)
        page_obj = paginator.get_page(page)
        
        # Serializar datos
        characters = []
        for character in page_obj:
            characters.append({
                'id': str(character.id),
                'name': character.name,
                'gender': character.gender,
                'birth_year': character.birth_year,
                'height': character.height,
                'mass': character.mass,
                'hair_color': character.hair_color,
                'skin_color': character.skin_color,
                'eye_color': character.eye_color,
                'homeworld': {
                    'id': str(character.homeworld.id) if character.homeworld else None,
                    'name': character.homeworld.name if character.homeworld else None,
                    'climate': character.homeworld.climate if character.homeworld else None,
                    'terrain': character.homeworld.terrain if character.homeworld else None,
                } if character.homeworld else None,
                'films_count': character.films.count(),
                'films_url': f'/api/characters/{character.id}/films/',
                'created': character.created.isoformat(),
            })
        
        return JsonResponse({
            'results': characters,
            'count': paginator.count,
            'page': page,
            'total_pages': paginator.num_pages,
            'has_next': page_obj.has_next(),
            'has_previous': page_obj.has_previous(),
        })
        
    except Exception as e:
        return JsonResponse({
            'error': 'Failed to fetch characters',
            'message': str(e)
        }, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def character_films_view(request, character_id):
    """
    Para cada personaje, consultar las películas en las que aparece (Requisito principal)
    Con todos los datos requeridos: opening_crawl, planetas, director, productores, etc.
    GET /api/characters/{id}/films/
    """
    try:
        character = Person.objects.select_related('homeworld').prefetch_related(
            'films__planets'
        ).get(id=character_id)
        
        # Serializar películas con TODOS los detalles requeridos
        films = []
        for film in character.films.all().order_by('episode_id'):
            films.append({
                'id': str(film.id),
                'title': film.title,
                'episode_id': film.episode_id,
                # TEXTO DE APERTURA (requerido)
                'opening_crawl': film.opening_crawl,
                # DIRECTOR (requerido)
                'director': film.director,
                # PRODUCTORES (requerido)
                'producer': film.producer,
                'release_date': film.release_date.isoformat(),
                # PLANETAS QUE APARECEN (requerido)
                'planets': [
                    {
                        'id': str(planet.id),
                        'name': planet.name,
                        'climate': planet.climate,
                        'terrain': planet.terrain,
                        'population': planet.population,
                        'diameter': planet.diameter,
                        'gravity': planet.gravity,
                        'surface_water': planet.surface_water,
                        'rotation_period': planet.rotation_period,
                        'orbital_period': planet.orbital_period,
                    } for planet in film.planets.all()
                ],
                # OTROS DATOS RELEVANTES
                'character_count': film.characters.count(),
                'created': film.created.isoformat(),
                'swapi_url': film.swapi_url,
            })
        
        character_data = {
            'character': {
                'id': str(character.id),
                'name': character.name,
                'gender': character.gender,
                'birth_year': character.birth_year,
                'homeworld': character.homeworld.name if character.homeworld else None,
            },
            'films': films,
            'total_films': len(films)
        }
        
        return JsonResponse(character_data)
        
    except Person.DoesNotExist:
        return JsonResponse({
            'error': 'Character not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'error': 'Failed to fetch character films',
            'message': str(e)
        }, status=500)


@csrf_exempt 
@require_http_methods(["GET"])
def character_detail_view(request, character_id):
    """
    Detalle completo de un personaje
    GET /api/characters/{id}/
    """
    try:
        character = Person.objects.select_related('homeworld').prefetch_related(
            'films', 'species'
        ).get(id=character_id)
        
        character_data = {
            'id': str(character.id),
            'name': character.name,
            'gender': character.gender,
            'birth_year': character.birth_year,
            'height': character.height,
            'mass': character.mass,
            'hair_color': character.hair_color,
            'skin_color': character.skin_color,
            'eye_color': character.eye_color,
            'homeworld': {
                'id': str(character.homeworld.id),
                'name': character.homeworld.name,
                'climate': character.homeworld.climate,
                'terrain': character.homeworld.terrain,
                'population': character.homeworld.population,
            } if character.homeworld else None,
            'films_count': character.films.count(),
            'films_url': f'/api/characters/{character.id}/films/',
            'created': character.created.isoformat(),
        }
        
        return JsonResponse(character_data)
        
    except Person.DoesNotExist:
        return JsonResponse({
            'error': 'Character not found'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'error': 'Failed to fetch character details',
            'message': str(e)
        }, status=500)


# Endpoints adicionales útiles
@csrf_exempt
@require_http_methods(["GET"])
def films_list_view(request):
    """Lista todas las películas"""
    try:
        films = Film.objects.prefetch_related('planets', 'characters').order_by('episode_id')
        
        films_data = []
        for film in films:
            films_data.append({
                'id': str(film.id),
                'title': film.title,
                'episode_id': film.episode_id,
                'director': film.director,
                'producer': film.producer,
                'release_date': film.release_date.isoformat(),
                'character_count': film.characters.count(),
                'planet_count': film.planets.count(),
            })
        
        return JsonResponse({
            'results': films_data,
            'count': len(films_data)
        })
        
    except Exception as e:
        return JsonResponse({
            'error': 'Failed to fetch films',
            'message': str(e)
        }, status=500)


@csrf_exempt
@require_http_methods(["GET"])
def planets_list_view(request):
    """Lista todos los planetas"""
    try:
        planets = Planet.objects.prefetch_related('residents', 'films')
        
        planets_data = []
        for planet in planets:
            planets_data.append({
                'id': str(planet.id),
                'name': planet.name,
                'climate': planet.climate,
                'terrain': planet.terrain,
                'population': planet.population,
                'resident_count': planet.residents.count(),
                'film_count': planet.films.count(),
            })
        
        return JsonResponse({
            'results': planets_data,
            'count': len(planets_data)
        })
        
    except Exception as e:
        return JsonResponse({
            'error': 'Failed to fetch planets',
            'message': str(e)
        }, status=500)