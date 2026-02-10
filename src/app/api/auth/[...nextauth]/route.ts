import NextAuth from "next-auth";
import { authOptions } from "./options";
import { NextApiRequest } from "next";
import { NextRequest } from "next/server";

const handler = NextAuth(authOptions)

//// short way to use handler as GET and POST method
export {handler as GET , handler as POST }


//// more familier but bulky
// export async function GET(req:NextRequest){
//     return handler(req)
// }

// export async function POST(req:NextRequest){
//     return handler(req)
// }