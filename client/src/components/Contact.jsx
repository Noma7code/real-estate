import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Contact({ listing }) {
  const [landlord, setLandlord] = useState(false);
  const [error, setError] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        setLandlord(false);
        const { data } = await axios.get(`/api/user/${listing.userRef}`);
        if (data.success === false) {
          setError(data.message);
          return;
        }
        setLandlord(data);
      } catch (error) {
        setError(error);
        setLandlord(false);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  return (
    <>
      {error && (
        <p className="text-red-500">
          {typeof error === "string" ? error : "Error loading landlord."}
        </p>
      )}
      {landlord && (
        <div className="flex flex-col gap-3">
          <p>
            Contact <span className="font-semibold">{landlord.username}</span>{" "}
            for
            <span className="font-semibold"> {listing.name.toLowerCase()}</span>
          </p>
          <textarea
            className="bg-white w-full border rounded-lg"
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={handleChange}
          ></textarea>
          <Link
            className="bg-slate-700 text-white text-center rounded-lg uppercase hover:opacity-95 p-3"
            to={`mailto:${landlord.email}?Subject=Regarding ${listing.name}&body=${message}`}
          >
            Send Message
          </Link>
        </div>
      )}
    </>
  );
}
