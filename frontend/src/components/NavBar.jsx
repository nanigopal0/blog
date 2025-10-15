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
      <i
        onClick={searchClick}
        className="hidden md:block p-2 hover:border rounded-full border-black/20 dark:border-white/20 hover:bg-black/20 hover:dark:bg-white/20 cursor-pointer"
      >
        <SearchIcon className="text-center" />
      </i>

      <div
        onClick={searchClick}
        className={`${
          darkMode ? "hover:bg-white/20" : "hover:bg-black/20"
        } rounded-lg p-2 text-lg cursor-pointer my-2 md:hidden
        `}
      >
        Search
      </div>

      {tabs.map((tab, index) => (
        <button
          key={index}
          className={`${
            darkMode ? "hover:bg-white/20" : "hover:bg-black/20"
          } rounded-lg p-2 text-lg cursor-pointer my-2
        ${
          isActive(tab.path) &&
          `${darkMode ? "bg-white/20" : "bg-black/20"} border border-black/20 `
        }`}
          onClick={tab.onClick}
        >
          {tab.name}
        </button>
      ))}

      <i
        onClick={logout}
        className="hidden md:block rounded-full text-orange-500 dark:text-orange-400 hover:text-orange-700 cursor-pointer"
      >
        <LogOut />
      </i>
      <div
        onClick={logout}
        className="md:hidden text-lg cursor-pointer hover:text-white hover:bg-orange-400 p-2 rounded-lg"
      >
        Logout
      </div>
    </>
  );

  const unauthenticatedNavBarTabs = (
    <button
      onClick={aboutClick}
      className={`${
        darkMode ? "hover:bg-white/20" : "hover:bg-black/20"
      }  text-xl cursor-pointer rounded-lg p-2 lg:mx-4 md:mx-3 ${
        isActive("/about") &&
        `${darkMode ? "bg-white/20" : "bg-black/20"} border border-black/20 `
      }`}
    >
      About
    </button>
  );

  return (
    <nav className="w-full p-4 flex justify-between items-center ">
      <p className="text-2xl font-bold cursor-pointer" onClick={homepageClick}>
        Blogify
      </p>

      {showRegister && <Register onClose={() => setShowRegister(false)} />}

      {/* Small screen < 768px */}
      <div className="flex md:hidden">
        <div className="gap-4 flex items-center">
          <ToggleThemeIcon darkMode={darkMode} toggleTheme={toggleTheme} />
          <i className="cursor-pointer" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </i>
        </div>

        {isMobileMenuOpen && (
          <div
            className="absolute top-14 z-50 right-4 w-2/5 py-8 bg-gray-300/60 backdrop-blur-xs border border-black/30 dark:border-white/30
           dark:bg-gray-700/80 rounded-md items-center justify-center flex shadow-2xl shadow-gray-700/30 dark:shadow-gray-400/30"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-2/3 gap-y-5 flex flex-col items-center">
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
      <div className="hidden gap-3 lg:gap-6 items-center md:flex">
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
    <i className="cursor-pointer" onClick={toggleTheme}>
      {darkMode ? <Sun size={24} /> : <Moon size={24} />}
    </i>
  );
}

export function LoginBtn({ openLoginDialog }) {
  return (
    <div onClick={openLoginDialog}>
      <button
        className="text-xl cursor-pointer font-medium hover:underline
        text-blue-700 dark:text-blue-500 my-2 md:mx-3 lg:mx-4"
      >
        Login
      </button>
    </div>
  );
}
