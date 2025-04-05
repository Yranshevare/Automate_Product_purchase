from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from process.models import processModel
from .models import RFQModel
from utils.utils import encode_id,decode_id,decrypt_data
from APP import settings
import cloudinary
import cloudinary.uploader

import json
import os 
import environ
env = environ.Env()


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
environ.Env.read_env(os.path.join(BASE_DIR, '.env'))



# Create your views here.
@csrf_exempt
def home(request):
    return JsonResponse({'message':"Hello, world. You're at the RFQ home."})


@csrf_exempt
def submit(request):
    if request.method == 'POST':
        try:
            sheet = json.loads(request.body)['sheet']
            # print(sheet)


            id = json.loads(request.body)['id']
            id = decode_id(id)
            # print(id)


            process = processModel.objects.filter(_id = id).first()

            if(not process):
                return JsonResponse({'message':'process not found'},status=401)
            
            if (process.stepTwo != processModel.steps.COMPLETE):
                return JsonResponse({'message':'no requirement sheet is available'},status=422)
            
            

            rfq = RFQModel.objects.filter(sheet = sheet).first()
            if(rfq):
                return JsonResponse({'message':'sheet already submitted'},status=200)
            

            rfq = RFQModel(
                sheet = sheet,
                process = process,
            )
            print(rfq)
            rfq.save()
            
            if process.stepThree != processModel.steps.COMPLETE:
                process.stepThree = processModel.steps.PENDING
                process.save()
            


            return JsonResponse({'message':'data submitted successfully'},status=200)
        except Exception as e:
            return JsonResponse({'message': 'Invalid JSON format',"error":str(e)}, status=400)
    else:
        return JsonResponse({"message":'invalid request method'},status=400)
    

def get_all(request):
    if request.method == 'GET':
        try:
            id = request.GET.get('id')
            # id = json.loads(request.body)['id']
            id = decode_id(id)
            print(id,"hghg")
            process = processModel.objects.filter(_id = id).first()
            if(not process):
                return JsonResponse({'message':'process not found'},status=401)
            


            rfq = RFQModel.objects.filter(process = process)
            if(not rfq):
                return JsonResponse({'message':'rfq not found'},status=401)
            

            data = []
            for x in rfq:
                data.append({
                    "id":encode_id(x.id),
                    "sheet":x.sheet,
                    "status":x.status,
                    "type":x.type
                })
            
            return JsonResponse({'sheet':data},status=200)
        except Exception as e:
            return JsonResponse({'message': 'Invalid JSON format',"error":str(e)}, status=400)
    else:
        return JsonResponse({"message":'invalid request method'},status=400)
    


@csrf_exempt
def select(request):
    if request.method == 'POST':
        try:

            # check for authentication
            if 'access_token' not in request.COOKIES:
                return JsonResponse({"message":"Unauthorized requested"},status=401)
            
            if 'process_token'  not in request.COOKIES:
                return JsonResponse({"message":"process token doesn't exist"},status=400)
            
            pro = decrypt_data(request.COOKIES.get('process_token'))['id']
            user = decrypt_data(request.COOKIES.get('access_token'))["id"]
            # print(pro)
     


            id = json.loads(request.body)['id']
            id = decode_id(id)
            
            process = processModel.objects.filter(_id = pro).first()    
            if(not process):
                return JsonResponse({'message':'process not found'},status=401)
            

            if(process.owner_id != int(user)):
                return JsonResponse({'message':'not the owner'},status=401)
            

            rfq = RFQModel.objects.filter(id = id,process = process).first()
            if(not rfq):
                return JsonResponse({'message':'rfq not found'},status=401)



            rfq.status = "selected"
            rfq.save()
            


            return JsonResponse({'message':'data submitted successfully'},status=200)
        except Exception as e:
            return JsonResponse({'message': 'Invalid JSON format',"error":str(e)}, status=400)
    else:
        return JsonResponse({"message":'invalid request method'},status=400)
    



cloudinary.config( 
  cloud_name = env("CLOUD_NAME"), 
  api_key = env("API_KEY"), 
  api_secret =env("API_SECRET")
)
@csrf_exempt
def remove(request):
    print(settings.CLOUD_NAME,settings.API_KEY,settings.API_SECRET)
    if request.method == 'POST':
        try:
            id = json.loads(request.body)['id'] 
            file_id = json.loads(request.body)['file_id']
            print(id,"hghg")
            print(file_id)

            result = cloudinary.uploader.destroy(file_id)
            print(result,"result")


            id = decode_id(id)
            rfq = RFQModel.objects.filter(id = id).first()
            if(not rfq):
                return JsonResponse({'message':'rfq not found'},status=401)
            print(rfq.sheet,"sheet")
            rfq.delete()


            process = processModel.objects.filter(_id = rfq.process._id).first()

            if(not process):
                return JsonResponse({'message':'process not found'},status=401)
            
            allRfq = RFQModel.objects.filter(process = process)

            if not allRfq:
                process.stepThree = processModel.steps.INCOMPLETE
                process.save()
                
            return JsonResponse({'message':'data deleted successfully'},status=200)
        except Exception as e:
            return JsonResponse({'message': 'Invalid JSON format',"error":str(e)}, status=400)
    else:
        return JsonResponse({"message":'invalid request method'},status=400)