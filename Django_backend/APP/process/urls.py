
from django.urls import path,include
from . import views

urlpatterns = [
    path('home/', views.home),
    path('create', views.createProcess),
    path('get_all/',views.get_all),
    path('get_one/',views.get_one),
    path('delete/',views.delete),
]