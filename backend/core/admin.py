from django.contrib import admin

from .models import Projet, SousProjet, ActiviteGenerale, ActiviteSpecifique, Entete, EnteteValue, CorpsEtat, FicheControle, Anomalie,TypeChamp,ChampControle, Controle, PlanReference, FicheRempli, AnomalieResolu

admin.site.register(Projet)
admin.site.register(SousProjet)
admin.site.register(ActiviteGenerale)
admin.site.register(ActiviteSpecifique)
admin.site.register(Entete)
admin.site.register(EnteteValue)
admin.site.register(CorpsEtat)
admin.site.register(FicheControle)
admin.site.register(Anomalie)
admin.site.register(Controle)
admin.site.register(PlanReference)
admin.site.register(FicheRempli)
admin.site.register(AnomalieResolu)
admin.site.register(TypeChamp)
admin.site.register(ChampControle)