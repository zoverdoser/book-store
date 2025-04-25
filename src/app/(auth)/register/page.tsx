'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useToast } from '@/components/ui/use-toast'
import { useTranslations } from 'next-intl'

type TranslationFunction = (key: string) => string

const emailSchema = (t: TranslationFunction) => z.string().email(t('invalidEmail'))

const registerSchema = (t: TranslationFunction) =>
  z
    .object({
      email: emailSchema(t),
      password: z.string().min(6, t('passwordMinLength')),
      confirmPassword: z.string(),
      code: z.string().min(6, t('codeLength')),
    })
    .refine(data => data.password === data.confirmPassword, {
      message: t('passwordMismatch'),
      path: ['confirmPassword'],
    })

type RegisterFormData = z.infer<ReturnType<typeof registerSchema>>

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const t = useTranslations('Register')
  const [isLoading, setIsLoading] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [countdown, setCountdown] = useState(0)

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema(t)),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      code: '',
    },
  })

  const email = form.watch('email')

  async function sendVerificationCode() {
    if (!email) {
      toast({
        variant: 'destructive',
        title: t('sendFailed'),
        description: t('enterEmail'),
      })
      return
    }

    const emailResult = emailSchema(t).safeParse(email)
    if (!emailResult.success) {
      toast({
        variant: 'destructive',
        title: t('sendFailed'),
        description: t('invalidEmail'),
      })
      return
    }

    try {
      const response = await fetch('/api/auth/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const result = await response.json()

      if (!result.success) {
        toast({
          variant: 'destructive',
          title: t('sendFailed'),
          description: t(result.msg),
        })
        return
      }

      setIsSendingCode(true)
      setCountdown(60)

      toast({
        title: t('sendSuccess'),
        description: t('codeSent'),
      })

      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('sendFailed'),
        description: t('tryAgain'),
      })
    } finally {
      setIsSendingCode(false)
    }
  }

  async function onSubmit(data: RegisterFormData) {
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          code: data.code,
        }),
      })

      const result = await response.json()

      if (!result.success) {
        toast({
          variant: 'destructive',
          title: t('registerFailed'),
          description: t(result.msg),
        })
        return
      }

      toast({
        title: t('registerSuccess'),
        description: t('pleaseLogin'),
      })
      router.push('/login')
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('registerFailed'),
        description: t('tryAgain'),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">{t('title')}</h1>
          <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('email')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="name@example.com"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('verificationCode')}</FormLabel>
                  <div className="flex space-x-2">
                    <FormControl>
                      <Input placeholder={t('enterCode')} autoComplete="off" disabled={isLoading} {...field} />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={sendVerificationCode}
                      disabled={isSendingCode || countdown > 0}
                    >
                      {countdown > 0 ? `${countdown}${t('seconds')}` : t('getCode')}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('password')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('enterPassword')}
                      type="password"
                      autoComplete="new-password"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('confirmPassword')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('enterPasswordAgain')}
                      type="password"
                      autoComplete="new-password"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? t('registering') : t('register')}
            </Button>
          </form>
        </Form>
        <p className="px-8 text-center text-sm text-muted-foreground">
          {t('haveAccount')}{' '}
          <Link href="/login" className="underline underline-offset-4 hover:text-primary">
            {t('login')}
          </Link>
        </p>
      </div>
    </div>
  )
}
