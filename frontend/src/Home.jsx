import { useEffect, useState } from "react";
import HomeBlogCard from "./components/HomeBlogCard";
import { sortAndFormatDates } from "./util/SortAndFormatBlog";
import { handleResponseFromFetchBlog } from "./util/HandleResponse";
import LoadingIndicator from "./util/LoadingIndicator";
import { API_BASE_URL } from "./util/BaseUrl";


function Home({ onLogin }) {

  const [blogs, setBlogs] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const getAllBlogs = async () => {
      try {
        const result = await fetch(
          `${API_BASE_URL}/blog/get-all-blogs`
          ,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
          }
        );

        return await handleResponseFromFetchBlog(result, onLogin);
      } catch (error) {
        
        console.error("There has been a problem with fetch operation:", error);
        return [];
      }
    };


    const fetchBlog = async () => {
      const fetchedBlogs = await getAllBlogs();
      setBlogs(sortAndFormatDates(fetchedBlogs));
      setLoading(false);
    };

    fetchBlog();
  }, []);



  return (
    <div className="m-4">
      <p className="text-2xl font-bold my-3">Latest Blogs</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {blogs &&
          blogs.map((element) => {
            return (
              <HomeBlogCard
                key={element.id}
                id={element.id}
                coverImage={element.coverImage}
                title={element.title}
                content={element.content}
                userImage={element.userImage}
                username={element.username}
                date={element.date}
              />
            );
          })
        }
        {loading ? <LoadingIndicator/> : <></> }
      </div>
    </div>
  );
}

export default Home;
