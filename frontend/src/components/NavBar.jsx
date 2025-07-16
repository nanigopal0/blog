import { useContext, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { ThemeContext } from "../contexts/ThemeContext";
import { Close, DarkMode, DensityMedium, LightMode } from "@mui/icons-material";
import { Divider } from "@mui/material";
import ColorPalette from "../util/ColorPalette";

export default function NavBar({ openLoginDialog }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { isAuthenticated } = useContext(AuthContext);
  const palette = darkMode ? ColorPalette.darkMode : ColorPalette.lightMode;
  const [searchKeyword, setSearchKeyword] = useState("");
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isActive = (path) => location.pathname === path; // Check if the tab is active

  const handleSearchSubmit = (keyword) => {
    setSearchKeyword(keyword); // Update the search keyword state
    navigate(`/search?query=${keyword}`); // Navigate to the search page with the keyword
  };

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

  const authenticatedNavBarTabs = (
    <>
      <input
        type="text"
        className="border-2 rounded-md p-2 border-gray-500 "
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSearchSubmit(e.target.value); // Submit the search keyword on Enter key
        }}
        style={{
          color: "text.primary",
          "--placeholder-color": palette.text.primary,
        }}
        placeholder="Search..."
      />
      <div
        className="flex-col flex cursor-pointer rounded-md hover:bg-green-700 hover:text-white"
        onClick={dashboardClick}
      >
        <button className="text-xl cursor-pointer lg:mx-4 md:mx-3 my-2 ">Dashboard</button>
        {isActive("/dashboard") && (
          <Divider color="background.paper" sx={{ borderWidth: 3 }} />
        )}
      </div>
      <div
        className="flex flex-col cursor-pointer rounded-md hover:bg-green-700 hover:text-white"
        onClick={postClick}
      >
        <button className="text-xl cursor-pointer lg:mx-4 md:mx-3 my-2">Post</button>
        {isActive("/post") && (
          <Divider color="background.paper" sx={{ borderWidth: 3 }} />
        )}
      </div>
      <div
        className="flex flex-col cursor-pointer rounded-md hover:bg-green-700 hover:text-white"
        onClick={profileClick}
      >
        <button className="text-xl cursor-pointer lg:mx-4 md:mx-3 my-2">Profile</button>
        {isActive("/profile") && (
          <Divider color="background.paper" sx={{ borderWidth: 3 }} />
        )}
      </div>
    </>
  );

  const unauthenticatedNavBarTabs = (
    <div
      className="flex flex-col cursor-pointer rounded-md hover:bg-green-700 hover:text-white"
      onClick={aboutClick}
    >
      <button className="text-xl cursor-pointer lg:mx-4 md:mx-3 my-2">About</button>
      {isActive("/about") && (
        <Divider color="background.paper" sx={{ borderWidth: 3 }} />
      )}
    </div>
  );

  return (
    <nav
      className="w-full p-4 flex justify-between items-center"
      style={{
        background: `linear-gradient(181deg,${palette.background.default},${palette.background.body})`,
      }}
    >
      <p
        className="text-2xl ml-2 font-bold cursor-pointer"
        onClick={homepageClick}
      >
        Blogify
      </p>

      {/* Small screen < 768px */}
      <div className="flex md:hidden">
        <div className="gap-4 flex items-center">
          <ToggleThemeIcon darkMode={darkMode} toggleTheme={toggleTheme} />
          <i className="cursor-pointer" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? (
              <Close fontSize="medium" />
            ) : (
              <DensityMedium fontSize="medium" />
            )}
          </i>
        </div>

        {isMobileMenuOpen && (
          <div
            className="absolute top-14 z-50 right-4 w-2/4 px-4 py-8 bg-gray-200 rounded-md items-center justify-center flex"
            style={{ backgroundColor: darkMode ? "#364153 " : "#bfc2c7 " }}
          >
            <div className="w-2/3 gap-y-5 flex flex-col">
              {isAuthenticated ? (
                authenticatedNavBarTabs
              ) : (
                <>
                  {unauthenticatedNavBarTabs}
                  <LoginBtn openLoginDialog={openLoginDialog} />
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
            <LoginBtn openLoginDialog={openLoginDialog} />
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
      {darkMode ? <LightMode /> : <DarkMode />}
    </i>
  );
}

export function LoginBtn({ openLoginDialog }) {
  return (
    <div
      className="bg-blue-600 cursor-pointer text-center rounded-md hover:bg-green-700"
      onClick={openLoginDialog}
    >
      <button className="text-xl cursor-pointer text-white my-2 md:mx-3 lg:mx-4">Login</button>
    </div>
  );
}
