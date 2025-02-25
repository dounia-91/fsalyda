import Link from "next/link";
import { Metadata } from "next";
import SignUpForm from "@/components/signUpForm";

export const metadata: Metadata = {
  title: "SignUp",
};

export default function SignUpPage() {
  return (
    <main className="bg-background bg-cover bg-center bg-no-repeat">
      <div className="flex flex-col justify-between items-center min-h-screen py-20 space-y-20 bg-gradient-to-br from-black/80 to-slate-400">
        <div className="max-sm:w-[90vw] w-full max-w-md pt-5 px-8 bg-white/30 backdrop-blur-sm rounded-lg shadow-2xl">
          <div className="text-center text-[#343666] space-y-4 p-2">
            <h1 className="text-3xl font-extrabold tracking-tight lg:text-5xl">
              Join Fsalyda
            </h1>
            <p className="">SignUp to become a pro with Fsalyda</p>
          </div>
          <SignUpForm />
          <div className="flex items-center justify-center flex-wrap space-y-2 text-center py-5 text-[#343666] text-lg">
            <span>Already a member?</span>
            <Link
              href="/signin"
              className="text-[#343666] hover:text-white/50 active:bg-white/30 border border-[#343666] px-3 py-2 rounded-xl ml-2"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
