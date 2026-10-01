const bcrypt = require('bcryptjs');
const User = require("../models/authModel");
const jwt = require('jsonwebtoken');
const sendMail = require('../utility/sendMail');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

//register User
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        try {
            await sendMail({
                to: user.email,
                subject: "Creativiy Redefined",
                html: `
<div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f7; padding: 40px 0;">
  <div style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
    
    <div style="background-color: #4f46e5; padding: 24px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Novdev</h1>
    </div>

    <div style="padding: 32px 24px;">
      <h2 style="color: #1a1a1a; font-size: 20px; margin-top: 0;">Welcome, ${user.name}!</h2>
      <p style="color: #555555; font-size: 15px; line-height: 1.6;">
        Thank you for registering with us. We're excited to have you on board.
      </p>

      <a href="https://yourapp.com/login" 
         style="display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px;">
        Go to your dashboard
      </a>
    </div>

    <div style="padding: 16px 24px; background-color: #f4f4f7; text-align: center;">
      <p style="color: #999999; font-size: 12px; margin: 0;">
        © ${new Date().getFullYear()} Novdev. All rights reserved.
      </p>
    </div>

  </div>
</div>
`
    });
        } catch (emailError) {
            console.error("Email sending failed:", emailError.message);
        }

        const token = jwt.sign(
    { id: user._id, role: user.role, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
);

        res.status(201).json({ message: "User registered successfully", user, token });
    } catch (error) {
        res.status(500).json({ 
            message: "Error registering user", 
            error: error.message || error 
        });
    }
};
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        //check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        
        const token = jwt.sign(
    { id: user._id, role: user.role, name: user.name, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
);
        res.status(200).json({ message: "Login successful", user, token });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error });
    }
};
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user profile", error });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.status(200).json({ count: users.length, users });
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
};

const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
};

const googleLogin = async (req, res) => {
    try {
        const { credential } = req.body;

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email } = payload;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "No account found with this email. Please sign up first." });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, name: user.name, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({ message: "Google login successful", user, token });
    } catch (error) {
        console.error("Google login error:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
};

const googleSignup = async (req, res) => {
    try {
        const { credential } = req.body;

        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email, name } = payload;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "An account with this email already exists. Please log in instead." });
        }

        const user = await User.create({
            name,
            email,
            password: await bcrypt.hash(Math.random().toString(36), 10),
        });

        try {
            await sendMail({
                to: user.email,
                subject: "Creativiy Redefined",
                html: `
<div style="font-family: Arial, Helvetica, sans-serif; background-color: #f4f4f7; padding: 40px 0;">
  <div style="max-width: 480px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.08);">
    <div style="background-color: #4f46e5; padding: 24px; text-align: center;">
      <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Novdev</h1>
    </div>
    <div style="padding: 32px 24px;">
      <h2 style="color: #1a1a1a; font-size: 20px; margin-top: 0;">Welcome, ${user.name}!</h2>
      <p style="color: #555555; font-size: 15px; line-height: 1.6;">
        Thank you for registering with us. We're excited to have you on board.
      </p>
    </div>
    <div style="padding: 16px 24px; background-color: #f4f4f7; text-align: center;">
      <p style="color: #999999; font-size: 12px; margin: 0;">
        © ${new Date().getFullYear()} Novdev. All rights reserved.
      </p>
    </div>
  </div>
</div>
`
            });
        } catch (emailError) {
            console.error("Email sending failed:", emailError.message);
        }

        const token = jwt.sign(
            { id: user._id, role: user.role, name: user.name, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(201).json({ message: "Google signup successful", user, token });
    } catch (error) {
        console.error("Google signup error:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    };
};
   
const updateProfile = async (req, res) => {
    try {
        const { name, email, currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (email && email !== user.email) {
            const emailTaken = await User.findOne({ email });
            if (emailTaken) {
                return res.status(400).json({ message: "Email already in use" });
            }
            user.email = email;
        }

        if (name) user.name = name;

        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ message: "Current password is required to set a new password" });
            }
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Current password is incorrect" });
            }
            user.password = await bcrypt.hash(newPassword, 10);
        }

        await user.save();

        const token = jwt.sign(
            { id: user._id, role: user.role, name: user.name, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.status(200).json({ message: "Profile updated successfully", user, token });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
};

const deleteMyAccount = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user.id);
        res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
        console.error("Error deleting account:", error);
        res.status(500).json({ error: error.message || "Internal server error" });
    }
};

        module.exports = {
            registerUser,
            loginUser,
            getUserProfile,
            getAllUsers,
            deleteUser,
            googleLogin,
            googleSignup,
            updateProfile,
            deleteMyAccount
        };