import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'noreply@luxefashionboutique.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
      }
    });
  }

  async sendPasswordReset(email, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5174'}/reset-password/${resetToken}`;
    
    const mailOptions = {
      from: process.env.EMAIL_USER || 'noreply@luxefashionboutique.com',
      to: email,
      subject: 'Password Reset Request - Luxe Fashion Boutique',
      html: `
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
          <div style="text-align: center; padding: 20px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 28px;">🔐 Password Reset</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">Luxe Fashion Boutique</p>
          </div>
          
          <div style="padding: 30px; background: #f8fafc; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-bottom: 20px;">Reset Your Password</h2>
            
            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 25px;">
              We received a request to reset your password for your Luxe Fashion Boutique account. 
              Click the button below to create a new password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); 
                        color: white; padding: 15px 30px; text-decoration: none; border-radius: 50px; 
                        font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3);">
                Reset Password
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; line-height: 1.5; margin-bottom: 20px;">
              If the button doesn't work, you can copy and paste this link into your browser:
            </p>
            
            <p style="background: #e5e7eb; padding: 10px; border-radius: 5px; word-break: break-all; font-size: 12px; color: #4b5563;">
              ${resetUrl}
            </p>
            
            <div style="border-top: 1px solid #d1d5db; margin-top: 30px; padding-top: 20px;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                <strong>Security Notice:</strong> This link will expire in 1 hour for your security.
                If you didn't request this password reset, please ignore this email.
              </p>
            </div>
          </div>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
      return { success: true, message: 'Password reset email sent successfully' };
    } catch (error) {
      console.error('Email sending error:', error);
      throw new Error('Failed to send password reset email');
    }
  }

  async testConnection() {
    try {
      await this.transporter.verify();
      console.log('Email service ready');
      return true;
    } catch (error) {
      console.error('Email service connection failed:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();