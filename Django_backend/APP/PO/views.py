from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from utils.utils import encode_id,decode_id,decrypt_data
import json

# Create your views here.
@csrf_exempt
def home(request):
    return JsonResponse({'message':"Hello, world. You're at the PO home."})

@csrf_exempt
def submit(request):    
    if request.method == 'POST':
        try:
            # Read and parse the JSON data from the request body
            tableData = json.loads(request.body)['tableData']
            print(tableData)
            poData = json.loads(request.body)['poData']
            print(poData)
            terms = json.loads(request.body)['termsAndCondition']
            print(terms)
            id = json.loads(request.body)['id']
            # id = decode_id(id)
            print(id)


            return JsonResponse({'message':"data submitted successfully"}) 
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)

