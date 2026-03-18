from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import CustomUser
from django.contrib.auth.password_validation import validate_password
 #User serilaizer
class UserSerializer(serializers.ModelSerializer):
 class Meta:
    model=CustomUser
    fields=['username','email','is_verified','user_image']

# Register serializer

class RegisterSerializer(serializers.ModelSerializer):
    
    password1=serializers.CharField(write_only=True)
    password2=serializers.CharField(write_only=True)
    class Meta:
        model=CustomUser
        fields=['username','email','password1','password2']

    def validate(self, attrs):
    # Check if both passowrd matches or not
        if attrs['password1']!=attrs['password2']:
            raise serializers.ValidationError({'password':['Password didnot match']})
        
        # Validate the password
        validate_password(attrs['password1'])
        return attrs

    def create(self, validated_data):
       validated_data.pop('password2')
       user=CustomUser.objects.create_user(
        username=validated_data['username'],
        email=validated_data['email'],
        password=validated_data['password1']
       )
       return user

   
