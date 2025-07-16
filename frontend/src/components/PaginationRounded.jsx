import { Box, Pagination, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { ConstBlogPageSize } from "../util/ConstBlogPageSize";

export default function PaginationRounded({
  pageSize,
  onChangePage,
  totalPages,
  pageNumber,
  isLastPage,
  totalElements,
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        mt: 4,
        mb: 4,
        px: 2,
        py: 2,
        backgroundColor: "background.paper",
        
        borderRadius: 2,
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Page Size Selector */}
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel id="select-page-size">Page Size</InputLabel>
        <Select
          labelId="select-page-size"
          label="Page Size"
          value={pageSize}
          onChange={(e) => onChangePage(pageNumber - 1, e.target.value)}
        >
          {ConstBlogPageSize.map((size) => (
            <MenuItem key={size} value={size}>
              {size}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Pagination */}
      <Pagination
        count={totalPages}
        shape="rounded"
        color="primary"
        page={pageNumber}
        showFirstButton
        showLastButton={!isLastPage}
        onChange={(_e, value) => onChangePage(value - 1, pageSize)}
        sx={{
          "& .MuiPagination-ul": {
            justifyContent: "center",
          },
        }}
      />

      {/* Total Elements */}
      <Typography variant="body2" sx={{  color: "text.primary" }}>
        Total Blogs: {totalElements}
      </Typography>
    </Box>
  );
}