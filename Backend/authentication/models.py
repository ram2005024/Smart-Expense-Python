from django.db import models
import uuid
from django.contrib.auth.models import AbstractUser
# Create your models here.
class CustomUser(AbstractUser):
    id=models.CharField(primary_key=True,default=uuid.uuid4,editable=False)
    email=models.CharField(max_length=100,unique=True)
    username=models.CharField(max_length=100,unique=True)
    USERNAME_FIELD='email'
    REQUIRED_FIELDS=['username']
    user_image=models.ImageField(upload_to='user_images/',default='user_images/default.jpg',null=True)
    is_verified=models.BooleanField(default=False)

    def __str__(self):
        return self.email

