from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# Create your views here.
@csrf_exempt
def home(request):
    return JsonResponse({'message':"Hello, world. You're at the RFQ home."})