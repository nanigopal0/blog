import { useContext, useEffect, useState } from "react";

import LoadingIndicator from "./components/LoadingIndicator";

import { AuthContext } from "./contexts/AuthContext";
import { LogOut, UserCircle } from "lucide-react";
import FollowerListDialog from "./components/FollowerListDialog";
import { deleteUser, getCurrentUser } from "./util/UserUtil";
import apiErrorHandle from "./util/APIErrorHandle";
import Dialog from "./components/Dialog";
import UpdateProfile from "./components/UpdateProfile";
import ChangeEmail from "./components/ChangeEmail";
import ChangePassword from "./components/ChangePassword";
import DeleteAccount from "./components/DeleteAccount";

function Profile() {
  const [loading, setLoading] = useState(true);
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false);
  const { userInfo, removeCreds, logout, updateUserInfo } =
    useContext(AuthContext);
  const [displayFollowers, setDisplayFollowers] = useState(false);
  const [displayFollowings, setDisplayFollowings] = useState(false);
  const [showUpdateProfileDialog, setShowUpdateProfileDialog] = useState(false);
  const [showChangeEmailDialog, setShowChangeEmailDialog] = useState(false);
  const [showChangePasswordDialog, setShowChangePasswordDialog] =
    useState(false);

  const fetchUser = async () => {
    try {
      const response = await getCurrentUser();
      updateUserInfo(response);
    } catch (error) {
      const retry = await apiErrorHandle(error, removeCreds);
      if (retry) fetchUser();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logoutClick = () => {
    logout();
  };

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingIndicator size={40} />
      </div>
    );
  else
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8 flex justify-center items-center min-h-screen">
        {userInfo && (
          <div className="w-full max-w-2xl bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row items-center gap-8 mb-8">
              {/* Avatar */}
              <div className="w-32 h-32 rounded-full flex-shrink-0 overflow-hidden ring-4 ring-blue-100 dark:ring-blue-900">
                {userInfo.photo ? (
                  <img
                    src={userInfo.photo}
                    alt={userInfo.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <UserCircle className="w-20 h-20 text-gray-400" />
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex flex-col text-center sm:text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {userInfo.name}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mb-1">
                  @{userInfo.username}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {userInfo.email}
                </p>
              </div>
            </div>
            {/* Bio */}
            <div className="mb-4">{userInfo.bio}</div>
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8 p-4 bg-gray-200 dark:bg-gray-700/50 rounded-xl">
              <button
                onClick={() => setDisplayFollowers(true)}
                className="text-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
              >
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userInfo.totalFollowers || 0}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Followers
                </p>
              </button>
              <button
                onClick={() => setDisplayFollowings(true)}
                className="text-center p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors cursor-pointer"
              >
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userInfo.totalFollowings || 0}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Following
                </p>
              </button>
              <div className="text-center p-3">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {userInfo.totalBlogs || 0}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Blogs
                </p>
              </div>
            </div>

            {/* Followers Dialog */}
            {displayFollowers && (
              <FollowerListDialog
                onClose={() => setDisplayFollowers(false)}
                userId={userInfo.id}
                isFollowers={true}
                open={displayFollowers}
              />
            )}
            {displayFollowings && (
              <FollowerListDialog
                onClose={() => setDisplayFollowings(false)}
                userId={userInfo.id}
                isFollowers={false}
                open={displayFollowings}
              />
            )}

            <UpdateProfile
              bio={userInfo.bio}
              name={userInfo.name}
              photo={userInfo.photo}
              isOpen={showUpdateProfileDialog}
              onClose={() => setShowUpdateProfileDialog(false)}
            />

            <ChangeEmail
              isOpen={showChangeEmailDialog}
              onClose={() => setShowChangeEmailDialog(false)}
            />

            <ChangePassword
              isOpen={showChangePasswordDialog}
              onClose={() => setShowChangePasswordDialog(false)}
            />

            <DeleteAccount
              isOpen={showDeleteAccountDialog}
              onClose={() => setShowDeleteAccountDialog(false)}
            />

            {/* Settings Section */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                Account Settings
              </h3>

              <button
                onClick={() => setShowUpdateProfileDialog(true)}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 flex items-center justify-between group"
              >
                <span>Update Profile</span>
                <span className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200">
                  →
                </span>
              </button>

              <button
                onClick={() => setShowChangeEmailDialog(true)}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 flex items-center justify-between group"
              >
                <span>Update Email</span>
                <span className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200">
                  →
                </span>
              </button>

              <button
                onClick={() => setShowChangePasswordDialog(true)}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 flex items-center justify-between group"
              >
                <span>Change Password</span>
                <span className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200">
                  →
                </span>
              </button>

              <button
                onClick={() => setShowDeleteAccountDialog(true)}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-500 flex items-center justify-between group"
              >
                <span>Delete Account</span>
                <span className="text-red-400 group-hover:text-red-600">→</span>
              </button>
            </div>

            {/* Logout Button */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={logoutClick}
                className="w-full bg-gray-900 dark:bg-white dark:text-gray-900 flex gap-2 items-center justify-center py-3 px-4 rounded-xl text-white font-medium cursor-pointer hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
              >
                <LogOut size={20} />
                Log out
              </button>
            </div>
          </div>
        )}
      </div>
    );
}

export default Profile;
