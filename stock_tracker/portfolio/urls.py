from django.urls import path
from .views import RegisterView, LoginView, PortfolioView ,StockDataView, stock_list, UserView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)


urlpatterns = [
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('portfolio/', PortfolioView.as_view(), name='portfolio'),
    path("stock/<str:symbol>/", StockDataView.as_view(), name="stock-data"),
    path("stocks/", stock_list, name="stock-list"),
    path('user/', UserView.as_view(), name='user-api'),
]
