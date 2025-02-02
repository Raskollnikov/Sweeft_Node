import nodemailer from "nodemailer";



export const sendVerificationEmail = async (email: string, token: string) => {
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            }
            
            body {
                background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                padding: 40px 20px;
            }
            
            .container {
                max-width: 600px;
                margin: 0 auto;
                background: white;
                border-radius: 16px;
                box-shadow: 0 8px 30px rgba(0,0,0,0.12);
                overflow: hidden;
            }
            .content {
                padding: 40px;
                text-align: center;
            }
            
            h1 {
                color: #1e293b;
                font-size: 24px;
                margin-bottom: 24px;
            }
            
            .token-box {
                background: #f8fafc;
                border: 2px dashed #cbd5e1;
                border-radius: 12px;
                padding: 20px;
                font-size: 32px;
                font-weight: 700;
                color: #2563eb;
                margin: 32px 0;
                letter-spacing: 2px;
                transition: all 0.3s ease;
            }
            
            .instructions {
                color: #64748b;
                font-size: 16px;
                line-height: 1.6;
                margin-bottom: 32px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="content">
                <h1>Verify Your Email Address</h1>
                
                <div class="instructions">
                    Please use the following verification code to complete your account setup:
                </div>
                
                <div class="token-box">
                    ${token}
                </div> 
            </div>
        </div>
    </body>
    </html>
    `;

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
        },
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify Your Account",
        html: htmlContent,
    });
};
