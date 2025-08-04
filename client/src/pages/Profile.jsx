import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
} from "../../redux/user/userSlice";
import { useDispatch } from "react-redux";

export default function Profile() {
  //create a reference for file upload
  const fileRef = useRef(null);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    avatar: "",
    password: "",
  });
  const [filePercentage, setFilePercentage] = useState(-1);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const dispatch = useDispatch();

  axios.defaults.withCredentials = true;

  useEffect(() => {
    if (currentUser) {
      setFormData({
        username: currentUser.username || "",
        email: currentUser.email || "",
        avatar: currentUser.avatar || "",
        password: "",
      });
    }
  }, [currentUser]);

  const uploadFile = async (timestamp, signature) => {
    if (!file) {
      console.error("No file selected");
      return;
    }
    const data = new FormData();
    data.append("file", file);
    //needed for secure upload
    data.append("timestamp", timestamp);
    data.append("signature", signature);
    data.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
    data.append("folder", "images");
    //preset upload
    // data.append("upload_preset", "images_preset");

    try {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const resourceType = "image";
      const api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

      const res = await axios.post(api, data, { withCredentials: false });
      const { secure_url } = res.data;
      return secure_url;
    } catch (error) {
      console.error("cloudinary upload error", error);
      setFileUploadError(true);
      return;
    }
  };

  //signature for secure upload
  async function getSignaturForUpload(folder) {
    try {
      const res = await axios.post("/api/upload/sign-upload", { folder });
      return res.data;
    } catch (error) {
      console.error(error);
    }
  }

  const handleFileUpload = async () => {
    try {
      setFileUploadError(false);
      setFilePercentage(0);

      const { timestamp: imgTimeStamp, signature: imgSignature } =
        await getSignaturForUpload("images");
      const imgUrl = await uploadFile(imgTimeStamp, imgSignature);

      if (imgUrl) {
        setFormData({ ...formData, avatar: imgUrl });
        setFilePercentage(100);
        return imgUrl;
      }
    } catch (error) {
      setFileUploadError(true);
      return;
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      if (file) {
        const uploadedUrl = await handleFileUpload();
        if (!uploadedUrl) {
          dispatch(updateUserFailure("Failed too upload image"));
          return;
        }
        formData.avatar = uploadedUrl;
      }
      const { data } = await axios.put(
        `api/user/update/${currentUser._id}`,
        formData
      );
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data.user));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(
        updateUserFailure(error.response?.data?.message || error.message)
      );
    }
  };

  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const { data } = await axios.delete(
        `/api/user/delete/${currentUser._id}`
      );
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-center text-3xl font-bold my-8">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          accept="image/*"
          ref={fileRef}
          hidden
        />
        <img
          src={formData.avatar || currentUser.avatar}
          alt="profile"
          onClick={() => fileRef.current.click()}
          className="w-24 h-24 mt-2 rounded-full object-cover cursor-pointer self-center"
        />
        <p className="text-center text-sm">
          {fileUploadError ? (
            <span className="text-red-600">Failed to upload image</span>
          ) : filePercentage >= 0 && filePercentage < 100 && file !== null ? (
            <span className="text-slate-700">Uploading {filePercentage}%</span>
          ) : filePercentage === 100 ? (
            <span className="text-green-600">Image uploaded successfully</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          placeholder="username"
          id="username"
          value={formData.username}
          onChange={handleChange}
          className="border p-3 rounded-lg bg-white"
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          className="border p-3 rounded-lg  bg-white"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          className="border p-3 rounded-lg  bg-white"
        />
        <button
          disabled={loading}
          className="rounded-lg uppercase hover:opacity-90 disabled:opacity-80 bg-slate-700 text-white p-3"
        >
          {loading ? "Loading" : "Update"}
        </button>
        <div className="flex justify-between mt-5">
          <span className="text-red-700 cursor-pointer" onClick={handleDelete}>
            Delete Account
          </span>
          <span className="text-red-700 cursor-pointer">Sign out</span>
        </div>
      </form>
      <p className="text-red-700">{error ? error : ""}</p>
      <p className="text-green-700">
        {updateSuccess ? "User updated successfully" : ""}
      </p>
    </div>
  );
}
