from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from .models import Person, Film, Planet, Species


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