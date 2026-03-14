const { Resend } = require('resend');

// Initialize Resend with your API Key from Render
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (email, subject, text) => {
  try {
    // Extract the OTP from the text string (e.g., "Your code is: 123456")
    const otpCode = text.split(': ')[1] || text;

    const data = await resend.emails.send({
      from: 'FinTrack <onboarding@resend.dev>', // Must stay as onboarding@resend.dev for Free Tier
      to: email, // Reminder: Must be your signed-up email for Resend Free Tier
      subject: subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #2563eb; text-align: center;">FinTrack Verification</h2>
          <p>Hello,</p>
          <p>You requested a verification code for your Finance Tracker account.</p>
          <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #1f2937; border-radius: 5px;">
            ${otpCode}
          </div>
          <p style="margin-top: 20px;">This code will expire in 10 minutes.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #9ca3af; text-align: center;">If you did not request this, please ignore this email.</p>
        </div>
      `,
    });

    console.log("✅ Email sent successfully via Resend. ID:", data.id);
    return data;
  } catch (error) {
    console.error("❌ Resend failed to send email:", error);
    throw new Error("Email service failed");
  }
};

module.exports = sendEmail;