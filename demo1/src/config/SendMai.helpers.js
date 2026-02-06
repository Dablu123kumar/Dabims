import {mailTransporter} from './mail.config'

async function sendEmail(toEmails, subject, text, html) {
  const mailOptions = {
    from: process.env.USER_EMAIL,
    to: toEmails,
    subject: subject,
    text: text,
    html,
  }

  try {
    const result = await mailTransporter.sendMail(mailOptions)
    console.log('Email sent successfully', result)
  } catch (error) {
    console.log('Email send failed with error:', error)
  }
}
