import { useContext, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import HomeBlogCard from "./components/HomeBlogCard";
import { handleResponseFromFetchBlog } from "./util/HandleResponse";
import LoadingIndicator from "./util/LoadingIndicator";

import { AuthContext } from "./contexts/AuthContext";
import { ConstBlogPageSize } from "./util/ConstBlogPageSize";
import PaginationRounded from "./components/PaginationRounded";
import MediaCard from "./components/MediaCard";
import { Box, CircularProgress, Grid, Typography } from "@mui/material";

function Search() {
  const [searchedBlogs, setSearchedBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const { logout } = useContext(AuthContext);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(ConstBlogPageSize[0]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchKey = queryParams.get("query") || ""; // Get the search key from the URL

  useEffect(() => {
    fetchSearchedBlogs(pageNumber - 1, pageSize);
  }, [searchKey]);

  const fetchSearchedBlogs = async (p, pageSize) => {
    setLoading(true);
    const fetchedBlogs = await fetchSearchResult(p, pageSize);

    if (fetchedBlogs && fetchedBlogs.content) {
      setSearchedBlogs(fetchedBlogs.content);
      setPageNumber(fetchedBlogs.pageNumber + 1);
      setPageSize(fetchedBlogs.pageSize);
      setIsLastPage(fetchedBlogs.isLastPage);
      setTotalPages(fetchedBlogs.totalPages);
      setTotalElements(fetchedBlogs.totalElements);
    }
    setLoading(false);
  };

  const fetchSearchResult = async (pageNumber, pageSize) => {
    return await fetch(
      `/api/blog/search?keyword=${searchKey}&pageNumber=${pageNumber}&pageSize=${pageSize}`,
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        return handleResponseFromFetchBlog(res, logout); // Parse the text from the response
      })
      .catch((error) => {
        error.response == 404
          ? console.log("No result found")
          : console.log("Error fetching blogs:", error);
        return [];
      });
  };

  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: "background.body",
        minHeight: "100vh",
      }}
    >
     
        {/* Header Section */}
        <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: 3 }}>
          Searched Blogs for "{searchKey}"
        </Typography>

        {/* Blogs Section */}
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "200px",
            }}
          >
            <CircularProgress />
          </Box>
        ) : searchedBlogs.length === 0 ? (
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{ textAlign: "center" }}
          >
            No results found
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {searchedBlogs.map((element) => (
              <Grid item xs={12} sm={6} md={4} key={element.id}>
                <MediaCard blog={element} />
              </Grid>
            ))}
          </Grid>
        )}
 
      {searchedBlogs.length > 0 && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 4,
          }}
        >
          <PaginationRounded
            pageNumber={pageNumber}
            pageSize={pageSize}
            onChangePage={fetchSearchedBlogs}
            isLastPage={isLastPage}
            totalElements={totalElements}
            totalPages={totalPages}
          />
        </Box>
     )} 
    </Box>
  );
}

export default Search;
