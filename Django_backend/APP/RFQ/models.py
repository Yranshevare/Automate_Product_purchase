from django.db import models

# Create your models here.
class RFQModel(models.Model):
    id = models.AutoField(primary_key=True)

    sheet = models.TextField()      # cloudinary url


    class type(models.TextChoices):
        SELECTED = 'Selected', 'Selected',
        NOT_SELECTED = 'Not Selected', 'Not Selected'

    type = models.CharField(max_length=20,choices=type.choices, default=type.NOT_SELECTED)

    class status(models.TextChoices):
        COMPLETED = 'Completed', 'Completed',
        PENDING = 'Pending', 'Pending',
        REJECTED = 'Rejected', 'Rejected'

    status = models.CharField(max_length=20,choices=status.choices, default=status.PENDING)

    process = models.ForeignKey('process.processModel', on_delete=models.CASCADE)

    def __str__(self):
        return self.process.title