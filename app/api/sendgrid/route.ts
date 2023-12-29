import sendgrid from '@sendgrid/mail'
import type { NextApiRequest, NextApiResponse } from 'next'

if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY is not defined in your environment variables')
}

sendgrid.setApiKey(process.env.SENDGRID_API_KEY)

// async function handler(req, res) {
async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const msg = {
      to: 'hello@nodu.io',
      from: 'hello@nodu.io',
      subject: `Email from nodu.io`,
      html: `<div><p>${req.body.fullname}</p><p>${req.body.email}</p><p>${req.body.message}</p></div>`,
    }

    await sendgrid.send(msg)

    res.status(200).json({ message: 'Email sent successfully' })
  } catch (error) {
    console.error('Error sending email:', error)
    res.status(500).json({ error: 'Error sending email' })
  }
}

export { handler as POST }
