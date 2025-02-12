from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password
import json

# Create your views here.
@csrf_exempt
def registerUser(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            data['isEmailVerified'] = False
            password = data.get('password', None)
            if password:
                data['password'] = make_password(password)
            else:
                return JsonResponse({'error': 'Password not provided'}, status=400)

            print(check_password(password, data['password']))
            return JsonResponse({'data': data})
        except Exception as e:
            return JsonResponse({'error': 'error while registering user'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)