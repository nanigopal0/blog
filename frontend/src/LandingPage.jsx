import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";
import Register from "./Register";
import axios from "axios";

const featureCards = [
  {
    title: "Create Blogs",
    description: "Write and share your thoughts with a global audience.",
  },
  {
    title: "Connect with Others",
    description: "Engage with like-minded individuals and grow your network.",
  },
  {
    title: "Easy to Use",
    description: "Enjoy a seamless and intuitive blogging experience.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { updateUserInfo, logout } = useContext(AuthContext);
  const [showRegister, setShowRegister] = useState(false);

  // useEffect(() => {
  //   const token = extractOAuth2TokenFromUrl();
  //   if (token) {
  //     getUserInfo(token);
  //   }
  // }, []);

  // Function to extract OAuth2 temporary token from URL
  const extractOAuth2TokenFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get("token");
  };

  const getUserInfo = async (token) => {
    try {
      const response = await axios.get(
        `/api//oauth2-success/jwt-token?token=${token}`,
        {
          withCredentials: true,
          headers: {
            "Content-type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        updateUserInfo(response.data);
        navigate("/home");
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("Unauthorized access - please log in.");
        logout();
      } else
        console.error(
          error.response?.data?.message ||
            error.message ||
            "Error fetching user data"
        );
    }
  };

  return (
    <div className="min-h-screen">
      {showRegister && <Register onClose={() => setShowRegister(false)} />}

      {/* Hero Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl leading-18 font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          Welcome to Blogify
        </h1>
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
          Share your thoughts, connect with others, and explore amazing blogs
          from around the world.
        </p>
        <button
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full text-lg transition-all hover:shadow-lg hover:shadow-blue-500/30 cursor-pointer"
          onClick={() => setShowRegister(true)}
        >
          Get Started Free
        </button>
      </div>

      {/* Features Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-16 bg-gradient-to-b from-blue-100 via-pink-100 to-blue-100 dark:bg-gradient-to-br dark:from-blue-950/30 dark:via-purple-950/30 dark:to-pink-950/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4 text-gray-900 dark:text-white">
            Why Choose Blogify?
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            Discover the features that make Blogify the best platform for
            bloggers.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featureCards.map((card, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-700"
              >
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/50 rounded-xl flex items-center justify-center mb-5">
                  <span className="text-2xl">
                    {index === 0 ? "✍️" : index === 1 ? "🤝" : "✨"}
                  </span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  {card.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-gray-900 dark:text-white">
            Ready to Start Your Blogging Journey?
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            Join Blogify today and share your voice with the world.
          </p>
          <button
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-full transition-all cursor-pointer"
            onClick={() => setShowRegister(true)}
          >
            Create Your Account
          </button>
        </div>
      </div>
    </div>
  );
}
