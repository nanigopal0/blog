import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Avatar,
  Typography,
  Card,
  CardContent,
  Divider,
  Button,
} from "@mui/material";
import LoadingIndicator from "./util/LoadingIndicator";

import { AuthContext } from "./contexts/AuthContext";
import { LogOut } from "lucide-react";

function Profile() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { userInfo, logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userResult = await fetch(`/api/user/get`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (userResult.status === 401) {
          logout();
          navigate("/login");
          throw new Error("Unauthorized user as token is invalid");
        }
        if (!userResult.ok) {
          throw new Error("Network response was not ok");
        }
        await userResult.json();

        setLoading(false);
      } catch (error) {
        console.error("There has been a problem with fetch operation:", error);
      }
    };

    fetchUser();
  }, [navigate, logout]);

  const logoutClick = () => {
    logout();
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
      {userInfo && (
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
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "primary.main",
                  width: 150,
                  height: 150,
                  mb: 3,
                }}
                src={userInfo.photo}
              >
                <Typography variant="h3">
                  {userInfo.name && userInfo.name.charAt(0).toUpperCase()}
                </Typography>
              </Avatar>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold" }}>
                {userInfo.name}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                Email: {userInfo.email}
              </Typography>
              <Typography variant="body2" sx={{ color: "text.primary", mb: 2 }}>
                username: @{userInfo.username}
              </Typography>
              <Divider sx={{ width: "100%", mb: 2 }} />
              <Typography variant="body2">Role: {userInfo.role}</Typography>
            </Box>
          </CardContent>
          <Divider />
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/settings")}
              sx={{ textTransform: "none" }}
            >
              Go to Settings
            </Button>
          </Box>
          <Divider />
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button
              variant="contained"
              color="warning"
              onClick={logoutClick}
              sx={{ textTransform: "none", gap: 1 }}
            >
              <LogOut /> Log out
            </Button>
          </Box>
        </Card>
      )}
    </Box>
  );
}

export default Profile;
