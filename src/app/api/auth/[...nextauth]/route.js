import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Firebase",
      credentials: {
        email: { label: "Email", type: "email" },
        name: { label: "Name", type: "text" },
        image: { label: "Image", type: "text" },
        firebaseToken: { label: "Firebase Token", type: "text" },
      },
      async authorize(credentials) {
        // Verify the Firebase token would happen here in production
        // For now, we trust the client-side Firebase auth
        if (credentials?.email) {
          return {
            id: credentials.email,
            email: credentials.email,
            name: credentials.name || credentials.email.split("@")[0],
            image: credentials.image || null,
          };
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async signIn({ user, account }) {
      // Save user to MongoDB when they sign in
      const { name, email, image } = user;
      const provider = account?.provider || "credentials";
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

      try {
        const response = await fetch(`${API_URL}/api/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            name, 
            email, 
            image, 
            provider,
          }),
        });

        if (!response.ok) {
          console.error("Failed to save user:", await response.text());
        }
      } catch (error) {
        // Don't block login if save fails - just log it
        console.error("Error saving user to database:", error);
      }

      return true; // Allow sign in to proceed
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }
      return session;
    },
  },
})

export { handler as GET, handler as POST }

