import React from "react";

const HomePage = () => {
  return (
    <div className="relative h-screen w-screen">
      <video
        src="../src/assets/finance.mp4"
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
      ></video>
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-10">
        {/* Navbar */}
        <nav className="absolute top-4 left-32 right-32 bg-opacity-80 bg-black rounded-3xl flex justify-between items-center px-6 py-4 z-10">
          {/* Logo */}
          <div className="text-gray-300 text-xl font-serif">
            SPT.<span className="font-bold">Sujan</span>
          </div>

          {/* Links */}
          <ul className="flex space-x-6 text-gray-500 text-sm font-medium">
            <li>
              <a
                href="#investing"
                className="hover:text-green-900 transition duration-200"
              >
                Investing
              </a>
            </li>
            <li>
              <a
                href="#news"
                className="hover:text-green-900 transition duration-200"
              >
                News
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className="hover:text-green-900 transition duration-200"
              >
                Contact
              </a>
            </li>
          </ul>

          {/* Register Button */}
          <button
            onClick={() => (window.location.href = "/register")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-900 transition duration-200"
          >
            Register
          </button>
        </nav>
        {/* Content */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center px-8 py-6">
            <h1 className="text-9xl font-bold text-gray-300 mb-6">Grow Fast</h1>
            <p className="text-green-300 text-3xl mb-4">
              Redefine Stock Portfolio
            </p>
            <p className="text-gray-100 text-3xl mb-8">
              Build your own Stock Portfolio strong <br />
              with SPT.sujan
            </p>
            <button className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-900 transition duration-200" onClick={() => (window.location.href = "/login")}>
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
