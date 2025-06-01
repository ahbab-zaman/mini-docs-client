"use client";

import { SessionProvider } from "next-auth/react";

export default function NextProviders({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
