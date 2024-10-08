import { z } from 'zod';

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