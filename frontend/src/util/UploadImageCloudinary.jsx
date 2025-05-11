export const uploadImage = async (pic) => {
    const data = new FormData();
    data.append("file", pic);
    data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_NAME);
    data.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);
    data.append("folder", import.meta.env.VITE_CLOUDINARY_FOLDER);
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: data,
        }
      );
      const resultData = await response.json();
      return resultData.secure_url;
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };