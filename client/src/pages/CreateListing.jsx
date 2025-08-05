import { useState } from "react";
import axios from "axios";

export default function CreateListing() {
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    imgUrls: [],
  });

  const handleImageSubmit = async () => {
    setUploading(true);
    setImageUploadError(false);
    if (!files || files.length === 0) {
      setImageUploadError("No file selected");
      return;
    }

    if (files.length > 0 && files.length + formData.imgUrls.length < 7) {
      try {
        const uploadPromises = files.map((file) => storeImage(file));
        const imageUrls = await Promise.all(uploadPromises);

        console.log("Uploaded URLs:", imageUrls);

        // You can now use imageUrls in your form state
        setFormData((prev) => ({
          ...prev,
          imgUrls: imageUrls,
        }));
        setUploading(false);
        setImageUploadError(false);
      } catch (error) {
        setImageUploadError("Image upload faied (2m per image)");
        setUploading(false);
      }
    } else {
      setImageUploadError("You can only upload 6 images per listing");
      setUploading(false);
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

  const storeImage = async (file) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Get signed timestamp and signature from your backend
        const { timestamp, signature } = await getSignaturForUpload("images");

        const data = new FormData();
        data.append("file", file);
        data.append("timestamp", timestamp);
        data.append("signature", signature);
        data.append("api_key", import.meta.env.VITE_CLOUDINARY_API_KEY);
        data.append("folder", "images");

        const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        const resourceType = "image";
        const api = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

        const res = await axios.post(api, data, { withCredentials: false });
        const { secure_url } = res.data;

        resolve(secure_url);
      } catch (error) {
        console.error("Error uploading image:", error);
        reject(error);
      }
    });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imgUrls: formData.imgUrls.filter((_, i) => i !== index),
    });
  };

  return (
    <main className="mx-auto p-3 max-w-4xl ">
      <h1 className="text-center my-7 text-3xl font-semibold">
        Create a Listing
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        {/* name and description */}
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="name"
            id="name"
            name="name"
            maxLength="62"
            minLength="10"
            required
            className="bg-white p-3  border "
          />
          <textarea
            type="text"
            placeholder="description"
            id="description"
            name="description"
            className="bg-white p-3  "
          />
          <input
            type="text"
            placeholder="address"
            id="address"
            name="address"
            className="bg-white p-3 "
          />
          {/* checkboxes */}
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sale" className="w-5" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
              <span>Offer</span>
            </div>
          </div>
          {/* bedroom and bedhouse */}
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="10"
                id="beds"
                required
                className="border border-gray-300 rounded-lg p-3"
              />
              <label htmlFor="beds">Beds</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="10"
                id="bathhouse"
                required
                className="border border-gray-300 rounded-lg p-3"
              />
              <label htmlFor="bathhouse ">Baths</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="1"
                max="10"
                required
                className="border border-gray-300 rounded-lg p-3"
              />
              <label
                htmlFor="regularPrice"
                className="flex flex-col items-center"
              >
                Regular Price <span>($ / month)</span>
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="10"
                id="discountedPrice"
                required
                className="border border-gray-300 rounded-lg p-3"
              />
              <label
                htmlFor="discountedPrice"
                className="flex flex-col items-center"
              >
                Discounted Price <span>($ / month)</span>
              </label>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:{" "}
            <span className="font-normal text-gray-600 ml-2">
              the first image will be the cover (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              type="file"
              id="images"
              accept="image/*"
              multiple
              className="p-3 border border-gray-300 rounded w-full "
              onChange={(e) => setFiles(Array.from(e.target.files))}
            />
            <button
              disabled={uploading}
              type="button"
              onClick={handleImageSubmit}
              className="p-3 text-green-700 border border-green-700 rounded
             uppercase hover:shadow-lg disabled:opacity-80"
            >
              {uploading ? "Uploading" : "upload"}
            </button>
          </div>
          <p className="text-red-700">{imageUploadError}</p>
          {formData.imgUrls.length > 0 &&
            formData.imgUrls.map((url, index) => (
              <div
                key={url}
                className="flex justify-between p-3 shadow-2xl shadow-gray-300 items-center"
              >
                <img
                  src={url}
                  alt="listing image"
                  className="w-30 h-20 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="text-red-700 uppercase hover:opacity-75 hover:font-bold"
                >
                  Delete
                </button>
              </div>
            ))}
          <button className="text-white uppercase bg-green-500 rounded-lg text-center p-3 hover:opacity-85">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
