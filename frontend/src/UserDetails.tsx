import { UserCircle2 } from "lucide-react";
import MediaCard from "./components/MediaCard";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getBlogsByUser } from "./util/api-request/BlogUtil";
import { ConstBlogPageSize } from "./util/ConstBlogPageSize";
import { getUserById } from "./util/api-request/UserUtil";
import LoadingIndicator from "./components/LoadingIndicator";
import PaginationRounded from "./components/PaginationRounded";
import apiErrorHandle, { type APIError } from "./util/APIErrorHandle";
import { useAuth } from "./contexts/AuthContext";
import toast from "react-hot-toast";
import FollowerListDialog from "./components/FollowerListDialog";
import type { PaginatedResponse } from "./types/Page";
import type { BlogSummary } from "./types/blog/BlogInfo";
import type { BasicUserInfo } from "./types/user/BasicUserInfo";
import { follow, getFollowerInfo, unfollow } from "./util/api-request/FollowUtil";
import type { FollowerInfo } from "./types/user/Follow";

export default function UserDetails() {
  const param = useParams();
  const [blogPage, setBlogPage] =
    useState<PaginatedResponse<BlogSummary> | null>(null);
  const [user, setUser] = useState<BasicUserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const { removeCreds, basicUserInfo } = useAuth();
  const [isFollow, setIsFollow] = useState(false);
  const [followerInfo, setFollowerInfo] = useState<FollowerInfo | null>(null);
  const [displayFollowers, setDisplayFollowers] = useState(false);
  const [displayFollowings, setDisplayFollowings] = useState(false);
  const userId = Number(param["id"]);
  const defaultPageSize = ConstBlogPageSize[0] ?? 10;

  const fetchUserBlogs = useCallback(
    async (pageNumber: number, pageSize: number) => {
      try {
        const fetchedBlogs = await getBlogsByUser(userId, pageNumber, pageSize);
        setBlogPage(fetchedBlogs);
      } catch (error) {
        apiErrorHandle(error as APIError, removeCreds);
      }
    },
    [userId, removeCreds],
  );

  const fetchUser = useCallback(async () => {
    try {
      const fetchedUser = await getUserById(userId);
      setUser(fetchedUser);
    } catch (error) {
      apiErrorHandle(error as APIError, removeCreds);
    }
  }, [userId, removeCreds]);

  const fetchFollowerInfo = useCallback(async () => {
    if (!basicUserInfo) return;
    try {
      const response = await getFollowerInfo(userId);
      setFollowerInfo(response);
      setIsFollow(response.followed);
    } catch (error) {
      apiErrorHandle(error as APIError, removeCreds);
    }
  }, [basicUserInfo, removeCreds]);

  useEffect(() => {
    if (!userId || !basicUserInfo) return;

    initializePage();
  }, [
    userId,
    basicUserInfo,
    fetchUserBlogs,
    fetchUser,
    fetchFollowerInfo,
    defaultPageSize,
  ]);

  const initializePage = async () => {
    setLoading(true);
    await Promise.all([
      fetchUserBlogs(
        blogPage?.page?.number ?? 0,
        blogPage?.page?.size ?? defaultPageSize,
      ),
      fetchUser(),
      fetchFollowerInfo(),
    ]);
    setLoading(false);
  };

  const handleFollowClick = useCallback(async () => {
    const loadingId = toast.loading("Following...");
    try {
      const res = await follow(userId);
      setIsFollow(res.followed);
      toast.success("Followed successfully");
      // Update follower count
      setFollowerInfo((prev) =>
        prev
          ? {
            ...prev,
            totalFollowers: res.totalFollowers,
          }
          : null,
      );
    } catch (error) {
      apiErrorHandle(error as APIError, removeCreds);
    } finally {
      toast.dismiss(loadingId);
    }
  }, [userId, removeCreds]);

  const handleUnfollowClick = useCallback(async () => {
    const loadingId = toast.loading("Unfollowing...");
    try {
      const res = await unfollow(userId);
      setIsFollow(res.followed);
      toast.success("Unfollowed successfully");
      // Update follower count
      setFollowerInfo((prev) =>
        prev
          ? {
            ...prev,
            totalFollowers: res.totalFollowers,
          }
          : null,
      );
    } catch (error) {
      apiErrorHandle(error as APIError, removeCreds);
    } finally {
      toast.dismiss(loadingId);
    }
  }, [userId, removeCreds]);

  if (!userId) return <div>User ID is missing</div>;
  if (!basicUserInfo) return;

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
              {basicUserInfo.id !== userId && (
                <button
                  className={`w-full mb-6 px-4 py-2.5 font-medium rounded-xl transition-colors cursor-pointer ${isFollow
                      ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  onClick={isFollow ? handleUnfollowClick : handleFollowClick}
                >
                  {isFollow ? "Unfollow" : "Follow"}
                </button>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl mb-4">
                <button
                  onClick={() => setDisplayFollowers(true)}
                  className="text-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                >
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {followerInfo?.totalFollowers || 0}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Followers
                  </p>
                </button>
                <button
                  onClick={() => setDisplayFollowings(true)}
                  className="text-center p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                >
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {followerInfo?.totalFollowings || 0}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Following
                  </p>
                </button>
                <div className="text-center p-2">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {blogPage?.page?.totalElements ?? 0}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Blogs
                  </p>
                </div>
              </div>

              {displayFollowers && (
                <FollowerListDialog
                  onClose={() => setDisplayFollowers(false)}
                  userId={userId}
                  isFollowers={true}
                  isOpen={displayFollowers}
                />
              )}
              {displayFollowings && (
                <FollowerListDialog
                  onClose={() => setDisplayFollowings(false)}
                  userId={userId}
                  isFollowers={false}
                  isOpen={displayFollowings}
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
            {blogPage?.content && blogPage.content.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {blogPage.content.map((blogItem, index) => (
                    <MediaCard key={blogItem.blog.id || index} {...blogItem} />
                  ))}
                </div>

                {/* Pagination */}
                <div className="mt-8 flex justify-center">
                  <PaginationRounded
                    onChangePage={fetchUserBlogs}
                    number={(blogPage?.page?.number ?? 0) + 1}
                    size={blogPage?.page?.size ?? defaultPageSize}
                    totalElements={blogPage?.page?.totalElements ?? 0}
                    totalPages={blogPage?.page?.totalPages ?? 0}
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
