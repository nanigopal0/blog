import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import LoadingIndicator from "./components/LoadingIndicator";
import { useAuth } from "./contexts/AuthContext";

import FormatDate from "./util/FormatDate";
import { Heart, MessageCircle, X, User, ChevronDown } from "lucide-react";
import apiErrorHandle, { type APIError } from "./util/APIErrorHandle";
import {
  deleteBlogById,
  getBlogById,
  likeBlog,
  unlikeBlog,
} from "./util/api-request/BlogUtil";
import toast from "react-hot-toast";
import { EditorContent, useEditor } from "@tiptap/react";
import { tiptapEditorExtension } from "./components/tiptap/TiptapEditorExtension";
import type { BlogInfo } from "./types/blog/BlogInfo";
import type { Comment } from "./types/blog/Comment";
import {
  getCommentsByBlogId,
  postComment,
} from "./util/api-request/CommentUtil";
import CommentComponent from "./components/Comment";
import { ConstBlogPageSize } from "./util/ConstBlogPageSize";
import type { PaginatedResponse } from "./types/Page";

function BlogReader() {
  const param = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<BlogInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const { basicUserInfo, removeCreds, logout } = useAuth();
  const [isBlogOfCurrentUser, setIsBlogOfCurrentUser] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);
  const [isHeartClicked, setIsHeartClicked] = useState(false);
  const [isCommentSectionVisible, setIsCommentSectionVisible] = useState(false);
  const [commentPages, setCommentPages] = useState<PaginatedResponse<Comment>[]>([]);
  const [newComment, setNewComment] = useState("");
  const blogId = Number(param["id"] ?? 0);
  const commentPageSize = ConstBlogPageSize[0] ?? 10;

  if (basicUserInfo === null) logout();

  const editor = useEditor({
    editable: false,
    extensions: tiptapEditorExtension,
    content: "Loading...",
  });

  useEffect(() => {
    fetchBlog();
    fetchComments(0);
  }, []);

  // Set editor content when both editor and blog data are ready
  useEffect(() => {
    if (editor && blog?.blog.content) {
      editor.commands.setContent(JSON.parse(blog.blog.content));
    }
  }, [editor, blog]);

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const response = await getBlogById(blogId);
      setVariables(response);
    } catch (error) {
      apiErrorHandle(error as APIError, removeCreds);
    } finally {
      setLoading(false);
    }
  };

  const setVariables = (resultData: BlogInfo) => {
    setBlog(resultData);
    // setComments(resultData.comments || []);
    setTotalLikes(resultData.reaction.totalLikes || 0);
    setIsBlogOfCurrentUser(resultData.author.id === basicUserInfo!.id);
    setIsHeartClicked(resultData?.reaction?.reactionId !== null);
  };

  const handleReaction = async () => {
    if (blog == null) return;
    try {
      const reaction = !isHeartClicked
        ? await likeBlog(blog.blog.id)
        : await unlikeBlog(blog.reaction.reactionId, blog.blog.id); //reaction id

      const updatedBlog = {
        ...blog,
        reaction: {
          reactionId: reaction?.reactionId,
          totalLikes: reaction?.totalLikes,
        },
      };
      setTotalLikes(reaction.totalLikes);
      setIsHeartClicked(reaction.reactionId !== null);
      setBlog(updatedBlog);
    } catch (error) {
      apiErrorHandle(error as APIError, removeCreds);
    }
  };

  const fetchComments = async (pageNumber: number, replaceComment: boolean = false) => {
    try {
      const res = await getCommentsByBlogId(blogId, pageNumber, commentPageSize);
      if (pageNumber === 0)
        setCommentPages([res]);
      else if (replaceComment)
        setCommentPages(prev => prev.with(res.page.number, res))
      else setCommentPages(prev => prev.concat(res));
    } catch (error) {
      apiErrorHandle(error as APIError, removeCreds);
    }
  };

  const handlePostComment = async () => {
    if (newComment.trim() === "") return;
    if (basicUserInfo == null || blog == null) return;
    const loadingId = toast.loading("Posting comment...");
    try {
      const res = await postComment(newComment, blog.blog.id);
      toast.success(res);
      fetchComments(0);
    } catch (error) {
      apiErrorHandle(error as APIError, removeCreds);
    } finally {
      setNewComment("");
      toast.dismiss(loadingId);
    }
  };


  const handleDeleteBlog = async () => {
    if (blog == null) return;
    const loadingId = toast.loading("Deleting blog...");
    try {
      await deleteBlogById(blog.blog.id);
      toast.success("Blog deleted successfully");
      navigate("/home");
    } catch (error) {
      apiErrorHandle(error as APIError, removeCreds);
    } finally {
      toast.dismiss(loadingId);
    }
  };

  const handleUserClick = () => {
    if (blog == null) return;
    navigate(`/user/${blog.author.id}`);
  };

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingIndicator size={40} />
      </div>
    );
  else
    return (
      <div className="flex justify-center items-center min-h-screen">
        {blog && (
          <div className="w-full max-w-4xl">
            {/* Blog Cover Image - Hero */}
            <div className="w-full mb-6 sm:mb-8 overflow-hidden">
              <img
                src={blog.blog.coverImage}
                alt="cover"
                className="w-full max-h-[500px] object-cover rounded-none sm:rounded-2xl"
              />
            </div>


            {/* Blog Category */}
            <div className="mb-3">
              <span className="inline-block bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 px-3 py-1 rounded-full text-sm font-medium">
                {blog.category?.category || "Uncategorized"}
              </span>
            </div>

            {/* Blog Title */}
            <h1 className="font-bold mb-4 sm:mb-6 text-left text-3xl sm:text-4xl md:text-5xl leading-tight">
              {blog.blog.title}
            </h1>

            {/* Blog Author Info & Date - Inline */}
            <div className="flex items-center mb-6 sm:mb-8 ">
              <div
                onClick={handleUserClick}
                className="w-12 h-12 mr-4 rounded-full overflow-hidden border-2 cursor-pointer border-gray-200 dark:border-gray-600 flex items-center justify-center flex-shrink-0"
              >
                {blog.author.photo ? (
                  <img
                    src={blog.author.photo}
                    alt={blog.author.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-6 h-6 text-gray-500" />
                )}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <h3
                  className="font-semibold cursor-pointer text-base sm:text-lg hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  onClick={handleUserClick}
                >
                  {blog.author.name}
                </h3>
                <span className="hidden sm:inline text-gray-400">•</span>
                <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                  {FormatDate(blog.blog.createdAt)}
                </p>
              </div>
            </div>
            <hr className="mb-4 sm:mb-6 border-gray-400 dark:border-gray-700" />
            {/* Blog Content */}
            <div className="mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed prose prose-lg max-w-none dark:prose-invert">
              {blog && (
                <EditorContent
                  editor={editor}
                  className="tiptap p-0 text-slate-800 dark:text-slate-100"
                />
              )}
            </div>

            <hr className="mb-4 sm:mb-6 border-gray-400 dark:border-gray-700" />

            {/* Icons Section */}
            <div className="flex items-center justify-start gap-2 sm:gap-4 mb-4 sm:mb-6">
              {/* Heart Icon with Like Count */}
              <div
                onClick={handleReaction}
                className="flex items-center rounded-full px-2 py-1 sm:px-3 sm:py-2 gap-2 
                transition-colors cursor-pointer hover:bg-slate-300 hover:dark:bg-gray-600"
              >
                <Heart
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${isHeartClicked
                    ? "text-red-500 fill-red-500"
                    : "text-gray-700 dark:text-gray-300"
                    } hover:text-red-500 transition-colors`}
                />

                <span className="font-bold text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  {totalLikes || 0}
                </span>
              </div>

              {/* Comment Icon with Comment Count */}
              <div
                className="flex items-center rounded-full px-2 py-1 sm:px-3 sm:py-2 gap-2 
                      cursor-pointer hover:bg-slate-300 hover:dark:bg-gray-600 transition-colors"
                onClick={() => {
                  setIsCommentSectionVisible(!isCommentSectionVisible);
                }}
              >
                <button className="p-0 focus:outline-none">
                  {isCommentSectionVisible ? (
                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
                  ) : (
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
                  )}
                </button>
                <span className="font-bold text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  {commentPages[0]?.page?.totalElements ?? 0}
                </span>
              </div>
            </div>

            {/* Comments Section */}
            {isCommentSectionVisible && (
              <div className="transition-all duration-300">
                <h2 className="mb-2 sm:mb-4 text-xl sm:text-2xl font-semibold ">
                  Comments
                </h2>
                <div className="mb-4 sm:mb-6">
                  <textarea
                    className="w-full p-3 border text-gray-700 dark:text-gray-200 border-gray-400 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical min-h-20"
                    placeholder="Add a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  />
                  <button
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    onClick={handlePostComment}
                    disabled={!newComment.trim()}
                  >
                    Post Comment
                  </button>
                </div>
                <div className="space-y-4">

                  {commentPages.map((commentPage, index) =>
                    commentPage.content.map((comment) => (
                      <CommentComponent
                        key={comment.commentId}
                        comment={comment}
                        onUpdatedComment={(isDeleted) => fetchComments(isDeleted ? 0 : index, true)}
                      />
                    )
                    ))}
                </div>
                {commentPages.length > 0 && commentPages[0] &&
                  commentPages.length < commentPages[0].page?.totalPages && (
                    <div className="flex justify-center">
                      <button
                        onClick={() => fetchComments(commentPages.length)}
                        className="rounded-2xl py-1 px-3 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors ">
                        {<ChevronDown />}
                      </button>
                    </div>
                  )}
              </div>
            )}

            <hr className="mb-4 sm:mb-6 border-gray-400 dark:border-gray-700" />

            {/* Edit and Delete Buttons */}
            {isBlogOfCurrentUser && (

              <div className="mb-4 sm:mb-6 flex justify-between gap-4">
                <button
                  className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  onClick={() => navigate(`/edit-blog/${blog.blog.id}`)}
                >
                  Edit
                </button>
                <button
                  className="cursor-pointer bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                  onClick={handleDeleteBlog}
                >
                  Delete
                </button>
              </div>

            )}
          </div>

        )}
      </div>
    );
}

export default BlogReader;
