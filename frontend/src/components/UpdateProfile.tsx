import { useAuth } from "@/contexts/AuthContext";
import apiErrorHandle, { type APIError } from "@/util/APIErrorHandle";
import { uploadImage } from "@/util/UploadImageCloudinary";
import { updateUser } from "@/util/api-request/UserUtil";
import { User } from "lucide-react";
import { useCallback, useRef, useState, type ChangeEvent } from "react";
import toast from "react-hot-toast";
import Dialog from "./Dialog";
import type { UpdateProfile } from "@/types/user/UpdateProfile";
import type { DialogProps } from "@/types/DialogProps";

export default function UpdateProfileComponent({
  bio = "",
  name = "",
  photo = "",
  isOpen,
  onClose,
  onSuccess,
}: UpdateProfile & DialogProps) {
  const [updatedName, setUpdatedName] = useState<string>(name ?? "");
  const [updatedPhoto, setUpdatedPhoto] = useState<string>(photo ?? "");
  const [updatedBio, setUpdatedBio] = useState<string>(bio ?? "");
  const { removeCreds, saveUserInfoToState } = useAuth();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const profileImageInputRef = useRef<HTMLInputElement | null>(null);

  const handleUpdateProfile = async () => {
    const loadingId = toast.loading("Updating profile...");
    setLoading(true);
    try {
      let profileImageUrl = updatedPhoto || photo || undefined;
      if (imageFile) {
        profileImageUrl = await uploadImage(imageFile);
      }
      const data: UpdateProfile = {};
      if (updatedName) data.name = updatedName;
      if (profileImageUrl) data.photo = profileImageUrl;
      if (updatedBio) data.bio = updatedBio;
      
      await updateUserBackend(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      toast.dismiss(loadingId);
    }
  };

  const updateUserBackend = useCallback(async (data: UpdateProfile) => {
    try {
      const response = await updateUser(data);
      saveUserInfoToState(response);
      toast.success("Profile updated successfully");
      onSuccess?.();
      reset();
    } catch (error) {
      apiErrorHandle(error as APIError, removeCreds);
    }
  }, [saveUserInfoToState, removeCreds, onClose, onSuccess]);

  const handleChangeImageInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUpdatedPhoto(URL.createObjectURL(file));
      setImageFile(file);
    }
  }, []);

  const clickableImageInput = useCallback(() => {
    profileImageInputRef.current?.click();
  }, []);

  const reset = () => {
    setUpdatedName( name??"");
    setUpdatedBio(bio?? "");
    setUpdatedPhoto(photo?? "");
    setImageFile(null);
    profileImageInputRef.current = null
    onClose();
  }

  return (
    <Dialog isOpen={isOpen} onClose={reset} title={"Update Profile"} outsideClickCloses={false}>
      <div className="p-2 flex flex-col gap-4">
        {/* Change Avatar */}
        <div
          onClick={clickableImageInput}
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
            value={updatedBio}
            maxLength={500}
            onChange={(e) => setUpdatedBio(e.target.value)}
            className="w-full py-2 px-3 border border-gray-500  
            rounded-lg bg-white dark:bg-gray-700 "
          />
          <label className="text-sm block text-end font-medium mt-2">
            {updatedBio?.length ?? 0}/500
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
