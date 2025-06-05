"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const { data: session } = useSession();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Load local login info (if exists)
    const localUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (localUser && token) {
      setUser(JSON.parse(localUser));
    }

    // If NextAuth session (Google login)
    if (session?.user) {
      setUser({
        fullName: session.user.name,
        email: session.user.email,
        avatar: session.user.image,
      });
    }
  }, [session]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
