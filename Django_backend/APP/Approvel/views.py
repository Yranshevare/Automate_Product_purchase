from django.http import JsonResponse
from utils.utils import decrypt_data,encode_id,decode_id
from django.views.decorators.csrf import csrf_exempt
from .models import ApprovalModel
from process.models import processModel
from APP import settings
from django.core.mail import EmailMessage
import json


def home(request):
    return JsonResponse({"message": "Hello, world. You're at the Approvel home."})

@csrf_exempt
def send_for_primary(request):
    if request.method == 'GET':
        try:
            # data = request.GET.get('email')
            data = json.loads(request.body)['email']

            if "message" in json.loads(request.body) :
                message = json.loads(request.body)['message']
            else:
                message= """We hope this message finds you well. We are in the process of preparing a Request for Quotation (RFQ) for an upcoming project, and your approval is required to proceed with the next steps.</p>
                            <p>Please review the requirement sheet at the following link:"""
            # print(data,message)

            if not data:
                return JsonResponse({'error': 'email is required'}, status=400)
            


            process_token = request.COOKIES.get('process_token')
            access_token = request.COOKIES.get('access_token')

            if not access_token or not process_token:
                return JsonResponse({'error': 'unauthorize request'}, status=401)

            decrypt_process_token = decrypt_data(process_token)
            decrypt_access_token = decrypt_data(access_token)


            process = processModel.objects.filter(_id = decrypt_process_token['id']).first()
            if not process:
                return JsonResponse({"error":"process doesn't exist"},status=404)
            
            if process.stepOne != process.steps.COMPLETE:
                return JsonResponse({"error":"no requirement sheet is available"},status=405)

            
            

            subject = "Primary approval"
            from_email = decrypt_access_token['username'] or settings.EMAIL_HOST_USER
            recipient_list = [data]
            html_content = f"""
                <body>
                    <div >
                        <div >
                            <h2>RFQ Approval Request</h2>
                        </div>
                        <div >
                            <p>{message}</p>
                            <p><a href={settings.FRONTEND}/reqSheet/{encode_id(process._id)} >Review Requirement Sheet</a></p>
                            <p>Once you have reviewed the document, kindly provide your approval or feedback so we can continue with the RFQ process.</p>
                            <p>If you have any questions or need additional information, feel free to reach out.</p>
                            <p>Thank you for your attention to this matter.</p>
                            <p>Best regards,</p>
                            <p>{decrypt_access_token['username']}<br>{decrypt_access_token['email']}</p>
                        </div>
                        <div >
                            <p>This email was sent by Automate product purchase platform. If you did not request this email, please disregard it.</p>
                        </div>
                    </div>
                </body>
            """

            email = EmailMessage(subject, html_content, from_email, recipient_list)
            email.content_subtype = "html"  # Mark content as HTML


            res = email.send()

            if res != 1:
                return JsonResponse({"error": "email not sent properly"},status = 500)
            

            approval = ApprovalModel.objects.filter(email = data).first()
            if approval:    
                return JsonResponse({'message': 'email is re sended successfully'}, status=500)


            approve = ApprovalModel(
                email = data,
                process = process
            ) 

            process.stepTwo = processModel.steps.PENDING

            
            process.save()
            approve.save()


            return JsonResponse({"message": "request send successfully"},status = 200)
        except Exception as e:
            
            return JsonResponse({'error': 'unauthorize request',"error": str(e)}, status=401)

    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    

@csrf_exempt
def get(request,process_id):
    if request.method == 'GET':
        try:
            process_id = decode_id(process_id)
            approve = ApprovalModel.objects.filter(process = process_id).first()
            if not approve:
                return JsonResponse({'message':'request not found'},status = 404)
            
            data = {
                "id":approve._id,
                "status":approve.status,
                "accepted_by_email":approve.email,
                "response":approve.response,
                'type':approve.type
            }
            return JsonResponse({"data":data},status = 200)
        except Exception as e:
            return JsonResponse({'message':'error while getting the request','error':str(e)},status=500)
    else:
        return JsonResponse({"message":"invalid request type"},status=405)      
    

@csrf_exempt
def Approve(request,process_id):
    if request.method == 'GET':
        try:
            process_id = decode_id(process_id)

            process = processModel.objects.filter(_id = process_id).first()
            if not process:
                return JsonResponse({'message':'process not found'},status = 404)
            
            if(process.stepOne != processModel.steps.COMPLETE):
                return JsonResponse({'message':'no requirement sheet is available'},status = 404)
            

            approve = ApprovalModel.objects.filter(process = process_id).first()
            if not approve:
                return JsonResponse({'message':'request not found'},status = 404)
            

            approve.status = ApprovalModel.Status.ACCEPTED
            approve.response = "approved"
            process.stepTwo = processModel.steps.PENDING
            process.save()
            approve.save()
            return JsonResponse({'message':'your request has been approve'},status = 200)
        except Exception as e:
            return JsonResponse({'message':'error while approving the request','error':str(e)},status=500)
    else:
        return JsonResponse({"message":"invalid request type"},status=405)
    

@csrf_exempt
def Reject(request):
    if request.method == 'GET':
        try:
            # process_id = request.GET.get('process_id')
            # response = request.GET.get('response')
            process_id = json.loads(request.body)['process_id']
            response = json.loads(request.body)['response']
            process_id = decode_id(process_id)


            process = processModel.objects.filter(_id = process_id).first()
            if not process:
                return JsonResponse({'message':'process not found'},status = 404)
            
            if(process.stepOne != processModel.steps.COMPLETE):
                return JsonResponse({'message':'no requirement sheet is available'},status = 404)
            

            approve = ApprovalModel.objects.filter(process = process_id).first()
            if not approve:
                return JsonResponse({'message':'request not found'},status = 404)
            

            approve.status = ApprovalModel.Status.REJECTED
            approve.response = response
            process.stepTwo = processModel.steps.REJECTED

            process.save()
            approve.save()
            return JsonResponse({'message':'your request has been rejected'},status = 200)
        except Exception as e:
            return JsonResponse({'message':'error while rejecting the request','error':str(e)},status=500)
    else:
        return JsonResponse({"message":"invalid request type"},status=405)
