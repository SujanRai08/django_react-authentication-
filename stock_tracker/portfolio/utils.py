import requests

ALPHA_VANTAGE_API_KEY = '0CK50VRAQV5LBIZK'
def fetch_stock_data(symbol):
    url = f"https://www.alphavantage.co/query"
    params = {
        "function": "TIME_SERIES_INTRADAY",
        "symbol": symbol,
        "interval": "5min",
        "apikey": ALPHA_VANTAGE_API_KEY,

    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        return response.json()
    return None