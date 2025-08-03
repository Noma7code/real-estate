import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

export default function Profile() {
  //create a reference for file upload
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [formData, setFormData] = useState({}); 
  const [filePercentage, setFilePercentage] = useState(0);
  const [fileUploadError,setFileUploadError] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    if(file){
      handleFileUpload(file);

    }
  }, [file]);

  const handleFileUpload = async (file) => {
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("image", file); 
  
      setFilePercentage(0); 
      setFileUploadError(false); 
  
      const { data } = await axios.post("/api/upload/image-upload", formDataUpload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setFilePercentage(progress);
        },
      });
  
      // Set the Cloudinary image URL to your form
      setFormData((prevForm) => ({
        ...prevForm,
        avatar: data.data.secure_url,
      }));
    } catch (err) {
      console.error("Upload failed:", err);
      setFileUploadError(true);
    }
  };
  

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-center text-3xl font-bold my-8">Profile</h1>
      <form className="flex flex-col gap-4">
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
          <span  className="text-red-600">Failed to upload image</span>
        ) : (
          filePercentage >= 0 && filePercentage < 100 ? (
            <span className="text-slate-700">Uploading {filePercentage}%</span>
          ) : filePercentage === 100 ? (
            <span className="text-green-600">Image uploaded successfully</span>
          ) : ""
        )}
     </p>
        <input
          type="text" 
          placeholder="username"
          id="username"
          className="border p-3 rounded-lg bg-white"
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg  bg-white"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg  bg-white"
        />
        <button className="rounded-lg uppercase hover:opacity-90 disabled:opacity-80 bg-slate-700 text-white p-3">
          Update
        </button>
        <div className="flex justify-between mt-5">
          <span className="text-red-700 cursor-pointer">Delete Account</span>
          <span className="text-red-700 cursor-pointer">Sign out</span>
        </div>
      </form>
    </div>
  );
}
