from django.db import models
from django.conf import settings

# Create your models here.
class processModel(models.Model):
    _id = models.AutoField(primary_key=True,unique=True)
    owner = models.ForeignKey(settings.USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=100, default='Process')

    class steps(models.TextChoices):
        INCOMPLETE = 'Incomplete'
        PENDING = 'Pending'
        COMPLETE = 'Complete',
        REJECTED = 'Rejected',
        SKIPPED = 'Skipped'
    
    stepOne = models.CharField(
        max_length=100, 
        choices=steps.choices, 
        default=steps.INCOMPLETE
    )
    stepTwo = models.CharField(
        max_length=100, 
        choices=steps.choices, 
        default=steps.INCOMPLETE
    )
    stepThree = models.CharField(
        max_length=100, 
        choices=steps.choices, 
        default=steps.INCOMPLETE
    )
    stepFour = models.CharField(
        max_length=100, 
        choices=steps.choices, 
        default=steps.INCOMPLETE
    )
    stepFive = models.CharField(
        max_length=100, 
        choices=steps.choices, 
        default=steps.INCOMPLETE
    )