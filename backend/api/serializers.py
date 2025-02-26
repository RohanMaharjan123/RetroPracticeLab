from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from api.models import User, Note

# User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'password', 'phone_number', 'address']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        print("I am inside user serializer", validated_data)
        password = validated_data.pop('password', None)
        user = User.objects.create(**validated_data)
        if password is not None:
            user.set_password(password)
        user.save()
        return user
    
class NoteSerializer(serializers.ModelSerializer):
    date = serializers.DateTimeField(format="%Y-%m-%d", input_formats=["%Y-%m-%d"])

    class Meta:
        model = Note
        fields = ['id', 'user', 'date', 'task', 'description']
        read_only_fields = ['user']