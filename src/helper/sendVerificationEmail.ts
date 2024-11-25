import { EmailTemplate } from '../../email/EmailTemplate';
import { APIResponseType } from './APIResponse';
import { resend } from "@/lib/resend";

export async function sendVerificationCode(
    email: string,
    username: string,
    verifycode: string
): Promise<APIResponseType> {
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Anonymous feedbacker Verification Code',
            react: EmailTemplate({ username, otp: verifycode }),
        });
        return { success: true, message: "Verification email send successfully" }
    } catch (emailError) {
        console.log("verifcation Email error", emailError);
        return { success: false, message: "Failed to send verifcation email" }
    }
}   