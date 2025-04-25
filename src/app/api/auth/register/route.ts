import { hash } from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { successResponse, errorResponse } from '@/lib/api-response'

export async function POST(req: Request) {
  try {
    const { email, password, code } = await req.json()

    if (!email || !password || !code) {
      return errorResponse('Register.fillAllFields')
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return errorResponse('Register.emailExists')
    }

    const verificationCode = await prisma.verificationCode.findUnique({
      where: { email },
    })

    if (!verificationCode) {
      return errorResponse('Register.getCodeFirst')
    }

    if (verificationCode.code !== code) {
      return errorResponse('Register.invalidCode')
    }

    if (verificationCode.expiresAt < new Date()) {
      return errorResponse('Register.codeExpired')
    }

    const hashedPassword = await hash(password, 12)

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'USER',
        status: 'ACTIVE',
      },
    })

    await prisma.verificationCode.delete({
      where: { email },
    })

    return successResponse(null)
  } catch (error) {
    console.error('注册错误:', error)
    return errorResponse('Register.failed')
  }
}
