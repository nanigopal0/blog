import { ConstBlogPageSize } from "../util/ConstBlogPageSize";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export default function PaginationRounded({
  pageSize,
  onChangePage,
  totalPages,
  pageNumber,
  isLastPage,
  totalElements,
}) {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 3;
    let startPage = Math.max(1, pageNumber - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== pageNumber) {
      onChangePage(newPage - 1, pageSize);
    }
  };

  return (
    <div className="max-w-sm sm:max-w-lg w-full flex flex-col sm:flex-row items-center justify-between gap-4 my-4 p-4 bg-white/50 border border-black/20 dark:bg-white/20 rounded-lg shadow-lg">
      {/* Page Size Selector */}
      <div className="flex items-center gap-2">
        <label htmlFor="page-size-select" className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Page Size:
        </label>
        <select
          id="page-size-select"
          value={pageSize}
          onChange={(e) => onChangePage(pageNumber - 1, parseInt(e.target.value))}
          className="min-w-20 px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          {ConstBlogPageSize.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1">
        {/* First Page Button */}
        <button
          onClick={() => handlePageChange(1)}
          disabled={pageNumber === 1}
          className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="First page"
        >
          <ChevronsLeft size={18} />
        </button>

        {/* Previous Page Button */}
        <button
          onClick={() => handlePageChange(pageNumber - 1)}
          disabled={pageNumber === 1}
          className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Page Number Buttons */}
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`min-w-10 h-10 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
              page === pageNumber
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            {page}
          </button>
        ))}

        {/* Next Page Button */}
        <button
          onClick={() => handlePageChange(pageNumber + 1)}
          disabled={isLastPage || pageNumber === totalPages}
          className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight size={18} />
        </button>

        {/* Last Page Button */}
        {!isLastPage && (
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={pageNumber === totalPages}
            className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Last page"
          >
            <ChevronsRight size={18} />
          </button>
        )}
      </div>

      {/* Total Elements */}
      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
        Total: {totalElements}
      </p>
    </div>
  );
}