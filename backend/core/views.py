from rest_framework import generics
from .serializers import ProjetSerializer, SousProjetSerializer,ActiviteGeneraleSerializer, ActiviteSpecifiqueSerializer, PlanReferenceSerializer
from users.models import User
from .models import Projet, SousProjet, ActiviteGenerale, ActiviteSpecifique, PlanReference
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


# ActiviteGenerale Views

class ActiviteGeneraleListView(generics.ListAPIView):
    queryset = ActiviteGenerale.objects.all()
    serializer_class = ActiviteGeneraleSerializer
    permission_classes = [IsAuthenticated]    


class ActiviteGeneraleDetailView(generics.RetrieveAPIView):
    queryset = ActiviteGenerale.objects.all()
    serializer_class = ActiviteGeneraleSerializer
    permission_classes = [IsAuthenticated]


class ActiviteGeneraleCreateView(generics.CreateAPIView):
    queryset = ActiviteGenerale.objects.all()
    serializer_class = ActiviteGeneraleSerializer
    permission_classes = [IsAuthenticated]


class ActiviteGeneraleUpdateView(generics.UpdateAPIView):
    queryset = ActiviteGenerale.objects.all()
    serializer_class = ActiviteGeneraleSerializer
    permission_classes = [IsAuthenticated]



class ActiviteGeneraleDeleteView(generics.DestroyAPIView):
    queryset = ActiviteGenerale.objects.all()
    serializer_class = ActiviteGeneraleSerializer
    permission_classes = [IsAuthenticated]                



# ActiviteSpecifique Views

class ActiviteSpecifiqueCreateView(generics.CreateAPIView):
    queryset = ActiviteSpecifique.objects.all()
    serializer_class = ActiviteSpecifiqueSerializer
    permission_classes = [IsAuthenticated]    


class ActiviteSpecifiqueListView(generics.ListAPIView):
    queryset = ActiviteSpecifique.objects.all()
    serializer_class = ActiviteSpecifiqueSerializer
    permission_classes = [IsAuthenticated]  

class ActiviteSpecifiqueDetailsView(generics.RetrieveAPIView):
    queryset = ActiviteSpecifique.objects.all()
    serializer_class = ActiviteSpecifiqueSerializer
    permission_classes = [IsAuthenticated]      

class ActiviteSpecifiqueUpdateView(generics.UpdateAPIView):
    queryset = ActiviteSpecifique.objects.all()
    serializer_class = ActiviteSpecifiqueSerializer
    permission_classes = [IsAuthenticated]    


class ActiviteSpecifiqueDeleteView(generics.DestroyAPIView):
    queryset = ActiviteSpecifique.objects.all()
    serializer_class = ActiviteSpecifiqueSerializer
    permission_classes = [IsAuthenticated]




# PlanReference Views

class PlanReferenceCreateView(generics.CreateAPIView):
    queryset = PlanReference.objects.all()
    serializer_class = PlanReferenceSerializer
    permission_classes = [IsAuthenticated]


class PlanReferenceListView(generics.ListAPIView):
    queryset = PlanReference.objects.all()
    serializer_class = PlanReferenceSerializer
    permission_classes = [IsAuthenticated]


class PlanReferenceDetailView(generics.RetrieveAPIView):
    queryset = PlanReference.objects.all()
    serializer_class = PlanReferenceSerializer
    permission_classes = [IsAuthenticated]



class PlanReferenceUpdateView(generics.UpdateAPIView):
    queryset = PlanReference.objects.all()
    serializer_class = PlanReferenceSerializer
    permission_classes = [IsAuthenticated]



class PlanReferenceDeleteView(generics.DestroyAPIView):
    queryset = PlanReference.objects.all()
    serializer_class = PlanReferenceSerializer
    permission_classes = [IsAuthenticated]


class PlanRefByActiviteSpecifiqueListView(generics.ListAPIView):
    serializer_class = PlanReferenceSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        activite_specifique_id = self.kwargs.get('activite_specifique_id')
        if not activite_specifique_id:
            return PlanReference.objects.none()
        # s'assure que l'activité existe -> 404 si non
        from .models import ActiviteSpecifique
        get_object_or_404(ActiviteSpecifique, id=activite_specifique_id)
        return PlanReference.objects.filter(activite_specifique_id=activite_specifique_id).order_by('id')