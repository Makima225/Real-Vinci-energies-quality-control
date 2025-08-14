from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
   password = serializers.CharField(write_only=True)
   password_confirm = serializers.CharField(write_only=True)

   class Meta:
      model = User
      fields = ['id','email', 'name', 'surname', 'role', 'password', 'password_confirm', 'picture']

   def validate_data(self, data):
      if data['password'] != data['password_confirm']:
         raise serializers.ValidationError("les mots de passe ne correspondent pas")
      return data

   def create(self, validated_data):
      # Supprimer le champ de confirmation du mot de passe avant de créer l'utilisateur
      validated_data.pop('password_confirm')
      return User.objects.create_user(**validated_data)   


class UserCreateByAdminSerializer(serializers.ModelSerializer):

   class Meta:
      model = User
      fields = ['id','email', 'name', 'surname', 'role', 'picture']


class ChangePasswordSerializer(serializers.Serializer):
      old_password = serializers.CharField(required=True)
      new_password = serializers.CharField(required=True, min_length=8)  

class UpdateProfilePictureSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ["picture"]


class RoleUserSerializer(serializers.Serializer):
    id = serializers.CharField()
    name = serializers.CharField()      



class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # 🔹 Ajouter le rôle dans le token
        token["role"] = user.role if hasattr(user, "role") else None
        token["force_password_change"] = not user.is_password_changed

        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user

        # 🔴 Vérifier si l'utilisateur est actif
        if not user.is_active:
            raise serializers.ValidationError("Votre compte est désactivé. Contactez un administrateur.")

        # 🔹 Ajouter aussi le rôle dans la réponse (optionnel)
        data["role"] = user.role if hasattr(user, "role") else None
        data["force_password_change"] = not user.is_password_changed

        return data