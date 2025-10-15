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
      apiErrorHandle(error, removeCreds);
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
      <div className="p-5 flex justify-center items-center min-h-screen backdrop-blur-2xl ">
        {userInfo && (
          <div className="w-full max-w-2xl p-6 border border-black/30 dark:border-white/20  rounded-lg shadow-xl">
            <div className="mb-6">
              {/* Profile Header */}
              <div className="flex flex-col sm:flex-row items-center justify-around gap-6 text-center mb-6">
                {/* Avatar */}
                <div className="w-32 h-32 md:w-40 md:h-40 rounded-full flex-shrink-0 overflow-hidden ">
                  {userInfo.photo ? (
                    <img
                      src={userInfo.photo}
                      alt={userInfo.name}
                      className="w-full h-full rounded-full object-cover scale-125 object-top border"
                    />
                  ) : (
                    <UserCircle
                      size={"128px md:160px"}
                      className=" text-gray-400"
                    />
                  )}
                </div>

                {/* User Info */}
                <div className="flex flex-col text-left">
                  <h1 className="text-2xl md:text-3xl font-bold mb-2">
                    {userInfo.name}
                  </h1>
                  <p className="text-sm font-medium mb-1">
                    Email:{" "}
                    <span className="font-normal font-mono">
                      {userInfo.email}
                    </span>
                  </p>
                  <p className="text-sm font-medium mb-1">
                    Username:{" "}
                    <span className="font-normal font-mono">
                      @{userInfo.username}
                    </span>
                  </p>
                  <p className="text-sm font-medium">
                    Role:{" "}
                    <span className="font-normal font-mono">
                      {userInfo.role}
                    </span>
                  </p>
                </div>
              </div>

              {/* Followers/Following */}
              <div className="flex gap-4 mb-4 w-3/5">
                <button
                  onClick={() => setDisplayFollowers(true)}
                  className="p-2 text-blue-500 dark:text-blue-400 cursor-pointer 
                               font-medium rounded-full border-none text-sm
                               hover:dark:bg-blue-500/30 hover:bg-blue-200 transition-colors"
                >
                  {userInfo.totalFollowers || 0} followers
                </button>
                <button
                  onClick={() => setDisplayFollowings(true)}
                  className="p-2 text-blue-500 dark:text-blue-400 cursor-pointer 
                               font-medium rounded-full border-none text-sm
                               hover:dark:bg-blue-500/30 hover:bg-blue-200 transition-colors"
                >
                  {userInfo.totalFollowings || 0} Following
                </button>
              </div>
              <h4 className="text-sm">
                Total Blogs: {userInfo.totalBlogs || 0}
              </h4>
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
              email={userInfo.email}
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
            {/* Divider */}
            <div className="border-t border-gray-400 dark:border-gray-700 my-4" />

            <div className="flex flex-col items-start gap-4">
              <button
                onClick={() => setShowUpdateProfileDialog(true)}
                className="hover:underline cursor-pointer text-gray-700 dark:text-gray-300"
              >
                Update Profile
              </button>
              <button
                onClick={() => setShowChangeEmailDialog(true)}
                className="hover:underline cursor-pointer  text-gray-700 dark:text-gray-300"
              >
                Update Email
              </button>
              <button
                onClick={() => setShowChangePasswordDialog(true)}
                className="hover:underline cursor-pointer  text-gray-700 dark:text-gray-300"
              >
                Change Password
              </button>
              <button
                onClick={() => setShowDeleteAccountDialog(true)}
                className="cursor-pointer hover:underline text-red-400 font-medium "
              >
                Delete Account
              </button>

              <button
                onClick={logoutClick}
                className="mx-auto bg-amber-600 flex gap-2 py-2 px-4 rounded-full text-white font-medium cursor-pointer hover:underline"
              >
                <LogOut size={24} />
                Log out
              </button>
            </div>
          </div>
        )}
      </div>
    );
}

export default Profile;
