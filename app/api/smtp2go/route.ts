import { NextRequest, NextResponse } from 'next/server'
import SMTP2GOApi from 'smtp2go-nodejs'

if (!process.env.SEND2GO_API_KEY) {
  throw new Error('SEND2GO_API_KEY is not defined in your environment variables')
}

const api = SMTP2GOApi(process.env.SEND2GO_API_KEY)

async function handler(req: NextRequest) {
  try {
    const body = await req.json()

    const msg = {
      to: 'hello@nodu.io',
      from: 'hello@nodu.io',
      subject: `Email from nodu.io`,
      html: `<div><p>${body.fullname}</p><p>${body.email}</p><p>${body.message}</p></div>`,
    }

    const mailService = api
      .mail()
      .to({ email: msg.to })
      .from({ email: msg.from })
      .subject(msg.subject)
      .html(msg.html)

    await api.client().consume(mailService)

    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json({ error: 'Method not allowed' }, { status: 500 })
  }
}

export { handler as POST }
