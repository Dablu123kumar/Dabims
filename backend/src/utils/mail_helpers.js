import { createTransport } from "nodemailer";
import { USER_EMAIL, USER_PASSWORD } from "../config/config.js";

export const mailTransporter = createTransport({
  service: "gmail",
  secure: true,
  auth: {
    user: USER_EMAIL,
    pass: USER_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // <== Bypass self-signed cert errors
  },
});

// export const mailTransporter1  = createTransport({
//   service: "gmail",
//   auth: {
//     user: USER_EMAIL1,
//     pass: USER_PASSWORD1,
//   },
// });
