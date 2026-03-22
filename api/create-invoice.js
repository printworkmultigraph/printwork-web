import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { amount, external_id, payer_email, description } = req.body;
  const XENDIT_SECRET = process.env.VITE_XENDIT_SECRET_KEY;

  if (!XENDIT_SECRET) {
    return res.status(500).json({ error: 'Xendit Secret Key not configured' });
  }

  try {
    const authHeader = Buffer.from(`${XENDIT_SECRET}:`).toString('base64');
    const response = await axios.post(
      'https://api.xendit.co/v2/invoices',
      {
        external_id,
        amount,
        payer_email,
        description,
        should_send_email: true,
        success_redirect_url: 'https://www.printwork.id/Shop',
      },
      {
        headers: {
          Authorization: `Basic ${authHeader}`,
        },
      }
    );

    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Xendit Invoice Error:', error.response?.data || error.message);
    return res.status(500).json({ error: 'Failed to create invoice' });
  }
}
