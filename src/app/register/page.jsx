"use client";

import React, { useState } from "react";
import API from "../AxiosInstance/api";
import { motion, AnimatePresence } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

export default function Register() {
  const [form, setForm] = useState({
    fullName: "",
    avatar: "",
    email: "",
    password: "",
  });
  const router = useRouter();

  const [modal, setModal] = useState({
    show: false,
    message: "",
    success: true,
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      setTimeout(() => {
        router.push("/"); // Navigate to home
      }, 1000);
      setModal({
        show: true,
        message: "Registration successful!",
        success: true,
      });
    } catch (err) {
      setModal({
        show: true,
        message: err.response?.data?.message || "Registration failed",
        success: false,
      });
    }
  };

  const handleGoogleSignIn = () => {
    setModal({
      show: true,
      message: "Google Sign-In coming soon...",
      success: true,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-200 px-4">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md relative"
      >
        <h2 className="text-3xl font-bold text-center text-purple-700 mb-6">
          Create Your Account
        </h2>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            name="fullName"
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <input
            name="avatar"
            onChange={handleChange}
            placeholder="Avatar URL (optional)"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <input
            name="email"
            type="email"
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <input
            name="password"
            type="password"
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <motion.button
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition"
          >
            Register
          </motion.button>
        </form>

        <div className="my-6 flex items-center justify-center">
          <span className="border-t w-1/4"></span>
          <span className="mx-2 text-gray-500">OR</span>
          <span className="border-t w-1/4"></span>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGoogleSignIn}
          className="flex items-center justify-center gap-3 w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition"
        >
          <FcGoogle size={24} />
          <span>Sign in with Google</span>
        </motion.button>

        {/* Modal */}
        <AnimatePresence>
          {modal.show && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-white border shadow-lg p-4 rounded-lg z-50"
            >
              <p
                className={`text-sm font-medium ${
                  modal.success ? "text-green-600" : "text-red-600"
                }`}
              >
                {modal.message}
              </p>
              <button
                onClick={() => setModal({ ...modal, show: false })}
                className="text-xs text-gray-500 hover:underline mt-2"
              >
                Close
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
