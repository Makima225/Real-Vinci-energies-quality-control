from django.db import models

from django.db import models
from users.models import User
from django.core.exceptions import ValidationError  
from PIL import Image
from io import BytesIO
import os
from django.core.files.base import ContentFile

class Projet(models.Model):
    titre =  models.CharField(max_length=100)
    client = models.CharField(max_length=100)
    Emplacement = models.CharField(max_length=100)
    Reference_affaire = models.CharField(max_length=100)
    coordonnateur = models.ForeignKey(User,on_delete=models.SET_NULL, null=True, blank=True, related_name='projets_coordonnes')

    def __str__(self):
        return self.titre
    
    def clean(self):
    # Validation pour s'assurer que le coordinateur a le rôle de coordonnateur
        if self.coordinateur and self.coordinateur.role != 'coordonnateur':
            raise ValidationError(" Le coordinateur doit avoir le rôle de coordonnateur")
    

class SousProjet(models.Model):
    titre = models.CharField(max_length=100)
    projet = models.ForeignKey(Projet, on_delete=models.CASCADE)
    chef_projet = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='sous_projets_chef_projet')
    ingenieur_travaux = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='sous_projets_ingenieur_travaux')


    def __str__(self):
        return self.titre
    
    def clean(self):
    # Validation pour s'assurer que le chef de projet a le rôle d'ingénieur travaux
        if self.chef_projet and self.chef_projet.role != 'chef de projet':
            raise ValidationError("Le chef de projet doit avoir le rôle de chef de projet")
        
    # Validation pour s'assurer que l'ingénieur travaux a le rôle d'ingénieur travaux
        if self.ingenieur_travaux and self.ingenieur_travaux.role != 'ingenieur travaux':
            raise ValidationError("L'ingénieur travaux doit avoir le rôle d'ingénieur travaux")


class ActiviteGenerale(models.Model):
    titre = models.CharField(max_length=100)
    sous_projet = models.ForeignKey(SousProjet, on_delete=models.CASCADE)
    qualiticient = models.ManyToManyField(User, related_name='activites_generales_qualiticient')

    def __str__(self):
        return self.titre

    def clean(self):
        # Validation pour s'assurer que les utilisateurs ont le rôle de qualiticien
        for user in self.qualiticient.all():
            if user.role != 'qualiticient':
                raise ValidationError(f"L'utilisateur {user.email} doit avoir le rôle de qualiticient.")
    

class ActiviteSpecifique(models.Model):
    titre = models.CharField(max_length=100)
    activite_generale = models.ForeignKey(ActiviteGenerale, on_delete=models.CASCADE)
   
    def __str__(self):
        return self.titre
    
class PlanReference(models.Model):
    nom = models.CharField(max_length=100)
    plan = models.FileField(upload_to='plans/') 
    activite_specifique = models.ForeignKey(ActiviteSpecifique, on_delete=models.CASCADE)   

    def __str__(self):
        return self.nom
    

class Entete(models.Model):
    titre = models.CharField(max_length=100)
    activite_specifique = models.ForeignKey(ActiviteSpecifique, on_delete=models.CASCADE)

    def __str__(self):
        return self.titre
    

    

class CorpsEtat(models.Model):
    titre = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.titre
    
    
class TypeChamp(models.Model):
    """Types de champs possibles"""
    TYPE_CHOICES = [
        ('char', 'Texte court'),
        ('text', 'Texte long'),
        ('decimal', 'Nombre décimal'),
        ('integer', 'Nombre entier'),
        ('select', 'Liste déroulante'),
        ('date', 'Date'),
        ('datetime', 'Date et heure'),
        ('boolean', 'Oui/Non'),
        ('file', 'Fichier'),
        ('photo', 'Photo'),
    ]
    
    nom = models.CharField(max_length=50, choices=TYPE_CHOICES, unique=True)
    
    def __str__(self):
        return self.get_nom_display()    
    

class ChampControle(models.Model):
    """Définit les champs dynamiques pour chaque contrôle"""
    controle = models.ForeignKey('Controle', on_delete=models.CASCADE, related_name='champs')
    nom_champ = models.CharField(max_length=100)  # Ex: "moyen_de_controle", "mesure", "conformite"
    label = models.CharField(max_length=100)  # Ex: "Moyen de contrôle", "Mesure", "Conformité"
    type_champ = models.ForeignKey(TypeChamp, on_delete=models.CASCADE)
    obligatoire = models.BooleanField(default=True)
    options = models.TextField(blank=True, null=True, help_text="Options séparées par virgules pour select")
    valeur_defaut = models.CharField(max_length=200, blank=True, null=True)
    ordre = models.IntegerField(default=0)
    
    def get_options_list(self):
        if self.type_champ.nom == 'select' and self.options:
            return [opt.strip() for opt in self.options.split(',')]
        return []
    
    class Meta:
        ordering = ['ordre', 'nom_champ']
        unique_together = ['controle', 'nom_champ']
    
    def __str__(self):
        return f"{self.controle.titre} - {self.label}"

class Controle(models.Model):
    corps_etat = models.ForeignKey(CorpsEtat, on_delete=models.CASCADE)
   
    
    @property
    def titre(self):
        return self.corps_etat.titre
    
    def __str__(self):
        return f"{self.titre}"

   


class FicheControle(models.Model):
    ETAT_DE_LA_FICHE = [
         ('Remplis', 'Remplis'),
         ('Validé', 'Validé'),
    ]

    activite_specifique = models.ForeignKey(ActiviteSpecifique, on_delete=models.CASCADE)
    activite_generale = models.ForeignKey(ActiviteGenerale, on_delete=models.CASCADE, null=True, blank=True)
    controle = models.ManyToManyField(Controle)
    quantite = models.IntegerField(default=1)
    quantitemod = models.IntegerField(default=0, editable=False)  # Nouveau champ
    quantite_remplie =  models.IntegerField(default=0) # Nouvelle quantité pour les contrôles remplis
    etat_de_la_fiche = models.CharField(max_length=100, choices=ETAT_DE_LA_FICHE,  default='Remplis' )
      # Champs pour la signature avec relation utilisateur
    qualiticient = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="fiches_qualiticient"
    )
    signature_qualiticient = models.ImageField(upload_to='signatures/', null=True, blank=True)
     # Associer l'ingénieur qui a signé
    ingenieur_travaux = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="fiches_ingenieur"
    )
    signature_ingenieur_travaux = models.ImageField(upload_to='signatures/', null=True, blank=True)

    def clean(self):
        # Vérifie que seul un qualiticient peut remplir la fiche
        if self.qualiticient and self.qualiticient.role != 'qualiticient':
            raise ValidationError("Seuls les qualiticients peuvent remplir une fiche de contrôle.")

        # Vérifie que seul un ingénieur travaux peut valider une fiche
        if self.ingenieur_travaux and self.ingenieur_travaux.role != 'ingenieur travaux':
            raise ValidationError("Seuls les ingénieurs travaux peuvent valider une fiche.")
        
    def save(self, *args, **kwargs):
        # Définir automatiquement l'activité générale en fonction de l'activité spécifique
        if self.activite_specifique and not self.activite_generale:
            self.activite_generale = self.activite_specifique.activite_generale

        # Si l'objet est en cours de création, initialiser quantitemod avec la valeur de quantite

        if not self.pk:  # Vérifie si l'objet est en cours de création
            self.quantitemod = self.quantite

        super().save(*args, **kwargs)    

    def __str__(self):
        return f"{self.activite_specifique.titre} " 
    


class FicheRempli(models.Model):
    ETAT_DE_LA_FICHE = [
        ('En cours', 'En cours'),  # Avant toute signature
        ('Remplis', 'Remplis'),  # Quand le qualiticien signe
        ('Validé', 'Validé'),  # Quand l’ingénieur signe
    ]

    fiche = models.ForeignKey(FicheControle, on_delete=models.CASCADE, related_name="fiches_remplies")
    etat_de_la_fiche = models.CharField(max_length=100, choices=ETAT_DE_LA_FICHE, default='En cours')
    qualiticient = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="fiches_remplies_qualiticient")
    signature_qualiticient = models.ImageField(upload_to='signatures/', null=True, blank=True)
    ingenieur_travaux = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="fiches_remplies_ingenieur")
    signature_ingenieur_travaux = models.ImageField(upload_to='signatures/', null=True, blank=True)
    photo = models.ImageField(upload_to="controle-qualité", null=True, blank=True)
    entetes_values = models.JSONField(default=list)
    controles_values = models.JSONField(default=list)
    tableaux_values = models.JSONField(default=list, blank=True, null=True, help_text="Stocke les tableaux dynamiques de la fiche si besoin.")
    date_remplissage = models.DateTimeField(null=True, blank=True)

    @property
    def projet(self):
        return self.fiche.activite_specifique.activite_generale.sous_projet.projet

    @property
    def plan_reference(self):
        return PlanReference.objects.filter(activite_specifique=self.fiche.activite_specifique).first()

    def save(self, *args, **kwargs):
        # Vérifier et redimensionner la photo avant de sauvegarder
        if self.photo:
            photo_file = self.photo.file
            if photo_file.size > 500 * 1024:  # 500 KB
                image = Image.open(photo_file)
                output = BytesIO()
                image = image.convert("RGB")
                image.thumbnail((1024, 1024))
                quality = 95
                image.save(output, format="JPEG", quality=quality)
                output.seek(0)
                while output.tell() > 2 * 1024 * 1024 and quality > 10:
                    quality -= 5
                    output.seek(0)
                    image.save(output, format="JPEG", quality=quality)
                self.photo.file = output

        # Mettre à jour le statut en fonction des signatures
        if self.signature_qualiticient and not self.signature_ingenieur_travaux:
            self.etat_de_la_fiche = "Remplis"
        elif self.signature_qualiticient and self.signature_ingenieur_travaux:
            self.etat_de_la_fiche = "Validé"
        super().save(*args, **kwargs)

        # Mettre à jour la quantité remplie dans FicheControle
        self.fiche.quantite_remplie = self.fiche.fiches_remplies.count()
        self.fiche.save()

    def __str__(self):
        return f"Fiche remplie pour {self.fiche.activite_specifique.titre} - {self.date_remplissage} - {self.etat_de_la_fiche}"
    
class EnteteValue(models.Model):
    fiche_controle = models.ForeignKey(FicheControle, on_delete=models.CASCADE, null=True,  related_name="entete_values")
    entete = models.ForeignKey(Entete, on_delete=models.CASCADE)
    valeur = models.CharField(max_length=100, null=True, blank=True, )
    
    def __str__(self):
        return f"{self.entete.titre}: {self.valeur}"   




class Anomalie(models.Model):

    STATUS = [
        ('Detecter', 'Detecter'),
        ('Résolu', 'Résolu'),
    ]

    fiche_rempli = models.ForeignKey(FicheRempli, related_name='anomalies', on_delete=models.CASCADE)
    controle = models.ForeignKey(Controle, on_delete=models.CASCADE)
    qualiticient = models.ForeignKey(User, on_delete=models.CASCADE)  # Le qualiticien qui a signalé ET traite l'anomalie
    status = models.CharField(max_length=100, choices=STATUS, default='Detecter')
    delais = models.DateField(null=True, blank=True)  # Délai de résolution
    description = models.TextField()
    photo1 = models.ImageField(upload_to='anomalies/', null=True, blank=True)  # Photo de l'anomalie constatée
    photo2 = models.ImageField(upload_to='anomalies/', null=True, blank=True)
    date_signalement = models.DateTimeField(auto_now_add=True)  # Date du signalement

    def save(self, *args, **kwargs):
        # Vérifier et redimensionner les photos avant de sauvegarder
        for photo_field in [self.photo1, self.photo2]:
            if photo_field:
                photo_file = photo_field.file
                max_size = 2 * 1024 * 1024  # 2 Mo en octets

                # Ouvrir l'image
                image = Image.open(photo_file)
                output = BytesIO()
                image = image.convert("RGB")  # Assure compatibilité

                # Redimensionner à une taille max de 2048x2048
                image.thumbnail((2048, 2048))

                # Sauvegarder avec une bonne qualité de départ
                quality = 95
                image.save(output, format="JPEG", quality=quality)

                # Réduire la qualité si le fichier est encore trop gros
                while output.tell() > max_size and quality > 30:
                    quality -= 5
                    output.seek(0)
                    output.truncate(0)
                    image.save(output, format="JPEG", quality=quality)

                output.seek(0)
                # Remplacer le fichier par l'image optimisée
                photo_field.file = output

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Anomalie liée à {self.controle} par {self.qualiticient} - {self.date_signalement} {self.status}"


class AnomalieResolu(models.Model):
    anomalie = models.ForeignKey(Anomalie, related_name='resolutions', on_delete=models.CASCADE)
    photo_anomalie_resolue1 = models.ImageField(upload_to='anomalies_resolues/', null=True, blank=True)  # Photo après résolution
    photo_anomalie_resolue2 = models.ImageField(upload_to='anomalies_resolues/', null=True, blank=True)
    date_resolution = models.DateTimeField(auto_now_add=True)  # Date de résolution

    def save(self, *args, **kwargs):
        for photo_field_name in ['photo_anomalie_resolue1', 'photo_anomalie_resolue2']:
            photo_field = getattr(self, photo_field_name)
            if photo_field:
                try:
                    photo_file = photo_field.file
                    max_size = 2 * 1024 * 1024  # 2 Mo

                    image = Image.open(photo_file)
                    output = BytesIO()
                    image = image.convert("RGB")

                    # Redimensionne l'image à une taille raisonnable
                    image.thumbnail((2048, 2048))

                    # Enregistre l'image avec une bonne qualité initiale
                    quality = 95
                    image.save(output, format='JPEG', quality=quality)

                    # Réduit la qualité si nécessaire pour être < 2Mo
                    while output.tell() > max_size and quality > 30:
                        quality -= 5
                        output.seek(0)
                        output.truncate(0)
                        image.save(output, format='JPEG', quality=quality)

                    output.seek(0)
                    file_content = ContentFile(output.read())

                    # Remplacer l'ancien fichier par le fichier optimisé
                    photo_field.save(photo_field.name, file_content, save=False)

                except Exception as e:
                    print(f"Erreur lors du redimensionnement de {photo_field_name}: {e}")

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Résolution de l'anomalie {self.anomalie.id} - {self.date_resolution}"

