from django.contrib import admin
from .models import CustomUser
from django.contrib.auth.admin import UserAdmin
# Register your models here.
class CustomUserAdmin(UserAdmin):
    list_display=['email','username','is_verified']
    list_editable=('is_verified',)
    fieldsets=UserAdmin.fieldsets +(
        ('Verification',{'fields':('is_verified',)}),
        ('User image',{'fields':('user_image',)}),
    )
    add_fieldsets=UserAdmin.add_fieldsets  +  (
        ('Verification',{'fields':('is_verified',)}),
        ('User image',{'fields':('user_image',)}),
    )
    
    
admin.site.register(CustomUser,CustomUserAdmin)