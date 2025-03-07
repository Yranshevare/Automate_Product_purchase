from django.db import models
from django.conf import settings
# Create your models here.
class ApprovalModel(models.Model):
    _id = models.AutoField(primary_key=True, serialize=False, unique=True)
    email = models.EmailField(max_length=100)

    class Status(models.TextChoices):
        INCOMPLETE = 'Incomplete', 'Incomplete'
        PENDING = 'Pending', 'Pending'
        COMPLETE = 'Complete', 'Complete'

    status = models.CharField(max_length=20,choices=Status.choices, default=Status.INCOMPLETE)

    class Type(models.TextChoices):
        PRIMARY = 'Primary', 'Primary'
        FINAL = 'Final', 'Final'

    type = models.CharField(max_length=20,choices=Type.choices, default=Type.PRIMARY)

    process = models.ForeignKey(settings.PROCESS_MODEL, on_delete=models.CASCADE)

    def __str__(self):
            return self.process.title

