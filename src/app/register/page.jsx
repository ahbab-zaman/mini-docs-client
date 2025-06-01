"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import API from "../AxiosInstance/api";
import { motion } from "framer-motion";
import Link from "next/link";

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

export default function RegisterForm() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    avatarUrl: "", // added for image URL
  });
  const [modal, setModal] = useState({
    show: false,
    message: "",
    success: false,
  });

  const router = useRouter();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/register", form, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);

      setModal({
        show: true,
        message: "Registration successful!",
        success: true,
      });

      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (err) {
      setModal({
        show: true,
        message: err.response?.data?.message || "Registration failed",
        success: false,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-700">
          Create an Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="fullName"
            type="text"
            onChange={handleChange}
            value={form.fullName}
            placeholder="Full Name"
            required
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <input
            name="email"
            type="email"
            onChange={handleChange}
            value={form.email}
            placeholder="Email"
            required
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <input
            name="password"
            type="password"
            onChange={handleChange}
            value={form.password}
            placeholder="Password"
            required
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <input
            name="avatarUrl"
            type="text"
            onChange={handleChange}
            value={form.avatarUrl}
            placeholder="Image URL (optional)"
            className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
          />

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
          >
            Register
          </button>
        </form>

        <p className="py-2 text-center">
          Already have an account?
          <Link href="/login">
            <span className="text-blue-600 font-bold"> Login</span>
          </Link>
        </p>
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
