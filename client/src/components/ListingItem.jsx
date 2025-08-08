import React from "react";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";

export default function ListingItem({ listing }) {
  return (
    <div
      className="bg-white shadow-mg hover:shadow-lg transition-shadow
     overflow-hidden rounded-lg w-full sm:w-[250px] "
    >
      <Link to={`/lookuplisting/${listing._id}`}>
        <img
          src={listing.imgUrls[0]}
          alt="listing cover"
          className="h-[300px] sm:h-[220px] w-full object-cover hover:scale-105
           transition-scale duration-300"
        />
        <div className="p-3 flex flex-col gap-2">
          <p className="text-lg font-semi  text-slate-700 truncate">
            {listing.name}
          </p>
          <div className="flex gap-2 items-center ">
            <MdLocationOn className="text-green-700 w-4 h-4 " />
            <p className="text-sm truncate text-gray-600">{listing.address}</p>
          </div>
          <p className=" text-gray-600 text-sm line-clamp-2">
            {listing.description}
          </p>
          <p className="text-2xl text-gray-500 mt-2 font-semibold flex items-center">
            $
            {listing.offer
              ? listing.discountPrice.toLocaleString("en-US")
              : listing.regularPrice.toLocaleString("en-US")}
            {listing.type === "rent" ? " / month" : ""}
          </p>
          <div className="text-slate-700 flex gap-4">
            <div className="font-bold text-xm">
              {listing.bedrooms > 1
                ? `${listing.bedrooms} beds`
                : `${listing.bedrooms} bed`}
            </div>
            <div className="font-bold text-xm">
              {listing.bathrooms > 1
                ? `${listing.bathrooms} baths`
                : `${listing.bathrooms} bath`}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
