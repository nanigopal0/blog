import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { uploadImage } from "./util/UploadImageCloudinary";
import { useAuth } from "./contexts/AuthContext";
import PreviewPost from "./components/PreviewPost";
import LoadingIndicator from "./components/LoadingIndicator";
import { getCategoriesFromServer } from "./util/api-request/CategoryUtil";
import apiErrorHandle, { type APIError } from "./util/APIErrorHandle";
import { getBlogById, updateBlogById } from "./util/api-request/BlogUtil";
import toast from "react-hot-toast";
import CustomEditor from "./components/tiptap/CustomEditor";
import type CategoryInfo from "./types/blog/CategoryInfo";
import type { BlogInfo, UpdateBlog } from "./types/blog/BlogInfo";
import { Editor } from "@tiptap/react";

function EditBlog() {
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [blogTitle, setBlogTitle] = useState("");
  const coverImageInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(0);
  const [categories, setCategories] = useState<CategoryInfo[]>([
    { id: 0, category: "Choose a category" },
  ]);
  const { removeCreds } = useAuth();
  const [blogInfo, setBlogInfo] = useState<BlogInfo | null>(null);
  const param = useParams();
  const [previewPost, setPreviewPost] = useState(false);
  const editorRef = useRef<Editor | null>(null);
  const blogId = Number(param["id"]);

  useEffect(() => {
    fetchData();
  }, [blogId]);

  useEffect(() => {
    if (blogInfo?.category?.id !== undefined) {
      setCategoryIndex(blogInfo.category.id);
    }
  }, [categories, blogInfo]);

  useEffect(() => {
    if (blogInfo && editorRef.current) {
      editorRef.current.commands.setContent(JSON.parse(blogInfo.blog.content));
    }
  }, [blogInfo, editorRef]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [cats, blogData] = await Promise.all([
        getCategoriesFromServer(),
        getBlogById(blogId)
      ]);

      setCategories([{ id: 0, category: "Choose a category" }, ...cats]);
      setBlogInfo(blogData);
      setPreviewImage(blogData.blog.coverImage);
      setBlogTitle(blogData.blog.title);
      setPreviewImage(blogData.blog.coverImage);
    } catch (error) {
      apiErrorHandle(error as APIError, removeCreds);
    } finally {
      setLoading(false);
    }
  };

  const setCategoryIndex = (categoryId: number) => {
    const idx = categories.findIndex((cat) => cat.id == categoryId);
    setSelectedCategoryIdx(idx);
  };

  const initRef = (editorInstance: Editor) => {
    // console.log(editorInstance)
    editorRef.current = editorInstance;
  };

  const handleEditBlogBtnClick = async () => {
    if (selectedCategoryIdx == 0) {
      toast.error("Please select a category");
      return;
    }
    if (!editorRef.current || !blogInfo) return;

    if (!blogTitle) {
      toast.error("Title is required");
      return;
    }
    const loadingId = toast.loading("Updating blog...");

    const coverImageUrl =
      image === null ? previewImage : await uploadImage(image);
    try {
      const data = {
        coverImage: coverImageUrl,
        title: blogTitle,
        content: JSON.stringify(editorRef.current.getJSON()),
      };
      if (data.content && data.coverImage && data.title) {
        updateBlogBackend(data);
      }
    } catch (error) {
      apiErrorHandle(error as APIError, removeCreds);
    } finally {
      toast.dismiss(loadingId);
    }
  };

  const updateBlogBackend = async (data: UpdateBlog) => {
    const response = await updateBlogById(data,blogId);
    toast.success(response);
    navigate("/home");
  };

  const handleCoverImageClick = () => {
    if (coverImageInputRef.current) coverImageInputRef.current.click();
  };

  if (loading)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <LoadingIndicator size={40} />
      </div>
    );

  return (
    <div className="m-4 flex flex-col items-center min-h-screen ">
      {previewPost && (
        <PreviewPost
          onClose={() => setPreviewPost(false)}
          jsonPost={editorRef.current && editorRef.current.getJSON()}
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
            if (e.target.files && e.target.files[0]) {
              setImage(e.target.files[0]);
              setPreviewImage(URL.createObjectURL(e.target.files[0]));
            }
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
            onChange={(e) => setSelectedCategoryIdx(Number(e.target.value))}
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
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-vertical"
          />
        </div>
      </div>

      <div className="w-full md:w-2/3 mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          Content
        </h3>

        {blogInfo && blogInfo.blog.content && <CustomEditor init={initRef} initialContent={JSON.parse(blogInfo.blog.content)}/>}
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
          onClick={handleEditBlogBtnClick}
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
