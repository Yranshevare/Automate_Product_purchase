from django.db import models
from django.conf import settings

# Create your models here.

class stepOneModel(models.Model):
    _id = models.AutoField(primary_key=True, unique=True)
    requirementSHeet = models.TextField()
    process = models.ForeignKey(settings.PROCESS_MODEL,on_delete=models.CASCADE)
    SKU = models.CharField(unique=True,max_length=500)

    def __str__(self):
        return self.process.title
