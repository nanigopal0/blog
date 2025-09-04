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
      apiErrorHandle(error, removeCreds);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [userInfo?.id, pageSize, page, sortBy, sortOrder]);

  return (
    <div className="p-8 min-h-screen">
      {/* Recent Blogs Section */}
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
        My Blogs
      </h2>

      <div className="max-w-lg mx-auto mb-6">
        <HeaderFilter
          onChangeSortBy={(e) => setSortBy(e.target.value)}
          onChangeSortOrder={(e) => setSortOrder(e.target.value)}
          sortByItems={sortByItems}
          sortByValue={sortBy}
          sortOrderValue={sortOrder}
        />
      </div>

      <div className="min-h-3/4">
        <div className="w-full grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {myBlogPage &&
            myBlogPage.content &&
            myBlogPage.content.map((blog) => (
              <MediaCard key={blog.blogId} blog={blog} />
            ))}
          {loading && <LoadingIndicator size={40}/>}
        </div>

        {(!myBlogPage || myBlogPage.empty) && !loading && (
          <p className="text-center mt-8 text-gray-600 dark:text-gray-400 text-base">
            No blogs found.
          </p>
        )}
      </div>

      {/* Pagination */}
      {!myBlogPage.empty && (
        <div className="flex justify-center mt-8">
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
