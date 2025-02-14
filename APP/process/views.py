from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from utils.utils import encrypt_data, decrypt_data
from django.views.decorators.csrf import csrf_exempt
from authentication.models import UserModel
from .models import processModel
import json

# Create your views here.
@csrf_exempt 
def home(request):
    return HttpResponse("Hello, world. You're at the process home.")


@csrf_exempt
def createProcess(request):
    if request.method == 'POST':
        try:
            
             # Get access token from cookies
            access_token = request.COOKIES.get('access_token')  # Using .get() to avoid KeyError
             
            if not access_token :
                return JsonResponse({'error': 'unauthorize request'}, status=401)

            decrypt_token = decrypt_data(access_token)

            if not decrypt_token:
                return JsonResponse({'error': 'user not found'}, status=404)
            
            user = UserModel.objects.filter(email=decrypt_token['email']).first()
            if not user:
                return JsonResponse({'error': 'user not found'}, status=404)


            if not user.isEmailVerified:
                return JsonResponse({'error': 'unverified email'}, status=401)
            

            
            data = json.loads(request.body)

            process = processModel(
                title = data['title'],
                owner = user
            )
            # print(process.owner)



            try:
                process.save()
            except Exception as e:
                return JsonResponse({'error': 'error while saving process','error': str(e)}, status=400)
            
            return JsonResponse({'message':'process created successfully','name': user.username,'email': user.email,'id':user._id})
        except Exception as e:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

@csrf_exempt
def get(request):
    try:
        if request.method == 'GET':
            # Get access token from cookies
            access_token = request.COOKIES.get('access_token')  # Using .get() to avoid KeyError
            if not access_token:
                return JsonResponse({'error': 'unauthorize request'}, status=401)

            decrypt_token = decrypt_data(access_token)

            if not decrypt_token:
                return JsonResponse({'error': 'user not found'}, status=404)
            
            process = processModel.objects.filter(owner_id = decrypt_token['id'])
            if not process:
                return JsonResponse({"message":"process doesn't exist"},status=200)
            
            # Convert processes to a list of dictionaries (or any format you want)
            process_list = [{
                "process_id": pro._id, 
                "process_title": pro.title,
                "step_one": pro.stepOne,
                "step_two": pro.stepTwo,
                "step_three": pro.stepThree,
                "step_four": pro.stepFour,
                "step_five": pro.stepFive
            } for pro in process]

            return JsonResponse({'message':'get the process','process':process_list},status=200)
        else:
            return JsonResponse({'error': 'Invalid request method'}, status=405)
    except Exception as e:
        return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    

@csrf_exempt
def delete(request):
    try:
        if request.method == 'DELETE':

            data = json.loads(request.body)
            # Get access token from cookies
            access_token = request.COOKIES.get('access_token')  # Using .get() to avoid KeyError
            if not access_token:
                return JsonResponse({'error': 'unauthorize request'}, status=401)

            decrypt_token = decrypt_data(access_token)

            if not decrypt_token:
                return JsonResponse({'error': 'user not found'}, status=404)

            process = processModel.objects.filter(_id = data['process_id'])
            if not process:
                return JsonResponse({"message":"process doesn't exist"},status=200)

            if process[0].owner_id != decrypt_token['id']:
                return JsonResponse({"message":"not the owner of this process"},status=401)
            
            process.delete()

            return JsonResponse({'message':'process deleted successfully'},status=200)
        else:
            return JsonResponse({'error': 'Invalid request method'}, status=405)
    except Exception as e:
        return JsonResponse({'error': 'Invalid JSON format'}, status=400)
            