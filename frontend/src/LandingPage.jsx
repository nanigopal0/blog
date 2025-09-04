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
    <div className="my-8 p-4">
      {showRegister && <Register onClose={() => setShowRegister(false)} />}
      <div className="sm:max-w-md lg:max-w-4xl text-center mx-auto p-4">
        <p className="font-bold text-4xl mb-2">Welcome to Blogify</p>
        <p className="mb-8 text-lg text-gray-600 dark:text-gray-400">
          Share your thoughts, connect with others, and explore amazing blogs
          from around the world.
        </p>
      </div>

      <div className="my-8">
        <p className="text-2xl mb-2 font-bold text-center text-teal-700 dark:text-teal-500">
          Why Choose Blogify?
        </p>
        <p className="text-center text-lg mb-8">
          Discover the features that make Blogify the best platform for
          bloggers.
        </p>

        <div className="justify-center sm:grid-cols-1 md:grid-cols-2 mx-auto lg:grid-cols-3 grid gap-8">
          {featureCards.map((card, index) => (
            <div
              key={index}
              className="text-center border border-black/20 bg-black/20 dark:border-white/10 dark:bg-white/20 rounded-2xl md:mx-auto p-6 hover:scale-105 "
            >
              <div>
                <p className="text-lg font-medium mb-2">{card.title}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex my-8 flex-col items-center">
        <p className="text-xl mb-2 font-medium">
          Ready to Start Your Blogging Journey?
        </p>
        <p className="text-sm mb-8">
          Join Blogify today and share your voice with the world.
        </p>
        <button
          className="cursor-pointer hover:bg-violet-500 backdrop-blur-2xl rounded-lg font-medium bg-violet-600 p-3 text-white"
          onClick={() => setShowRegister(true)}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
