import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email: string, token: string) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify Your Account",
        text: `Your verification code is: ${token}`,
    });
};
