from django.urls import path
from users.views import UserCreateView, UserDetailView, RoleUserListView, UserListView, UserCreateByAdminView, ChangePasswordView, CustomTokenObtainPairView,AddPictureView, UserDetailRoleView
from core.views import ProjetCreateView, ProjectListView, ProjectDetailView, ProjectUpdateView, ProjectDeleteView, SousProjetCreateView, SousProjetListView, SousProjetDetailView, SousProjetUpdateView, SousProjetDeleteView, ActiviteGeneraleCreateView,ActiviteGeneraleListView, ActiviteGeneraleDetailView, ActiviteGeneraleUpdateView, ActiviteGeneraleDeleteView      
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    
    # User management URLs
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('users/create/', UserCreateView.as_view(), name='user-create'),
    path('users/create-by-admin/', UserCreateByAdminView.as_view(), name='user-create-by-admin'),
    path('users/change-password/', ChangePasswordView.as_view(), name="change-password"),
    path('users/list/', UserListView.as_view(), name='user-list'),
    path('users/detail/', UserDetailView.as_view(), name='user_detail'),
    path('users/detail/by-role/<str:role>/', UserDetailRoleView.as_view(), name='user_detail_role'),
    path('users/roles/', RoleUserListView.as_view(), name='role-user-list'),
    path('update-picture/', AddPictureView.as_view(), name='update-picture'),


    ### Core API URLs ###

    # Project URLs
    path('projects/create/', ProjetCreateView.as_view(), name='project-create'),
    path('projects/list/', ProjectListView.as_view(), name='project-list'),
    path('projects/detail/<int:pk>/', ProjectDetailView.as_view(), name='project-detail'),
    path('projects/update/<int:pk>/', ProjectUpdateView.as_view(), name='project-update'),
    path('projects/delete/<int:pk>/', ProjectDeleteView.as_view(), name='project-delete'),


    # Sous-Project URLs
    path('sous-projects/create/', SousProjetCreateView.as_view(), name='sous-project-create'),
    path('sous-projects/list/', SousProjetListView.as_view(), name='sous-project-list'),
    path('sous-projects/detail/<int:pk>/', SousProjetDetailView.as_view(), name='sous-project-detail'),
    path('sous-projects/update/<int:pk>/', SousProjetUpdateView.as_view(), name='sous-project-update'),
    path('sous-projects/delete/<int:pk>/', SousProjetDeleteView.as_view(), name='sous-project-delete'),

    
    # ActiviteGenerale URLs
    path('activite-generale/create/', ActiviteGeneraleCreateView.as_view(), name='activite-generale-create'),
    path('activite-generale/list/', ActiviteGeneraleListView.as_view(), name='activite-generale-list'),
    path('activite-generale/detail/<int:pk>/', ActiviteGeneraleDetailView.as_view(), name='activite-generale-detail'),
    path('activite-generale/update/<int:pk>/', ActiviteGeneraleUpdateView.as_view(), name='activite-generale-update'),
    path('activite-generale/delete/<int:pk>/', ActiviteGeneraleDeleteView.as_view(), name='activite-generale-delete'),
]