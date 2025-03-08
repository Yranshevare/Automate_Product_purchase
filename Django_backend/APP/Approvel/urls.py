from django.urls import path
from . import views

urlpatterns = [
    path("home/", views.home),
    path('send_for_primary/',views.send_for_primary),
    path('approve_request/<str:process_id>',views.Approve),
    path('get/<str:process_id>/',views.get),
    path('reject_request/',views.Reject),
]