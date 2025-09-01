import { useNavigate } from "react-router-dom";
import { extractTextFromTipTapJSON } from "@/util/ExtractTextFromJson";
import { User } from "lucide-react";

export default function MediaCard({ blog }) {
  const navigate = useNavigate();

  const navigateReader = (id) => {
    navigate(`/blog/${id}`);
  };

  return (
    <div
      className="max-w-sm min-w-0 w-full bg-black/20 border dark:border-black/10
       border-white/10 dark:bg-white/20 rounded-lg hover:shadow-xl transition-all
       duration-300 hover:scale-105 cursor-pointer overflow-hidden "
      onClick={() => navigateReader(blog.id)}
    >
      {/* Blog Cover Image */}
      <div className="h-44 w-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
        <img
          src={blog.coverImage}
          alt={blog.title}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
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
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
          {blog.title}
        </h3>
        <p className=" text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
          {extractTextFromTipTapJSON(blog.content)}
        </p>
      </div>

      {/* Blog Footer */}
      <div className="flex justify-between items-center px-4 pb-4">
        {/* Author Info */}
        <div className="flex items-center gap-2">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 border">
            {blog?.user?.photo ? (
              <img
                src={`${blog.user.photo}`}
                alt="photo"
                className="rounded-full object-cover scale-125 w-full h-full"
              />
            ) : (
              <User size={32}/>
            )}
          </div>

          {/* Author Details */}
          <div className="flex flex-col">
            <p className="text-sm font-medium dark:text-white">
              {blog.user.name}
            </p>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              {new Date(blog.time).toLocaleDateString("en-us", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Category Badge */}
        <div className="bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 px-2 py-1 rounded-full text-xs font-medium">
          {blog.category?.category || "Uncategorized"}
        </div>
      </div>
    </div>
  );
}
