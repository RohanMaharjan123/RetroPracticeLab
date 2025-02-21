from django.urls import path
from .views import  add_note, update_note, delete_note

urlpatterns = [
    # path("notes/", get_notes, name="get_notes"),
    path("notes/add/", add_note, name="add_note"),
    path("notes/update/<uuid:note_id>/", update_note, name="update_note"),
    path("notes/delete/<uuid:note_id>/", delete_note, name="delete_note"),
]