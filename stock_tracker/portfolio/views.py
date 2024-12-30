from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .models import Portfolio, Stock
from .serializers import UserSerializer, PortfolioSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from . import RegisterSerializer
from django.contrib.auth import authenticate
from .utils import fetch_stock_data
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import Stock
from .serializers import StockSerializer


# User Registration View (Unauthenticated)
class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        # Normalize email
        email = data['email'].strip().lower()
        
        # Check for duplicate email
        if get_user_model().objects.filter(email=email).exists():
            return Response(
                {"error": "A user with this email already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            # Create user
            user = get_user_model().objects.create_user(
                email=email,
                password=data['password'],
                first_name=data.get('first_name', ''),
                last_name=data.get('last_name', ''),
            )
            from .serializers import UserSerializer  # Import here to avoid circular imports
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
# User Login View (JWT Token Authentication)
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]  # Allows any user (including unauthenticated) to access this view

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"detail": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Authenticate using request parameter
        user = authenticate(request=request, email=email, password=password)

        if user:
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            })
        return Response({"detail": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

# Portfolio View (Add/View Portfolio)
class PortfolioView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Retrieve all portfolios for the authenticated user
        portfolios = Portfolio.objects.filter(user=request.user)
        serializer = PortfolioSerializer(portfolios, many=True)
        return Response(serializer.data)

    def post(self, request):
        stock_symbol = request.data.get('stock')
        quantity = request.data.get('quantity')

        # Validate input data
        if not stock_symbol or not quantity:
            return Response({"error": "Stock symbol and quantity are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            quantity = int(quantity)
        except ValueError:
            return Response({"error": "Quantity must be a valid number."}, status=status.HTTP_400_BAD_REQUEST)

        if quantity <= 0:
            return Response({"error": "Quantity must be greater than zero."}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch the stock by its symbol
        try:
            stock = Stock.objects.get(symbol=stock_symbol)  # Use symbol to fetch the stock
        except Stock.DoesNotExist:
            return Response({"error": "Invalid stock symbol."}, status=status.HTTP_404_NOT_FOUND)

        # Create or update the portfolio
        portfolio, created = Portfolio.objects.get_or_create(
            user=request.user,
            stock=stock,
            defaults={'quantity': quantity}
        )

        if not created:
            portfolio.quantity += quantity
            portfolio.save()

        # Return the updated portfolio data
        serializer = PortfolioSerializer(portfolio)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Retrieve all portfolios for the authenticated user
        portfolios = Portfolio.objects.filter(user=request.user)
        serializer = PortfolioSerializer(portfolios, many=True)
        return Response(serializer.data)

    def post(self, request):
        stock_symbol = request.data.get('stock')
        quantity = request.data.get('quantity')

        # Validate input data
        if not stock_symbol or not quantity:
            return Response({"error": "Stock symbol and quantity are required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            quantity = int(quantity)
        except ValueError:
            return Response({"error": "Quantity must be a valid number."}, status=status.HTTP_400_BAD_REQUEST)

        if quantity <= 0:
            return Response({"error": "Quantity must be greater than zero."}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch the stock by its symbol
        try:
            stock = Stock.objects.get(symbol=stock_symbol)  # Use symbol to fetch the stock
        except Stock.DoesNotExist:
            return Response({"error": "Invalid stock symbol."}, status=status.HTTP_404_NOT_FOUND)

        # Create or update the portfolio
        portfolio, created = Portfolio.objects.get_or_create(
            user=request.user,
            stock=stock,
            defaults={'quantity': quantity}
        )

        if not created:
            portfolio.quantity += quantity
            portfolio.save()

        # Return the updated portfolio data
        serializer = PortfolioSerializer(portfolio)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class StockDataView(APIView):
    def get(self, request, symbol):
        data = fetch_stock_data(symbol)
        if data:
            return Response(data, status=status.HTTP_200_OK)
        return Response({"error": "Could not fetch stock data"}, status=status.HTTP_400_BAD_REQUEST)
    

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def stock_list(request):
    stocks = Stock.objects.all()
    serializer = StockSerializer(stocks, many=True)
    return Response(serializer.data)

class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
