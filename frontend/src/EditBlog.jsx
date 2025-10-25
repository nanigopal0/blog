import { useContext, useEffect, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useParams } from "react-router-dom";
import { uploadImage } from "./util/UploadImageCloudinary";
import { AuthContext } from "./contexts/AuthContext";
import { SimpleEditor } from "./components/tiptap-templates/simple/simple-editor";
import PreviewPost from "./components/PreviewPost";
import LoadingIndicator from "./components/LoadingIndicator";
import { getCategoriesFromServer } from "./util/LoadCategory";
import apiErrorHandle from "./util/APIErrorHandle";
import { getBlogById, updateBlogById } from "./util/BlogUtil";
import toast from "react-hot-toast";

function EditBlog() {
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [blogTitle, setBlogTitle] = useState("");
  const coverImageInputRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(0);
  const [categories, setCategories] = useState([
    { id: 0, category: "Choose a category" },
  ]);
  const { logout, removeCreds } = useContext(AuthContext);
  const [blog, setBlog] = useState({});
  const param = useParams();
  const [editor, setEditor] = useState(null);
  const [previewPost, setPreviewPost] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchBlog();
  }, [param.id]);

  useEffect(() => {
    setCategoryIndex(blog?.category?.id);
  }, [categories, blog]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const cats = await getCategoriesFromServer({ logout });
      setCategories([{ id: 0, category: "Choose a category" }, ...cats]);
    } catch (error) {
      const retry = await apiErrorHandle(error, removeCreds);
      if (retry) await fetchCategories();
    } finally {
      if (blog) setLoading(false);
    }
  };

  const setCategoryIndex = (categoryId) => {
    const idx = categories.findIndex((cat) => cat.id == categoryId);
    setSelectedCategoryIdx(idx);
  };

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const result = await getBlogById(param.id);
      setBlog(result);
      setImage(result.coverImage);
      setPreviewImage(result.coverImage);
      setBlogTitle(result.title);
    } catch (error) {
      const retry = await apiErrorHandle(error, removeCreds);
      if (retry) await fetchBlog();
    } finally {
      if (categories.length > 1) setLoading(false);
    }
  };

  const handleEditBlogBtn = async () => {
    if (selectedCategoryIdx == 0) {
      toast.error("Please select a category");
      return;
    }

    if (!blogTitle || !image) {
      toast.error("Title and Cover Image are required");
      return;
    }
    const loadingId = toast.loading("Updating blog...");

    const coverImageUrl =
      image === blog.coverImage ? image : await uploadImage(image);
    try {
      const data = {
        id: blog.id,
        coverImage: coverImageUrl,
        title: blogTitle,
        content: JSON.stringify(editor.getJSON()),
      };
      if (data.content && data.coverImage && data.title) {
        updateBlogBackend(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      toast.dismiss(loadingId);
    }
  };

  const updateBlogBackend = async (data) => {
    try {
      const response = await updateBlogById(data);
      toast.success(response);
      navigate("/home");
    } catch (error) {
      const retry = await apiErrorHandle(error, removeCreds);
      if (retry) await updateBlogBackend(data);
    }
  };

  const handleCoverImageClick = () => {
    coverImageInputRef.current.click();
  };

  if (loading)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <LoadingIndicator size={40} />
      </div>
    );
  else
    return (
      <div className="m-4 flex flex-col items-center min-h-screen ">
        {previewPost && (
          <PreviewPost
            onClose={() => setPreviewPost(false)}
            jsonPost={editor.getJSON()}
          />
        )}
        {/* Cover Image Input */}
        <div
          onClick={handleCoverImageClick}
          className="h-72 w-4/5 md:w-1/2 mb-4 border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden cursor-pointer flex justify-center items-center hover:border-gray-400 transition-colors"
        >
          {previewImage ? (
            <img
              src={previewImage}
              alt="Cover"
              className="w-full h-full object-contain"
            />
          ) : (
            <p className="font-medium text-gray-600 dark:text-gray-400">
              Click to choose a cover image
            </p>
          )}
          <input
            type="file"
            ref={coverImageInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              setImage(e.target.files[0]);
              setPreviewImage(URL.createObjectURL(e.target.files[0]));
            }}
          />
        </div>

        <div className="w-4/5 md:w-2/3 mb-4">
          {/* Category Select */}
          <div className="mb-3">
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Select a category
            </label>
            <select
              id="category"
              value={selectedCategoryIdx}
              onChange={(e) => setSelectedCategoryIdx(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              {categories.map((category, index) => (
                <option key={category.id} value={index}>
                  {category.category}
                </option>
              ))}
            </select>
          </div>

          {/* Title Input */}
          <div className="mb-3">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Title
            </label>
            <textarea
              id="title"
              value={blogTitle}
              onChange={(e) => setBlogTitle(e.target.value)}
              placeholder="Enter title"
              rows="2"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-vertical"
            />
          </div>
        </div>

        <div className="w-full md:w-2/3 mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Content
          </h3>

          {blog && blog.content && (
            <SimpleEditor
              onActivate={setEditor}
              initialContent={JSON.parse(blog.content)}
            />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 w-1/2">
          <button
            className="p-2 bg-green-600 text-white rounded-lg"
            onClick={() => setPreviewPost(true)}
          >
            Preview
          </button>
          <button
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium py-2 px-4
             rounded-md transition-colors"
            onClick={handleEditBlogBtn}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Blog"}
          </button>

          <button
            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            onClick={() => {
              navigate(-1);
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
}

export default EditBlog;
