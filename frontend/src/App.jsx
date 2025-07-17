import React, { useContext, Suspense, useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import RegisterDialog from "./components/RegisterDialog";
import LoginDialog from "./components/LoginDialog";
import LoadingIndicator from "./util/LoadingIndicator";

// Lazy load components
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
  const { isAuthenticated, updateUserInfo } = useContext(AuthContext);
  const [loginOpen, setLoginOpen] = useState(false);
  const [registerOpen, setRegisterOpen] = useState(false);
 

  useEffect(() => {
    const token = extractOAuth2TokenFromUrl();
    console.log("enter")
    if (token) {
      getUserInfo(token);
    }
  }, []);

  // Function to extract OAuth2 temporary token from URL
  const extractOAuth2TokenFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
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
      console.error("Error fetching user info:", error);
    }
  };

  const handleChangeFromRegisterToLogin = () => {
    setRegisterOpen(false);
    setLoginOpen(true);
  };

  const handleChangeFromLoginToRegister = () => {
    setRegisterOpen(true);
    setLoginOpen(false);
  };

  const handleRegisterClickOpen = () => setRegisterOpen(true);

  const handleLoginClickOpen = () => setLoginOpen(true);

  const handleRegisterClose = () => setRegisterOpen(false);

  const handleLoginClose = () => setLoginOpen(false);

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingIndicator />}>
        <NavBar openLoginDialog={handleLoginClickOpen} />
        <Routes>
          <Route path="/about" element={<About />} />
          {/* /* Protected Routes */}
          {isAuthenticated ? (
            <>
              <Route path="/*" element={<Home />} />
              <Route path="/home" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/create-blog" element={<CreateBlog />} />
              <Route path="/search" element={<Search />} />
              <Route path="/blog/:id" element={<BlogReader />} />
              <Route path="/edit-blog/:id" element={<EditBlog />} />
            </>
          ) : (
            <>
              {/* Public Routes */}
              <Route
                path="/*"
                element={
                  <LandingPage openRegisterDialog={handleRegisterClickOpen} />
                }
              />
              <Route path="/search" element={<Search />} />
              <Route path="/blog/:id" element={<BlogReader />} />
            </>
          )}
        </Routes>
        <Footer />
        <LoginDialog
          open={loginOpen}
          onClose={handleLoginClose}
          onChangeRegister={handleChangeFromLoginToRegister}
        />
        <RegisterDialog
          open={registerOpen}
          onClose={handleRegisterClose}
          onChangeLogin={handleChangeFromRegisterToLogin}
        />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
