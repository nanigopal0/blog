import { useContext, useEffect, useRef, useState } from "react";

import { ConstBlogPageSize } from "./util/ConstBlogPageSize";
import { AuthContext } from "./contexts/AuthContext";
import HeaderHomePage from "./components/HeaderHomePage";
import MediaCard from "./components/MediaCard";
import PaginationRounded from "./components/PaginationRounded";
import LoadingIndicator from "./components/LoadingIndicator";
import { getCategoriesFromServer } from "./util/LoadCategory";
import { getAllBlogs, getBlogsByCategory } from "./util/BlogUtil";
import apiErrorHandle from "./util/APIErrorHandle";
import HeaderFilter from "./components/HeaderFilter";

function Home() {
  const [blogPage, setBlogPage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(ConstBlogPageSize[0]);
  const { removeCreds } = useContext(AuthContext);
  const scrollContainerRef = useRef(null);
  const [categories, setCategories] = useState([{ id: 0, category: "All" }]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortBy, setSortBy] = useState("time");
  const sortByItems = ["time", "title"];

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBlog();
  }, [sortBy, sortOrder, pageNumber, pageSize, selectedCategoryId]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const result = await getCategoriesFromServer();
      setCategories([{ id: 0, category: "All" }, ...result]);
    } catch (error) {
      const retry = await apiErrorHandle(error, removeCreds);
      if(retry) await fetchCategories();
    } finally {
      if (blogPage) setLoading(false);
    }
  };

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const fetchedBlogs =
        selectedCategoryId == 0
          ? await getAllBlogs(pageNumber, pageSize, sortBy, sortOrder)
          : await getBlogsByCategory(
              findCategoryById(selectedCategoryId).id,
              pageNumber,
              pageSize,
              sortBy,
              sortOrder
            );

      updateBlogContent(fetchedBlogs);
    } catch (error) {
      const retry = await apiErrorHandle(error, removeCreds);
      if(retry) fetchBlog();
    } finally {
      if (categories) setLoading(false);
    }
  };

  const findCategoryById = (id) => {
    return categories.find((category) => category.id == id);
  };

  const updateBlogContent = (blog) => {
    if (blog && blog.content) {
      setBlogPage(blog);
      setPageNumber(blog.number);
      setPageSize(blog.size);
    }
  };
  const handleOnHeaderClick = (categoryId) => {
    if (selectedCategoryId !== categoryId) setSelectedCategoryId(categoryId);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 min-h-screen max-w-7xl mx-auto">
      {/* Horizontal Scrollable Header */}
      <div
        ref={scrollContainerRef}
        className="mb-6 flex gap-3 overflow-x-auto py-4 px-2 whitespace-nowrap scrollbar-none cursor-grab select-none"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {categories.map((category) => (
          <HeaderHomePage
            key={category.id}
            category={category.category}
            isSelected={selectedCategoryId === category.id}
            onClick={() => handleOnHeaderClick(category.id)}
          />
        ))}
      </div>

      <div className="max-w-md mx-auto mb-8">
        <HeaderFilter
          onChangeSortBy={(e) => setSortBy(e.target.value)}
          onChangeSortOrder={(e) => setSortOrder(e.target.value)}
          sortByItems={sortByItems}
          sortByValue={sortBy}
          sortOrderValue={sortOrder}
        />
      </div>

      {/* Blog Cards */}
      {loading ? (
        <div className="mt-16 flex justify-center">
          <LoadingIndicator size={40}/>
        </div>
      ) : !blogPage || blogPage.empty ? (
        <div className="mt-16 text-center">
          <p className="text-xl text-gray-500 dark:text-gray-400">
            No blogs available
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Check back later for new content
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {blogPage &&
            blogPage.content &&
            blogPage.content.map((blog) => (
              <MediaCard key={blog.id} blog={blog} />
            ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-12 pb-8">
        <PaginationRounded
          pageNumber={pageNumber + 1}
          pageSize={pageSize}
          onChangePage={(pn, ps) => {
            setPageNumber(pn);
            setPageSize(ps);
          }}
          isLastPage={(blogPage && blogPage.last) || true}
          totalElements={(blogPage && blogPage.totalElements) || 0}
          totalPages={(blogPage && blogPage.totalPages) || 0}
        />
      </div>
    </div>
  );
}

export default Home;
