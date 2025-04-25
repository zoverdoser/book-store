'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
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

const loginSchema = (t: (key: string) => string) =>
  z.object({
    email: z.string().email(t('Login.invalidEmail')),
    password: z.string().min(1, t('Login.enterPassword')),
  })

type LoginFormData = z.infer<ReturnType<typeof loginSchema>>

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const t = useTranslations()

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema(t)),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: LoginFormData) {
    setIsLoading(true)

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: '/',
      })

      if (result?.error) {
        toast({
          variant: 'destructive',
          title: t('Login.loginFailed'),
          description: result.error,
        })
        return
      }

      toast({
        title: t('Login.loginSuccess'),
        description: t('Login.welcomeBack'),
      })

      router.push('/')
    } catch (error) {
      toast({
        variant: 'destructive',
        title: t('Login.loginFailed'),
        description: t('Login.tryAgain'),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">{t('Login.title')}</h1>
          <p className="text-sm text-muted-foreground">{t('Login.subtitle')}</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Login.email')}</FormLabel>
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('Login.password')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('Login.enterPassword')}
                      type="password"
                      autoComplete="current-password"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? t('Login.loggingIn') : t('Login.login')}
            </Button>
          </form>
        </Form>
        <p className="px-8 text-center text-sm text-muted-foreground">
          {t('Login.noAccount')}{' '}
          <Link href="/register" className="underline underline-offset-4 hover:text-primary">
            {t('Login.register')}
          </Link>
        </p>
      </div>
    </div>
  )
}
