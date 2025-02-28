import { useNavigate } from "react-router-dom";
import HomeBlogCard from "./components/HomeBlogCard";
import { useEffect, useState } from "react";
import { extractParagraphs } from "./util/ExtractParagraphs";
import { handleResponseFromFetchBlog } from "./util/HandleResponse";
import LoadingIndicator from "./util/LoadingIndicator";
import { API_BASE_URL } from "./util/BaseUrl";

function Dashboard({ onLogin }) {
  const [myBlogs, setMyBlogs] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function fetchData() {
      try {
        const result = await fetch(
          `${API_BASE_URL}/blog/get-all-of-user`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("token"),
            },
          }
        );

        const resultData = await handleResponseFromFetchBlog(result, onLogin) // Parse the text from the response
        const sortAndFormatDates = () => {

          return resultData
            .sort((a, b) => new Date(b.time) - new Date(a.time))
            .map(blog => {
              const date = new Date(blog.time);
              const options = { day: '2-digit', month: 'long', year: 'numeric' };
              const content = extractParagraphs(blog.content);

              return {
                id: blog.id,
                coverImage: blog.coverImage,
                title: blog.title,
                content: content,
                userImage: blog.userPhoto,
                username: blog.userName,
                date: date.toLocaleDateString('en-US', options)
              };
            });
        }
        setMyBlogs(sortAndFormatDates());
      
      } catch (error) {
        console.error("There has been a problem with fetch operation:", error);
      }
    }
    fetchData();
    setLoading(false)
  }, []);

  const createBlog = () => {
    navigate("/create-blog");
  };


  return (
    <div className="flex flex-col mx-4 my-8">
      <button
        className="p-2 border bg-gray-600 text-white rounded-lg"
        onClick={createBlog}
      >
        Create blog
      </button>

      <p className="text-2xl font-bold my-5">My blogs</p>
      <div className="w-full grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">

        {myBlogs &&
          myBlogs.map((element) => {
            return (
              <HomeBlogCard
                key={element.id}
                id={element.id}
                coverImage={element.coverImage}
                title={element.title}
                content={element.content}
                userImage={"null"}
                username={null}
                date={element.date}
              />
            )
          })
        }
        {loading ?
          <LoadingIndicator /> : <></>}
      </div>
    </div>
  );
}

export default Dashboard;
