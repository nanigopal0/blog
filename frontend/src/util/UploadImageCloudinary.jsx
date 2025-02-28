export const uploadImage = async (pic) => {
    const data = new FormData();
    data.append("file", pic);
    data.append("upload_preset", "kdr4dpqf");
    data.append("cloud_name", "dynp2wd6u");
    data.append("folder", "blog-images");
    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dynp2wd6u/image/upload`,
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