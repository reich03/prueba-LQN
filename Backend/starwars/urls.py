from django.urls import path
from . import views

app_name = 'starwars'

urlpatterns = [
    path('status/', views.status_view, name='status'),
    path('stats/', views.stats_view, name='stats'),
    
  
    path('characters/', views.characters_list_view, name='characters-list'),
    
    path('characters/<uuid:character_id>/', views.character_detail_view, name='character-detail'),
    path('characters/<uuid:character_id>/films/', views.character_films_view, name='character-films'),
    
    path('films/', views.films_list_view, name='films-list'),
    path('planets/', views.planets_list_view, name='planets-list'),
]