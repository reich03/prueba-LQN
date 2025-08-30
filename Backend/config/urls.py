from django.contrib import admin
from django.urls import path, include, re_path
from django.views.decorators.csrf import csrf_exempt
from graphene_django.views import GraphQLView
from django.conf import settings
from django.conf.urls.static import static

from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

schema_view = get_schema_view(
    openapi.Info(
        title="Star Wars API",
        default_version='v1',
        description="""
# Star Wars Universe API

Una API completa para explorar el universo de Star Wars con personajes, películas, planetas y especies.

## Características principales:
- 🚀 **Listado de personajes** con filtros por nombre
- 🎬 **Películas por personaje** con detalles completos
- 🪐 **Planetas y especies** del universo Star Wars
- 📊 **Estadísticas** de la base de datos
- 🔍 **Paginación** en todos los endpoints

## Endpoints principales:
- `GET /api/starwars/characters/` - Lista todos los personajes
- `GET /api/starwars/characters/{id}/films/` - Películas de un personaje
- `GET /api/starwars/films/` - Lista todas las películas
- `GET /api/starwars/planets/` - Lista todos los planetas

## Parámetros de consulta disponibles:
- **name**: Filtrar personajes por nombre (ej: `?name=luke`)
- **page**: Número de página (ej: `?page=2`)
- **page_size**: Elementos por página (ej: `?page_size=10`, máx: 100)

## Ejemplos de uso:
```
GET /api/starwars/characters/?name=skywalker&page=1
GET /api/starwars/characters/550e8400-e29b-41d4-a716-446655440000/films/
```
        """,
        terms_of_service="https://www.example.com/terms/",
        contact=openapi.Contact(email="contact@starwarsapi.local"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
    patterns=[
        path('api/starwars/', include('starwars.urls')),
    ],
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('graphql/', csrf_exempt(GraphQLView.as_view(graphiql=True))),
    path('api/starwars/', include('starwars.urls')),
    
    path('docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),
    
    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)