from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator
from django.db.models import Q
from .models import Person, Film, Planet, Species
import json

# Imports para Django REST Framework y documentación
from rest_framework.decorators import api_view
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi


# Parámetros comunes para la documentación
name_param = openapi.Parameter(
    'name',
    openapi.IN_QUERY,
    description="Filtrar personajes por nombre (búsqueda insensible a mayúsculas)",
    type=openapi.TYPE_STRING,
    required=False,
    example="luke"
)

page_param = openapi.Parameter(
    'page',
    openapi.IN_QUERY,
    description="Número de página para la paginación",
    type=openapi.TYPE_INTEGER,
    required=False,
    default=1,
    minimum=1
)

page_size_param = openapi.Parameter(
    'page_size',
    openapi.IN_QUERY,
    description="Número de elementos por página (máximo 100)",
    type=openapi.TYPE_INTEGER,
    required=False,
    default=20,
    minimum=1,
    maximum=100
)

# Respuestas comunes
error_response = openapi.Response(
    description="Error en la operación",
    schema=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'error': openapi.Schema(type=openapi.TYPE_STRING, description="Tipo de error"),
            'message': openapi.Schema(type=openapi.TYPE_STRING, description="Descripción del error")
        }
    )
)


@swagger_auto_schema(
    method='get',
    operation_summary="Estado de la API",
    operation_description="Verifica que la API Star Wars está funcionando correctamente",
    responses={
        200: openapi.Response(
            description="API funcionando correctamente",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'status': openapi.Schema(type=openapi.TYPE_STRING, example="ok"),
                    'message': openapi.Schema(type=openapi.TYPE_STRING, example="Star Wars API is running"),
                    'version': openapi.Schema(type=openapi.TYPE_STRING, example="1.0.0")
                }
            )
        )
    },
    tags=['System']
)
@api_view(['GET'])
@csrf_exempt
def status_view(request):
    """API status endpoint"""
    return JsonResponse({
        'status': 'ok',
        'message': 'Star Wars API is running',
        'version': '1.0.0'
    })


@swagger_auto_schema(
    method='get',
    operation_summary="Estadísticas de la base de datos",
    operation_description="Obtiene el conteo total de personajes, películas, planetas y especies",
    responses={
        200: openapi.Response(
            description="Estadísticas obtenidas exitosamente",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'total_people': openapi.Schema(type=openapi.TYPE_INTEGER, description="Total de personajes"),
                    'total_films': openapi.Schema(type=openapi.TYPE_INTEGER, description="Total de películas"),
                    'total_planets': openapi.Schema(type=openapi.TYPE_INTEGER, description="Total de planetas"),
                    'total_species': openapi.Schema(type=openapi.TYPE_INTEGER, description="Total de especies")
                }
            )
        ),
        500: error_response
    },
    tags=['System']
)
@api_view(['GET'])
@csrf_exempt
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


@swagger_auto_schema(
    method='get',
    operation_summary="Lista de personajes de Star Wars",
    operation_description="""
    Obtiene un listado paginado de todos los personajes del universo Star Wars.
    
    **Características:**
    - Paginación automática (20 elementos por página por defecto)
    - Filtro por nombre (búsqueda insensible a mayúsculas)
    - Incluye información del planeta natal
    - Optimizado con select_related y prefetch_related
    
    **Ejemplos:**
    - `/api/starwars/characters/` - Todos los personajes
    - `/api/starwars/characters/?name=luke` - Personajes que contengan "luke"
    - `/api/starwars/characters/?page=2&page_size=10` - Segunda página con 10 elementos
    """,
    manual_parameters=[name_param, page_param, page_size_param],
    responses={
        200: openapi.Response(
            description="Lista de personajes obtenida exitosamente",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'results': openapi.Schema(
                        type=openapi.TYPE_ARRAY,
                        items=openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                'id': openapi.Schema(type=openapi.TYPE_STRING, format='uuid'),
                                'name': openapi.Schema(type=openapi.TYPE_STRING, example="Luke Skywalker"),
                                'gender': openapi.Schema(type=openapi.TYPE_STRING, example="male"),
                                'birth_year': openapi.Schema(type=openapi.TYPE_STRING, example="19BBY"),
                                'height': openapi.Schema(type=openapi.TYPE_STRING, example="172"),
                                'mass': openapi.Schema(type=openapi.TYPE_STRING, example="77"),
                                'hair_color': openapi.Schema(type=openapi.TYPE_STRING, example="blond"),
                                'skin_color': openapi.Schema(type=openapi.TYPE_STRING, example="fair"),
                                'eye_color': openapi.Schema(type=openapi.TYPE_STRING, example="blue"),
                                'homeworld': openapi.Schema(
                                    type=openapi.TYPE_OBJECT,
                                    properties={
                                        'id': openapi.Schema(type=openapi.TYPE_STRING, format='uuid'),
                                        'name': openapi.Schema(type=openapi.TYPE_STRING, example="Tatooine"),
                                        'climate': openapi.Schema(type=openapi.TYPE_STRING, example="arid"),
                                        'terrain': openapi.Schema(type=openapi.TYPE_STRING, example="desert")
                                    }
                                ),
                                'films_count': openapi.Schema(type=openapi.TYPE_INTEGER, example=4),
                                'films_url': openapi.Schema(type=openapi.TYPE_STRING, example="/api/characters/uuid/films/"),
                                'created': openapi.Schema(type=openapi.TYPE_STRING, format='date-time')
                            }
                        )
                    ),
                    'count': openapi.Schema(type=openapi.TYPE_INTEGER, description="Total de personajes"),
                    'page': openapi.Schema(type=openapi.TYPE_INTEGER, description="Página actual"),
                    'total_pages': openapi.Schema(type=openapi.TYPE_INTEGER, description="Total de páginas"),
                    'has_next': openapi.Schema(type=openapi.TYPE_BOOLEAN, description="Hay página siguiente"),
                    'has_previous': openapi.Schema(type=openapi.TYPE_BOOLEAN, description="Hay página anterior")
                }
            )
        ),
        500: error_response
    },
    tags=['Characters']
)
@api_view(['GET'])
@csrf_exempt
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


@swagger_auto_schema(
    method='get',
    operation_summary="Películas de un personaje",
    operation_description="""
    Obtiene todas las películas en las que aparece un personaje específico.
    
    **Información incluida:**
    - Opening crawl completo de cada película
    - Director y productores
    - Planetas que aparecen en cada película
    - Fecha de lanzamiento
    - Conteo de personajes
    
    Este es el endpoint principal del challenge que muestra toda la información detallada requerida.
    """,
    manual_parameters=[
        openapi.Parameter(
            'character_id',
            openapi.IN_PATH,
            description="UUID único del personaje",
            type=openapi.TYPE_STRING,
            format='uuid',
            required=True
        )
    ],
    responses={
        200: openapi.Response(
            description="Películas del personaje obtenidas exitosamente",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'character': openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'id': openapi.Schema(type=openapi.TYPE_STRING, format='uuid'),
                            'name': openapi.Schema(type=openapi.TYPE_STRING, example="Luke Skywalker"),
                            'gender': openapi.Schema(type=openapi.TYPE_STRING, example="male"),
                            'birth_year': openapi.Schema(type=openapi.TYPE_STRING, example="19BBY"),
                            'homeworld': openapi.Schema(type=openapi.TYPE_STRING, example="Tatooine")
                        }
                    ),
                    'films': openapi.Schema(
                        type=openapi.TYPE_ARRAY,
                        items=openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                'id': openapi.Schema(type=openapi.TYPE_STRING, format='uuid'),
                                'title': openapi.Schema(type=openapi.TYPE_STRING, example="A New Hope"),
                                'episode_id': openapi.Schema(type=openapi.TYPE_INTEGER, example=4),
                                'opening_crawl': openapi.Schema(
                                    type=openapi.TYPE_STRING, 
                                    description="Texto de apertura completo de la película"
                                ),
                                'director': openapi.Schema(type=openapi.TYPE_STRING, example="George Lucas"),
                                'producer': openapi.Schema(type=openapi.TYPE_STRING, example="Gary Kurtz, Rick McCallum"),
                                'release_date': openapi.Schema(type=openapi.TYPE_STRING, format='date'),
                                'planets': openapi.Schema(
                                    type=openapi.TYPE_ARRAY,
                                    items=openapi.Schema(
                                        type=openapi.TYPE_OBJECT,
                                        properties={
                                            'id': openapi.Schema(type=openapi.TYPE_STRING, format='uuid'),
                                            'name': openapi.Schema(type=openapi.TYPE_STRING, example="Tatooine"),
                                            'climate': openapi.Schema(type=openapi.TYPE_STRING, example="arid"),
                                            'terrain': openapi.Schema(type=openapi.TYPE_STRING, example="desert"),
                                            'population': openapi.Schema(type=openapi.TYPE_STRING, example="200000"),
                                            'diameter': openapi.Schema(type=openapi.TYPE_STRING, example="10465"),
                                            'gravity': openapi.Schema(type=openapi.TYPE_STRING, example="1 standard"),
                                            'surface_water': openapi.Schema(type=openapi.TYPE_STRING, example="1"),
                                            'rotation_period': openapi.Schema(type=openapi.TYPE_STRING, example="23"),
                                            'orbital_period': openapi.Schema(type=openapi.TYPE_STRING, example="304")
                                        }
                                    )
                                ),
                                'character_count': openapi.Schema(type=openapi.TYPE_INTEGER, example=18),
                                'created': openapi.Schema(type=openapi.TYPE_STRING, format='date-time'),
                                'swapi_url': openapi.Schema(type=openapi.TYPE_STRING, format='uri')
                            }
                        )
                    ),
                    'total_films': openapi.Schema(type=openapi.TYPE_INTEGER, description="Total de películas del personaje")
                }
            )
        ),
        404: openapi.Response(
            description="Personaje no encontrado",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error': openapi.Schema(type=openapi.TYPE_STRING, example="Character not found")
                }
            )
        ),
        500: error_response
    },
    tags=['Characters']
)
@api_view(['GET'])
@csrf_exempt
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


@swagger_auto_schema(
    method='get',
    operation_summary="Detalle completo de un personaje",
    operation_description="""
    Obtiene información detallada de un personaje específico.
    
    **Información incluida:**
    - Datos físicos completos (altura, peso, colores)
    - Planeta natal con detalles
    - Conteo de películas en las que aparece
    - Enlaces a endpoints relacionados
    """,
    manual_parameters=[
        openapi.Parameter(
            'character_id',
            openapi.IN_PATH,
            description="UUID único del personaje",
            type=openapi.TYPE_STRING,
            format='uuid',
            required=True
        )
    ],
    responses={
        200: openapi.Response(
            description="Detalle del personaje obtenido exitosamente",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'id': openapi.Schema(type=openapi.TYPE_STRING, format='uuid'),
                    'name': openapi.Schema(type=openapi.TYPE_STRING, example="Luke Skywalker"),
                    'gender': openapi.Schema(type=openapi.TYPE_STRING, example="male"),
                    'birth_year': openapi.Schema(type=openapi.TYPE_STRING, example="19BBY"),
                    'height': openapi.Schema(type=openapi.TYPE_STRING, example="172"),
                    'mass': openapi.Schema(type=openapi.TYPE_STRING, example="77"),
                    'hair_color': openapi.Schema(type=openapi.TYPE_STRING, example="blond"),
                    'skin_color': openapi.Schema(type=openapi.TYPE_STRING, example="fair"),
                    'eye_color': openapi.Schema(type=openapi.TYPE_STRING, example="blue"),
                    'homeworld': openapi.Schema(
                        type=openapi.TYPE_OBJECT,
                        properties={
                            'id': openapi.Schema(type=openapi.TYPE_STRING, format='uuid'),
                            'name': openapi.Schema(type=openapi.TYPE_STRING, example="Tatooine"),
                            'climate': openapi.Schema(type=openapi.TYPE_STRING, example="arid"),
                            'terrain': openapi.Schema(type=openapi.TYPE_STRING, example="desert"),
                            'population': openapi.Schema(type=openapi.TYPE_STRING, example="200000")
                        }
                    ),
                    'films_count': openapi.Schema(type=openapi.TYPE_INTEGER, example=4),
                    'films_url': openapi.Schema(type=openapi.TYPE_STRING, example="/api/characters/uuid/films/"),
                    'created': openapi.Schema(type=openapi.TYPE_STRING, format='date-time')
                }
            )
        ),
        404: openapi.Response(
            description="Personaje no encontrado",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'error': openapi.Schema(type=openapi.TYPE_STRING, example="Character not found")
                }
            )
        ),
        500: error_response
    },
    tags=['Characters']
)
@api_view(['GET'])
@csrf_exempt 
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


@swagger_auto_schema(
    method='get',
    operation_summary="Lista todas las películas",
    operation_description="""
    Obtiene un listado completo de todas las películas de Star Wars ordenadas por episodio.
    
    **Información incluida:**
    - Título y número de episodio
    - Director y productores
    - Fecha de lanzamiento
    - Conteo de personajes y planetas
    """,
    responses={
        200: openapi.Response(
            description="Lista de películas obtenida exitosamente",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'results': openapi.Schema(
                        type=openapi.TYPE_ARRAY,
                        items=openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                'id': openapi.Schema(type=openapi.TYPE_STRING, format='uuid'),
                                'title': openapi.Schema(type=openapi.TYPE_STRING, example="A New Hope"),
                                'episode_id': openapi.Schema(type=openapi.TYPE_INTEGER, example=4),
                                'director': openapi.Schema(type=openapi.TYPE_STRING, example="George Lucas"),
                                'producer': openapi.Schema(type=openapi.TYPE_STRING, example="Gary Kurtz, Rick McCallum"),
                                'release_date': openapi.Schema(type=openapi.TYPE_STRING, format='date'),
                                'character_count': openapi.Schema(type=openapi.TYPE_INTEGER, example=18),
                                'planet_count': openapi.Schema(type=openapi.TYPE_INTEGER, example=3)
                            }
                        )
                    ),
                    'count': openapi.Schema(type=openapi.TYPE_INTEGER, description="Total de películas")
                }
            )
        ),
        500: error_response
    },
    tags=['Films']
)
@api_view(['GET'])
@csrf_exempt
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


@swagger_auto_schema(
    method='get',
    operation_summary="Lista todos los planetas",
    operation_description="""
    Obtiene un listado completo de todos los planetas del universo Star Wars.
    
    **Información incluida:**
    - Nombre del planeta
    - Clima y terreno
    - Población
    - Conteo de residentes y películas donde aparece
    """,
    responses={
        200: openapi.Response(
            description="Lista de planetas obtenida exitosamente",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'results': openapi.Schema(
                        type=openapi.TYPE_ARRAY,
                        items=openapi.Schema(
                            type=openapi.TYPE_OBJECT,
                            properties={
                                'id': openapi.Schema(type=openapi.TYPE_STRING, format='uuid'),
                                'name': openapi.Schema(type=openapi.TYPE_STRING, example="Tatooine"),
                                'climate': openapi.Schema(type=openapi.TYPE_STRING, example="arid"),
                                'terrain': openapi.Schema(type=openapi.TYPE_STRING, example="desert"),
                                'population': openapi.Schema(type=openapi.TYPE_STRING, example="200000"),
                                'resident_count': openapi.Schema(type=openapi.TYPE_INTEGER, example=10),
                                'film_count': openapi.Schema(type=openapi.TYPE_INTEGER, example=5)
                            }
                        )
                    ),
                    'count': openapi.Schema(type=openapi.TYPE_INTEGER, description="Total de planetas")
                }
            )
        ),
        500: error_response
    },
    tags=['Planets']
)
@api_view(['GET'])
@csrf_exempt
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