import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import LoadingIndicator from "./components/LoadingIndicator";
import { AuthContext } from "./contexts/AuthContext";
import Comment from "./components/Comment";

import FormatDate from "./util/FormatDate";
import { Heart, MessageCircle, X, User } from "lucide-react";
import axios from "axios";
import apiErrorHandle from "./util/APIErrorHandle";
import { deleteBlogById, getBlogById } from "./util/BlogUtil";
import toast from "react-hot-toast";
import { EditorContent, useEditor } from "@tiptap/react";
import { tiptapEditorExtension } from "./components/tiptap/TiptapEditorExtension";

function BlogReader() {
  const param = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo, removeCreds } = useContext(AuthContext);
  const [isBlogOfCurrentUser, setIsBlogOfCurrentUser] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);
  const [isHeartClicked, setIsHeartClicked] = useState(false);
  const [isCommentSectionVisible, setIsCommentSectionVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const editor = useEditor({
    editable: false,
    extensions: tiptapEditorExtension,
    content: "Loading...",
  });

  useEffect(() => {
    fetchBlog();
  }, []);

  // Set editor content when both editor and blog data are ready
  useEffect(() => {
    if (editor && blog?.content) {
      editor.commands.setContent(JSON.parse(blog.content));
    }
  }, [editor, blog]);

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const response = await getBlogById(param.id);
      setVariables(response);
    } catch (error) {
      const retry = await apiErrorHandle(error, removeCreds);
      if (retry) fetchBlog();
    } finally {
      setLoading(false);
    }
  };

  const setVariables = (resultData) => {
    setBlog(resultData);
    setComments(resultData.comments || []);
    setTotalLikes(resultData?.reaction?.totalLikes || 0);
    setIsBlogOfCurrentUser(userInfo && resultData.userId === userInfo.id);
    setIsHeartClicked(
      resultData.reaction.reactionId && resultData?.reaction?.reactionId != 0
    );
  };

  const handleReaction = async () => {
    try {
      const response = !isHeartClicked
        ? await likeCall()
        : await dislikeCall(blog?.reaction?.reactionId); //reaction id

      const reaction = response.data;

      if (response.status == 200) {
        const updatedBlog = {
          ...blog,
          reaction: {
            reactionId: reaction?.reactionId,
            totalLikes: reaction?.totalLikes,
          },
        };
        setTotalLikes(reaction.totalLikes);
        setIsHeartClicked(reaction.reactionId && reaction.reactionId != 0);
        setBlog(updatedBlog);
      }
    } catch (error) {
      const retry = await apiErrorHandle(error, removeCreds);
      if (retry) handleReaction();
    }
  };

  const likeCall = async () => {
    const data = {
      userId: userInfo.id,
      blogId: blog.id,
    };
    return await axios.post(`/api/blog/reaction/like`, data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const dislikeCall = async (reactionId) => {
    return await axios.delete(
      `/api/blog/reaction/dislike?blogReactionId=${reactionId}`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };

  const handlePostComment = async () => {
    if (newComment.trim() === "") return;
    const loadingId = toast.loading("Posting comment...");
    try {
      const newCommentData = {
        userId: userInfo.id,
        blogId: blog.id,
        userPhoto: userInfo.photo,
        userFullName: userInfo.name,
        comment: newComment,
      };

      const response = await axios.post(`/api/comment`, newCommentData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status == 201) {
        setComments([response.data, ...comments]);
        setNewComment("");
        toast.success("Comment posted successfully");
      }
    } catch (error) {
      const retry = await apiErrorHandle(error, removeCreds);
      if (retry) handlePostComment();
    } finally {
      toast.dismiss(loadingId);
    }
  };

  const handleDeleteBlog = async () => {
    const loadingId = toast.loading("Deleting blog...");
    try {
      const response = await deleteBlogById(blog.id);
      toast.success(response || "Blog deleted successfully");
      navigate("/home");
    } catch (error) {
      const retry = await apiErrorHandle(error, removeCreds);
      if (retry) handleDeleteBlog();
    } finally {
      toast.dismiss(loadingId);
    }
  };

  const handleUserClick = () => {
    navigate(`/user/${blog.userId}`);
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
                src={blog.coverImage}
                alt="cover"
                className="w-full max-h-[500px] object-cover rounded-none sm:rounded-2xl"
              />
            </div>

            <div className="px-4 sm:px-6 md:px-8">
              {/* Blog Category */}
              <div className="mb-3">
                <span className="inline-block bg-teal-100 dark:bg-teal-900 text-teal-700 dark:text-teal-300 px-3 py-1 rounded-full text-sm font-medium">
                  {blog.category?.category || "Uncategorized"}
                </span>
              </div>

              {/* Blog Title */}
              <h1 className="font-bold mb-4 sm:mb-6 text-left text-3xl sm:text-4xl md:text-5xl leading-tight">
                {blog.title}
              </h1>

              {/* Blog Author Info & Date - Inline */}
              <div className="flex items-center mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-gray-200 dark:border-gray-700">
                <div
                  onClick={handleUserClick}
                  className="w-12 h-12 mr-4 rounded-full overflow-hidden border-2 cursor-pointer border-gray-200 dark:border-gray-600 flex items-center justify-center flex-shrink-0"
                >
                  {blog.userPhoto ? (
                    <img
                      src={blog.userPhoto}
                      alt={blog.userFullName}
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
                    {blog.userFullName}
                  </h3>
                  <span className="hidden sm:inline text-gray-400">•</span>
                  <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                    {FormatDate(blog.time)}
                  </p>
                </div>
              </div>

              {/* Blog Content */}
              <div className="mb-6 sm:mb-8 text-base sm:text-lg leading-relaxed prose prose-lg max-w-none dark:prose-invert">
                {blog && (
                  <EditorContent
                    editor={editor}
                    className="tiptap p-0 text-slate-800 dark:text-slate-100"
                  />
                )}
              </div>

              <hr className="mb-4 sm:mb-6 border-gray-200 dark:border-gray-700" />

              {/* Icons Section */}
              <div className="flex items-center justify-start gap-2 sm:gap-4 mb-4 sm:mb-6">
              {/* Heart Icon with Like Count */}
              <div
                onClick={handleReaction}
                className="flex items-center rounded-full px-2 py-1 sm:px-3 sm:py-2 gap-2 
             transition-colors cursor-pointer hover:bg-slate-300 hover:dark:bg-gray-600"
              >
                <Heart
                  className={`w-4 h-4 sm:w-5 sm:h-5 ${
                    isHeartClicked
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
                onClick={() =>
                  setIsCommentSectionVisible(!isCommentSectionVisible)
                }
              >
                <button className="p-0 focus:outline-none">
                  {isCommentSectionVisible ? (
                    <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
                  ) : (
                    <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700 dark:text-gray-300" />
                  )}
                </button>
                <span className="font-bold text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  {comments.length}
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
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical min-h-20"
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
                  {comments.map((comment, index) => (
                    <Comment
                      key={comment.id || index}
                      photo={comment.userPhoto}
                      name={comment.userFullName}
                      time={comment.commentedAt}
                      text={comment.comment}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Edit and Delete Buttons */}
            {isBlogOfCurrentUser && (
              <div className="mt-8">
                <hr className="mb-4 sm:mb-6 border-gray-600" />
                <div className="flex justify-between mt-4 sm:mt-6 gap-4">
                  <button
                    className="cursor-pointer bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    onClick={() => navigate(`/edit-blog/${blog.id}`)}
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
              </div>
            )}
            </div>
          </div>
        )}
      </div>
    );
}

export default BlogReader;
