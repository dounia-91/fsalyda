import { Loader2 } from "lucide-react";
import React from "react";
import { useFormStatus } from "react-dom";

export default function SignupButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="w-full bg-[#343666] h-10 text-white rounded-md flex items-center justify-center space-x-2"
      disabled={pending}
    >
      {pending ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Please wait</span>
        </>
      ) : (
        "Sign Up"
      )}
    </button>
  );
}
