from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib import admin
from django.urls import path, include
from .views import RegisterView, LoginView, UserView, LogoutView, AddNoteView, NotesView, NoteDetailView


urlpatterns = [
    path("register", RegisterView.as_view(), name="register"),
    path("login", LoginView.as_view(), name="login"),
    path("user", UserView.as_view(), name="user"),
    path("logout", LogoutView.as_view(), name="logout"), 
    path("add-note", AddNoteView.as_view(), name="add-note"),
    path("notes", NotesView.as_view(), name="notes"),
    path('notes/<int:pk>/', NoteDetailView.as_view(), name='note-detail'),

     
]