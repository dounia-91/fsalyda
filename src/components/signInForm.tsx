"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const result = await signIn("credentials", {
        redirect: false,
        identifier: email,
        password: password,
      });
      if (result?.error) {
        toast(result.error, { type: "error" });
      } else {
        router.refresh();
      }
    } catch (error) {
      console.error("Error during sign in:", error);
      toast("An error occurred. Please try again.", { type: "error" });
    }
  };

  const formGroup = "flex p1 w-full";
  const inputclass =
    "text-[#333333] w-full h-[6vh] p-2 outline-none rounded-xl";
  const buttonClass =
    "w-full h-[6vh] p-2 outline-none border-none bg-white/30 rounded-xl my-5 active:bg-white/80";

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className={formGroup}>
        <input
          className={inputclass}
          onChange={(e) => setEmail(e.target.value)}
          type="text"
          id="email"
          placeholder="Email"
          name="email"
        />
      </div>
      <div className={formGroup}>
        <input
          className={inputclass}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          id="password"
          placeholder="password"
          name="password"
        />
      </div>
      <button className={buttonClass} type="submit">
        Sign In
      </button>
    </form>
  );
}
