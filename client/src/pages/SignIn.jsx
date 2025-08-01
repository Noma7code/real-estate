import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../../redux/user/userSlice";
import { Link, useNavigate } from "react-router-dom";
import Oauth from "../components/Oauth";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);
  // const [error, setError] = useState(false);
  // const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  //onChange function
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  //form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const { data } = await axios.post("/api/auth/signin", formData);
      console.log(data);
      if (!data.success) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.response?.data?.message));
    }
  };

  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="text-3xl text-center font-semibold text-slate-600 my-8">
        Sign In
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 p-3 text-white rounded-lg uppercase 
        hover:opacity-90 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign in"}
        </button>
        <Oauth />
      </form>
      <div className="flex gap-4 mt-7">
        <p>Dont have an account ?</p>
        <Link to="/signup">
          <span className="text-green-500">Sign up</span>
        </Link>
      </div>
      <p className="text-red-600">{error}</p>
    </div>
  );
}
