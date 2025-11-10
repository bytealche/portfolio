// src/api/contact.js
import sendgrid from '@sendgrid/mail';

// IMPORTANT: Set these in your Vercel/Netlify deployment environment
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const TO_EMAIL = process.env.TO_EMAIL; // Your personal email
const FROM_EMAIL = process.env.FROM_EMAIL; // A verified email on SendGrid

sendgrid.setApiKey(SENDGRID_API_KEY);

export default async function handler(req, res) {
  // We only accept POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { email, message } = req.body;

    if (!email || !message) {
      return res.status(400).json({ error: 'Email and message are required.' });
    }

    const msg = {
      to: TO_EMAIL,
      from: FROM_EMAIL,
      subject: `New Portfolio Contact from ${email}`,
      text: `
        From: ${email}
        Message:
        ${message}
      `,
    };

    await sendgrid.send(msg);
    return res.status(200).json({ success: 'Message sent successfully.' });

  } catch (error) {
    console.error('Error sending email:', error.response?.body || error.message);
    return res.status(500).json({ error: 'Error sending message.' });
  }
}