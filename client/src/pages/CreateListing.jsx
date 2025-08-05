import React from "react";

export default function CreateListing() {
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
              <label htmlFor="bathhouse text-center">Baths</label>
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
              accept="images/*"
              multiple
              className="p-3 border border-gray-300 rounded w-full "
            />
            <button
              className="p-3 text-green-700 border border-green-700 rounded
             uppercase hover:shadow-lg disabled:opacity-80"
            >
              Upload
            </button>
          </div>
          <button className="text-white uppercase bg-green-500 rounded-lg text-center p-3 hover:opacity-85">
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
}
