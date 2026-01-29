import React, { Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import NavBar from "./components/NavBar";
import LoadingIndicator from "./components/LoadingIndicator";
import UserDetails from "./UserDetails";

const LandingPage = React.lazy(() => import("./LandingPage"));
const Search = React.lazy(() => import("./Search"));
const BlogReader = React.lazy(() => import("./BlogReader"));
const Home = React.lazy(() => import("./Home"));
const Dashboard = React.lazy(() => import("./Dashboard"));
const Profile = React.lazy(() => import("./Profile"));
const CreateBlog = React.lazy(() => import("./CreateBlog"));
const EditBlog = React.lazy(() => import("./EditBlog"));
const About = React.lazy(() => import("./About"));

function ErrorHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const error = searchParams.get('error');

    if (error) {
      toast.error(decodeURIComponent(error));
      // Remove error param from URL
      searchParams.delete('error');
      const newSearch = searchParams.toString();
      navigate(
        {
          pathname: location.pathname,
          search: newSearch ? `?${newSearch}` : '',
        },
        { replace: true }
      );
    }
  }, [location, navigate]);

  return null;
}

function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-blue-100 dark:bg-gray-900 dark:text-white">
      <Toaster position="top-right" containerStyle={{ zIndex: 100000 }} />
      <BrowserRouter>
        <ErrorHandler />
        <NavBar />
        <Suspense fallback={<LoadingIndicator />}>
          <Routes>
            <Route path="/about" element={<About />} />
            {/* /* Protected Routes */}
            {isAuthenticated ? (
              <>
                <Route path="/*" element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
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
              </>
            )}
          </Routes>
        </Suspense>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
