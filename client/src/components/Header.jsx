import { useEffect } from "react";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link, useNavigate, useLocation } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);
  return (
    <header className=" bg-amber-400  shadow-md ">
      <div className="flex justify-between items-center max-w-6xl p-4 mx-auto">
        <h1 className="text-sm sm:text-3xl font-bold flex flex-wrap">
          <span className="text-slate-500 ">Alpha</span>
          <span className="text-slate-700 ">Estates</span>
        </h1>
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 rounded-lg p-2 flex justify-center items-center"
        >
          <input
            onChange={(e) => setSearchTerm(e.target.value)}
            type="text"
            placeholder="Search..."
            value={searchTerm}
            className=" bg-transparent outline-0 w-30 sm:w-64"
          />
          <button>
            <FaSearch className="text-slate-600" />
          </button>
        </form>
        <nav className="flex gap-3 hover:cursor-pointer list-none">
          <Link to="/">
            <li className="hidden sm:inline hover:text-slate-700">Home</li>
          </Link>

          <Link to="/about">
            <li className="hidden sm:inline hover:text-slate-700">About</li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full h-7 w-7"
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              <li className="sm:inline hover:text-slate-700">Sign in</li>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
