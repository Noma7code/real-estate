import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  return (
    <header className=" bg-amber-400  shadow-md ">
      <div className="flex justify-between items-center max-w-6xl p-4 mx-auto">
        <h1 className="text-sm sm:text-3xl font-bold flex flex-wrap">
          <span className="text-slate-500 ">Fancy</span>
          <span className="text-slate-700 ">Estates</span>
        </h1>
        <form className="bg-slate-100 rounded-lg p-2 flex justify-center items-center">
          <input
            type="text"
            placeholder="Search..."
            className=" bg-transparent outline-0 w-30 sm:w-64"
          />
          <FaSearch className="text-slate-600" />
        </form>
        <nav className="flex gap-3 hover:cursor-pointer list-none">
          <Link to="/">
            <li className="hidden sm:inline hover:text-slate-700">Home</li>
          </Link>

          <Link to="/about">
            <li className="hidden sm:inline hover:text-slate-700">About</li>
          </Link>
          <Link to="/signup">
            <li className="sm:inline hover:text-slate-700">Sign in</li>
          </Link>
        </nav>
      </div>
    </header>
  );
}
