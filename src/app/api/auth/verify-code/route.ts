import { Resend } from 'resend'
import { prisma } from '@/lib/prisma'
import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'
import { successResponse, errorResponse } from '@/lib/api-response'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const cookieStore = await cookies()
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'zh-CN'
  const t = await getTranslations({ locale })

  try {
    const { email } = await req.json()

    if (!email) {
      return errorResponse('enterEmail')
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return errorResponse('emailExists')
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
      subject: t('Register.verifyEmailSubject'),
      html: `
        <h1>${t('Register.verifyEmailWelcome')}</h1>
        <p>${t('Register.verifyEmailVerificationCode')}: <strong>${code}</strong></p>
        <p>${t('Register.verifyEmailCodeExpiresIn')}</p>
      `,
    })
    if (error) {
      console.error('发送验证码错误:', error, data)
      return errorResponse('sendCodeFailed')
    }

    return successResponse(null)
  } catch (error) {
    console.error('发送验证码错误:', error)
    return errorResponse('sendCodeFailed')
  }
}
