// --- Email Service Utility (Production Implementation using Nodemailer) ---

const nodemailer = require("nodemailer");

/**
 * Sends a verification email to the user with a 6-digit OTP.
 * Uses Gmail + App Password for authentication.
 *
 * @param {string} email The recipient's email address.
 * @param {string} code The 6-digit verification code (OTP).
 */
const sendVerificationEmail = async (email, code) => {
  try {
    // Create transporter using Gmail + App Password
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,    // your Gmail address
        pass: process.env.EMAIL_PASS,    // your Gmail App Password
      },
    });

    // Email structure
    const mailOptions = {
      from: `"Farmer Connect" <no-reply@farmerconnect.com>`,  
      // Gmail will still send from your actual Gmail but show this name
      to: email,
      subject: "Your Farmer Connect Verification Code",
      text: `
Hello,

Thank you for signing up for Farmer Connect!

Your verification code is: ${code}

This code is valid for a limited time.

Regards,
Farmer Connect Team
      `,
    };

    // Actually send the email
    await transporter.sendMail(mailOptions);

    console.log(`OTP email sent successfully to ${email}`);
  } catch (error) {
    console.error("Error sending OTP email:", error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
};
