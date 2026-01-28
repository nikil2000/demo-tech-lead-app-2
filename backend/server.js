const express = require('express');
const sgMail = require('@sendgrid/mail');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configure SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Backend server is running',
        timestamp: new Date().toISOString()
    });
});

// Send OTP Email endpoint
app.post('/api/send-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Validate input
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: 'Email and OTP are required'
            });
        }

        // Email template
        const msg = {
            to: email,
            from: process.env.FROM_EMAIL,
            subject: 'Password Change Verification Code - SLT Tech-Lead Platform',
            text: `Your OTP verification code is: ${otp}\n\nThis code will expire in 5 minutes.\n\nIf you did not request this change, please ignore this email.`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .header {
                            background: linear-gradient(135deg, #0066CC 0%, #0052A3 100%);
                            color: white;
                            padding: 30px;
                            text-align: center;
                            border-radius: 8px 8px 0 0;
                        }
                        .content {
                            background: #f9f9f9;
                            padding: 30px;
                            border-radius: 0 0 8px 8px;
                        }
                        .otp-box {
                            background: white;
                            border: 2px dashed #0066CC;
                            padding: 20px;
                            text-align: center;
                            margin: 20px 0;
                            border-radius: 8px;
                        }
                        .otp-code {
                            font-size: 32px;
                            font-weight: bold;
                            color: #0066CC;
                            letter-spacing: 8px;
                            font-family: 'Courier New', monospace;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 20px;
                            color: #666;
                            font-size: 12px;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Password Change Verification</h1>
                        </div>
                        <div class="content">
                            <p>Hello,</p>
                            <p>You have requested to change your password on the SLT Tech-Lead Platform. Please use the following verification code:</p>
                            
                            <div class="otp-box">
                                <p style="margin: 0; font-size: 14px; color: #666;">Your OTP Code</p>
                                <p class="otp-code">${otp}</p>
                                <p style="margin: 0; font-size: 12px; color: #999;">Valid for 5 minutes</p>
                            </div>
                            
                            <p><strong>Important:</strong> This code will expire in 5 minutes.</p>
                            <p>If you did not request this password change, please ignore this email and ensure your account is secure.</p>
                            
                            <p>Best regards,<br>SLT Tech-Lead Platform Team</p>
                        </div>
                        <div class="footer">
                            <p>This is an automated message. Please do not reply to this email.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        // Send email
        await sgMail.send(msg);

        console.log(`✅ OTP email sent successfully to ${email}`);
        console.log(`📧 OTP Code: ${otp}`);

        res.json({
            success: true,
            message: 'OTP sent successfully to your email'
        });

    } catch (error) {
        console.error('❌ Error sending email:', error);

        // Handle specific SendGrid errors
        if (error.response) {
            console.error('SendGrid Error:', error.response.body);
        }

        res.status(500).json({
            success: false,
            message: 'Failed to send OTP email',
            error: error.message
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log('='.repeat(50));
    console.log('🚀 Backend Server Started Successfully!');
    console.log('='.repeat(50));
    console.log(`📡 Server running on: http://localhost:${PORT}`);
    console.log(`📧 Email service: SendGrid`);
    console.log(`✉️  From email: ${process.env.FROM_EMAIL}`);
    console.log('='.repeat(50));
    console.log('Available endpoints:');
    console.log(`  GET  /api/health      - Health check`);
    console.log(`  POST /api/send-otp    - Send OTP email`);
    console.log('='.repeat(50));
});
