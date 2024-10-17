import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: process.env.MAIL_USER || 'alphaloop.firstmain@gmail.com',
    pass: process.env.MAIL_PASS || 'zxog locl tsbg kcnl',
  },
});

export const sendEmail = async (toMail, subject, htmlBody) => {
  const info = await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to: toMail,
    subject: subject,
    html: htmlBody,
  });
};
