import NavBar from "./components/NavBar";
import Login from "./Login";
import { BrowserRouter, Route, Routes, useLocation, useNavigate, useParams } from "react-router-dom";
import Register from "./Register";
import { useEffect, useState } from "react";
import CreateBlog from "./CreateBlog";
import Home from "./Home";
import Dashboard from "./Dashboard";
import Profile from "./Profile";
import BlogReader from './BlogReader';
import Search from "./Search";
import EditBlog from "./EditBlog";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));


  useEffect(() => {
    //Check status of blog api request user is authorised or not
    const storedToken = localStorage.getItem("token");
    if (storedToken !== token) {
      setToken(storedToken);
    }

  }, [token]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/search" element={<> <NavBar /> <Search onLogin={() => setToken(localStorage.getItem("token"))}/></>} />
        <Route path="/blog/:id" element={<> <NavBar /> <BlogReader onLogin={() => setToken(localStorage.getItem("token"))}/> </>} />
        {token ? (
          <>
            <Route path="/*" element={<> <NavBar /> <Home onLogin={() => setToken(localStorage.getItem("token"))}/> </>} />
            <Route path="/home" element={<> <NavBar /> <Home onLogin={() => setToken(localStorage.getItem("token"))}/>  </>} />
            <Route path="/dashboard" element={<><NavBar /><Dashboard onLogin={() => setToken(localStorage.getItem("token"))}/></>} />
            <Route path="/profile" element={<><NavBar /><Profile onLogin={() => setToken(localStorage.getItem("token"))}/></>} />
            <Route path="/create-blog" element={<><NavBar /><CreateBlog onLogin={() => setToken(localStorage.getItem("token"))}/></>} />
            <Route path="/edit-blog/:id" element={<><NavBar /><EditBlog onLogin={() => setToken(localStorage.getItem("token"))}/></>} />
          </>
        ) : (
          <>
            <Route path="/register" element={<Register onLogin={() => setToken(localStorage.getItem("token"))} />} />
            <Route path="/*" element={<Login onLogin={() => setToken(localStorage.getItem("token"))} />} />
          </>
        )}
      </Routes>
    </BrowserRouter>
  );
}


export default App;
