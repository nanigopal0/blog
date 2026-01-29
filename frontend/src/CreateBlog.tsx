import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadImage } from "./util/UploadImageCloudinary";
import { useAuth } from "./contexts/AuthContext";

import PreviewPost from "./components/PreviewPost";
import LoadingIndicator from "./components/LoadingIndicator";

import apiErrorHandle, { type APIError } from "./util/APIErrorHandle";
import { postBlog } from "./util/api-request/BlogUtil";
import toast from "react-hot-toast";
import CustomEditor from "./components/tiptap/CustomEditor";
import { getCategoriesFromServer } from "./util/api-request/CategoryUtil";
import type CategoryInfo from "./types/blog/CategoryInfo";
import type { Editor } from "@tiptap/react";
import type { BlogPost } from "./types/blog/BlogInfo";

function CreateBlog() {
  const [image, setImage] = useState<File|null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [blogTitle, setBlogTitle] = useState("");
  const coverImageInputRef = useRef<HTMLInputElement|null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [selectedCategoryIdx, setSelectedCategoryIdx] = useState(0);
  const [categories, setCategories] = useState<CategoryInfo[]>([
    { id: 0, category: "Choose a category" },
  ]);
  const { basicUserInfo, removeCreds } = useAuth();
  const [previewPost, setPreviewPost] = useState(false);
  const editorRef = useRef<Editor |null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const cats = await getCategoriesFromServer();
      setCategories([{ id: 0, category: "Choose a category" }, ...cats]);
    } catch (error) {
      apiErrorHandle(error as APIError, removeCreds);
      
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlogButton = async () => {
    if (selectedCategoryIdx <= 0) {
      toast.error("Please select a category");
      return;
    }
  
    const selectedCategory = categories[selectedCategoryIdx];
    if (!selectedCategory) {
      toast.error("Invalid category selected");
      return;
    }
    if (!editorRef.current) {
        toast.error("Editor not initialized");
        return;
      }
    if (!image) {
      toast.error("Please select a cover image");
      return;
    }
    const loadingId = toast.loading("Creating blog...");
    const coverImageUrl = await uploadImage(image);
    
    try {
      const data: BlogPost = {
        coverImage: coverImageUrl,
        title: blogTitle,
        content: JSON.stringify(editorRef.current.getJSON()),
        userId: basicUserInfo!.id,
        categoryId: selectedCategory.id,
      };
      if (data.content && data.coverImage && data.title) 
        createBlogBackend(data);
      
    } catch (error) {
      console.log(error)
    } finally {
      toast.dismiss(loadingId);
    }
  };

  const createBlogBackend = async (data:BlogPost) => {
    try {
      const response = await postBlog(data);
      toast.success(response);
      navigate("/home");
    } catch (error) {
      apiErrorHandle(error as APIError, removeCreds);
      
    }
  };

  const handleCoverImageClick = () => {
    if (coverImageInputRef.current !== null)
      coverImageInputRef.current.click();
  };

   const initRef = (editorInstance: Editor) => {
    editorRef.current = editorInstance;
  };

  if (loading)
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <LoadingIndicator size={40} />
      </div>
    );
  else
    return (
      <div className="lg:px-8 py-8 px-4 flex flex-col items-center min-h-screen ">
        {previewPost && (
          <PreviewPost
            onClose={() => setPreviewPost(false)}
            jsonPost={editorRef.current && editorRef.current.getJSON()}
          />
         
        )}
        {/* Cover Image Input */}
        <div
          onClick={handleCoverImageClick}
          className="h-72 sm:w-3/5 md:w-1/2 w-full mb-8 flex justify-center items-center border border-gray-600 rounded-lg overflow-hidden cursor-pointer"
        >
          {previewImage ? (
            <img
              src={previewImage}
              alt="Cover"
              className="w-full h-full object-cover "
            />
          ) : (
            <p className=" text-gray-600 font-medium text-sm">
              Click to choose a cover image
            </p>
          )}
          <input
            type="file"
            ref={coverImageInputRef}
            className="hidden"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setImage(file);
                setPreviewImage(URL.createObjectURL(file));
              }
            }}
          />
        </div>

        {/* Blog Title and Category */}
        <div className="sm:w-4/5 w-full md:w-2/3 mb-8">
          <div className="mb-6">
            <label
              htmlFor="category"
              className="block text-sm font-medium  mb-2"
            >
              Select a category
            </label>
            <select
              id="category"
              value={selectedCategoryIdx}
              onChange={(e) => setSelectedCategoryIdx(Number(e.target.value))}
              className="w-full px-3 py-2 border border-black/20 dark:border-white/20 dark:bg-gray-900 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 "
            >
              {categories.map((category, index) => (
                <option key={index} value={index}>
                  {category.category}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title
            </label>
            <textarea
              id="title"
              value={blogTitle}
              onChange={(e) => setBlogTitle(e.target.value)}
              placeholder="Enter title"
              rows={2}
              className="w-full px-3 py-2 border border-black/20 dark:border-white/20 rounded-md shadow-lg resize-vertical"
            />
          </div>
        </div>

        {/* Blog Content */}
        <div className="w-full lg:max-w-4/5 mb-8">
          <h3 className="text-lg font-semibold mb-4">Content</h3>
          <div className="w-full  overflow-hidden">
           <CustomEditor init={initRef} />
          </div>
        </div>

        {/* Buttons */}
        <div className="mx-auto gap-6 flex">
          <button
            className=" bg-green-600 text-white rounded-full px-4 py-2 cursor-pointer hover:bg-green-700"
            onClick={() => setPreviewPost(true)}
          >
            Preview
          </button>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 cursor-pointer
        disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            disabled={loading || !blogTitle || !image}
            onClick={() => {
              if (blogTitle && image) {
                handleCreateBlogButton();
              } else {
                console.log("Invalid input");
              }
            }}
          >
            Create Blog
          </button>
        </div>
      </div>
    );
}

export default CreateBlog;
