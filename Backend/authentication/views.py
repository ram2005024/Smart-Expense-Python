from rest_framework import generics
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from .serializer import RegisterSerializer, UserSerializer


# Create your views here.
class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {"message": "User registered successfully", "user_id": user.id},
            status=status.HTTP_201_CREATED,
        )


class TokenObtainView(TokenObtainPairView):
    serializer_class = TokenObtainPairSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        access = serializer.validated_data["access"]
        refresh = serializer.validated_data["refresh"]

        serializer.validated_data.pop("refresh")
        user = UserSerializer(serializer.user).data
        response = Response({"access": access, "user": user}, status=status.HTTP_200_OK)
        response.set_cookie(
            "refresh",
            refresh,
            samesite="None",
            httponly=True,
            secure=True,
            max_age=7 * 24 * 60 * 60,
        )
        return response


# For refresh view
class MyTokenRefreshView(TokenRefreshView):
    serializer_class = TokenRefreshSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh")
        if not refresh_token:
            return Response(
                {"details": "Token doesn't exist"}, status=status.HTTP_400_BAD_REQUEST
            )

        serializer = TokenRefreshSerializer(data={"refresh": refresh_token})
        serializer.is_valid(raise_exception=True)
        access = serializer.validated_data["access"]
        new_refresh = serializer.validated_data["refresh"]
        response = Response({"access": access}, status=status.HTTP_200_OK)
        # Set the new cookie
        response.set_cookie(
            "refresh",
            new_refresh,
            httponly=True,
            samesite="None",
            secure=True,
            max_age=7 * 24 * 60 * 60,
        )

        return response


# Logout view
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    try:
        refresh = request.COOKIES.get("refresh")
        # Blacklist the token
        if refresh:
            token = RefreshToken(refresh)
            token.blacklist()
    except Exception:
        pass
    response = Response({"message": "Logout successful"}, status=status.HTTP_200_OK)
    response.delete_cookie(key="refresh", samesite="None")
    return response
