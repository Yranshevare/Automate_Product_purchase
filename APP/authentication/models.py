from django.db import models
import json


# Create your models here.
class UserModel(models.Model):
    _id = models.AutoField(primary_key=True)
    USER_TYPES = (('normal', 'Normal User'), ('admin', 'Administrator'))
    username = models.CharField(max_length=100)
    email = models.EmailField(unique=True,max_length=100)
    password = models.CharField(max_length=50)
    profession = models.CharField(max_length=100)
    isEmailVerified = models.BooleanField(default=False)

    class Gender(models.TextChoices):
        MALE = 'M', 'Male'
        FEMALE = 'F', 'Female'
        OTHER = 'O', 'Other'

    gender = models.CharField(
        max_length=2, 
        choices=Gender.choices, 
        default=None
    )

    mobile = models.CharField(max_length=10)
    process = models.TextField(default='[]')  # Store an empty JSON array by default
    def set_process(self, value):
        """Serialize the Python object to a JSON string."""
        self.process = json.dumps(value)

    def get_process(self):
        """Deserialize the JSON string back to a Python object."""
        return json.loads(self.process)