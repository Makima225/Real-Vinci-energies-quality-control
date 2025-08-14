from django.urls import path
from users.views import UserCreateView, UserDetailView, RoleUserListView, UserListView, UserCreateByAdminView, ChangePasswordView, CustomTokenObtainPairView,AddPictureView, UserDetailRoleView
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
    
]