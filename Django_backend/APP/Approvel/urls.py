from django.urls import path
from . import views

urlpatterns = [
    path("home/", views.home),
    path('send_for_primary/',views.send_for_primary),
]