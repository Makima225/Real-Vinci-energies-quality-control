from rest_framework import serializers
from .models import Projet, SousProjet
from users.models import User


class UserCoordonnateurSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "name", "surname", "role")


class ProjetSerializer(serializers.ModelSerializer):
    # en écriture : on attend l'ID du coordonnateur et on filtre le queryset pour éviter les mauvais rôles
    coordonnateur = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='coordonnateur'),
        required=False,
        allow_null=True
    )
    # en lecture : détails imbriqués
    coordonnateur_details = UserCoordonnateurSerializer(source='coordonnateur', read_only=True)

    class Meta:
        model = Projet
        fields = (
            "id",
            "titre",
            "client",
            "Emplacement",
            "Reference_affaire",
            "coordonnateur",
            "coordonnateur_details",
        )

    def validate_coordonnateur(self, value):
        if value and value.role != 'coordonnateur':
            raise serializers.ValidationError("L'utilisateur doit avoir le rôle 'coordonnateur'.")
        return value

