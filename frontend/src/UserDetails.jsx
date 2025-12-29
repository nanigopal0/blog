import { UserCircle2 } from "lucide-react";
import MediaCard from "./components/MediaCard";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBlogsByUser } from "./util/BlogUtil";
import { ConstBlogPageSize } from "./util/ConstBlogPageSize";
import { getUserById, isFollowing } from "./util/UserUtil";
import LoadingIndicator from "./components/LoadingIndicator";
import PaginationRounded from "./components/PaginationRounded";
import apiErrorHandle from "./util/APIErrorHandle";
import { AuthContext } from "./contexts/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import FollowerListDialog from "./components/FollowerListDialog";

export default function UserDetails() {
  const param = useParams();
  const [blog, setBlog] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { removeCreds, userInfo } = useContext(AuthContext);
  const [isFollow, setIsFollow] = useState(false);
  const [displayFollowers, setDisplayFollowers] = useState(false);
  const [displayFollowings, setDisplayFollowings] = useState(false);

  useEffect(() => {
    fetchUserBlogs(0, ConstBlogPageSize[0]);
    fetchUser();
    isFollowedByCurrentUser();
  }, [param.id]);

  const fetchUserBlogs = async (pageNumber, pageSize) => {
    setLoading(true);
    try {
      const fetchedBlogs = await getBlogsByUser(param.id, pageNumber, pageSize);
      setBlog(fetchedBlogs || []);
    } catch (error) {
      const retry = await apiErrorHandle(error, removeCreds);
      if (retry) fetchUserBlogs(0, ConstBlogPageSize[0]);
    } finally {
      if (user) setLoading(false);
    }
  };

  const fetchUser = async () => {
    setLoading(true);
    try {
      const fetchedUser = await getUserById(param.id);
      setUser(fetchedUser);
    } catch (error) {
      const retry = await apiErrorHandle(error, removeCreds);
      if (retry) fetchUser();
    } finally {
      if (blog) setLoading(false);
    }
  };

  const isFollowedByCurrentUser = async () => {
    try {
      const response = await isFollowing(userInfo.id, param.id);
      setIsFollow(response);
    } catch (error) {
      const retry = await apiErrorHandle(error, removeCreds);
      if (retry) isFollowedByCurrentUser();
    }
  };

  const handleFollowClick = async () => {
    const loadingId = toast.loading("Following...");
    try {
      await axios.post(`/api/follower/follow?userId=${param.id}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success("Followed successfully");
      fetchUser();
      setIsFollow(true);
    } catch (error) {
      const retry = await apiErrorHandle(error, removeCreds);
      if (retry) handleFollowClick();
    } finally {
      toast.dismiss(loadingId);
    }
  };

  const handleUnfollowClick = async () => {
    const loadingId = toast.loading("Unfollowing...");
    try {
      await axios.delete(`/api/follower/unfollow?followedId=${param.id}`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      toast.success("Unfollowed successfully");
      fetchUser();
      setIsFollow(false);
    } catch (error) {
      const retry = await apiErrorHandle(error, removeCreds);
      if (retry) handleUnfollowClick();
    } finally {
      toast.dismiss(loadingId);
    }
  };

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingIndicator />
      </div>
    );
  else
    return (
      <div className="min-h-screen">
        {/* Mobile: Stack vertically, Desktop: Side by side */}
        <div className="px-4 sm:px-6 lg:px-8 py-8 flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          {/* User Profile Section */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 sticky top-24">
              {/* Profile Picture & Name */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden ring-4 ring-blue-100 dark:ring-blue-900">
                  {user && user.photo ? (
                    <img
                      src={user.photo}
                      alt={`${user.name}'s profile`}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                      <UserCircle2 className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
                <h2 className="font-bold text-xl text-gray-900 dark:text-white">
                  {user?.name}
                </h2>
                <p className="text-blue-500 text-sm">@{user?.username}</p>
              </div>

              {/* Follow Button */}
              {userInfo.id != param.id && (
                <button
                  className={`w-full mb-6 px-4 py-2.5 font-medium rounded-xl transition-colors cursor-pointer ${
                    isFollow
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                  onClick={isFollow ? handleUnfollowClick : handleFollowClick}
                >
                  {isFollow ? "Following" : "Follow"}
                </button>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl mb-4">
                <button
                  onClick={() => setDisplayFollowers(true)}
                  className="text-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                >
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{user?.totalFollowers || 0}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Followers</p>
                </button>
                <button
                  onClick={() => setDisplayFollowings(true)}
                  className="text-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                >
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{user?.totalFollowings || 0}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Following</p>
                </button>
                <div className="text-center p-2">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{user?.totalBlogs || 0}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Blogs</p>
                </div>
              </div>

              {displayFollowers && (
                <FollowerListDialog
                  onClose={() => setDisplayFollowers(false)}
                  userId={param.id}
                  isFollowers={true}
                  open={displayFollowers}
                />
              )}
              {displayFollowings && (
                <FollowerListDialog
                  onClose={() => setDisplayFollowings(false)}
                  userId={param.id}
                  isFollowers={false}
                  open={displayFollowings}
                />
              )}
            </div>
          </div>

          {/* Blogs Section */}
          <div className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Blogs by {user?.name}
              </h2>
            </div>

            {/* Blog Grid */}
            {blog?.content?.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {blog.content.map((blogItem, index) => (
                    <MediaCard key={blogItem.id || index} blog={blogItem} />
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-8 flex justify-center">
                  <PaginationRounded
                    isLastPage={blog.last}
                    onChangePage={fetchUserBlogs}
                    pageNumber={blog.number + 1 || 0}
                    pageSize={blog.size || ConstBlogPageSize[0]}
                    totalElements={blog.totalElements}
                    totalPages={blog.totalPages}
                  />
                </div>
              </>
            ) : (
              <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                <div className="text-6xl mb-4 opacity-30">📝</div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  No blogs posted yet
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  This user hasn't shared any stories yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
}
