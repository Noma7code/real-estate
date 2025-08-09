import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { SwiperSlide, Swiper } from "swiper/react";
import "swiper/css/bundle";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import ListingItem from "../components/ListingItem";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);

  console.log(saleListings);

  useEffect((e) => {
    const fetchOfferListings = async () => {
      try {
        const { data } = await axios.get(`/api/listing/get?offer=true&limit=4`);
        setOfferListings(data);
        fetchRentListing();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchRentListing = async () => {
      try {
        const { data } = await axios.get(`/api/listing/get?type=rent&limit=4`);
        setRentListings(data);
        fetchSaleListing();
      } catch (error) {
        console.error(error);
      }
    };

    const fetchSaleListing = async () => {
      try {
        const { data } = await axios.get(`/api/listing/get?type=sale&limit=4`);
        setSaleListings(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchOfferListings();
  }, []);

  return (
    <div>
      {/* top */}
      <div className="flex flex-col gap-4 mt-24 max-w-6xl mx-auto">
        <h1 className="text-3xl text-slate-700 font-bold lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span>
          <br />
          place with ease.
        </h1>

        <div className="text-xm text-gray-500 sm:text-sm mt-7">
          Fancy Estate is the best place to find your next perfect place to live
          <br />
          We will help you find your home fast,easy and confortable. Our experts
          are always available
        </div>
        <Link
          to={`/search`}
          className="text-blue-900 font-bold hover:underline text-shadow-gray-400 text-shadow-lg mb-7"
        >
          Let's Start now...
        </Link>
      </div>

      {/* swiper */}
      <Swiper navigation>
        {offerListings &&
          offerListings.length > 0 &&
          offerListings.map((listing) => (
            <SwiperSlide>
              <div
                style={{
                  background: `url(${listing.imgUrls[0]}) center no-repeat`,
                  backgroundSize: "cover",
                }}
                className="h-[450px]"
                key={listing._id}
              ></div>
            </SwiperSlide>
          ))}
      </Swiper>

      {/* listing results for offer, sale and rent */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {offerListings && offerListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-slate-700 text-2xl font-semibold">
                Recent offers
              </h2>
              <Link
                to={`/search?offer=true`}
                className="text-sm text-blue-800 hover:underline"
              >
                Show more offers
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 ">
              {offerListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {rentListings && rentListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-slate-700 text-2xl font-semibold">
                Recent places for rent
              </h2>
              <Link
                to={`/search?type=rent`}
                className="text-sm text-blue-800 hover:underline"
              >
                Show more places for rent
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 ">
              {rentListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
        {saleListings && saleListings.length > 0 && (
          <div className="">
            <div className="my-3">
              <h2 className="text-slate-700 text-2xl font-semibold">
                Recent for sale
              </h2>
              <Link
                to={`/search?offer-true`}
                className="text-sm text-blue-800 hover:underline"
              >
                Show more places for sale
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 ">
              {saleListings.map((listing) => (
                <ListingItem listing={listing} key={listing._id} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
