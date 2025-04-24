import * as z from 'zod'

export const registerSchema = z
  .object({
    email: z.string().email('请输入有效的邮箱地址'),
    password: z.string().min(6, '密码至少需要6个字符').max(32, '密码最多32个字符'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  })

export type RegisterFormData = z.infer<typeof registerSchema>
