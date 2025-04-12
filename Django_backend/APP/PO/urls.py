
from django.urls import path,include
from . import views

urlpatterns = [
   path('home/', views.home),
   path('submit/', views.submit),
   path('get/<str:id>/',views.get),
   path('send_po_to_vendor/',views.send_Po_to_vender),
]