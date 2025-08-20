from rest_framework import serializers
from .models import Projet, SousProjet, ActiviteGenerale
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


class UserChefProjetSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "name", "surname", "role")


class UserIngenieurTravauxSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "name", "surname", "role")


class UserQualiticientSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "name", "surname", "role")


class SousProjetSerializer(serializers.ModelSerializer):
    # écriture : on attend les PK filtrés par rôle
    projet = serializers.PrimaryKeyRelatedField(queryset=Projet.objects.all())
    chef_projet = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='chef de projet'),
        required=False,
        allow_null=True
    )
    ingenieur_travaux = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='ingenieur travaux'),
        required=False,
        allow_null=True
    )

    # lecture : détails imbriqués
    projet_details = serializers.SerializerMethodField(read_only=True)
    chef_projet_details = UserChefProjetSerializer(source='chef_projet', read_only=True)
    ingenieur_travaux_details = UserIngenieurTravauxSerializer(source='ingenieur_travaux', read_only=True)

    class Meta:
        model = SousProjet
        fields = (
            "id",
            "titre",
            "projet",
            "projet_details",
            "chef_projet",
            "chef_projet_details",
            "ingenieur_travaux",
            "ingenieur_travaux_details",
        )

    def get_projet_details(self, obj):
        # évite import circulaire ou surcharge si ProjetSerializer est lourd
        return {"id": obj.projet.id, "titre": obj.projet.titre} if obj.projet else None

    def validate_chef_projet(self, value):
        if value and value.role != 'chef de projet':
            raise serializers.ValidationError("L'utilisateur doit avoir le rôle 'chef de projet'.")
        return value

    def validate_ingenieur_travaux(self, value):
        if value and value.role != 'ingenieur travaux':
            raise serializers.ValidationError("L'utilisateur doit avoir le rôle 'ingenieur travaux'.")
        return value


class ActiviteGeneraleSerializer(serializers.ModelSerializer):
    # écriture : accepter plusieurs qualiticiens (PK) mais uniquement ceux avec le bon rôle
    qualiticient = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='qualiticient'),
        many=True,
        required=False,
        allow_empty=True
    )
    # lecture : détails imbriqués des qualiticiens
    qualiticient_details = UserQualiticientSerializer(source='qualiticient', many=True, read_only=True)

    # si tu veux conserver la version détaillée du sous-projet en lecture :
    sous_projet_details = SousProjetSerializer(source='sous_projet', read_only=True)

    class Meta:
        model = ActiviteGenerale
        fields = "__all__"

    def validate_qualiticient(self, value):
        # double-check côté serveur
        for u in value:
            if u.role != 'qualiticient':
                raise serializers.ValidationError("Tous les utilisateurs doivent avoir le rôle 'qualiticient'.")
        return value