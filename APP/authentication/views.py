from django.shortcuts import render
from django.http import JsonResponse

# Create your views here.

def registerUser(request):
    return JsonResponse({'message':"hello form auth app"})
