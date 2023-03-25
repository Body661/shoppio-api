import { createTransport } from "nodemailer";
import path from "path";
import hbs from "nodemailer-express-handlebars";

const sendEmail = async (options) => {
  const transporter = createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const handlebarOptions = {
    viewEngine: {
      partialsDir: path.resolve("../templates/"),
      defaultLayout: false,
    },
    viewPath: path.resolve("./templates/"),
  };

  transporter.use("compile", hbs(handlebarOptions));

  const mailtOpts = {
    from: process.env.EMAIL_USER,
    to: options.email,
    subject: options.subject,
    template: options.template,
    context: options.context,
  };

  await transporter.sendMail(mailtOpts);
};

export default sendEmail;
