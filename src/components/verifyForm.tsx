"use client";
import { verifySchema } from "@/schemas/verifySchema";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useRouter } from "next/navigation";
import { Verify } from "@/actions/verify";
import { useRef } from "react";

export default function VerifyForm() {
  const router = useRouter();
  const ref = useRef<HTMLFormElement>(null);
  const email = useParams<{ email: string }>().email;

  const validateForm = (formData: FormData) => {
    const formDataObject = Object.fromEntries(formData.entries());
    const { success, error } = verifySchema.safeParse(formDataObject);
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
  const inputclass =
    "text-[#343666] w-full h-[6vh] p-2 outline-none rounded-xl bg-white/80 mb-6 mt-1";
  const buttonClass =
    "w-full h-[6vh] flex items-center justify-center p-2 outline-none border-none bg-white/30 active:bg-white/60 rounded-xl";

  return (
    <form
      ref={ref}
      action={async (formData) => {
        if (validateForm(formData)) {
          const resp = await Verify(formData, email);
          if (resp.success) {
            ref.current?.reset();
            toast(resp.message, { type: "success" });
            router.replace("/signin");
          } else {
            toast(resp.message, { type: "error" });
            if (resp.error) {
              console.log(resp.error);
            }
          }
        }
      }}
    >
      <label htmlFor="code">Verification Code</label>
      <input
        className={inputclass}
        type="number"
        placeholder="OTP"
        name="code"
      />
      <button className={buttonClass} type="submit">
        Verify
      </button>
    </form>
  );
}
