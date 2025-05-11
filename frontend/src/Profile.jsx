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
import { API_BASE_URL } from "./util/BaseUrl";
import Cookies from "js-cookie";
import { AuthContext } from "./contexts/AuthContext";

function Profile() {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { authToken, logout } = useContext(AuthContext);
  const userInfo = JSON.parse(Cookies.get("user"));

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userResult = await fetch(`${API_BASE_URL}/user/get`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: authToken,
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
        const resultData = await userResult.json();
        setLoading(false);
      } catch (error) {
        console.error("There has been a problem with fetch operation:", error);
      }
    };

    fetchUser();
  }, [authToken, navigate, logout]);

  return (
    <Box
      sx={{
        m: 5,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#f5f5f5",
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
            backgroundColor: "white",
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
                  {userInfo.name.charAt(0).toUpperCase()}
                </Typography>
              </Avatar>
              <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold" }}>
                {userInfo.name}
              </Typography>
              <Typography variant="body1" sx={{ mb: 1 }}>
                {userInfo.email}
              </Typography>
              <Typography variant="body2" sx={{ color: "gray", mb: 2 }}>
                @{userInfo.username}
              </Typography>
              <Divider sx={{ width: "100%", mb: 2 }} />
              <Typography variant="body2" sx={{ color: "gray" }}>
                Role: {userInfo.role}
              </Typography>
            </Box>
          </CardContent>
          <Divider />
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/settings")}
              sx={{ textTransform: "none" }}
            >
              Go to Settings
            </Button>
          </Box>
        </Card>
      )}
    </Box>
  );
}

export default Profile;