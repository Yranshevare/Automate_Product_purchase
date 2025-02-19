from django.shortcuts import render
from django.http import HttpResponse,JsonResponse
from django.views.decorators.csrf import csrf_exempt
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
            message =  json.loads(request.body)
            # print()
            response = run_flow(message['message'])
            sheet = response["outputs"][0]['outputs'][0]["results"]["message"]["data"]["text"]
            return JsonResponse({"message":"successfully generated the requirement sheet","response":sheet},status=200)
        except Exception as e:
            return JsonResponse({"message": "error while generating the sheet",'error':e}, status=400)

    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
