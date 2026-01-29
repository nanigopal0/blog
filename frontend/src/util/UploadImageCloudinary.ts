export const MAX_IMAGE_SIZE_MB:number = 5; // 5MB
import axios from "axios";
import imageCompression from "browser-image-compression";

export const uploadImage = async (pic: File):Promise<string> => {
  if (!pic) throw new Error("No image provided");

  if (pic.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
    throw new Error("Image size must be less than 5MB");
  }

  const compressedFile = await compressImage(pic);

  const data = new FormData();
  data.append("file", compressedFile);
  data.append(
    "upload_preset",
    import.meta.env["VITE_CLOUDINARY_UPLOAD_PRESET_NAME"]
  );
  data.append("cloud_name", import.meta.env["VITE_CLOUDINARY_CLOUD_NAME"]);
  data.append("folder", import.meta.env["VITE_CLOUDINARY_FOLDER"]);
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${
        import.meta.env["VITE_CLOUDINARY_CLOUD_NAME"]
      }/image/upload`,
      data
    );
    if (response.status != 200) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
    const resultData = await response.data;
    // Step 3: Return optimized URL
    const optimizedUrl = resultData.secure_url.replace(
      "/upload/",
      "/upload/f_auto,q_auto:good/"
    );
    return optimizedUrl;
}

const compressImage = async (file:File):Promise<File> => {
  return await imageCompression(file, {
    fileType: "image/webp", // Convert to WebP
    maxSizeMB: MAX_IMAGE_SIZE_MB, 
    maxWidthOrHeight: 1200, // Resize if too big
    initialQuality: 0.7, // Start with 70% quality
    useWebWorker: true,
  });
};
