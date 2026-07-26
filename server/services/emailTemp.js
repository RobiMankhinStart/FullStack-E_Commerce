const emailVerifyTemp = (parameter) => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #4f46e5; padding: 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">
          Verify Your Email
        </h1>
      </div>
      <div style="padding: 30px; background-color: #ffffff; color: #333333; line-height: 1.6;">
        <p style="font-size: 16px;">Hello,</p>
        <p style="font-size: 16px;">
          Thank you for joining our platform. Use the code below to complete
          your registration. This code is valid for <b>2 minutes</b>.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; background-color: #f3f4f6; color: #4f46e5; font-size: 32px; font-weight: bold; padding: 15px 40px; border-radius: 8px; letter-spacing: 5px; border: 1px dashed #4f46e5;">
            ${parameter}
          </span>
        </div>

        <p style="font-size: 14px; color: #666666;">
          If you did not request this email, please ignore it or contact support
          if you have concerns.
        </p>
        <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;"> 
        <p style="font-size: 12px; color: #999999; text-align: center;">
          &copy; 2026 Ecommerce Inc. All rights reserved.
        </p>
      </div>
    </div>
  `;
};
const resetPassTemp = (parameter) => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
      <div style="background-color: #1e293b; padding: 20px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">
          Reset Your Password
        </h1>
      </div>
      <div style="padding: 30px; background-color: #ffffff; color: #333333; line-height: 1.6;">
        <p style="font-size: 16px;">Hello,</p>
        <p style="font-size: 16px;">
          We received a request to reset your password. Click the button below to choose a new one. 
          This link will expire in <b>15 minutes</b>.
        </p>

        <div style="text-align: center; margin: 35px 0;">
          <a href="${parameter}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 30px; border-radius: 6px; box-shadow: 0 4px 6px -1px rgba(79, 70, 229, 0.2);">
            Reset Password
          </a>
        </div>

        <p style="font-size: 14px; color: #666666;">
          If the button above doesn't work, copy and paste this link into your browser:
          <br>
          <a href="${parameter}" style="color: #4f46e5; word-break: break-all; font-size: 12px;">${parameter}</a>
        </p>

        <p style="font-size: 14px; color: #666666; margin-top: 20px;">
          If you didn't ask to change your password, you can safely ignore this email.
        </p>
        <hr style="border: 0; border-top: 1px solid #eeeeee; margin: 20px 0;"> 
        <p style="font-size: 12px; color: #999999; text-align: center;">
          &copy; 2026 Ecommerce Inc. All rights reserved.
        </p>
      </div>
    </div>  
  `;
};
module.exports = { emailVerifyTemp, resetPassTemp };
