from rest_framework import generics
from .serializers import ProjetSerializer, SousProjetSerializer
from users.models import User
from .models import Projet, SousProjet
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model



User = get_user_model()

# Project Views
class ProjetCreateView(generics.CreateAPIView):
    queryset = Projet.objects.all()
    serializer_class = ProjetSerializer
    permission_classes = [IsAuthenticated]


class ProjectListView(generics.ListAPIView):
    queryset = Projet.objects.all()
    serializer_class = ProjetSerializer
    permission_classes = [IsAuthenticated]    



class ProjectDetailView(generics.RetrieveAPIView):
    queryset = Projet.objects.all()
    serializer_class = ProjetSerializer
    permission_classes = [IsAuthenticated]



class ProjectUpdateView(generics.UpdateAPIView):
    queryset = Projet.objects.all()
    serializer_class = ProjetSerializer
    permission_classes = [IsAuthenticated]   


class ProjectDeleteView(generics.DestroyAPIView):
    queryset = Projet.objects.all()
    serializer_class = ProjetSerializer
    permission_classes = [IsAuthenticated]



# Sous-Project Views

class SousProjetCreateView(generics.CreateAPIView):
    queryset = SousProjet.objects.all()
    serializer_class = SousProjetSerializer
    permission_classes = [IsAuthenticated]


class SousProjetListView(generics.ListAPIView):
    queryset = SousProjet.objects.all()
    serializer_class = SousProjetSerializer
    permission_classes = [IsAuthenticated]


class SousProjetDetailView(generics.RetrieveAPIView):
    queryset = SousProjet.objects.all()
    serializer_class = SousProjetSerializer
    permission_classes = [IsAuthenticated]


class SousProjetUpdateView(generics.UpdateAPIView): 
    queryset = SousProjet.objects.all()
    serializer_class = SousProjetSerializer
    permission_classes = [IsAuthenticated]


class SousProjetDeleteView(generics.DestroyAPIView):
    queryset = SousProjet.objects.all()
    serializer_class = SousProjetSerializer
    permission_classes = [IsAuthenticated]    