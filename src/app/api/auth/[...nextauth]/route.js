import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import axios from "axios";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      try {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/google`,
          {
            fullName: user.name,
            email: user.email,
            avatar: user.image,
          }
        );

        // ✅ Store token in session or localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("token", res.data.token);
        }
      } catch (err) {
        console.error("Failed to save Google user:", err.message);
        return false;
      }
      return true;
    },
    async session({ session }) {
      // Customize session if needed
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
