import { useEffect, useState } from "react";
import LoadingIndicator from "./components/LoadingIndicator";
import { useAuth } from "./contexts/AuthContext";
import { LogOut, UserCircle, ChevronDown } from "lucide-react";
import FollowerListDialog from "./components/FollowerListDialog";
import { getAllLinkedAuthProviders, getCurrentUser, unlinkOAuthProvider } from "./util/api-request/UserUtil";
import ChangeDefaultProvider from "./components/ChangeDefaultProvider";
import apiErrorHandle, { type APIError } from "./util/APIErrorHandle";
import UpdateProfile from "./components/UpdateProfile";
import ChangeEmail from "./components/ChangeEmail";
import ChangePassword from "./components/ChangePassword";
import DeleteAccount from "./components/DeleteAccount";
import type { UserInfo } from "./types/user/UserInfo";
import { AuthProvider, type AuthProviderResponse } from "./types/AuthProvider";
import SetPassword from "./components/SetPassword";
import toast from "react-hot-toast";

function Profile() {
  const [loading, setLoading] = useState(true);
  const [showDeleteAccountDialog, setShowDeleteAccountDialog] = useState(false);
  const { removeCreds, logout } = useAuth();
  const [displayFollowers, setDisplayFollowers] = useState(false);
  const [displayFollowings, setDisplayFollowings] = useState(false);
  const [showUpdateProfileDialog, setShowUpdateProfileDialog] = useState(false);
  const [showChangeEmailDialog, setShowChangeEmailDialog] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [showChangePasswordDialog, setShowChangePasswordDialog] = useState(false);
  const [showSetPasswordDialog, setShowSetPasswordDialog] = useState(false);
  const [linkedProviders, setLinkedProviders] = useState<AuthProviderResponse[]>([]);
  const allProviders = [AuthProvider.LOCAL, AuthProvider.GOOGLE];
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProviderDialog, setShowProviderDialog] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<AuthProviderResponse | null>(null);

  useEffect(() => {
    fetchUser();
    getAllLinkedAuthProviderInfo();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await getCurrentUser();
      setUserInfo(response);
    } catch (error) {
      apiErrorHandle(error as APIError, removeCreds);
    } finally {
      setLoading(false);
    }
  };

  const getAllLinkedAuthProviderInfo = async (): Promise<void> => {
    const resp = await getAllLinkedAuthProviders();
    setLinkedProviders(resp);
  }

  const isLinkedProvider = (providerName: AuthProvider): boolean => {
    return linkedProviders.some((provider) => provider.authProviderName === providerName);
  }

  const handleProviderAction = async (provider: AuthProvider) => {
    if (!userInfo) return;

    const isLinked = isLinkedProvider(provider);

    // Handle LOCAL provider separately
    if (provider === AuthProvider.LOCAL) {
      if (!isLinked) {
        // Link LOCAL = Set password
        setShowSetPasswordDialog(true);
      } else {
        // Unlink LOCAL
        try {
          const linkedProvider = linkedProviders.find(p => p.authProviderName === provider);
          if (linkedProvider) {
            const res = await unlinkOAuthProvider(linkedProvider.authModeId);
            toast.success(res);
            setLinkedProviders(prev => prev.filter(p => p.authProviderName !== provider));
          }
        } catch (error) {
          apiErrorHandle(error as APIError, removeCreds);
        }
      }
      return;
    }

    // Handle OAuth providers (GOOGLE, etc.)
    try {
      if (isLinked) {
        // Unlink
        const linkedProvider = linkedProviders.find(p => p.authProviderName === provider);
        if (linkedProvider) {
          const res = await unlinkOAuthProvider(linkedProvider.authModeId);
          toast.success(res);
          setLinkedProviders(prev => prev.filter(p => p.authProviderName !== provider));
        }
      } else {
        // Link via OAuth
        window.location.href = `/api/public/login/${provider.toLowerCase()}`;
      }
    } catch (error) {
      apiErrorHandle(error as APIError, removeCreds);
    }
  }

  const logoutClick = () => {
    logout();
  };

  if (loading)
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingIndicator size={40} />
      </div>
    );

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8 flex justify-center items-center min-h-screen">
      {userInfo && (
        <div className="w-full max-w-2xl bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-center gap-8 mb-4">
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
              <p className="text-gray-600 dark:text-gray-400 mb-1">
                @{userInfo.username}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {userInfo.email}
              </p>
            </div>
          </div>

          {/* Bio */}
          <div className="mb-4 text-sm text-gray-600 dark:text-gray-400 ">{userInfo.bio}</div>

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
              <p className="text-sm text-gray-500 dark:text-gray-400">Blogs</p>
            </div>
          </div>

          {/* Followers Dialog */}
          {displayFollowers && (
            <FollowerListDialog
              onClose={() => setDisplayFollowers(false)}
              userId={userInfo.id}
              isFollowers={true}
              isOpen={displayFollowers}
            />
          )}
          {displayFollowings && (
            <FollowerListDialog
              onClose={() => setDisplayFollowings(false)}
              userId={userInfo.id}
              isFollowers={false}
              isOpen={displayFollowings}
            />
          )}

          <UpdateProfile
            bio={userInfo.bio ?? ""}
            name={userInfo.name}
            photo={userInfo.photo ?? ""}
            isOpen={showUpdateProfileDialog}
            onClose={() => setShowUpdateProfileDialog(false)}
            onSuccess={() => {
              fetchUser();
            }}
          />

          <ChangeEmail
            isOpen={showChangeEmailDialog}
            onClose={() => setShowChangeEmailDialog(false)}
            onSuccess={() => {
              fetchUser();
            }}
          />

          <ChangePassword
            isOpen={showChangePasswordDialog}
            onClose={() => setShowChangePasswordDialog(false)}
          />

          <SetPassword 
            isOpen={showSetPasswordDialog} 
            onClose={() => setShowSetPasswordDialog(false)}
            onSuccess={() => {
              // fetchUser();
              getAllLinkedAuthProviderInfo();
            }}
          />

          <DeleteAccount
            isOpen={showDeleteAccountDialog}
            onClose={() => setShowDeleteAccountDialog(false)}
          />
          {/* Default Authentication */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-5 font-medium">
              <h3 className="text-gray-500 dark:text-gray-400 text-left uppercase font-medium">
                Default Authentication
              </h3>
              {/* Dropdown for linked providers */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                >
                  <span>{userInfo.defaultAuthProvider}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showDropdown && linkedProviders.length > 0 && (
                  <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10 overflow-hidden">
                    {linkedProviders.map((provider) => (
                      <button
                        key={provider.authModeId}
                        onClick={() => {
                          setSelectedProvider(provider);
                          setShowProviderDialog(true);
                          setShowDropdown(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-gray-700 dark:text-gray-300 ${provider.authProviderName === userInfo.defaultAuthProvider ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400' : ''
                          }`}
                      >
                        {provider.authProviderName}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {allProviders.map((provider) => (
              <div key={provider} className="font-medium flex justify-between items-center mb-4 text-gray-500 dark:text-gray-400 text-left">
                <div className="flex items-center gap-2">
                  <h3 className="text-gray-700 dark:text-gray-300">
                    {provider === AuthProvider.LOCAL ? 'Email & Password' : `Login with ${provider.charAt(0) + provider.slice(1).toLowerCase()}`}
                  </h3>
                  {isLinkedProvider(provider) && (
                    <span className="text-xs px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full">
                      Linked
                    </span>
                  )}
                </div>
                <button
                  onClick={() => handleProviderAction(provider)}
                  className={`border px-3 py-1.5 rounded-lg cursor-pointer transition-colors ${isLinkedProvider(provider)
                    ? 'border-red-300 text-red-500 hover:bg-red-500 hover:text-white hover:border-red-500'
                    : 'border-blue-300 text-blue-600 hover:bg-blue-600 hover:text-white hover:border-blue-600'
                    }`}
                >
                  {isLinkedProvider(provider) ? 'Unlink' : (provider === AuthProvider.LOCAL ? 'Set Password' : 'Link')}
                </button>
              </div>
            ))}
          </div>

          {/* Change Default Provider Dialog */}
          <ChangeDefaultProvider
            isOpen={showProviderDialog}
            onClose={() => {
              setShowProviderDialog(false);
              setSelectedProvider(null);
            }}
            selectedProvider={selectedProvider}
            onSuccess={(providerName) => {
              setUserInfo(prev => prev ? { ...prev, defaultAuthProvider: providerName as AuthProvider } : null);
            }}
          />
          {/* Settings Section */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
              Account Settings
            </h3>

            <button
              onClick={() => setShowUpdateProfileDialog(true)}
              className="w-full text-gray-700 dark:text-gray-300 text-left px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between group"
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

            {isLinkedProvider(AuthProvider.LOCAL) && (
              <button
                onClick={() => setShowChangePasswordDialog(true)}
                className="w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300 flex items-center justify-between group"
              >
                <span>Change Password</span>
                <span className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200">
                  →
                </span>
              </button>
            )}
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
