const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth :{
        user : process.env.EMAIL_USER,
        pass : process.env.EMAIL_PASSWORD
    }
});

module.exports = {
    sendEmail: async (email, subject, body) => {
        try {
            await transporter.sendMail({
                from: `"Your App" <${process.env.EMAIL_USER}>`,
                to: email,
                subject,
                text: body, // Plain text fallback
                html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>${subject}</title>
                    <style type="text/css">
                        /* Base styles */
                        body {
                            font-family: 'Helvetica Neue', Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        
                        /* Email container */
                        .email-container {
                            border: 1px solid #e5e5e5;
                            border-radius: 8px;
                            overflow: hidden;
                        }
                        
                        /* Header */
                        .email-header {
                            background-color: #4a6bdf;
                            color: white;
                            padding: 20px;
                            text-align: center;
                        }
                        
                        .email-header h1 {
                            margin: 0;
                            font-size: 24px;
                        }
                        
                        /* Content */
                        .email-content {
                            padding: 30px;
                            background-color: #ffffff;
                        }
                        
                        /* Footer */
                        .email-footer {
                            background-color: #f5f5f5;
                            padding: 20px;
                            text-align: center;
                            font-size: 12px;
                            color: #777;
                        }
                        
                        /* Buttons */
                        .button {
                            display: inline-block;
                            padding: 12px 24px;
                            background-color: #4a6bdf;
                            color: white !important;
                            text-decoration: none;
                            border-radius: 4px;
                            font-weight: bold;
                            margin: 15px 0;
                        }
                        
                        /* Responsive */
                        @media screen and (max-width: 600px) {
                            .email-content {
                                padding: 20px;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        <div class="email-header">
                            <h1>Your App Name</h1>
                        </div>
                        
                        <div class="email-content">
                            <h2>${subject}</h2>
                            <p>${body.replace(/\n/g, '<br>')}</p>
                            
                            ${subject.includes('Welcome') ? `
                            <a href="https://yourapp.com/dashboard" class="button">
                                Go to Dashboard
                            </a>
                            ` : ''}
                        </div>
                        
                        <div class="email-footer">
                            <p>© ${new Date().getFullYear()} Your App Name. All rights reserved.</p>
                            <p>
                                <a href="https://yourapp.com" style="color: #4a6bdf; text-decoration: none;">Website</a> | 
                                <a href="https://yourapp.com/privacy" style="color: #4a6bdf; text-decoration: none;">Privacy Policy</a>
                            </p>
                        </div>
                    </div>
                </body>
                </html>
                `
            });
            console.log(`Email sent to ${email}`);
        } catch (error) {
            console.error('Email sending error:', error);
            throw new Error('Failed to send email');
        }
    }
};