import { useEffect, useRef, useState } from "react";
import { ConstBlogPageSize } from "./util/ConstBlogPageSize";
import { useAuth } from "./contexts/AuthContext";
import HeaderHomePage from "./components/HeaderHomePage";
import MediaCard from "./components/MediaCard";
import PaginationRounded from "./components/PaginationRounded";
import LoadingIndicator from "./components/LoadingIndicator";
import { getAllBlogs, getBlogsByCategory } from "./util/api-request/BlogUtil";
import apiErrorHandle, { type APIError } from "./util/APIErrorHandle";
import HeaderFilter from "./components/HeaderFilter";
import type { PaginatedResponse } from "./types/Page";
import{ sortByItems, type BlogSortField, type BlogSummary } from "./types/blog/BlogInfo";
import { getCategoriesFromServer } from "./util/api-request/CategoryUtil";
import type CategoryInfo from "./types/blog/CategoryInfo";

function Home() {
  const [blogPage, setBlogPage] = useState<PaginatedResponse<BlogSummary>>();
  const [loading, setLoading] = useState(true);
  const { removeCreds } = useAuth();
  const scrollContainerRef = useRef(null);
  const [categories, setCategories] = useState<CategoryInfo[]>([
    { id: 0, category: "All" },
  ]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortBy, setSortBy] = useState<BlogSortField>(sortByItems[0] || "createdAt");

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchBlog(0, ConstBlogPageSize[0] ?? 10);
  }, [sortBy, sortOrder, selectedCategoryId]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const result = await getCategoriesFromServer();
      setCategories([{ id: 0, category: "All" }, ...result]);
    } catch (error) {
      apiErrorHandle(error as APIError, removeCreds);
    } finally {
      if (blogPage) setLoading(false);
    }
  };

  const fetchBlog = async (
    pageNumber: number,
    pageSize: number
  ) => {
    setLoading(true);
    try {
      const fetchedBlogs =
        selectedCategoryId == 0
          ? await getAllBlogs(pageNumber, pageSize, sortBy, sortOrder)
          : await getBlogsByCategory(
              findCategoryById(selectedCategoryId)?.id ?? 0,
              pageNumber,
              pageSize,
              sortBy,
              sortOrder,
            );

      updateBlogContent(fetchedBlogs);
    } catch (error) {
      apiErrorHandle(error as APIError, removeCreds);
    } finally {
      if (categories) setLoading(false);
    }
  };

  const findCategoryById = (id: number) => {
    return categories.find((category) => category.id === id);
  };

  const updateBlogContent = (blog: PaginatedResponse<BlogSummary>) => {
    if (blog && blog.content) {
      setBlogPage(blog);
      // setPageNumber(blog.number);
      // setPageSize(blog.size);
    }
  };
  const handleOnHeaderClick = (categoryId: number) => {
    if (selectedCategoryId !== categoryId) {
      setSelectedCategoryId(categoryId);
      // setPageNumber(0); // Reset to first page when changing category
    }
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
          onChangeSortBy={(value) => setSortBy(value)}
          onChangeSortOrder={(value) => setSortOrder(value)}
          sortByItems={sortByItems}
          sortByValue={sortBy}
          sortOrderValue={sortOrder}
        />
      </div>

      {/* Blog Cards */}
      {loading ? (
        <div className="mt-16 flex justify-center">
          <LoadingIndicator size={40} />
        </div>
      ) : !blogPage || !blogPage.content || blogPage.content.length === 0 ? (
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
          {blogPage.content.map((blogSummary) => (
            <MediaCard key={blogSummary.blog.id} {...blogSummary} />
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-12 pb-8">
        <PaginationRounded
          number={(blogPage?.page?.number ?? -1) + 1}
          size={blogPage?.page?.size ?? ConstBlogPageSize[0] ?? 10}
          onChangePage={(pageNumber, pageSize) => {
            fetchBlog(pageNumber, pageSize);
          }}
          totalElements={blogPage?.page?.totalElements ?? 0}
          totalPages={blogPage?.page?.totalPages ?? 0}
        />
      </div>
    </div>
  );
}

export default Home;
