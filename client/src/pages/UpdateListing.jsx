import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateListing() {
  const [files, setFiles] = useState([]);
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const [getListingError, setGetListingError] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const [formData, setFormData] = useState({
    imgUrls: [],
    name: "",
    description: "",
    address: "",
    regularPrice: 50,
    discountPrice: 0,
    bedrooms: 1,
    bathrooms: 1,
    furnished: false,
    parking: false,
    type: "",
    offer: false,
  });

  useEffect(() => {
    const fetchListing = async () => {
      setGetListingError(false);
      const listingId = params.listingId;
      const { data } = await axios.get(`/api/listing/getlisting/${listingId}`);
      if (data.success === false) {
        return setGetListingError(data.message);
      }
      setFormData(data);
    };
    fetchListing();
  }, []);

  const handleImageSubmit = async () => {
    setUploading(true);
    setImageUploadError(false);
    if (!files || files.length === 0) {
      setUploading(false);
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

  const handleChange = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "text" ||
      e.target.type === "textarea"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.imgUrls.length < 1)
        return setError("You must upload at least one image");
      if (+formData.discountPrice > +formData.regularPrice)
        return setError("Discount price must be lower than regular price");
      if (!formData.type) {
        return setError("Listing type is required");
      }
      setLoading(true);
      setError(false);

      const { data } = await axios.post(
        `/api/listing/update/${params.listingId}`,
        {
          ...formData,
          userRef: currentUser._id,
        }
      );
      if (data.success === false) {
        setError(data.message);
      }
      navigate(`/listing/${data._id}`);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto p-3 max-w-4xl ">
      <h1 className="text-center my-7 text-3xl font-semibold">
        Update a Listing
      </h1>
      <form
        className="flex flex-col sm:flex-row gap-4"
        onSubmit={handleFormSubmit}
      >
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
            onChange={handleChange}
            value={formData.name}
            className="bg-white p-3  border "
          />
          <textarea
            type="text"
            placeholder="description"
            id="description"
            name="description"
            onChange={handleChange}
            value={formData.description}
            className="bg-white p-3  "
          />
          <input
            type="text"
            placeholder="address"
            id="address"
            name="address"
            onChange={handleChange}
            value={formData.address}
            className="bg-white p-3 "
          />
          {/* checkboxes */}
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={formData.parking}
              />
              <span>Parking spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={formData.furnished}
              />
              <span>furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={formData.offer}
              />
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
                id="bedrooms"
                required
                onChange={handleChange}
                value={formData.bedrooms}
                className="border border-gray-300 rounded-lg p-3"
              />
              <label htmlFor="bedrooms">Beds</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="10"
                id="bathrooms"
                required
                onChange={handleChange}
                value={formData.bathrooms}
                className="border border-gray-300 rounded-lg p-3"
              />
              <label htmlFor="bathrooms ">Baths</label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                id="regularPrice"
                min="50"
                max="1000000"
                required
                onChange={handleChange}
                value={formData.regularPrice}
                className="border border-gray-300 rounded-lg p-3"
              />
              <label
                htmlFor="regularPrice"
                className="flex flex-col items-center"
              >
                Regular Price <span>($ / month)</span>
              </label>
            </div>
            {formData.offer && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  max="1000000"
                  id="discountPrice"
                  required
                  onChange={handleChange}
                  value={formData.discountPrice}
                  className="border border-gray-300 rounded-lg p-3"
                />
                <label
                  htmlFor="discountPrice"
                  className="flex flex-col items-center"
                >
                  Discounted Price <span>($ / month)</span>
                </label>
              </div>
            )}
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
          <button
            disabled={loading || uploading}
            className="text-white uppercase bg-green-500 rounded-lg text-center p-3 hover:opacity-85"
          >
            {loading ? "updating" : "Update Listing"}
          </button>
          {error && <p className="text-red-700">{error}</p>}
        </div>
      </form>
    </main>
  );
}
