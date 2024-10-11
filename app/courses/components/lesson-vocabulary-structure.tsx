import LessonCard from './lesson-card'
import { LanguageUnit } from '@/lib/course/types'
import { CourseStructureVocabulary, LanguagePairField } from '../type'

interface LessonVocabularyStructureProps {
  unit: LanguageUnit;
  unitIndex: number;
  originLanguage: string;
  targetLanguage: string;
  handleItemChange: (unitIndex: number, type: CourseStructureVocabulary, itemIndex: number, field: LanguagePairField, value: string) => void;
  addItem: (unitIndex: number, type: CourseStructureVocabulary) => void;
}

export function LessonVocabularyStructure({ 
  unit, 
  unitIndex, 
  originLanguage, 
  targetLanguage, 
  handleItemChange, 
  addItem 
}: LessonVocabularyStructureProps) {
  return (
    <div>
      <div key={unit.unit} className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Lesson {unit.unit}</h2>
        <div className="grid grid-cols-2 gap-4">
          <LessonCard
            title="Vocabulary"
            items={unit.vocabulary}
            originLanguage={originLanguage}
            targetLanguage={targetLanguage}
            unitIndex={unitIndex}
            type={CourseStructureVocabulary.VOCABULARY}
            handleItemChange={handleItemChange}
            addItem={addItem}
          />
          <LessonCard
            title="Structures"
            items={unit.structure}
            originLanguage={originLanguage}
            targetLanguage={targetLanguage}
            unitIndex={unitIndex}
            type={CourseStructureVocabulary.STRUCTURE}
            handleItemChange={handleItemChange}
            addItem={addItem}
          />
        </div>
      </div>
    </div>
  )
}