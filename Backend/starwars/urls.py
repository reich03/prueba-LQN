from django.urls import path
from . import views

app_name = 'starwars'

urlpatterns = [
    path('status/', views.status_view, name='status'),
    path('stats/', views.stats_view, name='stats'),
]