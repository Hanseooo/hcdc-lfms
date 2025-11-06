from django.urls import path, include

urlpatterns = [
    # Authentication (dj-rest-auth + registration)
    path('auth/', include('dj_rest_auth.urls')),
    path('auth/registration/', include('dj_rest_auth.registration.urls')),

    # App routes
    path('accounts/', include('accounts.urls')),
    path('reports/', include('reports.urls')),
]


# from django.urls import path, include
# from dj_rest_auth.views import LoginView, LogoutView
# from dj_rest_auth.jwt_auth import get_refresh_view


# urlspatterns =[
#     path('auth/', include('dj_rest_auth.urls')),
#     path('auth/registration/', include('dj_rest_auth.registration.urls')),
#     path('auth/login/', LoginView.as_view(), name='rest_login'),
#     path('auth/logout/', LogoutView.as_view(), name='rest_logout'),
#     path('auth/token/refresh/', get_refresh_view().as_view(), name='token_refresh'),

#     path('accounts/', include('accounts.urls')),
#     path('reports/', include('reports.urls')),
# ]