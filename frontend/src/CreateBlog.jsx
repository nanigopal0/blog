import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadImage } from "./util/UploadImageCloudinary";
import { AuthContext } from "./contexts/AuthContext";
import { SimpleEditor } from "./components/tiptap-templates/simple/simple-editor";
import PreviewPost from "./components/PreviewPost";
import LoadingIndicator from "./components/LoadingIndicator";
import { getCategoriesFromServer } from "./util/LoadCategory";
import apiErrorHandle from "./util/APIErrorHandle";
import { postBlog } from "./util/BlogUtil";
import toast from "react-hot-toast";

function CreateBlog() {
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
  const { userInfo, removeCreds } = useContext(AuthContext);
  const [editor, setEditor] = useState(null);
  const [previewPost, setPreviewPost] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const cats = await getCategoriesFromServer();
      setCategories([{ id: 0, category: "Choose a category" }, ...cats]);
    } catch (error) {
      apiErrorHandle(error, removeCreds);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBlogButton = async () => {
    if (selectedCategoryIdx <= 0) {
      toast.error("Please select a category");
      return;
    }
    const loadingId = toast.loading("Creating blog...");

    const coverImageUrl = await uploadImage(image);
    try {
      const data = {
        coverImage: coverImageUrl,
        title: blogTitle,
        content: JSON.stringify(editor.getJSON()),
        userId: userInfo.id,
        categoryId: categories[selectedCategoryIdx].id,
      };
      if (data.content && data.coverImage && data.title) {
        const response = await postBlog(data);
        toast.success(response);
        navigate("/home");
      }
    } catch (error) {
      apiErrorHandle(error, removeCreds);
    } finally {
      toast.dismiss(loadingId);
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
      <div className="p-8 flex flex-col items-center min-h-screen ">
        {previewPost && (
          <PreviewPost
            onClose={() => setPreviewPost(false)}
            jsonPost={editor.getJSON()}
          />
        )}
        {/* Cover Image Input */}
        <div
          onClick={handleCoverImageClick}
          className="h-72 w-4/5 md:w-1/2 mb-8 flex justify-center items-center border border-gray-600 rounded-lg overflow-hidden cursor-pointer"
        >
          {previewImage ? (
            <img
              src={previewImage}
              alt="Cover"
              className="w-full h-full object-cover "
            />
          ) : (
            <p className="text-gray-600 font-medium">
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

        {/* Blog Title and Category */}
        <div className="w-4/5 md:w-2/3 mb-8">
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
        <div className="w-full lg:max-w-4/5 p-4 mb-8">
          <h3 className="text-lg font-semibold mb-4">Content</h3>
          <div className="p-1 w-full rounded-2xl border border-black/20 dark:border-white/20 shadow-lg overflow-auto">
            <SimpleEditor
              onActivate={setEditor}
              initialContent={"Start typing..."}
            />
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
