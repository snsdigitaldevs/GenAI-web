import {z} from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const courseSchema = z.object({
  id: z.string(),
  origin: z.string(),
  target: z.string(),
  prompt: z.string(),
  description: z.string(),
})

export type Course = z.infer<typeof courseSchema>
