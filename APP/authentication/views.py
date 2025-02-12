from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password
from .models import UserModel
import json

# Create your views here.
@csrf_exempt
def registerUser(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            required_fields = ['username', 'email', 'mobileNo', 'proffesion', 'password', 'gender']
            for field in required_fields:
                if field not in data:
                    return JsonResponse({'error': f'Missing required field: {field}'}, status=400)
            

            user = UserModel.objects.filter(username=data['username']).first() 

            if user:
                return JsonResponse({'error': 'User already exists'}, status=400)
            
            password = data.get('password', None)


            if password:
                data['password'] = make_password(password)
            else:
                return JsonResponse({'error': 'Password not provided'}, status=400)
            
            user = UserModel(
                username=data['username'],
                email=data['email'],
                mobile=data['mobileNo'],
                profession=data['proffesion'],
                password=data['password'],
                gender=data['gender'],
                isEmailVerified=data.get('isEmailVerified', False)  # Default to False
            )

            try:
                user.save()
            except Exception as e:
                print(f"Error saving user: {e}")
                print(user.gender)
                return JsonResponse({'error': f"Error saving user: {e}"}, status=400)


            return JsonResponse({
                'message': 'User registered successfully',
                'user': {
                    'username': user.username,
                    'email': user.email,
                    'mobileNo': str(user.mobile),
                    'proffesion': user.profession,
                    'gender': user.gender,
                    'isEmailVerified': user.isEmailVerified
                }
            }, status=201)
        except Exception as e:
            return JsonResponse({'error': 'error while registering user'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)