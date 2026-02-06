import {createTransport} from 'nodemailer'
export const mailTransporter = createTransport({
  service: 'gmail',
  auth: {
    user: process.env.USER_EMAIL,
    pass: process.env.USER_PASSWORD,
  },
})
