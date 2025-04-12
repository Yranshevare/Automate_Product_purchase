
from django.urls import path,include
from . import views

urlpatterns = [
   path('home/', views.home),
   path('submit/', views.submit),
   path('get/<str:id>/',views.get),
]