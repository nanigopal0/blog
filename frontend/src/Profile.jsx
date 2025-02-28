import { name } from "@cloudinary/url-gen/actions/namedTransformation";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoadingIndicator from "./util/LoadingIndicator";
import { handleResponseFromFetchBlog } from "./util/HandleResponse";
import {API_BASE_URL} from "./util/BaseUrl";

function Profile({ onLogin }) {
    const [changePasswordButtonClicked, setChangePasswordButtonClicked] =
        useState(false);
    const [updateProfileButtonClicked, setUpdateProfileButtonClicked] =
        useState(false);
    const profileImageRef = useRef(null);
    const [profileImage, setProfileImage] = useState(null);
    const [profileImageInput, setProfileImageInput] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [fullNameInput, setFullNameInput] = useState("");
    const [emailInput, setEmailInput] = useState("");
    const [currentPasswordInput, setCurrentPasswordInput] = useState("");
    const [newPasswordInput, setNewPasswordInput] = useState("");
    const [reEnterNewPasswordInput, setReEnterNewPasswordInput] = useState("");
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {

        const fetchUser = async () => {
            try {
                const userResult = await fetch(`${API_BASE_URL}/register/get`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: token,
                        },
                    }
                );
                if (userResult.status == 401) {
                    localStorage.removeItem("token");
                    setToken(null);
                    navigate("/login");
                    throw new Error("Unauthorised user as token invalid");
                }
                if (!userResult.ok) {
                    throw new Error("Network response was not ok");
                }
                const resultData = await userResult.json();
                setLoading(false);
                setUserInfo(resultData);
                setEmailInput(resultData.email)
                setFullNameInput(resultData.name)
                setProfileImage(resultData.photo)
            } catch (error) {
                console.error("There has been a problem with fetch operation:", error);
            }
        }

        fetchUser();
    }, []);

    const setChangePasswordAndUpdateProfileButtonToOff = () => {
        setChangePasswordButtonClicked(false);
        setUpdateProfileButtonClicked(false);
    };

    const isCurrentPasswordCorrect = async () => {

        try {
            if (currentPasswordInput) {
                const data = {
                    email: userInfo.email,
                    password: currentPasswordInput,
                };

                const result = await fetch(
                    `${API_BASE_URL}/public/login`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data),
                    }
                );
                if (result.status == 401) throw new Error("Unauthorised user!");
                if (!result.ok) {
                    throw new Error("Network response was not ok");
                }
                return true;
            } else return false;
        } catch (error) {
            console.error("There has been a problem with fetch operation:", error);
            return false;
        }
    };

    const changePasswordHandler = async () => {
        try {
            if (await isCurrentPasswordCorrect() && newPasswordInput === reEnterNewPasswordInput) {
                setLoading(true)
                const data = {
                    id: userInfo.id,
                    password: newPasswordInput,
                }
                const response = await fetch(`${API_BASE_URL}/register/update`, {
                    method: "PUT",
                    headers: {
                        Authorization: token,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data)
                });

                const result = await handleResponseFromFetchBlog(response, onLogin);
                setUserInfo(result);
                setLoading(false);
                setChangePasswordAndUpdateProfileButtonToOff();
            } else throw new Error("Current password was wrong!");
        } catch (error) {
            prompt(error);
            setLoading(false)
            console.error("There has been a problem with fetch operation:", error);
        }
    };


    const uploadProfileImageToCloudinary = async (pic) => {
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
            return null;
        }
    };

    const updateProfileHandler = async () => {
        try {
            setLoading(true)
            let url =null;
            if (profileImageInput){
                url = await uploadProfileImageToCloudinary(profileImageInput);
                setProfileImage(url)
            }
            const data = {
                id: userInfo.id,
                name: fullNameInput,
                email: emailInput,
                photo: url,
            }
            const response = await fetch(`${API_BASE_URL}/register/update`, {
                method: "PUT",
                headers: {
                    Authorization: token,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            });

            const result = await handleResponseFromFetchBlog(response, onLogin);
            console.log(result)
            setUserInfo(result);
            setLoading(false)
            setChangePasswordAndUpdateProfileButtonToOff();
        } catch (error) {
            setLoading(false)
            console.error("There has been a problem with fetch operation:", error);
        }
    };

    const deleteAccount = async () => {
        setLoading(true)
        try {
            const result = await fetch(`${API_BASE_URL}/register/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: token,
                }
            });
            if(result.status == 204){
                setLoading(false)
                localStorage.removeItem("token");
                setToken(null);
                navigate("/login");
                onLogin();
                throw new Error("Deleted account!")
            } else await handleResponseFromFetchBlog(result, onLogin);
        } catch (error) {
            setLoading(false)
            console.log(error)
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        navigate("/login");
        onLogin()
    };

    return (
        <div className="m-5 flex justify-center items-center">
            {userInfo && (
                <div className="flex flex-col w-1/2 ">
                    {loading ? <LoadingIndicator /> : <></>}
                    <img onClick={() => {
                        if (updateProfileButtonClicked)
                            profileImageRef.current.click()
                    }
                    }
                        className="w-32 h-32 rounded-full self-center border border-gray-600 my-4"
                        src={profileImageInput ? URL.createObjectURL(profileImageInput) : userInfo.photo? userInfo.photo : "/src/assets/person.svg" }
                        alt="user profile image"
                    />

                    <input ref={profileImageRef} hidden={true} type="file" onChange={(i) => setProfileImageInput(i.target.files[0])} />

                    <div hidden={updateProfileButtonClicked} className="self-center">
                        <p className="text-lg mb-2">Name: {userInfo.name}</p>
                        <p className="text-lg text-left">Email: {userInfo.email}</p>
                        <button hidden={changePasswordButtonClicked}
                            className={` text-blue-600 my-4`}
                            onClick={() => setChangePasswordButtonClicked(true)}
                        >
                            Change password
                        </button>
                    </div>

                    <div
                        className={` ${changePasswordButtonClicked || updateProfileButtonClicked
                            ? "block"
                            : "hidden"
                            } flex flex-col my-4`}
                    >
                        <p className="text-lg font-semibold">{
                            updateProfileButtonClicked ? "Update profile" : "Change Password"}</p>
                        <input hidden={!updateProfileButtonClicked}
                            type="text"
                            value={fullNameInput}
                            onChange={(n) => setFullNameInput(n.target.value)}
                            className={` my-4 border border-black rounded-lg p-2`}
                            placeholder="Enter full name"
                        />
                        <input
                            type="email"
                            value={emailInput}
                            onChange={(e) => setEmailInput(e.target.value)}
                            className="my-4 border border-black rounded-lg p-2"
                            placeholder="Enter email"
                        />
                        <input
                            hidden={updateProfileButtonClicked}
                            type="password"
                            value={currentPasswordInput}
                            onChange={(c) => setCurrentPasswordInput(c.target.value)}
                            className="my-4 border border-black rounded-lg p-2"
                            placeholder="Enter current password"
                        />
                        <input
                            hidden={updateProfileButtonClicked}
                            type="password"
                            value={newPasswordInput}
                            onChange={(n) => setNewPasswordInput(n.target.value)}
                            className="my-4 border border-black rounded-lg p-2"
                            placeholder="Enter new password"
                        />
                        <input
                            hidden={updateProfileButtonClicked}
                            type="password"
                            value={reEnterNewPasswordInput}
                            onChange={(r) => setReEnterNewPasswordInput(r.target.value)}
                            className="my-4 border border-black rounded-lg p-2"
                            placeholder="Re-enter new password"
                        />
                        <div className="my-4 flex">
                            <button className="bg-green-800 text-white w-1/2 py-2 px-4 mr-4 rounded-lg"
                                onClick={() => {
                                    if (updateProfileButtonClicked)
                                        updateProfileHandler();
                                    else if (changePasswordButtonClicked)
                                        changePasswordHandler();
                                }}
                            >
                                Save
                            </button>
                            <button
                                className="bg-slate-600 text-white w-1/2 py-2 px-4 rounded-lg"
                                onClick={() => {
                                    setChangePasswordButtonClicked(false);
                                    setUpdateProfileButtonClicked(false);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                    <button hidden={updateProfileButtonClicked}
                        className={`$ bg-blue-600 text-white p-2 mb-4 rounded-lg`}
                        onClick={() => setUpdateProfileButtonClicked(true)}
                    >
                        Update profile
                    </button>

                    <button className="bg-blue-400 text-black p-2 my-4 rounded-lg" onClick={() => logout()}>
                        Log out
                    </button>
                    <button className="bg-red-500 text-white p-2 rounded-lg" onClick={() => deleteAccount()}>
                        Delete account
                    </button>
                </div>
            )}
        </div>
    );
}

export default Profile;
