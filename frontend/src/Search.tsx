import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/AuthContext";
import { ConstBlogPageSize } from "./util/ConstBlogPageSize";
import PaginationRounded from "./components/PaginationRounded";
import MediaCard from "./components/MediaCard";
import { SearchIcon } from "lucide-react";
import apiErrorHandle, { type APIError } from "./util/APIErrorHandle";
import { searchBlogs } from "./util/api-request/BlogUtil";
import { searchUsers } from "./util/api-request/UserUtil";
import LoadingIndicator from "./components/LoadingIndicator";
import FollowerCard from "./components/FollowerCard";
import HeaderHomePage from "./components/HeaderHomePage";
import HeaderFilter from "./components/HeaderFilter";
import type { PaginatedResponse } from "./types/Page";
import {type BlogSortField, sortByItems, type BlogSummary } from "./types/blog/BlogInfo";
import type { UserOverview } from "./types/user/UserOverview";

function Search() {
  const [searchedBlogPage, setSearchedBlogPage] =
    useState<PaginatedResponse<BlogSummary> | null>(null);
  const [loading, setLoading] = useState(false);
  const { removeCreds } = useAuth();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [selectedHeaderIdx, setSelectedHeaderIdx] = useState(0);
  const headers = ["Blog", "User"];
  const [userPage, setUserPage] =
    useState<PaginatedResponse<UserOverview> | null>(null);
  const [sortBy, setSortBy] = useState<BlogSortField>(sortByItems[0] || "createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const defaultPageSize = ConstBlogPageSize[0] ?? 10;

  const fetchSearchedBlogs = useCallback(
    async (pageNumber: number, pageSize: number) => {
      setLoading(true);
      try {
        const fetchedBlogPage = await searchBlogs(
          keyword,
          pageNumber,
          pageSize,
          sortBy,
          sortOrder,
        );
        setSearchedBlogPage(fetchedBlogPage);
      } catch (error) {
        apiErrorHandle(error as APIError, removeCreds);
      } finally {
        setLoading(false);
      }
    },
    [keyword, sortBy, sortOrder, removeCreds],
  );

  const fetchUsers = useCallback(
    async (pageNumber: number, pageSize: number) => {
      setLoading(true);
      try {
        const result = await searchUsers(keyword, pageNumber, pageSize);
        setUserPage(result);
      } catch (error) {
        apiErrorHandle(error as APIError, removeCreds);
      } finally {
        setLoading(false);
      }
    },
    [keyword, removeCreds],
  );

  useEffect(() => {
    handleSearch();
  }, [sortBy, sortOrder, selectedHeaderIdx]);

  const handleSearch = useCallback(() => {
    if (keyword.trim()) {
      if (selectedHeaderIdx === 0) fetchSearchedBlogs(0, defaultPageSize);
      else fetchUsers(0, defaultPageSize);
    }
  }, [
    keyword,
    selectedHeaderIdx,
    defaultPageSize,
    fetchSearchedBlogs,
    fetchUsers,
  ]);

  const handleHeaderChange = (index: number): void => {
    setSelectedHeaderIdx(index);
    if (index === 0) setUserPage(null);
    else setSearchedBlogPage(null);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 min-h-screen max-w-7xl mx-auto">
      {/* Search Bar */}
      <div className="flex justify-center">
        <div className="flex max-w-xl w-full items-center gap-3 px-5 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 transition-all">
          <SearchIcon className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            className="w-full bg-transparent focus:outline-none text-gray-900 dark:text-white placeholder-gray-400"
            placeholder="Search blogs, users..."
            onChange={(e) => setKeyword(e.target.value)}
            value={keyword}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button
            onClick={() => handleSearch()}
            className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="flex justify-center">
        <div className="flex gap-2">
          {headers.map((header, index) => (
            <HeaderHomePage
              key={index}
              category={header}
              isSelected={selectedHeaderIdx === index}
              onClick={() => {
                handleHeaderChange(index);
              }}
            />
          ))}
        </div>
      </div>

      {/* Filter & Results Info */}
      {keyword && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Showing results for{" "}
            <span className="font-semibold text-gray-900 dark:text-white">
              "{keyword}"
            </span>
          </p>
          {selectedHeaderIdx === 0 && (
            <HeaderFilter
              onChangeSortBy={(value) => setSortBy(value)}
              onChangeSortOrder={(value) => setSortOrder(value)}
              sortByItems={sortByItems}
              sortByValue={sortBy}
              sortOrderValue={sortOrder}
            />
          )}
        </div>
      )}

      {/* Content Section */}
      <div>
        {loading && (
          <div className="flex justify-center py-12">
            <LoadingIndicator />
          </div>
        )}

        {!loading && selectedHeaderIdx === 0 && (
          <>
            {searchedBlogPage && searchedBlogPage.content?.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchedBlogPage.content.map((element: BlogSummary) => (
                  <MediaCard key={element.blog.id} {...element} />
                ))}
              </div>
            ) : keyword ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No blogs found
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                  Try different keywords
                </p>
              </div>
            ) : null}
          </>
        )}

        {!loading && selectedHeaderIdx === 1 && (
          <>
            {userPage && userPage.content?.length > 0 ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {userPage.content.map((element: UserOverview) => (
                  <FollowerCard
                    key={element.id}
                    follower={element}
                    onclick={() => navigate(`/user/${element.id}`)}
                  />
                ))}
              </div>
            ) : keyword ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No users found
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                  Try different keywords
                </p>
              </div>
            ) : null}
          </>
        )}
      </div>
      {/* Pagination */}

      {!loading && (searchedBlogPage || userPage) && (
        <div className="flex justify-center items-center ">
          <PaginationRounded
            number={
              ((selectedHeaderIdx == 0
                ? searchedBlogPage?.page?.number
                : userPage?.page.number) ?? -1) + 1
            }
            size={
              (selectedHeaderIdx == 0
                ? searchedBlogPage?.page?.size
                : userPage?.page.size) ?? defaultPageSize
            }
            onChangePage={(pn, ps) => {
              if (selectedHeaderIdx === 0) fetchSearchedBlogs(pn, ps);
              else fetchUsers(pn, ps);
            }}
            totalElements={
              selectedHeaderIdx === 0
                ? (searchedBlogPage?.page.totalElements ?? 0)
                : (userPage?.page.totalElements ?? 0)
            }
            totalPages={
              selectedHeaderIdx === 0
                ? (searchedBlogPage?.page.totalPages ?? 0)
                : (userPage?.page.totalPages ?? 0)
            }
          />
        </div>
      )}
    </div>
  );
}

export default Search;
