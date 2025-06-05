"use client";

import Link from "next/link";
import { signIn, signOut } from "next-auth/react";
import { useUser } from "../utils/UserContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "../assets/google-docs.png";
export default function Navbar() {
  const { user } = useUser();
  const router = useRouter();
  const handleLogout = async () => {
    localStorage.clear();
    await signOut({ redirect: false }); // prevent automatic redirect
    router.push("/login");
  };

  return (
    <nav className="bg-purple-600 text-white p-4 flex justify-between items-center">
      <Link href="/">
        <div className="flex items-center gap-1">
          <Image src={logo} width={22} height={22} alt="Logo" />
          <h1 className="text-xl font-bold cursor-pointer">DocY</h1>
        </div>
      </Link>

      <div className="flex items-center space-x-4">
        {user ? (
          <>
            {user.avatar && (
              <img
                src={user.avatar}
                alt="User Avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
            )}
            <span>{user.fullName}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/login">
            <button className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 transition">
              Login
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}
