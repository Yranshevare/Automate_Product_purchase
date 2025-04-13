from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse
from utils.utils import encrypt_data, decrypt_data,encode_id,decode_id
from django.views.decorators.csrf import csrf_exempt
from authentication.models import UserModel
from .models import processModel
from datetime import datetime, timedelta, timezone
from PO.models import POModel
from RFQ.models import RFQModel
import json
import cloudinary
import cloudinary.uploader


import os 
import environ
env = environ.Env()


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))



# Create your views here.
@csrf_exempt 
def home(request):
    # print(request.COOKIES)
    response  = JsonResponse({"message": "Hello, world. You're at the process home."})
    response.set_cookie('process_token', 'ajhjdshdgfusfhdfygdfdhjb', httponly=True, secure=True)
    return response


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
def get_all(request):
    try:
        if request.method == 'GET':
            # Get access token from cookies
            access_token = request.COOKIES.get('access_token')  # Using .get() to avoid KeyError
            # print(request.COOKIES)
            if not access_token:
                return JsonResponse({'error': 'unauthorize request'}, status=401)

            # print(access_token)
            decrypt_token = decrypt_data(access_token)
            # print(decrypt_token)


            if not decrypt_token:
                return JsonResponse({'error': 'user not found'}, status=404)
            
            process = processModel.objects.filter(owner_id = decrypt_token['id'])
            if not process:
                return JsonResponse({"message":"process doesn't exist"},status=200)
            
           
            
            # Convert processes to a list of dictionaries (or any format you want)
            process_list = [{
                "process_id": encode_id(pro._id), 
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
        print(str(e))
        return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    

@csrf_exempt
def get_one(request):
    try:
        if request.method == 'POST':


              # Get access token from cookies
            access_token = request.COOKIES.get('access_token')  # Using .get() to avoid KeyError
            if not access_token:
                return JsonResponse({'error': 'unauthorize request'}, status=401)
            
              
           

            decrypt_token = decrypt_data(access_token)
          
            data = decode_id(json.loads(request.body).get('process_id'))


            process = processModel.objects.filter(_id = data).first()

            
            if not process:
                return JsonResponse({"message":"process doesn't exist"},status=200)
            
            
     
            if (str(process.owner_id) != decrypt_token['id']):
                
                return JsonResponse({"message":'not the owner of this process'},status=401)
            
            payload = {
                'id': str(process._id),
                'exp': int((datetime.now(timezone.utc) + timedelta(minutes=60*24)).timestamp()),  # ✅ Fix here
                'iat': int(datetime.now(timezone.utc).timestamp())  # ✅ Fix here
            }
            
            encrypt_process_cookies = encrypt_data(payload)
            
            pro = {
                "process_id": process._id,
                "process_title": process.title,
                "step_one": process.stepOne,
                "step_two": process.stepTwo,
                "step_three": process.stepThree,
                "step_four": process.stepFour,
                "step_five": process.stepFive
            }
            
            
            response = JsonResponse({"message":"get the process","process":pro},status=200)
                
            
            
            response.set_cookie('process_token', encrypt_process_cookies, httponly=True,secure=True,max_age=3600,samesite='none')

            return response
        else:
            return JsonResponse({'error': 'Invalid request method'}, status=405)
    except Exception as e:
        print(str(e))
        return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    

cloudinary.config( 
  cloud_name = env("CLOUD_NAME"), 
  api_key = env("API_KEY"), 
  api_secret =env("API_SECRET")
)

def extract_public_id(url):
    parts = url.split('/')
    file_name_with_ext = parts[-1]       
    file_name = file_name_with_ext.split('.')[0]                  

    return f"{file_name}" 


@csrf_exempt
def delete(request):
    try:
        if request.method == 'DELETE':
            # data = json.loads(request.body)
            data = decode_id(request.GET.get('process_id'))
            
            # Get access token from cookies
            access_token = request.COOKIES.get('access_token')  # Using .get() to avoid KeyError
            if not access_token:
                return JsonResponse({'error': 'unauthorize request'}, status=401)

            decrypt_token = decrypt_data(access_token)

            if not decrypt_token:
                return JsonResponse({'error': 'user not found'}, status=404)

            process = processModel.objects.filter(_id = data)
            if not process:
                return JsonResponse({"message":"process doesn't exist"},status=200)

            if str(process[0].owner_id) != decrypt_token['id']:
                return JsonResponse({"message":"not the owner of this process"},status=401)
            

            if(process[0].stepThree != processModel.steps.INCOMPLETE):
                rfq = RFQModel.objects.filter(process = process[0])
                for r in rfq:
                    file_id = extract_public_id(r.sheet)

                    result = cloudinary.uploader.destroy(file_id)
                print("delete the uploaded quotes")

           

            if(process[0].stepFive == processModel.steps.COMPLETE):
                po = POModel.objects.filter(process = process[0]).first()

                file_id = extract_public_id(po.po_invoice)

                result = cloudinary.uploader.destroy(file_id)

            process.delete()

            return JsonResponse({'message':'process deleted successfully'},status=200)
        else:
            return JsonResponse({'error': 'Invalid request method'}, status=405)
    except Exception as e:
        return JsonResponse({'error': 'Invalid JSON format'}, status=400)
            