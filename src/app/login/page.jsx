"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import API from "../AxiosInstance/api";
import { motion } from "framer-motion";
import google from "../assets/google.png";
import Image from "next/image";
import { signIn } from "next-auth/react";

// Modal Component
function Modal({ show, message, success, onClose }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`bg-white p-6 rounded shadow-xl max-w-sm w-full text-center ${
          success ? "border-green-500" : "border-red-500"
        }`}
      >
        <h2
          className={`text-xl font-semibold mb-3 ${
            success ? "text-green-600" : "text-red-600"
          }`}
        >
          {success ? "Success" : "Error"}
        </h2>
        <p className="mb-4">{message}</p>
        <button
          onClick={onClose}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Close
        </button>
      </motion.div>
    </div>
  );
}

// Login Component
export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [modal, setModal] = useState({
    show: false,
    message: "",
    success: false,
  });
  const router = useRouter();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      setModal({ show: true, message: "Login successful!", success: true });

      setTimeout(() => {
        router.push("/"); // Redirect to home
      }, 1000);
    } catch (err) {
      setModal({
        show: true,
        message: err.response?.data?.message || "Login failed",
        success: false,
      });
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
          Login to Your Account
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            name="email"
            type="email"
            onChange={handleChange}
            value={form.email}
            placeholder="Email"
            required
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            name="password"
            type="password"
            onChange={handleChange}
            value={form.password}
            placeholder="Password"
            required
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <div className="my-4 text-center text-gray-500">or</div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 border border-gray-300 py-2 rounded hover:bg-gray-50 transition"
        >
          <Image src={google} height={20} width={20} alt="Google" />
          Sign in with Google
        </button>
      </motion.div>

      <Modal
        show={modal.show}
        message={modal.message}
        success={modal.success}
        onClose={() => setModal({ ...modal, show: false })}
      />
    </div>
  );
}
