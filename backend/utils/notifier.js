const nodemailer = require('nodemailer')
const pool = require('../config/db')

let transporter = null
if(process.env.SMTP_HOST && process.env.SMTP_USER){
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  })
}

const notifyParentsOfNanny = async (nanny_id, { subject, text, html }) => {
  // find parent emails for children that this nanny has activities for
  const [rows] = await pool.query('SELECT DISTINCT u.email FROM users u JOIN children c ON u.id = c.parent_id JOIN activities a ON c.id = a.child_id WHERE a.nanny_id = ?', [nanny_id])
  const emails = rows.map(r=>r.email).filter(Boolean)
  if(emails.length === 0){
    console.log('notifier: no parent emails found for nanny', nanny_id)
    return
  }
  if(transporter){
    const info = await transporter.sendMail({ from: process.env.SMTP_FROM || process.env.SMTP_USER, to: emails.join(','), subject, text, html })
    console.log('notifier: sent emails', info.messageId)
  }else{
    console.log('notifier: SMTP not configured — would notify:', emails, subject, text)
  }
}

module.exports = { notifyParentsOfNanny }
