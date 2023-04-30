import { createTransport } from "nodemailer";
import path from "path";
import hbs from "nodemailer-express-handlebars";

const sendEmail = async (options) => {
  // Create a nodemailer transport using the provided SMTP settings
  const transporter = createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Configure nodemailer to use Handlebars templates for email content
  const handlebarOptions = {
    viewEngine: {
      partialsDir: path.resolve("../templates/"),
      defaultLayout: false,
    },
    viewPath: path.resolve("./templates/"),
  };
  transporter.use("compile", hbs(handlebarOptions));

  // Set the email options including recipient, subject, template and context
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: options.email,
    subject: options.subject,
    template: options.template,
    context: options.context,
  };

  // Send the email using the configured transport and options
  await transporter.sendMail(mailOptions);
};

export default sendEmail;