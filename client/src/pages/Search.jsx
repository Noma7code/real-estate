import { useEffect } from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [listing, setListing] = useState([]);
  const [sidebardata, setSidebardata] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "create_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListing = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const { data } = await axios.get(`/api/listing/get?${searchQuery}`);
      setListing(data);
      setLoading(false);
    };
    fetchListing();
  }, [location.search]);

  console.log(listing);

  const handleChange = (e) => {
    if (e.target.id === "searchTerm") {
      setSidebardata({ ...sidebardata, searchTerm: e.target.value });
    }
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebardata({ ...sidebardata, type: e.target.id });
    }

    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebardata({
        ...sidebardata,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";
      setSidebardata({ ...sidebardata, sort, order });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebardata.searchTerm);
    urlParams.set("type", sidebardata.type);
    urlParams.set("parking", sidebardata.parking);
    urlParams.set("furnished", sidebardata.furnished);
    urlParams.set("offer", sidebardata.offer);
    urlParams.set("sort", sidebardata.sort);
    urlParams.set("order", sidebardata.order);

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };
  return (
    <div className="flex flex-col md:flex-row">
      {/* filter inputs */}
      <div className="p-7 shadow md:min-h-screen">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex gap-2 items-center ">
            <label
              className="whitespace-nowrap font-semibold"
              htmlFor="searchTerm"
            >
              Search Term:
            </label>
            <input
              type="text"
              value={sidebardata.searchTerm}
              onChange={handleChange}
              id="searchTerm"
              placeholder="search"
              className="bg-white p-3 rounded-lg outline-none border w-full"
            />
          </div>
          {/* types filter */}
          <div className="flex gap-2  flex-wrap items-center">
            <label className=" font-semibold">Type:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="all"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "all"}
              />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.type === "sale"}
              />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.offer}
              />
              <span>Offer</span>
            </div>
          </div>
          {/* amenities:parking, furnished */}
          <div className="flex gap-2">
            <label className=" font-semibold">Amenities:</label>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.parking}
              />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleChange}
                checked={sidebardata.furnished}
              />
              <span>Furnished</span>
            </div>
          </div>
          {/* sort */}
          <div className="flex items-center gap-2">
            <label className=" font-semibold">Sort:</label>
            <select
              id="sort_order"
              onChange={handleChange}
              defaultValue="created_at_desc"
              className="w-full bg-white border rounded-lg p-3"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">price low to high</option>
              <option value="createAt_desc">latest</option>
              <option value="createdAt_asc">oldest</option>
            </select>
          </div>
          <button className="bg-slate-700 text-white uppercase p-3 rounded-lg hover:opacity-85">
            Search
          </button>
        </form>
      </div>
      {/* filter results */}
      <div>
        <h1 className="text-3xl font-semibold  p-3 text-slate-700 mt-5">
          Listing Results:
        </h1>
      </div>
    </div>
  );
}
