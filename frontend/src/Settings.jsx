import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Avatar,
  Button,
  TextField,
  Typography,
  Card,
  CardContent,
  CardActions,
  Divider,
} from "@mui/material";
import LoadingIndicator from "./util/LoadingIndicator";
import { handleResponseFromFetchBlog } from "./util/HandleResponse";

import { uploadImage } from "./util/UploadImageCloudinary";
import Cookies from "js-cookie";
import { AuthContext } from "./contexts/AuthContext";

function Settings() {

  const { userInfo, authToken, logout } = useContext(AuthContext);
  const [changePasswordButtonClicked, setChangePasswordButtonClicked] = useState(false);
  const [updateProfileButtonClicked, setUpdateProfileButtonClicked] = useState(false);
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
      const response = await fetch(`/api/register/update`, {
        method: "PUT",
        headers: {
          Authorization: authToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      await handleResponseFromFetchBlog(response);
      setLoading(false);
      setUpdateProfileButtonClicked(false);
    } catch (error) {
      setLoading(false);
      console.error("Error updating profile:", error);
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
      const response = await fetch(`/api/register/update`, {
        method: "PUT",
        headers: {
          Authorization: authToken,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      await handleResponseFromFetchBlog(response);
      setLoading(false);
      setChangePasswordButtonClicked(false);
    } catch (error) {
      setLoading(false);
      console.error("Error changing password:", error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/register/delete`, {
        method: "DELETE",
        headers: {
          Authorization: authToken,
          "Content-Type": "application/json",
        },
      });
      if (response.status === 204) {
        Cookies.remove("token");
        navigate("/login");
        logout();
      }
    } catch (error) {
      setLoading(false);
      console.error("Error deleting account:", error);
    }
  };

  return (
    <Box
      sx={{
        p: 5,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "background.body",
      }}
    >
      {loading && <LoadingIndicator />}
      <Card
        sx={{
          width: "100%",
          maxWidth: 600,
          p: 3,
          boxShadow: 4,
          borderRadius: 2,
          backgroundColor: "background.body",
        }}
      >
        <CardContent>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Avatar
              onClick={() => updateProfileButtonClicked && profileImageRef.current.click()}
              sx={{
                bgcolor: "primary.main",
                width: 150,
                height: 150,
                mb: 3,
                cursor: updateProfileButtonClicked ? "pointer" : "default",
              }}
              src={
                profileImageInput
                  ? URL.createObjectURL(profileImageInput)
                  : userInfo.photo
              }
            >
              <Typography variant="h3">
                {userInfo.name.charAt(0).toUpperCase()}
              </Typography>
            </Avatar>
            <input
              ref={profileImageRef}
              hidden
              type="file"
              onChange={(e) => setProfileImageInput(e.target.files[0])}
            />
            {updateProfileButtonClicked && (
              <>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={fullNameInput}
                  onChange={(e) => setFullNameInput(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  sx={{ mb: 2 }}
                />
              </>
            )}
            {changePasswordButtonClicked && (
              <>
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Re-enter New Password"
                  type="password"
                  value={reEnterNewPasswordInput}
                  onChange={(e) => setReEnterNewPasswordInput(e.target.value)}
                  sx={{ mb: 2 }}
                />
              </>
            )}
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          {!updateProfileButtonClicked && !changePasswordButtonClicked && (
            <>
              <Button
                variant="contained"
                fullWidth
                onClick={() => setUpdateProfileButtonClicked(true)}
                sx={{ backgroundColor: "#1976d2", color: "white" }}
              >
                Update Profile
              </Button>
              <Button
                variant="contained"
                fullWidth
                color="secondary"
                onClick={() => setChangePasswordButtonClicked(true)}
              >
                Change Password
              </Button>
            </>
          )}
          {(updateProfileButtonClicked || changePasswordButtonClicked) && (
            <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
              <Button
                variant="contained"
                color="success"
                fullWidth
                onClick={
                  updateProfileButtonClicked
                    ? handleUpdateProfile
                    : handleChangePassword
                }
              >
                Save
              </Button>
              <Button
                variant="contained"
                color="error"
                fullWidth
                onClick={() => {
                  setUpdateProfileButtonClicked(false);
                  setChangePasswordButtonClicked(false);
                }}
              >
                Cancel
              </Button>
            </Box>
          )}
          <Button
            variant="contained"
            fullWidth
            color="error"
            onClick={handleDeleteAccount}
            sx={{ mt: 2 }}
          >
            Delete Account
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}

export default Settings;