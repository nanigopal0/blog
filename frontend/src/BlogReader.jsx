import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import LoadingIndicator from "./components/LoadingIndicator";
import { AuthContext } from "./contexts/AuthContext";
import Comment from "./components/Comment";

import FormatDate from "./util/FormatDate";
import {
  Heart,
  MessageCircle,
  X,
  User,
} from "lucide-react";
import TipTapRenderer from "./util/TipTapRenderer";
import axios from "axios";
import apiErrorHandle from "./util/APIErrorHandle";
import { deleteBlogById, getBlogById } from "./util/BlogUtil";
import toast from "react-hot-toast";

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

  useEffect(() => {
    fetchBlog();
  }, []);

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const response = await getBlogById(param.id);
      setVariables(response);
    } catch (error) {
      apiErrorHandle(error, removeCreds);
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
      apiErrorHandle(error, removeCreds);
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
      apiErrorHandle(error, removeCreds);
    }finally{
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
      apiErrorHandle(error, removeCreds);
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
      <div className="p-4 sm:p-6 md:p-10 flex justify-center items-center min-h-screen ">
        {blog && (
          <div className="w-full sm:w-11/12 md:w-4/5 lg:w-3/4 p-4 sm:p-6 md:p-8 rounded-lg">
            {/* Blog Cover Image */}
            <div className="flex justify-center mb-4 sm:mb-6 md:mb-8 overflow-hidden rounded-2xl">
              <img
                src={blog.coverImage}
                alt="cover"
                className="w-full max-h-96 object-contain rounded-2xl"
              />
            </div>

            {/* Blog Author Info */}
            <div className="flex items-center mb-4 sm:mb-6">
              <div
                onClick={handleUserClick}
                className="w-10 h-10 sm:w-14 sm:h-14 mr-4 rounded-full overflow-hidden border cursor-pointer border-gray-300 flex items-center justify-center "
              >
                {blog.userPhoto ? (
                  <img
                    src={blog.userPhoto}
                    alt={blog.userFullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-full h-full sm:w-7 sm:h-7 text-gray-500" />
                )}
              </div>
              <div>
                <h3
                  className="font-bold cursor-pointer text-base sm:text-xl "
                  onClick={handleUserClick}
                >
                  {blog.userFullName}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                  {FormatDate(blog.time)}
                </p>
              </div>
            </div>

            {/* Blog Title */}
            <h1 className="font-bold mb-2 sm:mb-4 text-left text-2xl sm:text-4xl ">
              {blog.title}
            </h1>

            {/* Blog Category */}
            <div className="mb-4 sm:mb-6">
              <span className="inline-block bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-bold">
                {blog.category?.category || "Uncategorized"}
              </span>
            </div>

            {/* Blog Content */}
            <div
              className="text-justify mb-4 sm:mb-8 text-sm sm:text-base  prose prose-sm sm:prose max-w-none "
              // dangerouslySetInnerHTML={{ __html: blog.content }}
            >
              {blog && <TipTapRenderer content={blog.content} />}
            </div>

            <hr className="mb-4 sm:mb-6 border-gray-600" />

            {/* Icons Section */}
            <div className="flex items-center justify-start gap-2 sm:gap-4 mb-4 sm:mb-6">
              {/* Heart Icon with Like Count */}
              <div
                className="flex items-center border border-gray-600 dark:border-gray-400 rounded-full px-2 py-1 sm:px-3 sm:py-2 gap-2 
            cursor-pointer hover:bg-gray-50 hover:dark:bg-gray-800 transition-colors"
              >
                <button
                  onClick={handleReaction}
                  className="p-0 focus:outline-none"
                >
                  <Heart
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      isHeartClicked
                        ? "text-red-500 fill-red-500"
                        : "text-gray-700 dark:text-gray-300"
                    } hover:text-red-500 transition-colors`}
                  />
                </button>
                <span className="font-bold text-sm sm:text-base text-gray-700 dark:text-gray-300">
                  {totalLikes || 0}
                </span>
              </div>

              {/* Comment Icon with Comment Count */}
              <div
                className="flex items-center border border-gray-600 dark:border-gray-400 rounded-full px-2 py-1 sm:px-3 sm:py-2 gap-2 
              cursor-pointer hover:bg-gray-50 hover:dark:bg-gray-800 transition-colors"
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
        )}
      </div>
    );
}

export default BlogReader;
