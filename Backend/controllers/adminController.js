const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const adminLogin = async (req, res) => {
    try {
        const { mobile, password } = req.body;
        
        if (!mobile || !password) {
            return res.status(400).json({
                success: false,
                message: "Mobile number and password are required",
            });
        }

        const admin = await Admin.findOne({ mobile });

        if (!admin) {
            return res.status(401).json({
                success: false,
                message: "Invalid mobile number or password",
            });
        }

        const isPasswordCorrect = admin.password === password;

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Invalid mobile number or password",
            });
        }

        const token = jwt.sign(
            {
                id: admin._id,
                role: "admin",
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d",
            }
        );

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            admin: {
                id: admin._id,
                mobile: admin.mobile,
            },
        });

    } catch (error) {
        console.error("Admin login error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

module.exports = {
    adminLogin,
};