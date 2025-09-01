import React, { useContext, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import LoadingIndicator from "./components/LoadingIndicator";
import UserDetails from "./UserDetails";
import { Toaster } from "react-hot-toast";
import apiErrorHandle from "./util/APIErrorHandle";

const LandingPage = React.lazy(() => import("./LandingPage"));
const Search = React.lazy(() => import("./Search"));
const BlogReader = React.lazy(() => import("./BlogReader"));
const Home = React.lazy(() => import("./Home"));
const Dashboard = React.lazy(() => import("./Dashboard"));
const Profile = React.lazy(() => import("./Profile"));
const CreateBlog = React.lazy(() => import("./CreateBlog"));
const EditBlog = React.lazy(() => import("./EditBlog"));
const Settings = React.lazy(() => import("./Settings"));
const About = React.lazy(() => import("./About"));

function App() {
  const { isAuthenticated,removeCreds, updateUserInfo } = useContext(AuthContext);

  useEffect(() => {
    try {
      const token = extractOAuth2TokenFromUrl();
      if (token) getUserInfo(token);
    } catch (error) {
      console.error("OAuth2 Error:", error);
    }
  }, []);

  // Function to extract OAuth2 temporary token from URL
  const extractOAuth2TokenFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const errorMsg = params.get("message");
    if (errorMsg) {
      alert(`OAuth2 Error: ${errorMsg}`);
      throw new Error(errorMsg);
    }
    return params.get("token");
  };

  const getUserInfo = async (token) => {
    try {
      const response = await fetch(
        `/api/public/oauth2-success/jwt-token?token=${token}`,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
          credentials: "include",
        }
      );
      if (response.ok) {
        const data = await response.json();
        updateUserInfo(data);
        window.location.href = "/home"; // Redirect to home after successful login
      }
    } catch (error) {
      apiErrorHandle(error,removeCreds)
    }
  };

  return (
    <div className="bg-blue-100 dark:bg-gray-900 dark:text-white">
      <Toaster position="top-right"/>
      <BrowserRouter>
        <Suspense fallback={<LoadingIndicator />}>
          <NavBar />
          <Routes>
            <Route path="/about" element={<About />} />
            {/* /* Protected Routes */}
            {isAuthenticated ? (
              <>
                <Route path="/*" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/create-blog" element={<CreateBlog />} />
                <Route path="/blog/:id" element={<BlogReader />} />
                <Route path="/edit-blog/:id" element={<EditBlog />} />
                <Route path="/user/:id" element={<UserDetails />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/search" element={<Search />} />
              </>
            ) : (
              <>
                {/* Public Routes */}
                <Route path="/*" element={<LandingPage />} />
                <Route path="/blog/:id" element={<BlogReader />} />
              </>
            )}
          </Routes>
          <Footer />
        </Suspense>
      </BrowserRouter>
    </div>
  );
}

export default App;
