export const locales = ['zh', 'en'] as const
export type Locale = (typeof locales)[number]
