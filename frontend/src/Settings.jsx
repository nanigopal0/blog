import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import LoadingIndicator from "./components/LoadingIndicator";

import { uploadImage } from "./util/UploadImageCloudinary";
import Cookies from "js-cookie";
import { AuthContext } from "./contexts/AuthContext";
import axios from "axios";
import apiErrorHandle from "./util/APIErrorHandle";

function Settings() {
  const { userInfo, logout, removeCreds } = useContext(AuthContext);
  const [changePasswordButtonClicked, setChangePasswordButtonClicked] =
    useState(false);
  const [updateProfileButtonClicked, setUpdateProfileButtonClicked] =
    useState(false);
  const profileImageRef = useRef(null);
  const [profileImageInput, setProfileImageInput] = useState(null);
  const [fullNameInput, setFullNameInput] = useState(userInfo.name);
  const [emailInput, setEmailInput] = useState(userInfo.email);
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [reEnterNewPasswordInput, setReEnterNewPasswordInput] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      let profileImageUrl = userInfo.photo;
      if (profileImageInput) {
        profileImageUrl = await uploadImage(profileImageInput);
      }
      const data = {
        id: userInfo.id,
        name: fullNameInput,
        email: emailInput,
        photo: profileImageUrl,
      };
      updateProfile(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const updateProfile = async (data) => {
    try {
      await axios.put(`/api/user/update`, data, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      setUpdateProfileButtonClicked(false);
    } catch (error) {
      const retry = await apiErrorHandle(error, () => {});
      if (retry) updateProfile(data);
    }
  };

  const handleChangePassword = async () => {
    try {
      if (newPasswordInput !== reEnterNewPasswordInput) {
        throw new Error("Passwords do not match!");
      }
      setLoading(true);
      const data = {
        id: userInfo.id,
        password: newPasswordInput,
      };
      const response = await axios.put(`/api/user/update`, data, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });

      setChangePasswordButtonClicked(false);
    } catch (error) {
      const retry =await apiErrorHandle(error, removeCreds);
      if(retry) handleChangePassword();
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(`/api/user/delete`, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 204) {
        console.log(response.data);
        Cookies.remove("token");
        navigate("/login");
        logout();
      }
    } catch (error) {
      const retry = await apiErrorHandle(error, removeCreds);
      if(retry) handleDeleteAccount();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 flex justify-center items-center min-h-screen ">
      {loading && <LoadingIndicator />}

      <div className="w-full max-w-2xl p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
        {/* Profile Section */}
        <div className="flex flex-col items-center mb-6">
          {/* Avatar */}
          <div
            onClick={() =>
              updateProfileButtonClicked && profileImageRef.current.click()
            }
            className={`w-36 h-36 mb-6 rounded-full flex items-center justify-center text-white text-4xl font-bold bg-blue-600 overflow-hidden ${
              updateProfileButtonClicked
                ? "cursor-pointer hover:bg-blue-700"
                : "cursor-default"
            } transition-colors`}
          >
            {profileImageInput ? (
              <img
                src={URL.createObjectURL(profileImageInput)}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : userInfo.photo ? (
              <img
                src={userInfo.photo}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              userInfo.name.charAt(0).toUpperCase()
            )}
          </div>

          <input
            ref={profileImageRef}
            hidden
            type="file"
            accept="image/*"
            onChange={(e) => setProfileImageInput(e.target.files[0])}
          />

          {/* Update Profile Form */}
          {updateProfileButtonClicked && (
            <div className="w-full space-y-4">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullNameInput}
                  onChange={(e) => setFullNameInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}

          {/* Change Password Form */}
          {changePasswordButtonClicked && (
            <div className="w-full space-y-4">
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  New Password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label
                  htmlFor="reEnterPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Re-enter New Password
                </label>
                <input
                  id="reEnterPassword"
                  type="password"
                  value={reEnterNewPasswordInput}
                  onChange={(e) => setReEnterNewPasswordInput(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 mt-6">
          {!updateProfileButtonClicked && !changePasswordButtonClicked && (
            <>
              <button
                onClick={() => setUpdateProfileButtonClicked(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
              >
                Update Profile
              </button>
              <button
                onClick={() => setChangePasswordButtonClicked(true)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
              >
                Change Password
              </button>
            </>
          )}

          {(updateProfileButtonClicked || changePasswordButtonClicked) && (
            <div className="flex gap-4 w-full">
              <button
                onClick={
                  updateProfileButtonClicked
                    ? handleUpdateProfile
                    : handleChangePassword
                }
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setUpdateProfileButtonClicked(false);
                  setChangePasswordButtonClicked(false);
                }}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          )}

          <button
            onClick={handleDeleteAccount}
            className="w-full bg-red-500 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 mt-2"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
