from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from utils.utils import encode_id,decode_id,decrypt_data
from process.models import processModel
from .models import POModel
from django.conf import settings
from django.core.mail import EmailMessage
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
    

@csrf_exempt
def send_Po_to_vender(request):
    if request.method == 'POST':
        try:
            process_token = request.COOKIES.get('process_token')
            access_token = request.COOKIES.get('access_token')

            if not access_token or not process_token:
                return JsonResponse({'error': 'unauthorize request'}, status=401)

            id = decrypt_data(process_token)["id"]
            decrypt_access_token = decrypt_data(access_token)
            print(id,"data")

            file = request.FILES.get('pdf')
            print(file)


            token = request.POST.get('token')
            print(token)

            po = POModel.objects.filter(process = id).first()
            if not po:
                return JsonResponse({'message':'PO not found'},status=401)
            print(po.po_email)


            subject = "Purchase Order"
            from_email = decrypt_access_token['username'] or settings.EMAIL_HOST_USER
            recipient_list = [po.po_email]
            html_content = f""" 
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <p>Dear {po.po_name}</p>

    <p>
      I hope this email finds you well.
    </p>

    <p>
      We are placing a purchase order (PO #{po.po_order_number}) for the items/services as discussed. 
      Please find the attached PDF containing all the PO details.
    </p>

    <p>
      Additionally, you can <strong>view the PO and submit your invoice</strong> through the following link:<br>
      <a href={settings.FRONTEND}/invoiceSubmit/{token} style="color: #1a73e8;">click here</a>
    </p>

    <p>
      Kindly submit the invoice at your earliest convenience to ensure smooth processing.
    </p>

    <p>Best regards,</p>
    <p>{decrypt_access_token['username']}<br>{decrypt_access_token['email']}</p>
  </body>
            """
            email = EmailMessage(subject, html_content, from_email, recipient_list)
            email.attach(file.name, file.read(), file.content_type)
            email.content_subtype = "html"  # Mark content as HTML

            res = email.send()
            if res != 1:
                return JsonResponse({'error': 'Failed to send email'}, status=500)


            
            return JsonResponse({'message':"PO is sended to vender"})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
