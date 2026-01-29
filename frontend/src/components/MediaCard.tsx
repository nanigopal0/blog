import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { extractTextFromTipTapJSON } from "@/util/ExtractTextFromJson";
import type { BlogSummary } from "@/types/blog/BlogInfo";

export default function MediaCard(blogSummary: BlogSummary) {
  const navigate = useNavigate();

  const navigateReader = (id: number) => {
    navigate(`/blog/${id}`);
  };

  return (
    <div
      className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg 
        border border-gray-100 dark:border-gray-700 transition-all duration-300 
        cursor-pointer overflow-hidden flex flex-col"
      onClick={() => navigateReader(blogSummary.blog.id)}
    >
      {/* Blog Cover Image */}
      <div className="h-40 w-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
        <img
          src={blogSummary.blog.coverImage}
          alt={blogSummary.blog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            const parent = target.parentElement;
            if (parent) {
              target.style.display = "none";
              parent.classList.add("flex", "items-center", "justify-center");
              parent.innerHTML =
                '<div class="text-gray-400 dark:text-gray-500">No Image</div>';
            }
          }}
        />
      </div>

      {/* Blog Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Category Badge */}
        <div className="mb-2">
          <span className="inline-block bg-teal-50 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 px-2.5 py-0.5 rounded-full text-xs font-medium">
            {blogSummary.category?.category || "Uncategorized"}
          </span>
        </div>

        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1.5 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {blogSummary.blog.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 flex-1">
          {extractTextFromTipTapJSON(blogSummary.blog.content)}
        </p>
      </div>

      {/* Blog Footer */}
      <div className="px-4 pb-4 pt-0">
        <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-gray-100 dark:ring-gray-700">
            {blogSummary.author?.photo ? (
              <img
                src={`${blogSummary.author.photo}`}
                alt="photo"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                <User size={16} className="text-gray-400" />
              </div>
            )}
          </div>

          {/* Author Details */}
          <div className="flex flex-col min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {blogSummary.author.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(blogSummary.blog.createdAt).toLocaleDateString("en-us", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
