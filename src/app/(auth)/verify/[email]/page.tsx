import { Metadata } from "next";
import VerifyForm from "@/components/verifyForm";

export const metadata: Metadata = {
  title: "Verify",
};

export default function VerifyAccount() {
  return (
    <main className="bg-background bg-cover bg-center bg-no-repeat">
      <div className="flex flex-col justify-between items-center min-h-screen pt-20 space-y-20 bg-gradient-to-br from-slate-500 to-black/40">
        <div className="max-sm:w-[90vw] w-full max-w-md p-8 space-y-8 bg-white/30 rounded-lg shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
              Verify Your Account
            </h1>
            <p className="mb-4">
              Enter the verification code sent to your email
            </p>
          </div>
          <VerifyForm />
        </div>
      </div>
    </main>
  );
}
