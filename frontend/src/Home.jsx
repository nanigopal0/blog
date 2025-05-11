import { useContext, useEffect, useRef, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Pagination,
  Card,
  CardContent,
  CardMedia,
  Button,
} from "@mui/material";
import { handleResponseFromFetchBlog } from "./util/HandleResponse";
import { API_BASE_URL } from "./util/BaseUrl";
import { ConstBlogPageSize } from "./util/ConstBlogPageSize";
import { AuthContext } from "./contexts/AuthContext";
import HeaderHomePage from "./components/HeaderHomePage";
import MediaCard from "./components/MediaCard";
import PaginationRounded from "./components/PaginationRounded";

function Home() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(ConstBlogPageSize[0]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const { authToken, logout } = useContext(AuthContext);

  useEffect(() => {
    fetchBlog(pageNumber - 1, pageSize);
  }, []);

  const getAllBlogs = async (pageNumber, pageSize) => {
    try {
      const result = await fetch(
        `${API_BASE_URL}/blog/get-all-blogs?pageNumber=${pageNumber}&pageSize=${pageSize}`,
        {
          method: "GET",
          credentials: "include",
          // headers: {
          //   "Content-Type": "application/json",
          //   Authorization: authToken,
          // },
        }
      );

      return await handleResponseFromFetchBlog(result, logout);
    } catch (error) {
      console.error("There has been a problem with fetch operation:", error);
      return null;
    }
  };

  const fetchBlog = async (pageNumber, pageSize) => {
    setLoading(true);
    const fetchedBlogs = await getAllBlogs(pageNumber, pageSize);

    if (fetchedBlogs && fetchedBlogs.content) {
      setBlogs(fetchedBlogs.content);
      setPageNumber(fetchedBlogs.pageNumber + 1);
      setPageSize(fetchedBlogs.pageSize);
      setIsLastPage(fetchedBlogs.isLastPage);
      setTotalPages(fetchedBlogs.totalPages);
      setTotalElements(fetchedBlogs.totalElements);
    }
    setLoading(false);
  };
  const scrollContainerRef = useRef(null);

  const handleMouseDown = (e) => {
    const container = scrollContainerRef.current;
    container.isDragging = true;
    container.startX = e.pageX - container.offsetLeft;
    container.scrollLeftStart = container.scrollLeft;
  };

  const handleMouseMove = (e) => {
    const container = scrollContainerRef.current;
    if (!container.isDragging) return;
    e.preventDefault();
    const x = e.pageX - container.offsetLeft;
    const walk = x - container.startX; // Distance moved
    container.scrollLeft = container.scrollLeftStart - walk;
  };

  const handleMouseUp = () => {
    const container = scrollContainerRef.current;
    container.isDragging = false;
  };
  const handleOnHeaderClick = () => {
    console.log("Header clicked");
  };

  const headerConstant = [
    "Trending",
    "Popular",
    "Recommended",
    "Recently Added",
    "Filter",
    "CyberSecurity",
    "Web 3",
    "Cloud Computing",
    "Data Science",
    "Artificial Intelligence",
    "Blockchain",
    "SEO",
  ];

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3, md: 5 },
        backgroundColor: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      {/* Horizontal Scrollable Header */}
      <Box
        ref={scrollContainerRef}
        sx={{
          display: "flex",
          gap: 2,
          overflowX: "auto",
          py: 2,
          px: 3,
          backgroundColor: "#ffffff",
          borderRadius: 2,
          boxShadow: 2,
          whiteSpace: "nowrap",
          scrollbarWidth: "none", // For Firefox
          "&::-webkit-scrollbar": {
            display: "none", // For Chrome, Safari, and Edge
          },
          WebkitOverflowScrolling: "touch", // Enables smooth scrolling on touch devices and trackpads
          cursor: "grab", // Show grab cursor
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp} // Stop dragging if the mouse leaves the container
      >
        {headerConstant.map((value, idx) => (
          <HeaderHomePage key={idx} name={value} onClick={handleOnHeaderClick} />
        ))}
      </Box>

      {/* Latest Blogs Section */}
      <Typography variant="h4" sx={{ fontWeight: "bold", mt: 4, mb: 2 }}>
        Latest Blogs
      </Typography>

      {/* Blog Cards */}
      <Grid container spacing={3}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
              mt: 4,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          blogs.map((blog) => (

              <MediaCard blog={blog} />
          ))
        )}
      </Grid>

      {/* Pagination */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <PaginationRounded
          pageNumber={pageNumber}
          pageSize={pageSize}
          onChangePage={fetchBlog}
          isLastPage={isLastPage}
          totalElements={totalElements}
          totalPages={totalPages}
        />
      </Box>
    </Box>
  );
}

export default Home;
