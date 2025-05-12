import { useNavigate } from "react-router-dom";
import HomeBlogCard from "./components/HomeBlogCard";
import { useEffect, useState } from "react";
import { extractParagraphs } from "./util/ExtractParagraphs";
import { handleResponseFromFetchBlog } from "./util/HandleResponse";
import LoadingIndicator from "./util/LoadingIndicator";
import { API_BASE_URL } from "./util/BaseUrl";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Pagination,
  Select,
  Typography,
} from "@mui/material";
import { ConstBlogPageSize } from "./util/ConstBlogPageSize";
import Cookies from "js-cookie";
import MediaCard from "./components/MediaCard";

function Dashboard() {
  const [myBlogs, setMyBlogs] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(ConstBlogPageSize[0]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [last, setLast] = useState(false);
  const user = JSON.parse(Cookies.get("user"));

  async function fetchData(pageN, pageS) {
    setLoading(true);
    try {
      const result = await fetch(
        `${API_BASE_URL}/blog/get-all-of-user?userId=${user.id}&pageNumber=${pageN}&pageSize=${pageS}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const resultData = await handleResponseFromFetchBlog(result); // Parse the text from the response
      console.log(resultData);
      setMyBlogs(resultData.content);
      setLast(resultData.lastPage);
      setPage(resultData.pageNumber + 1);
      setTotalPages(resultData.totalPages);
      setTotalElements(resultData.totalElements);
      setRowsPerPage(resultData.pageSize);
    } catch (error) {
      console.error("There has been a problem with fetch operation:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData(page - 1, rowsPerPage);
  }, []);

  const createBlog = () => {
    navigate("/create-blog");
  };

  return (
    <Box sx={{ padding: 4, height: "100vh" }}>
      {/* Header Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 4,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          Dashboard
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={createBlog}
          sx={{ textTransform: "none" }}
        >
          Create Blog
        </Button>
      </Box>

      {/* Recent Blogs Section */}
      <Typography variant="h5" fontWeight="bold" sx={{ marginBottom: 2 }}>
        Recent Blogs
      </Typography>

      <div className="w-full grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
        {myBlogs &&
          myBlogs.map((element) => {
            return (
              <MediaCard
                key={element.id}
                blog={element}
              />
            );
          })}
        {loading ? <LoadingIndicator /> : <></>}
      </div>

    
      <div className="flex justify-center items-center mt-12 mb-5">
        <FormControl sx={{ m: 1, minWidth: 80 }}>
          <InputLabel id="select-page-size">Page Size</InputLabel>
          <Select
            labelId="select-page-size"
            label="Blogs per page"
            autoWidth
            size="small"
            value={rowsPerPage}
            onChange={(e) => fetchBlog(page - 1, e.target.value)}
          >
            <MenuItem value={ConstBlogPageSize[0]}>
              {ConstBlogPageSize[0]}
            </MenuItem>
            <MenuItem value={ConstBlogPageSize[1]}>
              {ConstBlogPageSize[1]}
            </MenuItem>
            <MenuItem value={ConstBlogPageSize[2]}>
              {ConstBlogPageSize[2]}
            </MenuItem>
          </Select>
        </FormControl>
        <Pagination
          count={totalPages}
          shape="rounded"
          // variant="outlined"
          color="primary"
          page={page}
          showFirstButton={true}
          showLastButton={!last}
          onChange={(_e, value) => fetchBlog(value - 1, rowsPerPage)}
        />
        <p>Total {totalElements}</p>
       
      </div>
    </Box>
  );
}

export default Dashboard;
