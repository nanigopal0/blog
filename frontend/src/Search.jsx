import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HomeBlogCard from "./components/HomeBlogCard";
import { sortAndFormatDates } from "./util/SortAndFormatBlog";
import { handleResponseFromFetchBlog } from "./util/HandleResponse";
import LoadingIndicator from "./util/LoadingIndicator";
import { API_BASE_URL } from "./util/BaseUrl";

function Search({ onLogin }) {
  
  const [searchedBlogs, setSearchedBlogs] = useState([]);
  const [loading, setLoading] = useState(false)
  const [searchKey, setSearchKey] = useState("");

  
  const fetchSearchedBlogs = async () => {
    setLoading(true)
    const results = await fetchSearchResult();
    setSearchedBlogs(sortAndFormatDates(results));
    setLoading(false)
  }

  const fetchSearchResult = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/blog/search?title=${searchKey}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": localStorage.getItem("token"),
        }
      });


      return await handleResponseFromFetchBlog(response, onLogin) // Parse the text from the response

    } catch (error) {
      
      console.error("There has been a problem with fetch operation:", error);
      return [];
    }
  };

  return (
    <div className="m-4">
      <div className=" flex w-full max-w-2xl">
        <input
          type="text"
          value={searchKey}
          onChange={(s) => setSearchKey(s.target.value)}
          className="border rounded-lg w-full max-w-xl border-black p-2"
          placeholder="Search"
        />
        <button className="mx-2 bg-lime-500 p-2 rounded-lg" onClick={() => fetchSearchedBlogs()}>
          <img src="/public/search.svg" alt="" />
        </button>
      </div>
      <p className="text-2xl font-bold my-3">Searched blogs</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {loading ? <LoadingIndicator /> : <>{(searchedBlogs.length == 0) ? 'No result found': ''}</>}
        {searchedBlogs &&
          searchedBlogs.map((element) => {
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
          })}
      </div>
    </div>
  );
}

export default Search;