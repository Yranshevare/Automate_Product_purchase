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
            # name = request.GET.get('name')
            # sequence_number = request.GET.get('seq_num')
            data = json.loads(request.body)['data']
            # name = json.loads(request.body)['name']
            # sequence_number = json.loads(request.body)['seq_num']
            # print(data)


            if not data:
                return JsonResponse({'error': 'email is required'}, status=400)
            

            message = request.GET.get('message')
            # print(message)

            if message == "":
                message = """We hope this message finds you well. We are in the process of preparing a Request for Quotation (RFQ) for an upcoming project, and your approval is required to proceed with the next steps.</p>"""
   



            # token = request.GET.get('token')
            token = json.loads(request.body)['token']
            if not token:
                return JsonResponse({'error': 'unauthorize request'}, status=401)
            # print(token)
            

            


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
            
            if process.stepTwo != process.steps.REJECTED:
                return JsonResponse({"error":"request already rejected"},status=405)

            sender_email = ""
            for x in data:

                existed_approval_model =  ApprovalModel.objects.filter(email = x["email"],process = decrypt_process_token['id']).first()

                if not existed_approval_model:
                    
                    if(sender_email == ""):
                        sender_email = x["email"]

                elif existed_approval_model.status == ApprovalModel.Status.PENDING: 

                    if sender_email == "":
                        sender_email = existed_approval_model.email

                    

                
                

            
            

            subject = "Primary approval"
            from_email = decrypt_access_token['username'] or settings.EMAIL_HOST_USER
            recipient_list = [sender_email]
            html_content = f"""
                <body>
                    <div >
                        <div >
                            <h2>RFQ Approval Request</h2>
                        </div>
                        <div >
                            <p>{message}</p>
                            <p>Please review the requirement sheet for <b>{process.title}</b> at the following link:</p>
                            <p><a href={settings.FRONTEND}/approval/{token} >Review Requirement Sheet</a></p>
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
                # delete the approval models
               
                return JsonResponse({"error": "email not sent properly"},status = 500)
            


            for x in data:

                existed_approval_model =  ApprovalModel.objects.filter(email = x["email"],process = decrypt_process_token['id']).first()
                if not existed_approval_model:
                    # create the new model and save it
                    approval = ApprovalModel(
                        email = x["email"],
                        name = x["name"],
                        sequence_number = x["sqe_num"],
                        process = process
                    )

                    process.stepTwo = processModel.steps.PENDING

                    try:
                        process.save()
                        approval.save()
                    except Exception as e:
                        return JsonResponse({'error': 'unauthorize request',"error": str(e)}, status=401)



            
            
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
            approve = ApprovalModel.objects.filter(process = process_id)
            if not approve:
                return JsonResponse({'message':'request not found'},status = 404)
            
            data = []
            
            for a in approve:
                newData = {
                    "id":a._id,
                    "status":a.status,
                    "accepted_by_email":a.email,
                    "response":a.response,
                    "name": a.name,
                    "sqe_num": a.sequence_number
                }
                data.append(newData)
            
            

            
            # data = {
            #     "id":approve._id,
            #     "status":approve.status,
            #     "accepted_by_email":approve.email,
            #     "response":approve.response,
            #     'type':approve.type
            # }
            return JsonResponse({"data":data},status = 200)
        except Exception as e:
            return JsonResponse({'message':'error while getting the request','error':str(e)},status=500)
    else:
        return JsonResponse({"message":"invalid request type"},status=405)      
    

@csrf_exempt
def Approve(request):
    if request.method == 'GET':
        try:
            process_id = request.GET.get('process_id')
            # process_id = json.loads(request.body)['process_id']
            process_id = decode_id(process_id)

            process = processModel.objects.filter(_id = process_id).first()
            if not process:
                return JsonResponse({'message':'process not found'},status = 404)
            
            if(process.stepOne != processModel.steps.COMPLETE):
                return JsonResponse({'message':'no requirement sheet is available'},status = 404)
            
            email = request.GET.get('email')
            # email = json.loads(request.body)['email']

            approve = ApprovalModel.objects.filter(process = process_id)

            app = None
            for x in approve:
                if x.email == email:
                    app = x
                

            if not app:
                return JsonResponse({'message':'request not found, invalid email'},status = 404)
            
            # if(process.stepTwo == processModel.steps.REJECTED):
            #     return JsonResponse({'message':'request already rejected'},status = 422)
            

            app.status = ApprovalModel.Status.ACCEPTED
            app.response = f"approved by {app.email} "

            isApprovalAccepted = True

            for x in approve:
                if x.status != ApprovalModel.Status.ACCEPTED:
                    isApprovalAccepted = False
                    break

            if isApprovalAccepted:
                process.stepTwo = processModel.steps.COMPLETE
                process.save()
                # function to send email to store for quotations


            app.save()
            return JsonResponse({'message':'your request has been approve'},status = 200)
        except Exception as e:
            return JsonResponse({'message':'error while approving the request','error':str(e)},status=500)
    else:
        return JsonResponse({"message":"invalid request type"},status=405)
    

@csrf_exempt
def Reject(request):
    if request.method == 'GET':
        try:
            process_id = request.GET.get('process_id')
            response = request.GET.get('reason')
            email = request.GET.get('email')
            # process_id = json.loads(request.body)['process_id']
            # response = json.loads(request.body)['response']
            process_id = decode_id(process_id)


            process = processModel.objects.filter(_id = process_id).first()
            if not process:
                return JsonResponse({'message':'process not found'},status = 404)
            
            if(process.stepOne != processModel.steps.COMPLETE):
                return JsonResponse({'message':'no requirement sheet is available'},status = 404)
            

            approve = ApprovalModel.objects.filter(process = process_id,email = email).first()
            if not approve:
                return JsonResponse({'message':'request not found'},status = 404)
            
            if (process.stepTwo == processModel.steps.COMPLETE):
                
                return JsonResponse({'message':'request already accepted'},status = 422)
            

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
    
def get_one(request):
    if request.method == 'GET':
        try:
            process_id = request.GET.get('process_id')
            print(process_id)
            # process_id = json.loads(request.body)['process_id']
            process_id = decode_id(process_id)
            process = processModel.objects.filter(_id = process_id).first()
            if not process:
                return JsonResponse({'message':'process not found'},status = 404)
            
            email = request.GET.get('email')
            # email = json.loads(request.body)['email']
            
            approve = ApprovalModel.objects.filter(process = process_id,email = email).first()
            if not approve:
                return JsonResponse({'message':'request not found'},status = 404)
            
            data = {
                "id":approve._id,
                "status":approve.status,
                "accepted_by_email":approve.email,
                "response":approve.response
            }
            
            return JsonResponse({"data":data},status = 200)
        except Exception as e:
            return JsonResponse({'message':'error while getting the request','error':str(e)},status=500)
    else:
        return JsonResponse({"message":"invalid request type"},status=405)
