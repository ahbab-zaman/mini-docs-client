"use client"
import React, { useState } from "react";
import API from "../AxiosInstance/api";

export default function register() {
  const [form, setForm] = useState({
    fullName: "",
    avatar: "",
    email: "",
    password: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      alert("Registration successful");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-3">
      <input
        name="fullName"
        onChange={handleChange}
        placeholder="Full Name"
        required
      />
      <input name="avatar" onChange={handleChange} placeholder="Avatar URL" />
      <input
        name="email"
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        name="password"
        type="password"
        onChange={handleChange}
        placeholder="Password"
        required
      />
      <button type="submit">Register</button>
    </form>
  );
}
