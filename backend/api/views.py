from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.authentication import JWTAuthentication
import jwt
from datetime import datetime, timedelta, timezone
from .models import User
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import status
from .models import Note
from .serializers import NoteSerializer, UserSerializer
from django.shortcuts import get_object_or_404

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        # Validate and save the user data
        user_serializer = UserSerializer(data=request.data)
        user_serializer.is_valid(raise_exception=True)
        user_serializer.save()

        return Response(user_serializer.data)
    
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = User.objects.filter(username=username).first()

        if user is None or not user.check_password(password):
            raise AuthenticationFailed('Invalid credentials')

        refresh = RefreshToken.for_user(user)
        access = refresh.access_token

        response_data = {
            'username': user.username,
            'access': str(access),
            'refresh': str(refresh)
        }

        return Response(response_data)
    
class UserView(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')
        
        if not token:
            raise AuthenticationFailed('Unauthenticated')
        
        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Unauthenticated')
        
        user = User.objects.filter(id=payload['id']).first()
        serializer = UserSerializer(user)
        
        return Response(serializer.data)
        
class LogoutView(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')
        response.data = {
            'message': 'success'
        }
        return response
    
class AddNoteView(APIView):
    # permission_classes = [AllowAny]

    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def post(self, request):
        print("I am inside add note view", request.data)
        print("request.user", request.user)
        
        # Debugging: Check if the token is being received
        auth_header = request.headers.get('Authorization')
        print("Authorization header:", auth_header)
        
        serializer = NoteSerializer(data=request.data)
        
        if serializer.is_valid():
            serializer.save(user=request.user)  # Set the user field manually
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class NotesView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get(self, request):
        notes = Note.objects.filter(user=request.user)
        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class NoteDetailView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get_object(self, request, pk):
        return get_object_or_404(Note, pk=pk, user=request.user)

    def put(self, request, pk):
        note = self.get_object(request, pk)
        serializer = NoteSerializer(note, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        note = self.get_object(request, pk)
        note.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)