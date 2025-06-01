// "use client";

// import React, { useEffect, useState } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// export default function Navbar() {
//   const [user, setUser] = useState(null);
//   const router = useRouter();

//   // On mount, check if user data exists in localStorage
//   useEffect(() => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   // Logout function
//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     setUser(null);
//     router.push("/login"); // redirect to login after logout
//   };

//   return (
//     <nav className="bg-purple-600 text-white p-4 flex justify-between items-center">
//       <Link href="/">
//         <h1 className="text-xl font-bold cursor-pointer">MyApp</h1>
//       </Link>

//       <div className="flex items-center space-x-4">
//         {user ? (
//           <>
//             {user.avatar && (
//               <img
//                 src={user.avatar}
//                 alt="User Avatar"
//                 className="w-8 h-8 rounded-full object-cover"
//               />
//             )}
//             <span>{user.fullName}</span>
//             <button
//               onClick={handleLogout}
//               className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
//             >
//               Logout
//             </button>
//           </>
//         ) : (
//           <Link href="/login">
//             <button className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 transition">
//               Login
//             </button>
//           </Link>
//         )}
//       </div>
//     </nav>
//   );
// }

"use client";

import Link from "next/link";
import { signIn, signOut } from "next-auth/react";
import { useUser } from "@/app/utils/userContext";

export default function Navbar() {
  const { user } = useUser();

  return (
    <nav className="bg-purple-600 text-white p-4 flex justify-between items-center">
      <Link href="/">
        <h1 className="text-xl font-bold cursor-pointer">Docs</h1>
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
              onClick={() => {
                localStorage.clear(); // for manual logout
                signOut(); // for Google logout
              }}
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
