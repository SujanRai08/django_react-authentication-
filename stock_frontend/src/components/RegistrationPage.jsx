import React, { useState } from "react";
import axios from "axios";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/register/",
        formData
      );
      setSuccess("Registration successful! You can now log in.");
      setFormData({ email: "", password: "", first_name: "", last_name: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Try again.");
    }
  };

  return (
    <div
      className="relative h-screen w-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: "url('../src/assets/stock.jpg')" }}
    >
      <div className="bg-gray-800 bg-opacity-90 p-8 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-serif text-white text-center mb-6">Register</h1>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="first_name" className="block text-sm font-serif text-gray-400">
              First Name
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              placeholder="Enter your first name"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-900 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="last_name" className="block text-sm font-serif text-gray-400">
              Last Name
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              placeholder="Enter your last name"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-900 focus:outline-none"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-serif text-gray-400">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
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
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-900 focus:outline-none"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-900 transition duration-200"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-sm text-white text-center font-serif">
          Already have an account?{" "}
          <a href="/login" className="text-green-500 hover:underline hover:text-green-700">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
