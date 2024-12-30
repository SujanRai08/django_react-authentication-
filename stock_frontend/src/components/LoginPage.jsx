import React, { useState } from "react";
import axios from "axios";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login/", {
        email,
        password,
      });
      const { access, refresh } = response.data;
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
      alert("Login successfully!!");
      window.location.href = "/dashboard";
    } catch (err) {
      setError(
        err.response?.data?.detail || "Invalid credentials, try again..."
      );
    }
  };

  return (
    <div
      className="relative h-screen w-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('../src/assets/stock.jpg')" }}
    >
      <div className="bg-gray-800 bg-opacity-90 p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-serif text-white text-center mb-6">Login</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-serif text-gray-400">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@gmail.com"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-900 focus:outline-none"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-serif text-gray-400">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-900 focus:outline-none"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-900 transition duration-200"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-sm text-white text-center font-serif">
          Don't have an account?{" "}
          <a href="/register" className="text-red-500 hover:underline hover:text-green-700">
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
