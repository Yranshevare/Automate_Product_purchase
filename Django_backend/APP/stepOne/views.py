from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import stepOneModel
from process.models import processModel
from utils.utils import decode_id,decrypt_data
import requests
import json




import os 
import environ
env = environ.Env()

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))



BASE_API_URL = "https://api.langflow.astra.datastax.com"
LANGFLOW_ID = env('LANGFLOW_ID')
FLOW_ID = env('LANGFLOW_FLOW_ID')
APPLICATION_TOKEN = env('LANGFLOW_APPLICATION_TOKEN')
ENDPOINT = env('LANGFLOW_ENDPOINT') # You can set a specific endpoint name in the flow settings

def run_flow(message: str) -> dict:
    
    api_url = f"{BASE_API_URL}/lf/{LANGFLOW_ID}/api/v1/run/{ENDPOINT}"

    payload = {
        "input_value": message,
        "output_type": 'chat',
        "input_type": 'chat',
    }
    headers = {"Authorization": "Bearer " + APPLICATION_TOKEN, "Content-Type": "application/json"}
    response = requests.post(api_url, json=payload, headers=headers)
    return response.json()




@csrf_exempt
def generate(request):
    if request.method == 'GET':
        try:
            # message =  json.loads(request.body)
            message = request.GET.get('message')
            print(message)

            if message == "" or message == None:
                return JsonResponse({"message":"message is empty"},status=400)
            # print()
            response = run_flow(str(message))
            # print(response)
            try:
                 sheet = response["outputs"][0]['outputs'][0]["results"]["message"]["data"]["text"]
            except Exception as e:
                print(e)
                return JsonResponse({"message":"error while generating the sheet"},status=400)
            return JsonResponse({"message":"successfully generated the requirement sheet","response":sheet},status=200)
        except Exception as e:
            return JsonResponse({"message": "error while generating the sheet",'error':e}, status=400)

    else:
        return JsonResponse({'message': 'Invalid request method'}, status=405)



@csrf_exempt
def save(request):
    if request.method == 'POST':
        try:
            if 'access_token' not in request.COOKIES:
                return JsonResponse({"message":"Unauthorized requested"},status=401)
            
            if 'process_token'  not in request.COOKIES:
                return JsonResponse({"message":"process doesn't exist"},status=404)
            
            
            pro = decrypt_data(request.COOKIES.get('process_token'))['id']
            user = decrypt_data(request.COOKIES.get('access_token'))["id"]
     

            process = processModel.objects.filter(_id  = pro).first()

            if(process.owner_id != int(user)):
                return JsonResponse({"message":"not the owner"}, status=401)

            data = json.loads(request.body)

            if data['requirementSHeet'] == "":
                return JsonResponse({"message":"requirement sheet is empty"},status=400)


    
            if process.stepOne == 'Complete':

        
                step_one = stepOneModel.objects.filter(process = process).first()
              
                step_one.requirementSHeet = data['requirementSHeet']
                step_one.save()
                return JsonResponse({"message":"successfully updated the data",},status=200)
            else:

        
                step_one = stepOneModel(
                    requirementSHeet = data['requirementSHeet'],
                    SKU = data['SKU'],
                    process = process
                )
             
                process.stepOne = 'Complete'
                print(process.stepOne)
                process.save()
                step_one.save()
        


            return JsonResponse({"message":"successfully saved the data",},status=200)
        except Exception as e:
            return JsonResponse({"message": "error while saving the data",'error':e}, status=400)

    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    


@csrf_exempt
def get(request,process_id):
    """
    get the process id via url
    get the step one data via process id
    get the user info form the cookies
    check for the ownership of the process and add the ownership inn response
    """
    process_id = decode_id(process_id)
    try:
        if request.method == 'GET':

            step_one = stepOneModel.objects.filter(process_id = process_id).first()

            if not step_one:
                return JsonResponse({"message":"step doesn't exits"},status= 404)

            data = {
                "process_id":step_one._id,
                "requirementSHeet":step_one.requirementSHeet,
                "SKU":step_one.SKU,
                'owner': False
            }
            

            access_token = request.COOKIES.get('access_token')  # Using .get() to avoid KeyError
            if access_token:
                decrypt_token = decrypt_data(access_token)
                if decrypt_token['id'] == str(step_one.process.owner_id):
                    data['owner'] = True
            

            
            

            return JsonResponse({"message":"successfully fetched the data","data": data},status=200)
        else:
            return JsonResponse({'error': 'Invalid request method'}, status=405)
        
    except Exception as e:
        return JsonResponse({"message": "error while getting the data",'error':e}, status=400)
    

@csrf_exempt
def delete(request):
    try:
        if request.method == 'DELETE':
            access_token = request.COOKIES.get('access_token')  # Using .get() to avoid KeyError
            if not access_token:
                return JsonResponse({'error': 'unauthorize request'}, status=401)
            
            process_token = request.COOKIES.get('process_token')  # Using .get() to avoid KeyError
            if not process_token:
                return JsonResponse({'error': 'unauthorize request'}, status=401)

            decrypt_process_token = decrypt_data(process_token)
            step_one = stepOneModel.objects.filter(process_id = decrypt_process_token['id']).first()
            if not step_one:
                return JsonResponse({"message":"step doesn't exits"},status= 404)
            step_one.delete()

            process = processModel.objects.filter(_id = decrypt_process_token['id']).first()
            process.stepOne = 'Incomplete'
            process.save()

            return JsonResponse({"message":"successfully deleted the step"},status=200)
        else:
            return JsonResponse({'error': 'Invalid request method'}, status=405)
    except Exception as e:
        return JsonResponse({"message": "error while deleting the step",'error':e}, status=400)

