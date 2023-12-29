import sendgrid from '@sendgrid/mail'
import { NextRequest, NextResponse } from 'next/server'
if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY is not defined in your environment variables')
}

sendgrid.setApiKey(process.env.SENDGRID_API_KEY)

async function handler(req: NextRequest) {
  try {
    const body = await req.json()

    const msg = {
      to: 'hello@nodu.io',
      from: 'hello@nodu.io',
      subject: `Email from nodu.io`,
      html: `<div><p>${body.fullname}</p><p>${body.email}</p><p>${body.message}</p></div>`,
    }

    await sendgrid.send(msg)
    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json({ error: 'Method not allowed' }, { status: 500 })
  }
}

export { handler as POST }
