import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { handleResponseFromFetchBlog } from "./util/HandleResponse";
import LoadingIndicator from "./util/LoadingIndicator";
import { API_BASE_URL } from "./util/BaseUrl";

function BlogReader({onLogin}) {
  const param = useParams();
  const [blog, setBlog] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state;
  const [token,setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const paramId = param.id;
        const result = await fetch(
          `${API_BASE_URL}/blog/get/${paramId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );
        const resultData = await handleResponseFromFetchBlog(result,onLogin);
        setLoading(false)
        setBlog(resultData);

      } catch (error) {
    
        console.error("There has been a problem with fetch operation:", error);
      }
    };

    fetchBlog();
  }, []);

  const deleteBlog = async () => {
    const response = await fetch(`${API_BASE_URL}/blog/delete/${param.id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("token"),
        },
      });

    console.log(response.status);
    if (response.status == 401) {
      //Unauthorised as token invalid go the login page
      localStorage.removeItem("token");
      navigate("/login")
      onLogin();
      throw new Error("Unauthorised user as token invalid");
    }
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    navigate("/home")

  };

  const formatDate=(dateString)=>{
    const date = new Date(dateString);
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('en-us',options);
  };

  return (
    <div className="mx-5 my-8 flex justify-center">
      {blog && (
        <div className="w-3/4 flex flex-col">
          {loading ? <LoadingIndicator/> : <></>}
          <div className="h-1/3 w-full mb-8 flex justify-center overflow-hidden">
            <img
              src={blog.blog.coverImage}
              className="h-auto w-full lg:w-3/4 border border-gray-400 rounded-lg text-center"
              alt="cover image"
            />
          </div>

          <div className={`${blog.userName ? "flex items-center" : "hidden"} `}>
            <img
              className="mr-4 w-12 h-12 border border-gray-600 rounded-full"
              src={blog.userPhoto}
              alt=""
            />
            <div className="my-2 ">
              <p className="text-lg text-left font-semibold">{blog.userName}</p>
              <p className="text-gray-600 text-sm">{formatDate(blog.blog.time)}</p>
            </div>
          </div>

          <p className="text-4xl font-bold text-left my-8">{blog.blog.title}</p>

          <div
            className="my-4 text-left text-lg"
            dangerouslySetInnerHTML={{ __html: blog.blog.content }}
          ></div>

          <div className={`${data.isBlogOfCurrentUser ? "block" : "hidden"} flex justify-center `}>
            <button
              disabled={!blog}
              className="p-3 m-4 bg-green-500 rounded-lg"
              onClick={() => {
                if (blog) navigate(`/edit-blog/${blog.blog.id}`);
              }}
            >
              Edit
            </button>
            <button className="p-3 m-4 bg-red-300 rounded-lg"
              onClick={() => deleteBlog()}>Delete</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlogReader;
