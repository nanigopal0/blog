import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { handleResponseFromFetchBlog } from "./util/HandleResponse";
import { uploadImage } from "./util/UploadImageCloudinary";
import LoadingIndicator from "./util/LoadingIndicator";
import { API_BASE_URL } from "./util/BaseUrl";



function CreateBlog({onLogin}) {
  const [image, setImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [blogTitle, setBlogTitle] = useState("");
  const coverImageInputRef = useRef(null);
  const [value, setValue] = useState("");
  const [images, setImages] = useState([]);
  const quillRef = useRef(null);
  const navigate = useNavigate();
  const [loading,setLoading]= useState(false);

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
      console.log(objectURL);
    };
  }, []);

  const customReactQuillModule = useMemo(
    () => ({
      toolbar: {
        container: [
          ["bold", "italic", "underline", "strike"],
          ["blockquote", "code-block"],
          // [{ header: 1 }, { header: 2 }],
          [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
          [{ script: "sub" }, { script: "super" }], // superscript/subscript
          [{ indent: "-1" }, { indent: "+1" }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: [] }, { background: [] }], // dropdown with defaults from theme
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
    []
  );

  const handleCreateBlogButton = async () => {
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
      };
      if (data.content && data.coverImage && data.title) createBlogInDB(data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const createBlogInDB = async (data) => {
    try {
      console.log(data);
      const response = await fetch(
        `${API_BASE_URL}/blog/add`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("token"),
          },
        }
      );
     
      await handleResponseFromFetchBlog(response,onLogin); // Parse the text from the response
      navigate("/home")
    } catch (error) {
      
      console.error("There has been a problem with fetch operation:", error);
    }
  };

  const handleCoverImageClick = () => {
    coverImageInputRef.current.click();
  };

  return (
    <div className="m-4 flex flex-col items-center">
      {/* cover image input starts here*/}
      <div
        onClick={handleCoverImageClick}
        className="h-48 w-4/5 md:w-1/2 flex justify-center ">
        <div className="h-48 border flex items-center justify-center border-gray-400 w-full rounded-md overflow-hidden">
          {previewImage ? (
            <img
              className=" h-48 w-full object-cover"
              src={previewImage}
              alt=""
            />
          ) : (
            <p className="font-medium">Click to choose a cover image</p>
          )}
        </div>
        <input
          type="file"
          ref={coverImageInputRef}
          className="hidden"
          onChange={(f) => {
            setImage(f.target.files[0]);
            setPreviewImage(URL.createObjectURL(f.target.files[0]));
          }}
        />
      </div>

      {/* cover image input ends here */}
      {/* Blog title content  starts here*/}

      <div className="w-4/5 lg:w-2/3">
        <p className="mt-3 text-start text-lg font-medium ">Title</p>
        <textarea
          type="text"
          value={blogTitle}
          onChange={(b) => setBlogTitle(b.target.value)}
          className="max-h-24 border rounded-lg w-full my-2 p-2 border-black"
          placeholder="Enter title"
        />

        <p className="text-start text-lg font-medium ">Content</p>
        <div className="h-48 my-5" onClick={() => quillRef.current}>
          <ReactQuill
            ref={quillRef}
            className="h-1/2 lg:h-3/4"
            theme="snow"
            value={value}
            onChange={setValue}
            placeholder="Start typing..."
            modules={customReactQuillModule}
          />
        </div>

        {/* Blog content ends here */}
      </div>
      {loading? <LoadingIndicator/> : <></>}
      <button
        className="my-4 w-1/2 bg-blue-700 text-white p-2 rounded-md"
        onClick={() => {
          if (blogTitle && image && value && value !== "<p><br></p>") {
            setLoading(true);
            handleCreateBlogButton();
          } else {
            console.log("Invalid input");
            return;
          }
        }}
      >
        Create Blog
      </button>

      <button className="my-4 w-1/2 bg-red-500 text-white p-2 rounded-md"
      onClick={()=>{
        setImage("");
        setPreviewImage("");
        setBlogTitle("");
        setValue("");
      }}>
        Clear
      </button>
    </div>
  );
}

export default CreateBlog;
