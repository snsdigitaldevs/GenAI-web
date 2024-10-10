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

const LanguageUnitsSchema = z.array(UnitSchema);

export type LanguageUnit = z.infer<typeof UnitSchema>;
export type LanguageUnits = z.infer<typeof LanguageUnitsSchema>;

export default LanguageUnitsSchema;