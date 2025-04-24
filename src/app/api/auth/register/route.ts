import { NextResponse } from 'next/server'
import { hash } from 'bcryptjs'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { email, password, code } = await req.json()

    if (!email || !password || !code) {
      return NextResponse.json({ success: false, msg: 'Register.fillAllFields' }, { status: 200 })
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ success: false, msg: 'Register.emailExists' }, { status: 200 })
    }

    const verificationCode = await prisma.verificationCode.findUnique({
      where: { email },
    })

    if (!verificationCode) {
      return NextResponse.json({ success: false, msg: 'Register.getCodeFirst' }, { status: 200 })
    }

    if (verificationCode.code !== code) {
      return NextResponse.json({ success: false, msg: 'Register.invalidCode' }, { status: 200 })
    }

    if (verificationCode.expiresAt < new Date()) {
      return NextResponse.json({ success: false, msg: 'Register.codeExpired' }, { status: 200 })
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

    return NextResponse.json({ success: true, msg: 'Register.success' }, { status: 200 })
  } catch (error) {
    console.error('注册错误:', error)
    return NextResponse.json({ success: false, msg: 'Register.failed' }, { status: 200 })
  }
}
