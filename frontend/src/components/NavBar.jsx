import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function NavBar() {
  const [isMenuOpen, setMenu] = useState(false);
  const navigate = useNavigate();
  const [searchKey, setSearchKey] = useState("");

  const toggleMenu = () => {
    setMenu(!isMenuOpen);
  };

  

  const token = localStorage.getItem("token");

  return (
    <>
      <nav className="bg-orange-400 p-4 ">
        <div className="flex container justify-between mx-auto items-center">
          <div className=" text-white text-lg font-bold hover:text-cyan-700">
            <Link
              className="mx-4 text-stone-50 text-xl font-medium hover:underline hover:text-emerald-700"
              to={"/"}
            >
              Blogs
            </Link>
          </div>
          <ul className="hidden md:flex">
            <Link
              className="mx-4 text-stone-50 text-xl font-medium hover:underline hover:text-emerald-700"
              to={"/home"}
            >
              Home
            </Link>
            <Link
              className="mx-4 text-stone-50 text-xl font-medium hover:underline hover:text-emerald-700"
              to={"/search"}
            >
              Search
            </Link>
            {token ? (
              <>
                <Link
                  className="mx-4 text-stone-50 text-xl font-medium hover:underline hover:text-emerald-700"
                  to={"/dashboard"}
                >
                  Dashboard
                </Link>
                <Link
                  className="mx-4 text-stone-50 text-xl font-medium hover:underline hover:text-emerald-700"
                  to={"/profile"}
                >
                  Profile
                </Link>
              </>
            ) : (
              <></>
            )}
          </ul>

          <i className="md:hidden cursor-pointer" onClick={toggleMenu}>
            &#9776;
          </i>
        </div>
      </nav>

      <div
        className={`md:hidden ${isMenuOpen ? "block" : "hidden"
          }  flex flex-col h-screen justify-start bg-orange-100 pe-10 items-end `}
      >

        <Link
          className="py-5 text-xl font-medium hover:underline hover:text-blue-600"
          to={"/home"}
        >
          Home
        </Link>

        <Link className="py-5 text-xl font-medium hover:underline hover:text-blue-600"
          to={"/search"}>Search</Link>
        {token ? (
          <>
            <Link
              className="py-5 text-xl font-medium hover:underline hover:text-blue-600"
              to={"/dashboard"}
            >
              Dashboard
            </Link>
            <Link
              className="py-5 text-xl font-medium hover:underline hover:text-blue-600"
              to={"/profile"}
            >
              Profile
            </Link>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}

export default NavBar;
