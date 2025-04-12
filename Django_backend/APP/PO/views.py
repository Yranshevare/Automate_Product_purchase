from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from utils.utils import encode_id,decode_id,decrypt_data
from process.models import processModel
from .models import POModel
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
            # print(tableData)
            poData = json.loads(request.body)['poData']
            # print(poData)
            terms = json.loads(request.body)['termsAndCondition']
            # print(terms)
            id = json.loads(request.body)['id']
            id = decode_id(id)
            # print(id)


            process = processModel.objects.filter(_id = id).first()
            print(process)
            if(not process):
                return JsonResponse({'message':'process not found'},status=401)
            

            po = POModel.objects.filter(process = process).first()
            if(po):
                po.po_order_number = poData['po_order_number']
                po.po_date = poData['po_date']
                po.po_name = poData['po_name']
                po.po_address = poData['po_address']
                po.po_email = poData['po_email']    
                po.po_mobile_number = poData['po_mobile_number']
                po.po_tableData = tableData
                po.po_term_and_condition = terms
                po.save()
                return JsonResponse({'message':'PO updated successfully'},status=200)
            
            newPo = POModel(
                po_order_number = poData['po_order_number'],
                po_date = poData['po_date'],
                po_name = poData['po_name'],
                po_address = poData['po_address'],
                po_email = poData['po_email'],
                po_mobile_number = poData['po_mobile_number'],
                po_tableData = tableData,
                po_term_and_condition = terms,
                process = process
            )
            # print(newPo)
            newPo.save()

            process.stepFive = process.steps.PENDING
            process.save()
            


            

            return JsonResponse({'message':"data submitted successfully"}) 
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    
@csrf_exempt
def get(request,id):
    if request.method == 'GET':
        try:
            id = decode_id(id)
            process = processModel.objects.filter(_id = id).first()
            if(not process):
                return JsonResponse({'message':'process not found'},status=401)
            po = POModel.objects.filter(process = process).first()
            if(not po):
                return JsonResponse({'message':'PO not found'},status=401)
            data = {
                "po_order_number":po.po_order_number,
                "po_date":po.po_date,
                "po_name":po.po_name,
                "po_address":po.po_address,
                "po_email":po.po_email,
                "po_mobile_number":po.po_mobile_number,
                "po_tableData":po.po_tableData,
                "po_term_and_condition":po.po_term_and_condition,
                "po_invoice":po.po_invoice
            }
            return JsonResponse({'data':data,"message":"data fetched successfully"},status=200)
        except Exception as e:
            return JsonResponse({'message': 'Invalid JSON format',"error":str(e)}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
