import { useContext, useEffect, useState } from "react";
import { handleResponseFromFetchBlog } from "./util/HandleResponse";
import LoadingIndicator from "./util/LoadingIndicator";

import { Box, Typography } from "@mui/material";
import { ConstBlogPageSize } from "./util/ConstBlogPageSize";
import MediaCard from "./components/MediaCard";
import { AuthContext } from "./contexts/AuthContext";
import PaginationRounded from "./components/PaginationRounded";

function Dashboard() {
  const [myBlogs, setMyBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(ConstBlogPageSize[0]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [last, setLast] = useState(false);
  const { userInfo } = useContext(AuthContext);

  async function fetchData(pageN, pageS) {
    setLoading(true);
    try {
      const result = await fetch(
        `/api/blog/get-all-of-user?userId=${userInfo.id}&pageNumber=${pageN}&pageSize=${pageS}`,
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
  const fetchBlog = async (pageNumber, pageSize) => {
    setLoading(true);
    const fetchedBlogs = await fetchData(pageNumber, pageSize);

    if (fetchedBlogs && fetchedBlogs.content) {
      setMyBlogs(fetchedBlogs.content);
      setPage(fetchedBlogs.pageNumber + 1);
      setRowsPerPage(fetchedBlogs.pageSize);
      setLast(fetchedBlogs.isLastPage);
      setTotalPages(fetchedBlogs.totalPages);
      setTotalElements(fetchedBlogs.totalElements);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData(page - 1, rowsPerPage);
  }, []);

  return (
    <Box
      sx={{ padding: 4, height: "100vh", backgroundColor: "background.body" }}
    >
      {/* Recent Blogs Section */}
      <Typography variant="h6" fontWeight="bold" sx={{ marginBottom: 2 }}>
        My Blogs
      </Typography>

      <div className="min-h-3/4">
        <div className="w-full grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {myBlogs &&
            myBlogs.map((element) => 
               <MediaCard key={element.id} blog={element} />
            )}
          {loading ? <LoadingIndicator /> : <></>}
        </div>

        {myBlogs.length === 0 && !loading && (
          <Typography
            variant="body1"
            sx={{ textAlign: "center", marginTop: 2 }}
          >
            No blogs found.
          </Typography>
        )}
      </div>

      {/* Pagination */}
      {myBlogs.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <PaginationRounded
            pageNumber={page}
            pageSize={rowsPerPage}
            onChangePage={fetchBlog}
            isLastPage={last}
            totalElements={totalElements}
            totalPages={totalPages}
          />
        </Box>
      )}
    </Box>
  );
}

export default Dashboard;
