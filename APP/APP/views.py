from django.http import HttpResponse
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
# csrf_exempt

from django.core.mail import send_mail
from . import settings


@csrf_exempt
def home(request):
    print(request.method)
    subject = "testing email sending"
    message = "Hello, world. You're at the APP home."
    from_email = "yranshevare2005@gmail.com"
    recipient_list = ["yadneshranshevare@gmail.com"]

    send_mail(subject, message, from_email, recipient_list)

    # return HttpResponse("Hello, world. You're at the APP home.")
    return JsonResponse({"message": "Hello, world. You're at the APP home."})

@csrf_exempt
async def index(request):
    # print("sss")
    # print(request.method)
    
    if request.method == 'POST':
        try:
            # Read and parse the JSON data from the request body
            data = json.loads(request.body)
            # print(data)
            name = data.get('name', None)
            # print(name)
            return JsonResponse({'name': name})
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)
    
def get(request):
    
    name = request.GET.get('name')
    print(name)
    return HttpResponse(f"Name received: {name}")


from django.contrib.auth.hashers import make_password, check_password

@csrf_exempt
def registerUser(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            data['isEmailVerified'] = False
            password = data.get('password', None)
            if password:
                data['password'] = make_password(password)
            else:
                return JsonResponse({'error': 'Password not provided'}, status=400)

            print(check_password(password, data['password']))
            return JsonResponse({'data': data})
        except Exception as e:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=405)