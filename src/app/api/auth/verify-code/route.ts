import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { prisma } from '@/lib/db'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          msg: 'Register.enterEmail',
        },
        { status: 200 },
      )
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          msg: 'Register.emailExists',
        },
        { status: 200 },
      )
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 分钟过期

    await prisma.verificationCode.upsert({
      where: { email },
      update: { code, expiresAt },
      create: { email, code, expiresAt },
    })

    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: 'Register.verifyEmailSubject',
      html: `
        <h1>${'Register.verifyEmailWelcome'}</h1>
        <p>${'Register.verifyEmailVerificationCode'}: <strong>${code}</strong></p>
        <p>${'Register.verifyEmailCodeExpiresIn'}</p>
      `,
    })
    if (error) {
      console.error('发送验证码错误:', error, data)
      return NextResponse.json(
        {
          success: false,
          msg: 'auth.sendCodeFailed',
        },
        { status: 200 },
      )
    }

    return NextResponse.json(
      {
        success: true,
        msg: 'auth.codeSent',
      },
      { status: 200 },
    )
  } catch (error) {
    console.error('发送验证码错误:', error)
    return NextResponse.json(
      {
        success: false,
        msg: 'auth.sendCodeFailed',
      },
      { status: 200 },
    )
  }
}
