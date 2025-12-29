import nodemailer from "nodemailer";

const makeTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

export const sendVerificationEmail = async (email, code) => {
  const transporter = makeTransporter();

  const mailOptions = {
    from: `"Farmer Connect" <no-reply@farmerconnect.com>`,
    to: email,
    subject: "Your Farmer Connect Verification Code",
    text: `Hello,

Thank you for signing up for Farmer Connect!

Your verification code is: ${code}

This code is valid for a limited time.

Regards,
Farmer Connect Team`,
  };

  await transporter.sendMail(mailOptions);
  console.log(`OTP email sent successfully to ${email}`);
};

export const sendApprovalEmail = async (email, loginUrl) => {
  const transporter = makeTransporter();

  const mailOptions = {
    from: `"Farmer Connect" <no-reply@farmerconnect.com>`,
    to: email,
    subject: "Your Farmer Connect Account Has Been Approved",
    text: `Hello,

Good news! Your Farmer Connect account has been approved by an admin.

You can now log in using your email and the password you set:
${loginUrl}

Regards,
Farmer Connect Team`,
  };

  await transporter.sendMail(mailOptions);
  console.log(`Approval email sent to ${email}`);
};

export const sendRejectionEmail = async (email, feedback, homeUrl) => {
  const transporter = makeTransporter();

  const mailOptions = {
    from: `"Farmer Connect" <no-reply@farmerconnect.com>`,
    to: email,
    subject: "Your Farmer Connect Account Request Was Rejected",
    text: `Hello,

Your Farmer Connect account request has been rejected due to a discrepancy in the provided information.

Feedback from admin:
${feedback}

You may start the signup process again from here:
${homeUrl}

Regards,
Farmer Connect Team`,
  };

  await transporter.sendMail(mailOptions);
  console.log(`Rejection email sent to ${email}`);
};
