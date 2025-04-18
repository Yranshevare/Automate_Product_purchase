from django.http import JsonResponse
from utils.utils import decrypt_data,encode_id,decode_id
from django.views.decorators.csrf import csrf_exempt
from .models import ApprovalModel
from process.models import processModel
from APP import settings
from django.core.mail import EmailMessage
from rest_framework.parsers import MultiPartParser
from RFQ.models import RFQModel
import json

@csrf_exempt
def home(request):
    try:
        file = request.FILES.get('pdf')
        print(request.FILES,"LLL")
        print(file)
        subject = "Primary approval"
        from_email =  settings.EMAIL_HOST_USER
        recipient_list = ["yranshevare2005@gmail.com"]
        html_content = f"""
       <div>pdf</div> 
        """
        email = EmailMessage(subject, html_content, from_email, recipient_list)
        email.attach(file.name, file.read(), file.content_type)
        email.content_subtype = "html"  # Mark content as HTML


            
        # res = email.send()
        return JsonResponse({"message": "Hello, world. You're at the Approvel home."})
    except Exception as e:
        print(str(e))
        return JsonResponse({"error": str(e)})

@csrf_exempt
def send_for_primary(request):
    if request.method == 'POST':
        # print(request.FILES,"LLL")
        # print(json.loads(request.body))
        # print(request.POST.get('data'))
        try:
            # data = json.loads(request.body)
            data = request.POST.get('data')
            print(data,"data")


            if not data:
                return JsonResponse({'error': 'email is required'}, status=400)
            

            message = request.GET.get('message')
            # print(message)

            if message == "":
                message = """We hope this message finds you well. We are in the process of preparing a Request for Quotation (RFQ) for an upcoming project, and your approval is required to proceed with the next steps.</p>"""
   



            # token = request.GET.get('token')
            # token = json.loads(request.body)['token']
            token = request.POST.get('token')
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
            
            if process.stepTwo == process.steps.REJECTED:
                return JsonResponse({"error":"request already rejected"},status=405)
            print(token)

            sender_email = ""
            data = json.loads(data)
            for x in data:

                existed_approval_model =  ApprovalModel.objects.filter(email = x["email"],process = decrypt_process_token['id']).first()

                if not existed_approval_model:
                    
                    if(sender_email == ""):
                        sender_email = x["email"]

                elif existed_approval_model.status == ApprovalModel.Status.PENDING: 

                    if sender_email == "":
                        sender_email = existed_approval_model.email

                    

                
                

            
            file = request.FILES.get('pdf')
            print(file)
            # print(sender_email,"email")

            if sender_email != "":

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
                email.attach(file.name, file.read(), file.content_type)
                email.content_subtype = "html"  # Mark content as HTML



                res = email.send()

                if res != 1:
                    # delete the approval models
                    return JsonResponse({"error": "email not sent properly"},status = 500)
            else:
                res = send_email_to_store(decrypt_access_token['username'] or settings.EMAIL_HOST_USER,decrypt_access_token['username'],decrypt_access_token['email'],file,process.title,token)
                if  res != 1:
                    return JsonResponse({"error": "email not sent properly"},status = 500)
                process.stepThree = process.steps.PENDING
                process.save()
            


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



            
            
            return JsonResponse({"message": "request send successfully","email":sender_email},status = 200)
        except Exception as e:
            
            return JsonResponse({'error': 'not a valid json request',"error": str(e)}, status=401)

    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    

@csrf_exempt
def get(request,process_id):
    if request.method == 'GET':
        try:
            print(process_id,"LLL")
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
                    "sqe_num": a.sequence_number,
                    'type':a.type
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
    if request.method == 'POST':
        try:
            
            
            process_id = request.GET.get('process_id')
            owner_email = request.GET.get('owner_email')
            owner_username = request.GET.get('owner_username')
            
            # process_id = json.loads(request.body)['process_id']
            # print(process_id,"   ")
            process_id = decode_id(process_id)
            # print(process_id)

            process = processModel.objects.filter(_id = process_id).first()
            if not process:
                return JsonResponse({'message':'process not found'},status = 404)
            
            if(process.stepOne != processModel.steps.COMPLETE):
                return JsonResponse({'message':'no requirement sheet is available'},status = 404)
            
            email = request.GET.get('email')
            # print(email)
            # seq_num = request.GET.get('seq_num')
            token = request.GET.get('token')
            # print(token)
            # email = json.loads(request.body)['email']

            approve = ApprovalModel.objects.filter(process = process_id)




            curr_sqe = []
            for x in approve:
                if x.status == ApprovalModel.Status.PENDING:
                    curr_sqe.append(x.sequence_number)
                    
            curr_sqe.sort()


            #current approval model
            app = None
            for x in approve:
                if x.email == email:
                    app = x
                    break

            if not app:
                return JsonResponse({'message':'request not found, invalid email'},status = 404)
            
            if app.status == ApprovalModel.Status.ACCEPTED:
                return JsonResponse({'message':'request already accepted'},status = 200)
            

            isFinal = request.GET.get('isFinal')
            if(isFinal == 'false'):
                isFinal = False

            # print(isFinal)
            if not isFinal and app.type == ApprovalModel.Type.FINAL:
                return JsonResponse({'message':'request already accepted'},status = 200)
            
            


            #next approval model
            nextApp = None
            if len(curr_sqe) > 1:
                for x in approve:
                    if x.sequence_number == app.sequence_number + 1:
                        nextApp = x
                        break
            # print("sending email to ",nextApp.email)
            print(nextApp)

            if nextApp:


                if not isFinal:
            

                    subject = "Primary approval"
                    from_email = owner_username  or settings.EMAIL_HOST_USER
                    recipient_list = [nextApp.email]
                    html_content = f"""
                        <body>
                            <div >
                                <div >
                                    <h2>RFQ Approval Request</h2>
                                </div>
                                <div >
                                    <p>We hope this message finds you well. We are in the process of preparing a Request for Quotation (RFQ) for an upcoming project, and your approval is required to proceed with the next steps.</p>
                                    <p>Please review the requirement sheet for <b>{process.title}</b> at the following link:</p>
                                    <p><a href={settings.FRONTEND}/approval/{token} >Review Requirement Sheet</a></p>
                                    <p>Once you have reviewed the document, kindly provide your approval or feedback so we can continue with the RFQ process.</p>
                                    <p>If you have any questions or need additional information, feel free to reach out.</p>
                                    <p>Thank you for your attention to this matter.</p>
                                    <p>Best regards,</p>
                                    <p>{owner_username}<br>{owner_email}</p>
                                </div>
                                <div >
                                    <p>This email was sent by Automate product purchase platform. If you did not request this email, please disregard it.</p>
                                </div>
                            </div>
                        </body>
                    """

                    email = EmailMessage(subject, html_content, from_email, recipient_list)

                    # print(request.FILES,"LLL")
                    file = request.FILES.get('pdf')
                    # print(file)
                    email.attach(file.name, file.read(), file.content_type)


                    email.content_subtype = "html"  # Mark content as HTML



                    res = email.send()

                    if res != 1:
                        # delete the approval models
                        return JsonResponse({"error": "email not sent properly"},status = 500)
                    print("email sent to next approver",nextApp.email)
                else:

                    rfq = RFQModel.objects.filter(process = process, type = "Selected").first()
                    if not rfq:
                        return JsonResponse({"error":"no requirement sheet is available"},status=405)

                    subject = "final approval"
                    from_email = owner_username  or settings.EMAIL_HOST_USER
                    recipient_list = [nextApp.email]
                    html_content =f"""
<body style="font-family: Arial, sans-serif; color: #333;">
    <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px;">
            <h2>Final Approval Required: RFQ Quotation</h2>
        </div>

        <div style="line-height: 1.6;">
            <p>Dear Approver,</p>

            <p>
                Please review the requirement sheet for <b>{process.title}</b> using the link below:
            </p>

            <p>
                <a href="{settings.FRONTEND}/approval/{token}" 
                   style="color: #1a73e8; text-decoration: none;" target="_blank">
                    ➤ Review Requirement Sheet & Submit Approval
                </a>
            </p>

            <p>
                You can also directly view the quotation document here:
            </p>

            <p>
                <a href="{rfq.sheet}" 
                   target="_blank" 
                   style="display: inline-block; padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
                    View Quotation
                </a>
            </p>

            <p>
                After reviewing, kindly provide your final approval or feedback so we can proceed with the RFQ process.
            </p>

            <p>If you have any questions or need further information, feel free to reach out.</p>

            <p>Thank you for your attention to this request.</p>

            <p>
                Best regards,<br>
                {owner_username}<br>
                {owner_email}
            </p>
        </div>

        <hr style="margin-top: 30px; border: none; border-top: 1px solid #ccc;">

        <div style="font-size: 12px; color: #777;">
            <p>
                This email was sent by the Automate Product Purchase Platform. 
                If you did not request this email, please disregard it.
            </p>
        </div>
    </div>
</body>
"""

                    email = EmailMessage(subject, html_content, from_email, recipient_list)
                    email.content_subtype = "html"
                    res = email.send()

                    if res != 1:
                        # delete the approval models
                        return JsonResponse({"error": "email not sent properly"},status = 500)
                
            
                    print("email sent to next approver",nextApp.email)

            app.status = ApprovalModel.Status.ACCEPTED
            app.response = f"approved by {app.email} "

            isApprovalAccepted = True

            for x in approve:
                # print(x.status)
                if x.status != ApprovalModel.Status.ACCEPTED:
                    isApprovalAccepted = False
                    break

            if isApprovalAccepted:
                process.stepTwo = processModel.steps.COMPLETE
                if not isFinal:
                    print("send email to store for quotations")
                     # print(request.FILES,"LLL")
                    file = request.FILES.get('pdf')
                    # print(file)
                    res = send_email_to_store(owner_username  or settings.EMAIL_HOST_USER,owner_username,owner_email,file,process.title,token)
                    if res != 1:
                        return JsonResponse({"error": "email not sent properly"},status = 500)
                    process.save()
                else:
                    print("email sent to account department")
                    res = send_email_to_acc(owner_username  or settings.EMAIL_HOST_USER,owner_username,owner_email,process.title,token)
                    if res != 1:
                        return JsonResponse({"error": "email not sent properly"},status = 500)
                    process.stepFour = processModel.steps.COMPLETE
                    process.save()

            print(app.sequence_number)
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
            
            approve = ApprovalModel.objects.filter(process = process_id)
            if not approve:
                return JsonResponse({'message':'request not found'},status = 404)
            
            app = None
            for a in approve:
                if a.email == email:
                    app = a
            

            next_app = None
            for a in approve:
                if a.sequence_number == app.sequence_number + 1:
                    next_app = a
            
            if next_app:
                 data = {
                "id":next_app._id,
                "status":next_app.status,
                "next_email":next_app.email,
                "response":next_app.response
                }
            else:
                data = {
                    "message":"last approval needed"
                }
            return JsonResponse({"data":data,"message":"request found"},status = 200)
        except Exception as e:
            return JsonResponse({'message':'error while getting the request','error':str(e)},status=500)
    else:
        return JsonResponse({"message":"invalid request type"},status=405)




def send_email_to_store(from_email,owner_username,owner_email,file,title,token):
    print(token)

    subject = 'Asking for Quotations'
    from_email = from_email
    recipient_list = [settings.STORE_EMAIL]

    html_content = f"""
            <p>Dear [Store Name/Supplier’s Name],</p>

            <p>I hope this email finds you well. I am interested in purchasing <strong>{title}</strong> and would like to request a quotation for the same.</p>


            <p>For your reference, I have attached a PDF document with the details of the products I require.</p>

            <p>You may submit your quotation using the following link:<br>
            <a href={settings.FRONTEND}/quoteSubmit/{token} target="_blank">Submit Quotation</a></p>


            <p>Please let me know if you need any additional information to prepare the quotation. I would appreciate it if you could send the details at your earliest convenience.</p>

            <p>Looking forward to your response.</p>

            <p>Best regards,</p>
            <p><strong>{owner_username}</strong><br>{owner_email}</p>

    """

    email = EmailMessage(subject, html_content, from_email, recipient_list)
    email.attach(file.name, file.read(), file.content_type)
    email.content_subtype = "html" 

    res = email.send()

    return res


def send_email_to_acc(from_email,owner_username,owner_email,title,token):
    print(token)

    subject = 'Asking for Quotations'
    from_email = from_email
    recipient_list = [settings.STORE_EMAIL]

    html_content = f"""
            <p>Dear [Store Name/Supplier’s Name],</p>

            <p>I hope this email finds you well. I am writing to confirm that we are ready to proceed with the purchase of <strong>{title}</strong>.</p>

            <p>For your reference, I have attached a PDF document with the final details of the products and terms agreed upon.</p>

            <p>You may submit your purchase order using the following link:<br>
            <a href="{settings.FRONTEND}/purchaseorder/{token}" target="_blank">Submit Purchase Order</a></p>

            <p>If you need any additional information or clarification, please do not hesitate to reach out. We look forward to receiving your purchase order at the earliest convenience.</p>

            <p>Thank you for your continued support.</p>

            <p>Best regards,</p>
            <p><strong>{owner_username}</strong><br>{owner_email}</p>

    """

    email = EmailMessage(subject, html_content, from_email, recipient_list)
    email.content_subtype = "html" 

    res = email.send()
    print(res)

    return res



@csrf_exempt
def send_for_final_approval(request):
    if request.method == 'POST':
        try:
            # print("LLL")
            # data = json.loads(request.body)
            data = request.POST.get('data')
            print(data,"lll")

            if not data:
              return JsonResponse({'error': 'email is required'}, status=400)
            

            

            token = request.POST.get('token')
            if not token:
                return JsonResponse({'error': 'unauthorize request'}, status=401)
            

            
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
            
            if process.stepTwo == process.steps.REJECTED:
                return JsonResponse({"error":"request already rejected"},status=405)
            


            sender_email = ""
            data = json.loads(data)
            for x in data:

                existed_approval_model =  ApprovalModel.objects.filter(email = x["email"],process = decrypt_process_token['id']).first()

                if not existed_approval_model:
                    new_approval_model = ApprovalModel.objects.create(
                        email = x["email"],
                        process = process,
                        sequence_number = x["sequence_number"],
                        status = ApprovalModel.Status.PENDING,
                        response = x["response"],
                        type = ApprovalModel.Type.FINAL,
                        name = x["name"]
                    )

                    new_approval_model.save()
                    if sender_email == "":
                        sender_email = x["email"]
                else:
                    if existed_approval_model.type != ApprovalModel.Type.FINAL:
                        existed_approval_model.status = ApprovalModel.Status.PENDING
                        existed_approval_model.type = ApprovalModel.Type.FINAL
                        existed_approval_model.response = existed_approval_model.response + "sending another request for final approval"
                        existed_approval_model.save()

                    if existed_approval_model.status == ApprovalModel.Status.PENDING and sender_email == "" : 
                        sender_email = existed_approval_model.email
                        
                

                if sender_email == "":
                    # return JsonResponse({"message":'all emil have submit their approval'},status = 200)
                    res = send_email_to_acc(settings.EMAIL_HOST_USER,decrypt_access_token['username'],decrypt_access_token['email'],process.title,token)
                    if res != 1:
                       return JsonResponse({"error": "email not sent properly"},status = 500)
                    
                    return JsonResponse({"message":"request send successfully"},status = 200)
                

                rfq = RFQModel.objects.filter(process = process, type = "Selected").first()
                if not rfq:
                    return JsonResponse({"error":"no requirement sheet is available"},status=405)

                subject = "final approval"
                from_email = decrypt_access_token['username'] or settings.EMAIL_HOST_USER
                recipient_list = [sender_email]
                html_content =f"""
<body style="font-family: Arial, sans-serif; color: #333;">
    <div style="max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 8px;">
        <div style="text-align: center; margin-bottom: 20px;">
            <h2>Final Approval Required: RFQ Quotation</h2>
        </div>

        <div style="line-height: 1.6;">
            <p>Dear Approver,</p>

            <p>
                Please review the requirement sheet for <b>{process.title}</b> using the link below:
            </p>

            <p>
                <a href="{settings.FRONTEND}/approval/{token}" 
                   style="color: #1a73e8; text-decoration: none;" target="_blank">
                    ➤ Review Requirement Sheet & Submit Approval
                </a>
            </p>

            <p>
                You can also directly view the quotation document here:
            </p>

            <p>
                <a href="{rfq.sheet}" 
                   target="_blank" 
                   style="display: inline-block; padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
                    View Quotation
                </a>
            </p>

            <p>
                After reviewing, kindly provide your final approval or feedback so we can proceed with the RFQ process.
            </p>

            <p>If you have any questions or need further information, feel free to reach out.</p>

            <p>Thank you for your attention to this request.</p>

            <p>
                Best regards,<br>
                {decrypt_access_token['username']}<br>
                {decrypt_access_token['email']}
            </p>
        </div>

        <hr style="margin-top: 30px; border: none; border-top: 1px solid #ccc;">

        <div style="font-size: 12px; color: #777;">
            <p>
                This email was sent by the Automate Product Purchase Platform. 
                If you did not request this email, please disregard it.
            </p>
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
            

                    

            

            return JsonResponse({'message':f'email sended successfully to {sender_email}'},status = 200)
        except Exception as e:
            return JsonResponse({'message':'error while getting the request','error':str(e)},status=500)
        
    else:
        return JsonResponse({"message":"invalid request type"},status=405)