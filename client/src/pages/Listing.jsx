import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

export default function Listing() {
  SwiperCore.use([Navigation]);
  const params = useParams();
  const [getListingError, setGetListingError] = useState(false);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setGetListingError(false);
        setLoading(true);
        const { data } = await axios.get(
          `/api/listing/getlisting/${params.listingId}`
        );
        if (data.success === false) {
          setLoading(false);
          setGetListingError(data.message);
          return;
        }
        setListing(data);
        setLoading(false);
      } catch (error) {
        setGetListingError(error);
        setLoading(false);
      }
    };
    fetchListing();
  }, [params.listingId]);

  return (
    <main>
      {loading && (
        <p className="text-slate-700 text-3xl text-center my-7">Loading...</p>
      )}
      {getListingError && (
        <p className="text-slate-700 text-3xl text-center my-7">
          Something went wrong
        </p>
      )}
      {listing && !loading && !getListingError && (
        <div>
          <Swiper navigation>
            {listing.imgUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[450px]"
                  style={{
                    background: `url(${url}) center no-repeat `,
                    backgroundSize: "cover",
                  }}
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </main>
  );
}
