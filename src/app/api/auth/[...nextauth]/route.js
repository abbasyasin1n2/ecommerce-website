import NextAuth from "next-auth"

const handler = NextAuth({
  providers: [], // We will add Google later
})

export { handler as GET, handler as POST }

