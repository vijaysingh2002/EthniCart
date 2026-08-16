const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const transporter = require("../config/email");

const forgotPassword = async (req, res) => {
  try {
    const { phone } = req.body || {};

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No account found with this phone number",
      });
    }

    if (!user.email) {
      return res.status(400).json({
        success: false,
        message: "No email is registered with this account",
      });
    }

    console.log("User found:", user.email);

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Hash token before storing in database
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordToken = hashedToken;

    // Token expires in 15 minutes
    user.resetPasswordExpire = new Date(
      Date.now() + 15 * 60 * 1000
    );

    await user.save();

    console.log("Reset token saved");

    const resetUrl =
      `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    console.log("Reset URL:", resetUrl);

    const mailOptions = {
      from: `"EthniCart" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: "EthniCart - Reset Your Password",

      html: `
        <div style="
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: auto;
          padding: 30px;
          border: 1px solid #eee;
          border-radius: 12px;
        ">

          <h2 style="color:#C49A6C;">
            EthniCart
          </h2>

          <h3>
            Reset Your Password
          </h3>

          <p>
            We received a request to reset your EthniCart password.
          </p>

          <p>
            Click the button below to create a new password.
          </p>

          <a
            href="${resetUrl}"
            style="
              display:inline-block;
              padding:14px 24px;
              background:#C49A6C;
              color:white;
              text-decoration:none;
              border-radius:8px;
              font-weight:bold;
            "
          >
            Change Password
          </a>

          <p style="margin-top:25px;color:#666;">
            This link will expire in 15 minutes.
          </p>

          <p style="color:#888;font-size:13px;">
            If you did not request a password reset, you can safely ignore
            this email.
          </p>

        </div>
      `,
    };

    console.log("Sending email...");

    const emailResult = await transporter.sendMail(mailOptions);

    console.log("Email sent:", emailResult.messageId);

    return res.status(200).json({
      success: true,
      message: "Password reset link sent to your registered email",
    });

  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to send password reset email",
    });
  }
};


const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body || {};

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: "Token and password are required",
      });
    }

    // Hash token received from frontend
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    // Find user with valid token
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: {
        $gt: Date.now(),
      },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Reset link is invalid or has expired",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;

    // Invalidate token
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });

  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to reset password",
    });
  }
};


module.exports = {
  forgotPassword,
  resetPassword,
};