const nodemailer = require('nodemailer');

const sendEmail = async (email, subject, text) => {
  try {
    // 1. Create a transporter
    // For production, use Gmail, Mailtrap, or SendGrid
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // email
        pass: process.env.EMAIL_PASS  // App Password 
      }
    });

    // 2. Define email options
    const mailOptions = {
      from: `"FinTrack Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: subject,
      text: text,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
          <h2 style="color: #2563eb; text-align: center;">FinTrack Verification</h2>
          <p>Hello,</p>
          <p>You requested a verification code for your Finance Tracker account.</p>
          <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #1f2937;">
            ${text.split(': ')[1] || text}
          </div>
          <p style="margin-top: 20px;">This code will expire in 5 minutes.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">If you did not request this, please ignore this email.</p>
        </div>
      `
    };

    // 3. Send the email
    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully to:", email);
  } catch (error) {
    console.error("❌ Email failed to send:", error);
    throw new Error("Email could not be sent");
  }
};

module.exports = sendEmail;