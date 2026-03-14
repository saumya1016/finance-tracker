const axios = require('axios');

const sendEmail = async (email, subject, text) => {
  try {
    // Extract the OTP from the text string
    const otpCode = text.split(': ')[1] || text;

    const data = {
      // Your verified sender (use the email you signed up to Brevo with)
      sender: { name: "FinTrack", email: "saumya.singh.3468@gmail.com" }, 
      to: [{ email: email }],
      subject: subject,
      htmlContent: `
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
    // Better error logging to see exactly why Brevo might fail
    console.error("❌ Brevo failed to send email:", error.response ? error.response.data : error.message);
    throw new Error("Email service failed");
  }
};

module.exports = sendEmail;