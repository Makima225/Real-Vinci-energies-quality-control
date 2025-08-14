from .models import User
from django.contrib.auth.base_user import BaseUserManager
from .serializers import UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.core.mail import send_mail
from rest_framework.parsers import MultiPartParser, FormParser
from django.conf import settings
from rest_framework import generics, status
from rest_framework.exceptions import ValidationError
from rest_framework.response import Response
from django.shortcuts import render
from django.contrib.auth import get_user_model, update_session_auth_hash
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import User
from .serializers import UserSerializer, UserCreateByAdminSerializer, ChangePasswordSerializer, RoleUserSerializer, CustomTokenObtainPairSerializer, UpdateProfilePictureSerializer
import random
import string

User = get_user_model()

class UserCreateByAdminView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserCreateByAdminSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        email = serializer.validated_data.get("email")

         # Vérifier si l'email existe déjà
        if User.objects.filter(email=email).exists():
            raise ValidationError({"email": "Un utilisateur avec cet email existe déjà."})
        
        
        name = serializer.validated_data.get("name")
        surname = serializer.validated_data.get("surname")
        role = serializer.validated_data.get("role")
        picture = serializer.validated_data.get("picture")

        

        # générer un mot de passe aléatoire
        password = ''.join(random.choices(string.ascii_letters + string.digits, k=10))    

         # creer l'utilisateur avec le mot de passe généré
        user = serializer.save(password=password)
        user.set_password(password)  # Hacher le mot de passe
        user.save()  # Sauvegarder l'utilisateur avec le mot de passe haché

        # Envoyer le mail contenant le mot de passe 
        send_mail(
            "Votre compte a été créé",
            f"Salut {name} {surname} , \n\nVotre compte a été créé avec succès. \n Mot de passe: {password} \n\n Veuillez vous connecter et changer votre mot de passe. \n\n votre role est : {role}",
            "merci bien !",
            [email],
            fail_silently=False,
        )
        return Response({"message": "Utilisateur créé avec succès et email envoyé"}, status=status.HTTP_201_CREATED)

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    


class ChangePasswordView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        user = request.user
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            old_password = serializer.validated_data["old_password"]
            new_password = serializer.validated_data["new_password"]

            if not user.check_password(old_password):
                return Response({"error": "Ancien mot de passe incorrect"}, status=status.HTTP_400_BAD_REQUEST)

            if old_password == new_password:
                return Response({"error": "Le nouveau mot de passe ne peut pas être identique à l'ancien"}, status=status.HTTP_400_BAD_REQUEST)

            user.set_password(new_password)
            user.is_password_changed = True  # Marquer le mot de passe comme changé
            user.save()
            update_session_auth_hash(request, user)  # Garde la session active

            return Response({"message": "Mot de passe changé avec succès"}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



class AddPictureView(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UpdateProfilePictureSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]  # 📌 Gère l'upload de fichiers

    def get_object(self):
        return self.request.user  # 🔹 Met à jour uniquement l'utilisateur connecté
    
    def update(self, request, *args, **kwargs):
        print("📩 Données reçues :", request.data)  # 🔹 Vérifie les données envoyées
        print("📂 Fichiers reçus :", request.FILES)  # 🔹 Vérifie si l'image est bien reçue
        serializer = self.get_serializer(instance=self.get_object(), data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message":  "Photo de profil mise à jour avec succès", "picture":serializer.data["picture"] })
        return Response(serializer.errors, status=400)

class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = User.objects.all()
        role = self.request.query_params.get("role", None)  # Récupérer le paramètre d'URL
        if role:
            queryset = queryset.filter(role=role)
        return queryset

class UserDetailView(generics.RetrieveAPIView):
    # Vue pour afficher les détails d'un utilisateur
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
class UserDetailRoleView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]  

    def get_queryset(self):
        role = self.kwargs.get('role')
        return User.objects.filter(role=role)
    

class RoleUserListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RoleUserSerializer

    def get(self, request):
        # Récupérer la liste des rôles des utilisateurs
        roles = User.ROLE_CHOICES
        return Response(roles)