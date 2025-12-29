import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeContext } from "../contexts/ThemeContext";
import { Menu, X, Moon, Sun, SearchIcon, LogOut } from "lucide-react";
import Register from "../Register";

export default function NavBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { isAuthenticated,logout } = useContext(AuthContext);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isActive = (path) => location.pathname === path; // Check if the tab is active
  const [showRegister, setShowRegister] = useState(false);

  const aboutClick = () => {
    navigate("/about");
  };
  const dashboardClick = () => {
    navigate("/dashboard");
  };
  const profileClick = () => {
    navigate("/profile");
  };

  const postClick = () => {
    navigate("/create-blog");
  };

  const homepageClick = () => {
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen((open) => !open);
  };

  const searchClick = () => {
    navigate("/search");
  };

  const tabs = [
    { name: "Dashboard", path: "/dashboard", onClick: dashboardClick },
    { name: "Post", path: "/create-blog", onClick: postClick },
    { name: "Profile", path: "/profile", onClick: profileClick },
  ];

  const authenticatedNavBarTabs = (
    <>
      <button
        onClick={searchClick}
        className="hidden md:flex p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
      >
        <SearchIcon className="w-5 h-5" />
      </button>

      <button
        onClick={searchClick}
        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg md:hidden"
      >
        Search
      </button>

      {tabs.map((tab, index) => (
        <button
          key={index}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors
            ${isActive(tab.path)
              ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
              : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
            }
            md:inline-block w-full md:w-auto text-left md:text-center
          `}
          onClick={tab.onClick}
        >
          {tab.name}
        </button>
      ))}

      <button
        onClick={logout}
        className="hidden md:flex p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
      >
        <LogOut className="w-5 h-5" />
      </button>
      <button
        onClick={logout}
        className="md:hidden w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
      >
        Logout
      </button>
    </>
  );

  const unauthenticatedNavBarTabs = (
    <button
      onClick={aboutClick}
      className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors
        ${isActive("/about")
          ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
          : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
        }
      `}
    >
      About
    </button>
  );

  return (
    <nav className="w-full px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center  dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 sticky top-0 z-40">
      <p className="text-2xl font-bold cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent" onClick={homepageClick}>
        Blogify
      </p>

      {showRegister && <Register onClose={() => setShowRegister(false)} />}

      {/* Small screen < 768px */}
      <div className="flex md:hidden">
        <div className="gap-4 flex items-center">
          <ToggleThemeIcon darkMode={darkMode} toggleTheme={toggleTheme} />
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div
            className="absolute top-16 right-4 w-56 py-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700
              rounded-xl shadow-xl flex flex-col"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="flex flex-col px-2">
              {isAuthenticated ? (
                authenticatedNavBarTabs
              ) : (
                <>
                  {unauthenticatedNavBarTabs}
                  <LoginBtn openLoginDialog={() => setShowRegister(true)} />
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Large screen >= 768px */}
      <div className="hidden gap-2 lg:gap-4 items-center md:flex">
        {isAuthenticated ? (
          authenticatedNavBarTabs
        ) : (
          <>
            {unauthenticatedNavBarTabs}
            <LoginBtn openLoginDialog={() => setShowRegister(true)} />
          </>
        )}
        <ToggleThemeIcon darkMode={darkMode} toggleTheme={toggleTheme} />
      </div>
    </nav>
  );
}

export function ToggleThemeIcon({ darkMode, toggleTheme }) {
  return (
    <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" onClick={toggleTheme}>
      {darkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}

export function LoginBtn({ openLoginDialog }) {
  return (
    <button
      onClick={openLoginDialog}
      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
    >
      Login
    </button>
  );
}
