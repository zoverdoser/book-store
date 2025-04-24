import { getRequestConfig } from 'next-intl/server'
import { Language } from '@/types'

export default getRequestConfig(async ({ locale }) => {
  const lang = locale ?? 'zh-CN'
  return {
    messages: (await import(`./messages/${lang}.json`)).default,
    timeZone: 'Asia/Shanghai',
    now: new Date(),
    locale: lang as Language,
  }
})
