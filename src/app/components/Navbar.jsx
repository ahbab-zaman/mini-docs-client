"use client";
import logo from "@/app/assets/google-docs.png";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
const Navbar = () => {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <p>Loading...</p>; // Optional loading state
  }
  return (
    <div className="px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Image src={logo} width={40} height={40} alt="Google Docs Logo" />
        <h3 className="text-xl font-bold">Docs</h3>
      </div>
      <form className="relative max-w-[720px] w-full">
        <input
          data-slot="input"
          className="file:text-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex min-w-0 border py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive md:text-base placeholder:text-neutral-800 px-14 w-full border-none focus-visible:shadow-[0_1px_1px_0_rgba(65,69,73,.3),0_1px_3px_rgba(65,69,73,.15)] bg-[#F0F4F8] rounded-full h-[48px] focus-visible:ring-0 focus:bg-white"
          placeholder="Search"
          defaultValue=""
        />

        <button
          type="submit"
          data-slot="button"
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 size-9 absolute left-3 top-1/2 -translate-y-1/2 [&_svg]:size-5 rounded-full"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-search"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </button>
      </form>
      <div className="flex items-center gap-4">
        {session?.user ? (
          <>
            <Image
              src={session.user.avatar || session.user.image}
              alt="Avatar"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="text-sm font-medium">
              {session.user.fullName || session.user.name}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => signIn("google", { callbackUrl: "/login" })}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
