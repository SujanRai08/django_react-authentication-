import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js";
import {
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [newStock, setNewStock] = useState({ symbol: "", quantity: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.get("http://127.0.0.1:8000/api/user/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(response.data);
    } catch (err) {
      setError("Failed to fetch user data. Please log in again.");
    }
  };

  // Fetch stocks data
  const fetchStocks = async () => {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.get("http://127.0.0.1:8000/api/stocks/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Stocks response:", response.data); // Log to check if quantity exists
      setStocks(response.data);
    } catch (err) {
      setError("Failed to fetch stocks. Please try again later.");
    }
  };

  // Fetch portfolio data
  const fetchPortfolio = async () => {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.get("http://127.0.0.1:8000/api/portfolio/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPortfolio(response.data);
    } catch (err) {
      setError("Failed to fetch portfolio data.");
    }
  };

  // Add new stock to portfolio
  const addStock = async () => {
    try {
      const token = localStorage.getItem("access");
      const response = await axios.post(
        "http://127.0.0.1:8000/api/portfolio/",
        { stock: newStock.symbol, quantity: newStock.quantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setPortfolio((prev) => [...prev, response.data]);
      setNewStock({ symbol: "", quantity: "" });
    } catch (err) {
      setError("Failed to add stock. Please try again.");
    }
  };
  const getStockQuantity = (symbol) => {
    // Ensure you are accessing the correct field in your portfolio
    const stockInPortfolio = portfolio.find((item) => item.stock.symbol === symbol); // Assuming `item.stock.symbol` in portfolio
    return stockInPortfolio ? stockInPortfolio.quantity : "N/A"; // Adjust field names if needed
  };
  
  // Logout
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = "/login";
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchUserData();
    fetchStocks();
    fetchPortfolio();
    setLoading(false);
  }, []);
  
  useEffect(() => {
    console.log('Portfolio Data:', portfolio);  // Log the portfolio data to inspect the structure
  }, [portfolio]);
  

  // Prepare chart data for stock prices
  const chartData = {
    labels: ["January", "February", "March", "April", "May", "June"], // Example labels
    datasets: [
      {
        label: "Stock Price",
        data: [10, 20, 30, 40, 50, 60], // Example price data
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        tension: 0.1,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col items-center">
      <header className="bg-neutral-900 w-full p-4 shadow-md flex justify-between items-center">
        <h1 className="text-gray-300 text-5xl  font-serif">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-green-900 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
        >
          Logout
        </button>
      </header>

      <div className="container mx-auto mt-3 p-8 bg-white
       shadow-lg rounded-lg ">
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* User Info */}
        {userData ? (
          <div className="mb-6">
            <h2 className="text-xl font-serif text-gray-700">
              Welcome, {userData.first_name} {userData.last_name}!
            </h2>
            <p className="text-sm text-gray-500">Email: {userData.email}</p>
          </div>
        ) : (
          <p className="text-gray-700">Loading user data...</p>
        )}

        {/* Stock Price Chart */}
        <div className="mb-4">
          <h3 className="text-lg font-serif text-gray-700 mb-4">
            Stock Price Trend
          </h3>
          <Line data={chartData} />
        </div>
        {/* Stock List */}
        {stocks.map((stock, index) => {
          const quantity = getStockQuantity(stock.symbol);
          return (
            <div
              key={index}
              className="p-4 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300 transition duration-200"
            >
              <h4 className="text-md font-semibold text-gray-800">
                {stock.company_name} ({stock.symbol})
              </h4>
              <p className="text-sm text-gray-600">
                Price:{" "}
                {stock.price && !isNaN(Number(stock.price))
                  ? Number(stock.price).toFixed(2)
                  : "N/A"}
              </p>
              <p className="text-sm text-gray-600">
                Quantity: {quantity !== "N/A" ? quantity : "N/A"}
              </p>
            </div>
          );
        })}

        {/* Add Stock Form */}
        <div className="mt-6">
          <h3 className="text-lg font-serif text-gray-700 mb-4">Add Stock</h3>
          <input
            type="text"
            placeholder="Symbol"
            value={newStock.symbol}
            onChange={(e) =>
              setNewStock({ ...newStock, symbol: e.target.value })
            }
            className="border p-2 rounded-lg mr-2"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={newStock.quantity}
            onChange={(e) =>
              setNewStock({ ...newStock, quantity: e.target.value })
            }
            className="border p-2 rounded-lg mr-2"
          />
          <button
            onClick={addStock}
            className="bg-green-900 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-200"
          >
            Add Stock
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
