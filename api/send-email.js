import { Resend } from 'resend';

const resend = new Resend(process.env.VITE_RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, html } = req.body;

  if (!process.env.VITE_RESEND_API_KEY) {
    return res.status(500).json({ error: 'Resend API Key not configured' });
  }

  try {
    const data = await resend.emails.send({
      from: 'Printwork Indonesia <orders@printwork.id>',
      to: [to || 'printworkmultigraph@gmail.com'],
      subject: subject || 'Pesanan Baru - Printwork',
      html: html || '<p>Detail pesanan Anda sedang diproses.</p>',
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error('Resend Error:', error);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
