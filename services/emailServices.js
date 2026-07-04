const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sentVerificationEmail = async ({ email, subject, parameter, temp }) => {
  try {
    const info = await transporter.sendMail({
      from: '"Ecommerce" <robileo47@gmail.com>', // sender address
      to: email, // list of recipients
      subject: subject,
      // text: `your otp is ${otp}`,
      html: temp(parameter),
    });

    console.log("Message sent: %s", info.messageId);
    // Preview URL is only available when using an Ethereal test account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (err) {
    console.error("Error while sending mail:", err);
    throw err;
  }
};
module.exports = { sentVerificationEmail };
// for testing purpose ...............
// let transporter;
// const sentVerificationEmail = async ({ email, subject, otp }) => {
//   try {
//     if (!transporter) {
//       console.log("initializing test account........");
//       let testAccount = await nodemailer.createTestAccount();
//       transporter = nodemailer.createTransport({
//         host: testAccount.smtp.host,
//         port: testAccount.smtp.port,
//         secure: testAccount.smtp.secure, // use STARTTLS (upgrade connection to TLS after connecting)
//         auth: {
//           user: testAccount.user,
//           pass: testAccount.pass,
//         },
//       });
//     }
//     const info = await transporter.sendMail({
//       from: '"Ecommerce" <robileo47@gmail.com>', // sender address
//       to: email, // list of recipients
//       subject: subject, // subject line

//       html: `<b>your vefification otp is ${otp}</b>`, // HTML body
//     });
//     console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
//   } catch (error) {
//     console.log("email Service error :", error);
//   }
// };
// module.exports = { sentVerificationEmail };
