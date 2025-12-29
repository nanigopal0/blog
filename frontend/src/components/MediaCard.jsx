import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { extractTextFromTipTapJSON } from "@/util/ExtractTextFromJson";

export default function MediaCard({ blog }) {
  const navigate = useNavigate();

  const navigateReader = (id) => {
    navigate(`/blog/${id}`);
  };

  return (
    <div
      className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg 
        border border-gray-100 dark:border-gray-700 transition-all duration-300 
        cursor-pointer overflow-hidden flex flex-col"
      onClick={() => navigateReader(blog.id)}
    >
      {/* Blog Cover Image */}
      <div className="h-40 w-full bg-gray-100 dark:bg-gray-700 overflow-hidden">
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.style.display = "none";
            e.target.parentNode.classList.add(
              "flex",
              "items-center",
              "justify-center"
            );
            e.target.parentNode.innerHTML =
              '<div class="text-gray-400 dark:text-gray-500">No Image</div>';
          }}
        />
      </div>

      {/* Blog Content */}
      <div className="p-4 flex-1 flex flex-col">
        {/* Category Badge */}
        <div className="mb-2">
          <span className="inline-block bg-teal-50 dark:bg-teal-900/50 text-teal-600 dark:text-teal-400 px-2.5 py-0.5 rounded-full text-xs font-medium">
            {blog.category?.category || "Uncategorized"}
          </span>
        </div>
        
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1.5 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {blog.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 flex-1">
          {extractTextFromTipTapJSON(blog.content)}
        </p>
      </div>

      {/* Blog Footer */}
      <div className="px-4 pb-4 pt-0">
        <div className="flex items-center gap-3 pt-3 border-t border-gray-100 dark:border-gray-700">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 ring-2 ring-gray-100 dark:ring-gray-700">
            {blog?.user?.photo ? (
              <img
                src={`${blog.user.photo}`}
                alt="photo"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                <User size={16} className="text-gray-400"/>
              </div>
            )}
          </div>

          {/* Author Details */}
          <div className="flex flex-col min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {blog.user.name}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(blog.time).toLocaleDateString("en-us", {
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
