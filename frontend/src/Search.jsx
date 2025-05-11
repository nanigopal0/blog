import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import HomeBlogCard from "./components/HomeBlogCard";
import { handleResponseFromFetchBlog } from "./util/HandleResponse";
import LoadingIndicator from "./util/LoadingIndicator";
import { API_BASE_URL } from "./util/BaseUrl";
import { AuthContext } from "./contexts/AuthContext";
import { ConstBlogPageSize } from "./util/ConstBlogPageSize";
import PaginationRounded from "./components/PaginationRounded";

function Search() {
  const [searchedBlogs, setSearchedBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { authToken, logout } = useContext(AuthContext);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(ConstBlogPageSize[0]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchKey = queryParams.get("query") || ""; // Get the search key from the URL

  useEffect(() => {
    fetchSearchedBlogs(pageNumber - 1, pageSize);
  }, [searchKey]);

  const fetchSearchedBlogs = async (p, pageSize) => {
    setLoading(true);
    const fetchedBlogs = await fetchSearchResult(p, pageSize);

    if (fetchedBlogs && fetchedBlogs.content) {
      setSearchedBlogs(fetchedBlogs.content);
      setPageNumber(fetchedBlogs.pageNumber + 1);
      setPageSize(fetchedBlogs.pageSize);
      setIsLastPage(fetchedBlogs.isLastPage);
      setTotalPages(fetchedBlogs.totalPages);
      setTotalElements(fetchedBlogs.totalElements);
    }
    setLoading(false);
  };

  const fetchSearchResult = async (pageNumber, pageSize) => {
    return await fetch(
      `${API_BASE_URL}/blog/search?keyword=${searchKey}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: authToken,
        },
      }
    )
      .then((res) => {
        return handleResponseFromFetchBlog(res, logout); // Parse the text from the response
      })
      .catch((error) => {
        error.response == 404
          ? console.log("No result found")
          : console.log("Error fetching blogs:", error);
        return [];
      });
  };

  return (
    <div className="m-4">
      <p className="text-2xl font-bold my-3">Searched blogs</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {loading ? (
          <LoadingIndicator />
        ) : (
          <>{searchedBlogs.length == 0 ? "No result found" : ""}</>
        )}
        {searchedBlogs &&
          searchedBlogs.map((element) => {
            return <HomeBlogCard key={element.id} blog={element} />;
          })}
      </div>
      <PaginationRounded
        pageNumber={pageNumber}
        pageSize={pageSize}
        onChangePage={fetchSearchedBlogs}
        isLastPage={isLastPage}
        totalElements={totalElements}
        totalPages={totalPages}
      />
    </div>
  );
}

export default Search;
