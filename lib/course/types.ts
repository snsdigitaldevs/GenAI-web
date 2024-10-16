import {z} from 'zod';

const LanguagePairSchema = z.object({
  origin: z.string(),
  target: z.string(),
});

const UnitSchema = z.object({
  unit: z.number(),
  structure: z.array(LanguagePairSchema),
  vocabulary: z.array(LanguagePairSchema),
});

export type LanguageUnit = z.infer<typeof UnitSchema>;

export default UnitSchema;

const ScriptSchema = z.object({
  id: z.string(),
  courseId: z.string(),
  lessonId: z.number(),
  prompt: z.string(),
  text: z.string(),
});

export type Script = z.infer<typeof ScriptSchema>;

export const courseSchema = z.object({
  id: z.string(),
  origin: z.string(),
  target: z.string(),
  prompt: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  structure_vocabulary: z.string().optional().nullable(),
  updatedAt: z.string().optional().nullable(),
})
export type Course = z.infer<typeof courseSchema>
