"use client";
import React, { useRef, useState } from "react";
import { ApiResponse } from "@/types/ApiResponse";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signUpValidationSchema } from "@/schemas/signUpSchema";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Signup } from "@/actions/signup";
import SignupButton from "./signupButton";

export default function SignUpForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const ref = useRef<HTMLFormElement>(null);

  const checkUsernameUnique = async () => {
    setIsCheckingEmail(true);
    setEmailMessage(""); // Reset message
    try {
      const response = await axios.get<ApiResponse>(
        `/api/check-email-unique?email=${email.trim()}`
      );
      setEmailMessage(response.data.message);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      setEmailMessage(
        axiosError.response?.data.message ?? "Error checking Email"
      );
    } finally {
      setIsCheckingEmail(false);
    }
  };
  const validateForm = (formData: FormData) => {
    const formDataObject = Object.fromEntries(formData.entries());
    const { success, error } = signUpValidationSchema.safeParse(formDataObject);
    if (success) {
      return true;
    } else {
      const errors: string[] = [];
      error.errors.map((e) => {
        errors.push(e.message);
      });
      toast(errors.join(",\n"), { type: "error" });
      return false;
    }
  };
  const inputClass = "w-full p-2 rounded-md outline-none";
  return (
    <form
      ref={ref}
      action={async (formData) => {
        if (validateForm(formData)) {
          const resp = await Signup(formData);
          if (resp.success) {
            ref.current?.reset();
            toast(resp.message, { type: "success" });
            router.replace(`/verify/${email.trim()}`);
          } else {
            toast(resp.message, { type: "error" });
            if (resp.error) {
              console.log(resp.error);
            }
          }
        }
      }}
      className="text-[#343666] space-y-3"
    >
      <input
        name="companyName"
        placeholder="Company Name"
        className={inputClass}
      />
      <input name="fullName" placeholder="Full Name" className={inputClass} />
      <input
        name="email"
        placeholder="Email Address"
        className={inputClass}
        onChange={(e) => setEmail(e.target.value)}
        onBlur={() => checkUsernameUnique()}
      />
      {isCheckingEmail && <Loader2 className="animate-spin" />}
      {!isCheckingEmail && emailMessage && (
        <p
          className={`text-sm ${
            emailMessage === "Email is unique"
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {emailMessage}
        </p>
      )}
      <p className="text-muted text-sm">We will send you a verification code</p>
      <input
        type="password"
        placeholder="Password"
        name="password"
        className={inputClass}
      />
      <input
        type="password"
        placeholder="Confirm Password"
        name="confirmPassword"
        className={inputClass}
      />
      <SignupButton />
    </form>
  );
}
