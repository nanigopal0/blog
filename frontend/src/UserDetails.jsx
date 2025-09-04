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
      apiErrorHandle(error, removeCreds);
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
      apiErrorHandle(error, removeCreds);
    } finally {
      if (blog) setLoading(false);
    }
  };

  const isFollowedByCurrentUser = async () => {
    try {
      const response = await isFollowing(userInfo.id, param.id);
      setIsFollow(response);
    } catch (error) {
      apiErrorHandle(error, removeCreds);
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
      apiErrorHandle(error, removeCreds);
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
      apiErrorHandle(error, removeCreds);
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Mobile: Stack vertically, Desktop: Side by side */}
        <div className="p-4 lg:p-8 flex flex-col lg:flex-row justify-center lg:justify-around gap-4 sm:gap-6 lg:gap-8">
          {/* User Profile Section */}
          <div
            className="w-full lg:w-auto max-w-sm mx-auto lg:mx-0 flex flex-col justify-center items-center 
                       border py-4 sm:py-6 px-4 sm:px-8 rounded-2xl 
                       dark:border-white/10 border-black/20 
                       dark:bg-white/5 bg-black/10 
                       h-fit"
          >
            {/* Profile Picture & Name */}
            <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 mb-6 sm:mb-8">
              {/* Profile Picture - Responsive sizes */}
              <div
                className="border-2 w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 
                           rounded-full border-gray-400 overflow-hidden 
                           dark:border-gray-600 p-1 sm:p-2 flex-shrink-0"
              >
                {user && user.photo ? (
                  <img
                    src={user.photo}
                    alt={`${user.name}'s profile`}
                    className="rounded-full w-full h-full object-cover object-top 
                           hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <UserCircle2 className="w-full h-full text-gray-400" />
                )}
              </div>

              {/* User Info */}
              <div className="flex flex-col gap-2 justify-center items-center sm:items-start">
                <h2 className="font-bold text-xl sm:text-2xl lg:text-3xl text-center sm:text-left">
                  {user?.name}
                </h2>
                <h5 className="text-blue-500 cursor-pointer hover:underline text-sm sm:text-base">
                  @{user?.username}
                </h5>
              </div>
            </div>

            <button
              hidden={userInfo.id == param.id}
              className="mb-4 w-full px-4 sm:px-6 py-2  bg-blue-500 text-white 
                       cursor-pointer font-medium rounded-full border-none 
                       hover:bg-blue-600 transition-colors "
              onClick={isFollow ? handleUnfollowClick : handleFollowClick}
            >
              {isFollow ? "Unfollow" : "Follow"}
            </button>

            {/* Following/Followers - Stack on mobile, side by side on larger screens */}
            <div className="gap-2">
              <button
                onClick={() => setDisplayFollowers(true)}
                className="p-2 text-blue-500 dark:text-blue-400 cursor-pointer place-self-start
                               font-medium rounded-full border-none text-sm
                               hover:dark:bg-blue-500/30 hover:bg-blue-200 transition-colors"
              >
                {user?.totalFollowers || 0} followers
              </button>
              <button
                onClick={() => setDisplayFollowings(true)}
                className="p-2 text-blue-500 dark:text-blue-400 cursor-pointer 
                               font-medium rounded-full border-none text-sm
                               hover:dark:bg-blue-500/30 hover:bg-blue-200 transition-colors"
              >
                {user?.totalFollowings || 0} followings
              </button>
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

            {/* Blogs Count */}
            <p
              className="w-full py-2 dark:text-gray-300 text-gray-600
                      font-medium text-sm sm:text-base"
            >
              Total blogs {user?.totalBlogs || 0}
            </p>
          </div>

          {/* Blogs Section */}
          <div
            className="flex-1 min-h-96 border rounded-2xl overflow-hidden 
                       dark:border-white/10 border-black/20 
                       dark:bg-white/5 bg-black/10"
          >
            {/* Header */}
            <div className="p-4 sm:p-6 border-b border-gray-300 dark:border-gray-600">
              <h2 className="text-xl sm:text-2xl lg:text-3xl text-center font-bold">
                Blogs
              </h2>
            </div>

            {/* Content Area with Scroll */}
            <div className="p-2 sm:p-4 lg:p-6 h-[calc(100vh-300px)] sm:h-[calc(100vh-320px)] lg:h-[calc(100vh-200px)] overflow-y-auto">
              {/* Blog Grid - Responsive columns */}
              <div
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 
                           gap-4 sm:gap-4 lg:gap-6 justify-items-center "
              >
                {blog?.content?.map((blogItem, index) => (
                  <MediaCard key={blogItem.id || index} blog={blogItem} />
                ))}
              </div>

              {/* No Blogs Message */}
              {blog?.content?.length === 0 && (
                <div className="flex h-64 sm:h-96 justify-center items-center">
                  <div className="text-center">
                    <div className="text-4xl sm:text-6xl mb-4 opacity-20">
                      📝
                    </div>
                    <h3 className="text-base sm:text-lg lg:text-xl text-gray-500 dark:text-gray-400">
                      No blogs posted yet
                    </h3>
                    <p className="text-sm sm:text-base text-gray-400 dark:text-gray-500 mt-2">
                      This user hasn't shared any stories yet.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Pagination - Fixed at bottom */}
            {blog?.content?.length > 0 && (
              <div className=" m-4 place-self-center">
                <PaginationRounded
                  isLastPage={blog.last}
                  onChangePage={fetchUserBlogs}
                  pageNumber={blog.number + 1 || 0}
                  pageSize={blog.size || ConstBlogPageSize[0]}
                  totalElements={blog.totalElements}
                  totalPages={blog.totalPages}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
}
