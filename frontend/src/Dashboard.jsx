import { useContext, useEffect, useState } from "react";
import LoadingIndicator from "./components/LoadingIndicator";
import { ConstBlogPageSize } from "./util/ConstBlogPageSize";
import MediaCard from "./components/MediaCard";
import { AuthContext } from "./contexts/AuthContext";
import PaginationRounded from "./components/PaginationRounded";
import { getBlogsByUser } from "./util/BlogUtil";
import apiErrorHandle from "./util/APIErrorHandle";
import HeaderFilter from "./components/HeaderFilter";

function Dashboard() {
  const [myBlogPage, setMyBlogPage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(ConstBlogPageSize[0]);
  const { userInfo, removeCreds } = useContext(AuthContext);
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortBy, setSortBy] = useState("time");
  const sortByItems = ["time", "title"];

  async function fetchData() {
    setLoading(true);
    try {
      const resultData = await getBlogsByUser(
        userInfo.id,
        page,
        pageSize,
        sortBy,
        sortOrder
      );
      setMyBlogPage(resultData);
      setPage(resultData.number);
      setPageSize(resultData.size);
    } catch (error) {
      const retry = await apiErrorHandle(error, removeCreds);
      if(retry) fetchData();
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [userInfo?.id, pageSize, page, sortBy, sortOrder]);

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
          onChangeSortBy={(e) => setSortBy(e.target.value)}
          onChangeSortOrder={(e) => setSortOrder(e.target.value)}
          sortByItems={sortByItems}
          sortByValue={sortBy}
          sortOrderValue={sortOrder}
        />
      </div>

      {/* Content */}
      <div className="min-h-[50vh]">
        {loading ? (
          <div className="flex justify-center py-16">
            <LoadingIndicator size={40}/>
          </div>
        ) : myBlogPage && myBlogPage.content && myBlogPage.content.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {myBlogPage.content.map((blog) => (
              <MediaCard key={blog.blogId} blog={blog} />
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
      {myBlogPage && !myBlogPage.empty && (
        <div className="flex justify-center mt-12">
          <PaginationRounded
            pageNumber={page + 1}
            pageSize={pageSize}
            onChangePage={(pn, ps) => {
              setPage(pn);
              setPageSize(ps);
            }}
            isLastPage={(myBlogPage && myBlogPage.last) || true}
            totalElements={(myBlogPage && myBlogPage.totalElements) || 0}
            totalPages={(myBlogPage && myBlogPage.totalPages) || 0}
          />
        </div>
      )}
    </div>
  );
}

export default Dashboard;
