import { User, MoreVertical } from "lucide-react";
import FormatDate from "../util/FormatDate";
import type { Comment } from "@/types/blog/Comment";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useRef, useEffect } from "react";
import { deleteComment, updateComment } from "@/util/api-request/CommentUtil";
import apiErrorHandle, { type APIError } from "@/util/APIErrorHandle";
import toast from "react-hot-toast";

export default function CommentComponent({ comment, onUpdatedComment }: { comment: Comment, onUpdatedComment: (isDeleted:boolean) => void }) {
  const { basicUserInfo, removeCreds } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.comment);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleEdit = () => {
    setIsEditing(true);
    setShowDropdown(false);
  };

  const handleDelete = async () => {
    setShowDropdown(false);
    const toastId = toast.loading("Deleting comment...");
    try {
      await deleteComment(comment.commentId);
      toast.success('Comment deleted successfully');
      onUpdatedComment(true);
    } catch (error) {
      apiErrorHandle(error as APIError, removeCreds);
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleSaveEdit = async () => {
    setIsEditing(false);
    const toastId = toast.loading("Updating comment...");
    try {
      const res = await updateComment(comment.commentId, editedComment);
      toast.success(res);
      onUpdatedComment(false);
    } catch (error) {
      apiErrorHandle(error as APIError, removeCreds);
    }
    finally {
      toast.dismiss(toastId);
    }
  };

  const handleCancelEdit = () => {
    setEditedComment(comment.comment);
    setIsEditing(false);
  };

  return (
    <div className="mb-6 p-4 rounded-lg shadow-md bg-white/60 dark:bg-gray-800 border border-gray-200 dark:border-gray-600">
      {/* Commenter Info  */}
      <div className="flex items-start justify-between">
        <div className="flex">
          {/* Commenter Photo */}
          <div className="mr-4 border rounded-full w-10 h-10 overflow-hidden">
            {comment.commenter.photo ? (
              <img
                src={comment.commenter.photo}
                alt={comment.commenter.name}
                className="w-full h-full object-cover scale-125 object-top"
              />
            ) : (
              <User size={""} />
            )}
          </div>

          {/* Commenter Name and commented time  */}
          <div>
            <p className="font-medium " >
              {comment.commenter.name}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {FormatDate(comment.commentedAt)}
            </p>
          </div>
        </div>

        {/* More menu for comment owner */}
        {basicUserInfo && basicUserInfo.id === comment.commenter.id && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
              aria-label="More options"
            >
              <MoreVertical size={20} className="text-gray-600 dark:text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {showDropdown && (
              <div className=" absolute right-0 mt-2 w-32 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-10">
                <button
                  onClick={handleEdit}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-t-lg transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-b-lg transition-colors"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Comment Content or Edit Input */}
      {isEditing ? (
        <div className="mt-3">
          <textarea
            value={editedComment}
            onChange={(e) => setEditedComment(e.target.value)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
            autoFocus
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSaveEdit}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
            >
              Save
            </button>
            <button
              onClick={handleCancelEdit}
              className="px-4 py-1.5 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 text-sm rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className="text-sm block mt-2 text-gray-700 dark:text-gray-300">{comment.comment}</p>
      )}
    </div>
  );
}

