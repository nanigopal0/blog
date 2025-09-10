import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./contexts/AuthContext";
import { ConstBlogPageSize } from "./util/ConstBlogPageSize";
import PaginationRounded from "./components/PaginationRounded";
import MediaCard from "./components/MediaCard";
import { SearchIcon } from "lucide-react";
import apiErrorHandle from "./util/APIErrorHandle";
import { searchBlogs } from "./util/BlogUtil";
import { searchUsers } from "./util/UserUtil";
import LoadingIndicator from "./components/LoadingIndicator";
import FollowerCard from "./components/FollowerCard";
import HeaderHomePage from "./components/HeaderHomePage";
import HeaderFilter from "./components/HeaderFilter";

function Search() {
  const [searchedBlogPage, setSearchedBlogPage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { removeCreds } = useContext(AuthContext);
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [selectedHeaderIdx, setSelectedHeaderIdx] = useState(0);
  const headers = ["Blog", "User"];
  const sortByBlog = ["time", "title"];
  const [userPage, setUserPage] = useState(null);
  const [sortBy, setSortBy] = useState("time");
  const [sortOrder, setSortOrder] = useState("desc");
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(ConstBlogPageSize[0]);

  const fetchSearchedBlogs = async (pageNumber, pageSize) => {
    setLoading(true);
    try {
      const fetchedBlogPage = await searchBlogs(
        keyword,
        pageNumber,
        pageSize,
        sortBy,
        sortOrder
      );
      if (fetchedBlogPage.number != pageNumber)
        setPageNumber(fetchedBlogPage.number);
      if (fetchedBlogPage.size != pageSize) setPageSize(fetchedBlogPage.size);
      setSearchedBlogPage(fetchedBlogPage);
    } catch (error) {
      apiErrorHandle(error, removeCreds);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async (pageNumber, pageSize) => {
    setLoading(true);
    try {
      const result = await searchUsers(keyword, pageNumber, pageSize);
      if (result.number != pageNumber) setPageNumber(result.number);
      if (result.size != pageSize) setPageSize(result.size);
      setUserPage(result);
    } catch (error) {
      apiErrorHandle(error, removeCreds);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch();
  }, [sortBy, sortOrder, pageNumber, pageSize, selectedHeaderIdx]);

  const handleSearch = () => {
    if (keyword.trim()) {
      if (selectedHeaderIdx == 0)
        fetchSearchedBlogs(
          0,
          (searchedBlogPage && searchedBlogPage.size) || ConstBlogPageSize[0]
        );
      else
        fetchUsers(
          0,
          (searchedBlogPage && searchedBlogPage.size) || ConstBlogPageSize[0]
        );
    }
  };

  return (
    <div className="p-4 flex flex-col gap-6 min-h-screen ">
      <div className="place-items-center">
        <div className="flex max-w-md lg:max-w-lg w-full gap-2 justify-between items-center px-4 py-2 border rounded-xl">
          <input
            type="text"
            className="w-full focus:outline-none"
            placeholder="Search blogs, users"
            onChange={(e) => setKeyword(e.target.value)}
            value={keyword}
          />
          <i className="cursor-pointer" onClick={() => handleSearch()}>
            <SearchIcon />
          </i>
        </div>
      </div>
      {/* Header Section */}

      <h2 className="text-lg font-medium text-center text-gray-700 dark:text-gray-300 ">
        Searched {selectedHeaderIdx == 0 ? "blogs" : "users"} for "{keyword}"
      </h2>
      <div className="justify-items-center ">
        <div className="max-w-md lg:max-w-lg w-full ">
          {/* Sorting  */}
          {selectedHeaderIdx == 0 && (
            <div className="mb-4">
              <HeaderFilter
                onChangeSortBy={(e) => setSortBy(e.target.value)}
                onChangeSortOrder={(e) => setSortOrder(e.target.value)}
                sortByItems={sortByBlog}
                sortByValue={sortBy}
                sortOrderValue={sortOrder}
              />
            </div>
          )}

          <div className="flex gap-4 overflow-x-auto">
            {headers.map((header, index) => (
              <HeaderHomePage
                key={index}
                category={header}
                isSelected={selectedHeaderIdx == index}
                onClick={() => {
                  setSelectedHeaderIdx(index);
                  setPageNumber(0);
                  setPageSize(ConstBlogPageSize[0]);
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}

      <div>
        {loading && <LoadingIndicator />}

        {!loading && selectedHeaderIdx === 0 && (
          <>
            {searchedBlogPage ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchedBlogPage.content.map((element) => (
                  <MediaCard key={element.id} blog={element} />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600 dark:text-gray-400 text-base">
                No blogs found for "{keyword}"
              </p>
            )}
          </>
        )}

        {!loading && selectedHeaderIdx === 1 && (
          <>
            {userPage ? (
              <div className="grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 min-[425px]:grid-cols-2 gap-4">
                {userPage.content.map((element) => (
                  <FollowerCard
                    key={element.id}
                    follower={element}
                    onclick={() => navigate(`/user/${element.id}`)}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600 dark:text-gray-400 text-base">
                No users found for "{keyword}"
              </p>
            )}
          </>
        )}
      </div>
      {/* Pagination */}

      {!loading && (searchedBlogPage || userPage) && (
        <div className="flex justify-center items-center ">
          <PaginationRounded
            pageNumber={pageNumber + 1}
            pageSize={pageSize}
            onChangePage={(pn, ps) => {
              setPageNumber(pn);
              setPageSize(ps);
            }}
            isLastPage={
              selectedHeaderIdx == 0
                ? (searchedBlogPage && searchedBlogPage.last) || false
                : (userPage && userPage.last) || true
            }
            totalElements={
              selectedHeaderIdx == 0
                ? (searchedBlogPage && searchedBlogPage.totalElements) || 0
                : (userPage && userPage.totalElements) || 0
            }
            totalPages={
              selectedHeaderIdx == 0
                ? (searchedBlogPage && searchedBlogPage.totalPages) || 0
                : (userPage && userPage.last) || 0
            }
          />
        </div>
      )}
    </div>
  );
}

export default Search;
