from rest_framework import serializers
from .models import CustomUser, Stock, Portfolio

class StockSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stock
        fields = ['id', 'symbol', 'company_name', 'price']

class PortfolioSerializer(serializers.ModelSerializer):
    stock = StockSerializer()  # Nested stock data
    total_value = serializers.ReadOnlyField()

    class Meta:
        model = Portfolio
        fields = ['id', 'stock', 'quantity', 'total_value']

class UserSerializer(serializers.ModelSerializer):
    portfolios = PortfolioSerializer(many=True, read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'first_name', 'last_name', 'portfolios']
