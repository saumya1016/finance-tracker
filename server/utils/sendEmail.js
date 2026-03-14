const axios = require('axios');

const sendEmail = async (email, subject, text) => {
  try {
    // 1. Ensure email and text actually exist
    if (!email || !text) {
      throw new Error("Missing email recipient or message text");
    }

    const otpCode = text.split(': ')[1] || text;

    const data = {
      sender: { name: "FinTrack", email: "rajputsaumya456@gmail.com" }, 
      to: [{ email: email.trim() }], // Added .trim() to prevent space errors
      subject: subject,
      textContent: text, // Added plain text version
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #2563eb; text-align: center;">FinTrack Verification</h2>
          <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #1f2937; border-radius: 5px;">
            ${otpCode}
          </div>
          <p style="margin-top: 20px;">This code will expire in 10 minutes.</p>
        </div>
      `,
    };

    const response = await axios.post('https://api.brevo.com/v3/smtp/email', data, {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json'
      }
    });

    console.log("✅ Email sent successfully via Brevo!");
    return response.data;
  } catch (error) {
    // Look at your Render Logs for this specific output:
    console.error("❌ Brevo failed to send email:", error.response ? JSON.stringify(error.response.data) : error.message);
    throw new Error("Email service failed");
  }
};

module.exports = sendEmail;