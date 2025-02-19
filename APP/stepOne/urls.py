from django.urls import path,include
from . import views

urlpatterns = [
    path('generate/', views.generate),
]