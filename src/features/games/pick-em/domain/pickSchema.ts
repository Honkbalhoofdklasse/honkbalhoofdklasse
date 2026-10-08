import { z } from 'zod'

export const pickSchema = z.object({
  gameId: z.number().int().positive(),
  pickedTeamId: z.string().min(2).max(20),
  nickname: z.string().min(1).max(30),
  userToken: z.string().min(16).max(64),
})

export type PickBody = z.infer<typeof pickSchema>
