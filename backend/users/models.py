from django.db import models

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin

class UserManager(BaseUserManager):
    def create_user(self, email, name, surname, role, password, **extra_fields):
        if not email:
            raise ValueError("L'utilisateur doit avoir une adresse email")
        if not password:
            raise ValueError("Le mot de passe est obligatoire")
        email = self.normalize_email(email)
        user = self.model(email=email, name=name, surname=surname, role=role, **extra_fields)
        user.set_password(password)  # Utilise le mot de passe fourni
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email, name, surname, password=None, **extra_fields):
        extra_fields.setdefault('role', 'admin')  # Ajoutez ceci pour définir le rôle du superutilisateur
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, name, surname, password=password, **extra_fields)
    
class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = [
        ('qualiticient', 'Qualiticient'),
        ('ingenieur travaux', 'Ingénieur travaux'),
        ('chef de projet', 'Chef de projet'),
        ('coordonnateur', 'Coordonnateur'),
        ('directeur', 'Directeur'),
        ('admin', 'Admin'),  # Vous pouvez ajouter un rôle 'admin' si nécessaire
        
    ]
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)
    picture = models.ImageField(upload_to='users/', null=True, blank=True)
    role = models.CharField(max_length=100, choices=ROLE_CHOICES)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_password_changed = models.BooleanField(default=False)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name', 'surname']

    def __str__(self):
        return self.name + ' ' + self.surname + ' - ' + self.role

    def get_short_name(self):
        return self.name or self.email