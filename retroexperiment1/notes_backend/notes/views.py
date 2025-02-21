from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Note
from .serializers import NoteSerializer

@api_view(["GET", "POST"])
def add_note(request):
    if request.method == "GET":
        notes = Note.objects.all().order_by("-date")
        serializer = NoteSerializer(notes, many=True)
        return Response(serializer.data)
    
    if request.method == "POST":
        serializer = NoteSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Note added successfully", "note": serializer.data}, status=201)
        return Response(serializer.errors, status=400)

@api_view(["PUT"])
def update_note(request, note_id):
    try:
        note = Note.objects.get(pk=note_id)
    except Note.DoesNotExist:
        return Response({"error": "Note not found"}, status=404)

    serializer = NoteSerializer(note, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"message": "Note updated successfully", "note": serializer.data})
    return Response(serializer.errors, status=400)

@api_view(["DELETE"])
def delete_note(request, note_id):
    try:
        note = Note.objects.get(pk=note_id)
        note.delete()
        return Response({"message": "Note deleted successfully"})
    except Note.DoesNotExist:
        return Response({"error": "Note not found"}, status=404)