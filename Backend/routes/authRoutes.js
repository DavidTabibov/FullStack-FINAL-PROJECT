import express from 'express';
import { validateRegisterInput, validateLoginInput } from '../Middleware/validationMiddleware.js';
import { protect } from '../Middleware/authMiddleware.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User.js';
import { emailService } from '../services/emailService.js';

const router = express.Router();

// Registration
router.post('/register', validateRegisterInput, async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                status: 'error',
                message: 'User with this email already exists'
            });
        }

        // Create new user (password will be hashed automatically)
        const user = new User({
            email,
            password,
            firstName,
            lastName
        });

        await user.save();

        // Check JWT_SECRET
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error('JWT_SECRET is not defined in environment variables');
            return res.status(500).json({
                status: 'error',
                message: 'Server configuration error'
            });
        }

        // Create token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            jwtSecret,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            status: 'success',
            data: {
                token,
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role
                }
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Error registering user',
            error: error.message
        });
    }
});

// Login
router.post('/login', validateLoginInput, async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password'
            });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                status: 'error',
                message: 'Invalid email or password'
            });
        }

        // Check JWT_SECRET
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            console.error('JWT_SECRET is not defined in environment variables');
            console.error('Available env vars:', Object.keys(process.env).filter(key => key.includes('JWT')));
            return res.status(500).json({
                status: 'error',
                message: 'Server configuration error'
            });
        }

        // Create token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            jwtSecret,
            { expiresIn: '24h' }
        );

        // Update last activity time
        req.session.lastActivity = Date.now();

        res.json({
            status: 'success',
            data: {
                token,
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    role: user.role
                }
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Login error',
            error: error.message
        });
    }
});

// Token verification
router.get('/verify', protect, (req, res) => {
    res.json({
        status: 'success',
        data: {
            user: {
                id: req.user._id,
                name: req.user.name,
                email: req.user.email,
                isAdmin: req.user.isAdmin
            }
        }
    });
});

// Logout (bonus requirement)
router.post('/logout', protect, (req, res) => {
    try {
        req.session.destroy();
        res.json({
            status: 'success',
            message: 'Logged out successfully'
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Logout error'
        });
    }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                status: 'error',
                message: 'Email is required'
            });
        }

        // Find user by email
        const user = await User.findOne({ email: email.toLowerCase() });
        
        if (!user) {
            // Return success even if user doesn't exist for security
            return res.json({
                status: 'success',
                message: 'If an account with that email exists, a password reset link has been sent.'
            });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        
        // Set token and expiration (1 hour from now)
        user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour

        await user.save();

        // Send email
        try {
            await emailService.sendPasswordReset(user.email, resetToken);
            
            res.json({
                status: 'success',
                message: 'Password reset link sent to your email'
            });
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            
            // Clear the reset token if email fails
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save();
            
            res.status(500).json({
                status: 'error',
                message: 'Failed to send password reset email. Please try again later.'
            });
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error occurred while processing your request'
        });
    }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
    try {
        const { token, newPassword } = req.body;

        if (!token || !newPassword) {
            return res.status(400).json({
                status: 'error',
                message: 'Token and new password are required'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                status: 'error',
                message: 'Password must be at least 6 characters long'
            });
        }

        // Hash the token to match stored version
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Find user with valid token
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({
                status: 'error',
                message: 'Invalid or expired password reset token'
            });
        }

        // Update password (will be hashed automatically by pre-save middleware)
        user.password = newPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        res.json({
            status: 'success',
            message: 'Password has been reset successfully'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Server error occurred while resetting password'
        });
    }
});

export default router;