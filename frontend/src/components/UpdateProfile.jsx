import { AuthContext } from "@/contexts/AuthContext";
import apiErrorHandle from "@/util/APIErrorHandle";
import { uploadImage } from "@/util/UploadImageCloudinary";
import { updateUser } from "@/util/UserUtil";
import { User } from "lucide-react";
import { useContext, useRef, useState } from "react";
import toast from "react-hot-toast";
import Dialog from "./Dialog";

export default function UpdateProfile({ bio, name, photo, isOpen, onClose }) {
  const [updatedName, setUpdatedName] = useState(name);
  const [updatedPhoto, setUpdatedPhoto] = useState(photo);
  const [updatedBio, setUpdatedBio] = useState(bio);
  const { removeCreds, updateUserInfo } = useContext(AuthContext);
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const profileImageInputRef = useRef(null);

  const handleUpdateProfile = async () => {
    const loadingId = toast.loading("Updating profile...");
    setLoading(true);
    try {
      let profileImageUrl = photo;
      if (imageFile) {
        profileImageUrl = await uploadImage(imageFile);
      }
      const data = {
        name: updatedName,
        photo: profileImageUrl,
        bio: updatedBio,
      };
      await updateUserBackend(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      toast.dismiss(loadingId);
    }
  };

  const updateUserBackend = async (data) => {
    try {
      const response = await updateUser(data);
      updateUserInfo(response);
      toast.success("Profile updated successfully");
    } catch (error) {
      const retry = await apiErrorHandle(error, removeCreds);
      if (retry) updateUserBackend(data);
    }
  };

  const handleChangeImageInput = (e) => {
    setUpdatedPhoto(URL.createObjectURL(e.target.files[0]));
    setImageFile(e.target.files[0]);
  };
  return (
    <Dialog isOpen={isOpen} onClose={onClose} title={"Update Profile"}>
      <div className="p-2 flex flex-col gap-4">
        {/* Change Avatar */}
        <div
          onClick={() => profileImageInputRef.current.click()}
          className="mx-auto w-32 h-32 sm:w-40 cursor-pointer
       sm:h-40 border rounded-full overflow-hidden"
        >
          {updatedPhoto ? (
            <img
              src={updatedPhoto}
              alt="Profile"
              className="w-full rounded-full h-full object-cover scale-125 object-top"
            />
          ) : (
            <User size={""} />
          )}
          <input
            ref={profileImageInputRef}
            hidden
            type="file"
            accept="image/*"
            onChange={handleChangeImageInput}
          />
        </div>
        {/* Change Name  */}
        <div>
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <input
            type="text"
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
            className="w-full py-2 px-3 border border-gray-500  
          rounded-lg bg-white dark:bg-gray-700 "
          />
        </div>

        {/* Change Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Bio</label>

          <textarea
            type="text"
            value={updatedBio}
            maxLength={500}
            onChange={(e) => setUpdatedBio(e.target.value)}
            className="w-full py-2 px-3 border border-gray-500  
            rounded-lg bg-white dark:bg-gray-700 "
          />
          <label className="text-sm block text-end font-medium mt-2">
            {updatedBio.length}/500
          </label>
        </div>

        <button
          onClick={handleUpdateProfile}
          disabled={loading}
          className=" bg-blue-600 mx-auto hover:bg-blue-700 disabled:text-gray-400 disabled:bg-blue-900 disabled:cursor-not-allowed
         text-white font-medium py-2 px-4 rounded-full cursor-pointer "
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </div>
    </Dialog>
  );
}
