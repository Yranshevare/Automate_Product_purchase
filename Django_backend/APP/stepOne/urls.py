from django.urls import path,include
from . import views

urlpatterns = [
    path('generate/', views.generate),
    path('save/', views.save),
    path('get/<str:process_id>/',views.get),
    path('delete/',views.delete),
]