from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password
from .models import UserModel
# from ..utils.utils import encrypt_data
from utils.utils import encrypt_data

import json


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


            if not data.get('password'):
                return JsonResponse({'error': 'Password not provided'}, status=400)
            
            user = UserModel(
                username=data['username'],
                email=data['email'],
                mobile=data['mobileNo'],
                profession=data['proffesion'],
                password=make_password(data['password']),
                gender=data['gender'],
                isEmailVerified=data.get('isEmailVerified', False)  # Default to False
            )

            try:
                user.save()
            except Exception as e:
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


@csrf_exempt   
def login(request):
    if request.method == 'GET':
        try:
            data = json.loads(request.body)
    

            user = UserModel.objects.filter(username=data['username']).first() 

            if not user:
                return JsonResponse({"message":'user not found'}, status=404)

            if not check_password( data['password'],user.password):
                return JsonResponse({"message":'invalid password'},status=400)
            
            encrypted_data = encrypt_data(user.username,user.email)
        
            response = JsonResponse({"message":'login successfully'},status=200)
            
            # setting cookies
            response.set_cookie('access_token', encrypted_data)

            return response
        except Exception as e:
            return JsonResponse({'error': 'error while login'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)