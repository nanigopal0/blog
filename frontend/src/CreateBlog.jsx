import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { uploadImage } from "./util/UploadImageCloudinary";
import LoadingIndicator from "./util/LoadingIndicator";

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { AuthContext } from "./contexts/AuthContext";

function CreateBlog() {
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [blogTitle, setBlogTitle] = useState("");
  const coverImageInputRef = useRef(null);
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const quillRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [categories, setCategories] = useState([]);
  const {userInfo, logout } = useContext(AuthContext);


  // Ensure the Quill editor has the desired minimum height and allows dynamic resizing.
  useEffect(() => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      editor.root.style.minHeight = "24rem";
      editor.root.style.resize = "vertical";
      editor.root.style.overflow = "auto";
    }
    getCategoriesFromServer();
  }, []);

  const getCategoriesFromServer = async () => {
    try {
      const response = await fetch(`/api/category/all`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        logout();
      }
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const imageHandler = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;
      const objectURL = URL.createObjectURL(file);

      setImages((prevImages) => [...prevImages, { file, objectURL }]);

      const editor = quillRef.current.getEditor();
      const range = editor.getSelection(true);
      const Image = Quill.import("formats/image");
      Image.sanitize = () => objectURL; // You can modify the URL here
      editor.insertEmbed(range.index, "image", objectURL);
    };
  }, []);

  const customReactQuillModule = useMemo(
    () => ({
      toolbar: {
        container: [
          ["bold", "italic", "underline", "strike"],
          ["blockquote", "code-block"],
          [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
          [{ script: "sub" }, { script: "super" }],
          [{ indent: "-1" }, { indent: "+1" }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: [] }, { background: [] }],
          [{ font: [] }],
          [{ align: [] }],
          ["link", "image", "formula"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    [imageHandler]
  );

  const handleCreateBlogButton = async () => {
    // if(selectedCategory == 0 ) return;
    let content = value;
    const coverImageUrl = await uploadImage(image);
    const uploadPromises = images.map(async (element) => {
      const url = await uploadImage(element.file);
      return {
        oldUrl: element.objectURL,
        newUrl: url,
      };
    });

    try {
      // Wait for all image uploads to complete
      const uploadedImages = await Promise.all(uploadPromises);
      uploadedImages.forEach(({ oldUrl, newUrl }) => {
        content = content.replace(oldUrl, newUrl);
      });
      const data = {
        coverImage: coverImageUrl,
        title: blogTitle,
        content: content,
        userId: userInfo.id,
        categoryId: categories[selectedCategory].id,
      };
      if (data.content && data.coverImage && data.title) createBlogInDB(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const createBlogInDB = async (data) => {
    try {
      const response = await fetch(`/api/blog/add`, {
        method: "POST",
        body: JSON.stringify(data),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status == 401) {
        logout();
        // navigate("/");
      }
      if (!response.ok) {
        throw new Error("Network response was not ok");
      } else {
        console.log(await response.text());
        navigate("/home");
      }
    } catch (error) {
      console.error("There has been a problem with fetch operation:", error);
    }
  };

  const handleCoverImageClick = () => {
    coverImageInputRef.current.click();
  };

  return (
    <Box 
      sx={{
        p: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "background.body",
      }}
    >
      {/* Cover Image Input */}
      <Box
        onClick={handleCoverImageClick}
       
        sx={{
          height: "18rem",
          width: "80%",
          // Using same width as your current code (w-4/5 md:w-1/2).
          maxWidth: { xs: "80%", md: "50%" },
          mb: 4,
          border: "1px solid gray",
          borderRadius: 2,
          overflow: "hidden",
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {previewImage ? (
          <Box
            component="img"
            src={previewImage}
            alt="Cover"
            sx={{ width: "100%", height: "100%", objectFit: "contain" }}
          />
        ) : (
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            Click to choose a cover image
          </Typography>
        )}
        <input
          type="file"
          ref={coverImageInputRef}
          style={{ display: "none" }}
          onChange={(e) => {
            setImage(e.target.files[0]);
            setPreviewImage(URL.createObjectURL(e.target.files[0]));
          }}
        />
      </Box>

      {/* Blog Title and Category */}
      <Box sx={{ width: "80%", maxWidth: { xs: "80%", md: "66%" }, mb: 4 }}>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel id="category-label">Select a category</InputLabel>
          <Select
            labelId="category-label"
            value={selectedCategory}
            label="Select a category"
            onChange={(e) => setSelectedCategory(Number(e.target.value))}
          >
            {categories.map((category, index) => (
              <MenuItem key={index} value={index}>
                {category.category}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          value={blogTitle}
          onChange={(e) => setBlogTitle(e.target.value)}
          label="Title"
          placeholder="Enter title"
          variant="outlined"
          multiline
          sx={{ mb: 3 }}
        />
      </Box>

      {/* Blog Content */}
      <Box sx={{ width: "100%", maxWidth: { xs: "80%", md: "66%" }, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Content
        </Typography>
        <ReactQuill
          ref={quillRef}
          className="resize overflow-auto min-h-96 max-h-screen max-w-6xl min-w-96"
          theme="snow"
          value={value}
          onChange={setValue}
          placeholder="Start typing..."
          modules={customReactQuillModule}
          style={{ minHeight: "24rem" }}
        />
      </Box>

      {loading && <LoadingIndicator />}

      {/* Buttons */}
      <Button
        variant="contained"
        color="primary"
        sx={{ my: 2, width: "50%" }} // same width as before
        onClick={() => {
          if (blogTitle && image && value && value !== "<p><br></p>") {
            setLoading(true);
            handleCreateBlogButton();
          } else {
            console.log("Invalid input");
          }
        }}
      >
        Create Blog
      </Button>

      <Button
        variant="contained"
        color="error"
        sx={{ my: 2, width: "50%" }} // same width as before
        onClick={() => {
          setImage("");
          setPreviewImage("");
          setBlogTitle("");
          setValue("");
        }}
      >
        Clear
      </Button>
    </Box>
  );
}

export default CreateBlog;
