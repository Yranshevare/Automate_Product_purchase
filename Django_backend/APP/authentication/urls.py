from django.urls import path
from . import views

urlpatterns = [
    #you can add your new app path here
    path('registerUser/', views.registerUser),
    path('login/',views.login),
    path('logout/',views.logout),
    path('generateOTP/',views.generateOTP),
    path('verifyOTP/',views.verifyOTP),
    path('get/',views.get),
]