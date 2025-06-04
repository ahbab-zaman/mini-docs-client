"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function ConditionalNavbar() {
  const pathname = usePathname();

  // List of routes without navbar
  const noNavbarPaths = ["/login", "/register"];

  const showNavbar = !noNavbarPaths.includes(pathname);

  return showNavbar ? <Navbar /> : null;
}
