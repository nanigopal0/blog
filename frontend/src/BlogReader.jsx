import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  IconButton,
  Button,
  Avatar,
  Divider,
  TextField,
  Collapse,
  Chip,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import CommentOutlinedIcon from "@mui/icons-material/CommentOutlined";
import CloseIcon from "@mui/icons-material/Close";
import LoadingIndicator from "./util/LoadingIndicator";
import { AuthContext } from "./contexts/AuthContext";
import Comment from "./components/Comment";

import PersonIcon from "@mui/icons-material/Person";
import FormatDate from "./util/FormatDate";

function BlogReader() {
  const param = useParams();
  const navigate = useNavigate();
  
  const [blog, setBlog] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userInfo, logout } = useContext(AuthContext);
  const [isBlogOfCurrentUser, setIsBlogOfCurrentUser] = useState(false);
  const [totalLikes,setTotalLikes] = useState(0);
  // State for Heart and Comment icons
  const [isHeartClicked, setIsHeartClicked] = useState(false);
  const [isCommentSectionVisible, setIsCommentSectionVisible] = useState(false);

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetchBlog();
  }, []);

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/blog/get-blog/${param.id}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 401) {
        logout();
        return;
      }
      if (!response.ok)
        throw new Error(
          "Network response was not ok" + response.text(),
          response.statusText
        );
      const resultData = await response.json();
      setVariables(resultData);
    } catch (error) {
      console.error(error.message || "Error fetching blog data");
    } finally {
      setLoading(false);
    }
  };

  const setVariables = (resultData) => {
    setBlog(resultData);
    setComments(resultData.comments || []);
    setTotalLikes(resultData?.reaction?.totalLikes || 0);
    setIsBlogOfCurrentUser(userInfo && resultData.userId === userInfo.id);
    setIsHeartClicked(resultData?.reaction?.userLiked);
  }

  const handleReaction = async () => {
    try {
      const response = !isHeartClicked
      ? await likeCall()
        : await dislikeCall(blog?.reaction?.reactionId); //reaction id

        const reactionId = await response.text();
        console.log(reactionId);
      if (response.status == 401) {
        logout();
        return;
      }
      if (response.status == 200) {
        const updatedBlog = {
          ...blog,
          reaction: {
            ...blog.reaction,
            reactionId: isHeartClicked ? blog?.reaction?.reactionId : reactionId,
            totalLikes: isHeartClicked
              ? totalLikes - 1
              : totalLikes + 1,
          },
        };
        setTotalLikes(l=> !isHeartClicked ? l+1: l-1);
        setIsHeartClicked((prev) => !prev);
        setBlog(updatedBlog);
      }
    } catch (error) {
      console.error(error.message || "Error fetching blog data");
    }
  };

  const likeCall = async () => {
    const data = {
      userId: userInfo.id,
      blogId: blog.id,
    };
    return await fetch(`/api/blog/reaction/like`, {
      method: "POST",
      body: JSON.stringify(data),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const dislikeCall = async (reactionId) => {
    console.log(reactionId);
    return await fetch(`/api/blog/reaction/dislike`, {
      method: "POST",
      body: JSON.stringify(reactionId),
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };

  const handlePostComment = async () => {
    if (newComment.trim() === "") return;
    try {
      const newCommentData = {
        userId: userInfo.id,
        blogId: blog.id,
        userPhoto: userInfo.photo,
        userFullName: userInfo.name,
        comment: newComment,
      };

      const response = await fetch(`/api/comment`, {
        method: "POST",
        body: JSON.stringify(newCommentData),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status == 401) {
        logout();
        return;
      }
      if (response.status == 201) {
        setComments([newCommentData, ...comments]);
        setNewComment("");
      }
    } catch (error) {
      console.error(error.message || "Error fetching blog data");
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 5 }, // Adjust margins for different screen sizes
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "background.body",
      }}
    >
      {loading && <LoadingIndicator />}
      {blog && (
        <Card
          sx={{
            width: { xs: "100%", sm: "90%", md: "85%", lg: "75%"}, // Full width for small screens
            p: { xs: 2, sm: 3, md: 4 }, // Adjust padding for different screen sizes
            boxShadow: 4,
            borderRadius: 2,
            backgroundColor: "background.body",
          }}
        >
          {/* Blog Cover Image */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: { xs: 2, sm: 3, md: 4 },
              overflow: "hidden",
              borderRadius: 2,
            }}
          >
            <img
              src={blog.coverImage}
              alt="cover"
              style={{
                width: "100%",
                maxHeight: "400px",
                objectFit: "contain",
                borderRadius: "8px",
              }}
            />
          </Box>

          {/* Blog Author Info */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mb: { xs: 2, sm: 3 },
            }}
          >
            <Avatar
              src={blog.userPhoto || undefined}
              alt={blog.userFullName}
              sx={{
                width: { xs: 40, sm: 56 },
                height: { xs: 40, sm: 56 },
                mr: 2,
                border: "1px solid gray",
              }}
            >
              {!blog.userPhoto && (
                <PersonIcon sx={{ fontSize: { xs: 20, sm: 28 } }} />
              )}
            </Avatar>
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "1rem", sm: "1.25rem" },
                }}
              >
                {blog.userFullName}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "gray", fontSize: { xs: "0.8rem", sm: "1rem" } }}
              >
                {FormatDate(blog.time)}
              </Typography>
            </Box>
          </Box>

          {/* Blog Title */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              mb: { xs: 1, sm: 2 },
              textAlign: "left",
              fontSize: { xs: "1.5rem", sm: "2rem" },
            }}
          >
            {blog.title}
          </Typography>

          {/* Blog Category */}
          <Chip
            label={blog.category?.category || "Uncategorized"}
            sx={{
              mb: { xs: 2, sm: 3 },
              backgroundColor: "#e0f7fa",
              color: "#00796b",
              fontWeight: "bold",
              fontSize: { xs: "0.8rem", sm: "1rem" },
            }}
          />

          {/* Blog Content */}
          <Typography
            variant="body1"
            sx={{
              textAlign: "justify",
              mb: { xs: 2, sm: 4 },
              fontSize: { xs: "0.9rem", sm: "1rem" },
            }}
            dangerouslySetInnerHTML={{ __html: blog.content }}
          ></Typography>

          <Divider sx={{ mb: { xs: 2, sm: 3 } }} />

          {/* Icons Section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: { xs: 1, sm: 2 },
              mb: { xs: 2, sm: 3 },
            }}
          >
            {/* Heart Icon with Like Count */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid",
                borderRadius: "20px",
                padding: { xs: "2px 6px", sm: "4px 8px" },
                gap: 1,
              }}
            >
              <IconButton
                onClick={() => handleReaction()}
                sx={{
                  color: isHeartClicked ? "red" : "primary.paper",
                  padding: 0,
                }}
              >
                {isHeartClicked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
              <Typography
                variant="body2"
                sx={{
       
                  fontWeight: "bold",
                  fontSize: { xs: "0.8rem", sm: "1rem" },
                }}
              >
                {totalLikes || 0}
              </Typography>
            </Box>

            {/* Comment Icon with Comment Count */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                border: "1px solid ",
                borderRadius: "20px",
                padding: { xs: "2px 6px", sm: "4px 8px" },
                gap: 1,
              }}
              onClick={() =>
                setIsCommentSectionVisible(!isCommentSectionVisible)
              }
            >
              <IconButton
              color="primary.main"
              
                sx={{
                  // color: isCommentSectionVisible ? "primary.main" : "gray",

                  padding: 0,
                }}
              >
                {isCommentSectionVisible ? (
                  <CloseIcon />
                ) : (
                  <CommentOutlinedIcon />
                )}
              </IconButton>
              <Typography
                variant="body2"
                sx={{
                  
                  fontWeight: "bold",
                  fontSize: { xs: "0.8rem", sm: "1rem" },
                }}
              >
                {comments.length}
              </Typography>
            </Box>
          </Box>

          {/* Comments Section */}
          <Collapse in={isCommentSectionVisible}>
            <Divider sx={{ mb: { xs: 2, sm: 3 } }} />
            <Typography
              variant="h5"
              sx={{
                mb: { xs: 1, sm: 2 },
                fontSize: { xs: "1.2rem", sm: "1.5rem" },
              }}
            >
              Comments
            </Typography>
            <Box sx={{ mb: { xs: 2, sm: 3 } }}>
              <TextField
                fullWidth
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                sx={{ mb: { xs: 1, sm: 2 } }}
              />
              <Button
                variant="contained"
                onClick={handlePostComment}
                disabled={!newComment.trim()}
              >
                Post Comment
              </Button>
            </Box>
            {comments.map((comment) => (
              <Comment
                key={comment.id}
                photo={comment.userPhoto}
                name={comment.userFullName}
                time={comment.commentedAt}
                text={comment.comment}
              />
            ))}
          </Collapse>

          {/* Edit and Delete Buttons */}
          {isBlogOfCurrentUser && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: { xs: 2, sm: 3 },
              }}
            >
              <Button
                variant="contained"
                onClick={() => navigate(`/edit-blog/${blog.id}`)}
              >
                Edit
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => console.log("Delete blog")}
              >
                Delete
              </Button>
            </Box>
          )}
        </Card>
      )}
    </Box>
  );
}

export default BlogReader;
