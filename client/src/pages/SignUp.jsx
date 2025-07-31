import React from "react";
import { Link } from "react-router-dom";

export default function SignUp() {
  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="text-3xl text-center font-semibold text-slate-600 my-8">
        Sign up
      </h1>
      <form className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="username"
          id="username"
          className="border p-3 rounded-lg"
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
        />
        <button
          className="bg-slate-700 p-3 text-white rounded-lg uppercase 
        hover:opacity-90 disabled:opacity-80"
        >
          Sign up
        </button>
      </form>
      <div className="flex gap-4 mt-7">
        <p>Already have an account ?</p>
        <Link to="/signin">
          <span className="text-green-500">Sign in</span>
        </Link>
      </div>
    </div>
  );
}
