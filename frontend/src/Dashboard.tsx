import { useEffect, useState } from "react";
import LoadingIndicator from "./components/LoadingIndicator";
import { ConstBlogPageSize } from "./util/ConstBlogPageSize";
import MediaCard from "./components/MediaCard";
import { useAuth } from "./contexts/AuthContext";
import PaginationRounded from "./components/PaginationRounded";
import { getBlogsByUser } from "./util/api-request/BlogUtil";
import apiErrorHandle, { type APIError } from "./util/APIErrorHandle";
import HeaderFilter from "./components/HeaderFilter";
import {type BlogSortField, sortByItems, type BlogSummary } from "./types/blog/BlogInfo";
import type { PaginatedResponse } from "./types/Page";

function Dashboard() {
  const [myBlogPage, setMyBlogPage] =
    useState<PaginatedResponse<BlogSummary>>();
  const [loading, setLoading] = useState(true);
  const { basicUserInfo, removeCreds, logout } = useAuth();
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortBy, setSortBy] = useState<BlogSortField>(sortByItems[0] || "createdAt");

  if (basicUserInfo === null || !basicUserInfo) logout();

  useEffect(() => {
    fetchData(0, ConstBlogPageSize[0] ?? 10);
  }, [basicUserInfo?.id, sortBy, sortOrder]);

  async function fetchData(pageNumber: number, pageSize: number) {
    setLoading(true);
    try {
      const blogPage = await getBlogsByUser(
        basicUserInfo!.id,
        pageNumber,
        pageSize,
        sortBy,
        sortOrder,
      );

      setMyBlogPage(blogPage);

    } catch (error) {
      apiErrorHandle(error as APIError, removeCreds);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 min-h-screen max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          My Blogs
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage and view all your published content
        </p>
      </div>

      {/* Filter */}
      <div className="mb-8 flex justify-center sm:justify-start">
        <HeaderFilter
          onChangeSortBy={(by) => setSortBy(by)}
          onChangeSortOrder={(order) => setSortOrder(order)}
          sortByItems={sortByItems}
          sortByValue={sortBy}
          sortOrderValue={sortOrder}
        />
      </div>

      {/* Content */}
      <div className="min-h-[50vh]">
        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingIndicator size={40} />
          </div>
        ) : myBlogPage &&
          myBlogPage.content &&
          myBlogPage.content.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {myBlogPage.content.map((blogInfo) => (
              <MediaCard
                key={blogInfo.blog.id}
                blog={blogInfo.blog}
                category={blogInfo.category}
                author={blogInfo.author}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4 opacity-30">📝</div>
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
              No blogs yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Start writing and share your first blog post!
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {myBlogPage && (
        <div className="flex justify-center mt-12">
          <PaginationRounded
            number={(myBlogPage?.page?.number ?? -1) + 1}
            size={myBlogPage?.page?.size ?? ConstBlogPageSize[0] ?? 10}
            onChangePage={(pn, ps) => {
              fetchData(pn, ps);
            }}
            totalElements={myBlogPage?.page?.totalElements ?? 0}
            totalPages={myBlogPage?.page?.totalPages ?? 0}
          />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
