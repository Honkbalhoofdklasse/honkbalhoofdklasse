import { z } from 'zod'

const optionalPhone = z
  .string()
  .trim()
  .min(5)
  .max(30)
  .optional()
  .or(z.literal('').transform(() => undefined))

export const partnerContactSchema = z.object({
  name: z.string().trim().min(1).max(80),
  company: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  phone: optionalPhone,
  message: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .or(z.literal('').transform(() => undefined)),
})

export type PartnerContact = z.infer<typeof partnerContactSchema>
