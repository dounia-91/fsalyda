import { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import AdminModel from "@/model/admin";
import BusinessUserModel from "@/model/businessUser";
import UserModel from "@/model/user";

interface Nuser extends User {
  name: string;
  companyName: string;
  role: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Record<"identifier" | "password", string> | undefined
      ): Promise<User | null> {
        await dbConnect();
        try {
          if (credentials) {
            let user = await AdminModel.findOne({
              email: credentials?.identifier.toLowerCase(),
            });
            if (!user) {
              user = await BusinessUserModel.findOne({
                email: credentials?.identifier.toLowerCase(),
              });
              if (!user) {
                user = await UserModel.findOne({
                  email: credentials?.identifier.toLowerCase(),
                });
                if (!user) {
                  throw new Error("No user found with this email");
                }
              }
            }
            if (!user.isVerified) {
              throw new Error("Please verify your account before logging in");
            }
            const isPasswordCorrect = await bcrypt.compare(
              credentials.password,
              user.password
            );
            if (isPasswordCorrect) {
              return user as Nuser;
            } else {
              throw new Error("Incorrect password");
            }
          } else {
            return null;
          }
        } catch (error: unknown) {
          console.log("Error authorising user ", error);
          throw new Error(error as string);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString(); // Convert ObjectId to string
        token.isVerified = user.isVerified;
        token.name = user.name;
        token.companyName = user.companyName;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.name = token.name;
        session.user.companyName = token.companyName;
        session.user.role = token.role;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/signin",
  },
};
