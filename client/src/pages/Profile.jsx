import React from "react";
import { useSelector } from "react-redux";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-center text-3xl font-bold my-8">Profile</h1>
      <form className="flex flex-col gap-4">
        <img
          src={currentUser.avatar}
          alt="profile"
          className="w-24 h-24 mt-2 rounded-full object-cover cursor-pointer self-center"
        />
        <input
          type="text"
          placeholder="username"
          id="username"
          className="border p-3 rounded-lg bg-white"
        />
        <input
          type="email"
          placeholder="email"
          id="email"
          className="border p-3 rounded-lg  bg-white"
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg  bg-white"
        />
        <button className="rounded-lg uppercase hover:opacity-90 disabled:opacity-80 bg-slate-700 text-white p-3">
          Update
        </button>
        <div className="flex justify-between mt-5">
          <span className="text-red-700 cursor-pointer">Delete Account</span>
          <span className="text-red-700 cursor-pointer">Sign out</span>
        </div>
      </form>
    </div>
  );
}
