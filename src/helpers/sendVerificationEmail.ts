import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
  email: string,
  companyName: string,
  name: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    console.log(email);
    await resend.emails.send({
      // from: "support@fsalyda.com",
      from: "doubnts@gmail.com",
      to: email,
      subject: "Fsalyda Verification Code",
      react: VerificationEmail({ companyName, name, otp: verifyCode }),
    });
    return { success: true, message: "Verification email sent successfully." };
  } catch (emailError) {
    console.error("Error sending verification email:", emailError);
    return { success: false, message: "Failed to send verification email." };
  }
}
