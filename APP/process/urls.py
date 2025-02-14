
from django.urls import path,include
from . import views

urlpatterns = [
    path('home/', views.home),
    path('create', views.createProcess),
    path('get/',views.get),
    path('delete/',views.delete),
]