import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      // Save user to MongoDB when they sign in with Google
      if (account?.provider === "google") {
        const { name, email, image } = user;

        try {
          const response = await fetch("http://localhost:5000/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              name, 
              email, 
              image, 
              provider: "google" 
            }),
          });

          if (!response.ok) {
            console.error("Failed to save user:", await response.text());
          }
        } catch (error) {
          // Don't block login if save fails - just log it
          console.error("Error saving user to database:", error);
        }
      }

      return true; // Allow sign in to proceed
    },
  },
})

export { handler as GET, handler as POST }

