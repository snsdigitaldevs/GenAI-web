import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { LanguageUnit } from '@/lib/course/types'
import { CourseStructureVocabulary, LanguagePairField } from '../type'

interface CourseContentProps {
  unit: LanguageUnit;
  unitIndex: number;
  originLanguage: string;
  targetLanguage: string;
  handleItemChange: (unitIndex: number, type: CourseStructureVocabulary, itemIndex: number, field: LanguagePairField, value: string) => void;
  addItem: (unitIndex: number, type: CourseStructureVocabulary) => void;
}

export function CourseContent({ 
  unit, 
  unitIndex, 
  originLanguage, 
  targetLanguage, 
  handleItemChange, 
  addItem 
}: CourseContentProps) {
  return (
    <div>
      <div key={unit.unit} className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Lesson {unit.unit}</h2>
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Vocabulary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-semibold">{originLanguage}</div>
                <div className="font-semibold">{targetLanguage}</div>
                {unit.vocabulary.map((item, itemIndex) => (
                  <>
                    <Input
                      key={`vocab-origin-${itemIndex}`}
                      value={item.origin}
                      onChange={(e) => handleItemChange(
                        unitIndex, 
                        CourseStructureVocabulary.VOCABULARY, 
                        itemIndex, 
                        LanguagePairField.ORIGIN, 
                        e.target.value
                      )}
                    />
                    <Input
                      key={`vocab-target-${itemIndex}`}
                      value={item.target}
                      onChange={(e) => handleItemChange(
                        unitIndex, 
                        CourseStructureVocabulary.VOCABULARY, 
                        itemIndex, 
                        LanguagePairField.TARGET, 
                        e.target.value
                      )}
                    />
                  </>
                ))}
              </div>
              <Button variant="outline" className="mt-2" onClick={() => addItem(unitIndex, CourseStructureVocabulary.VOCABULARY)}>
                Add New
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Structures</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                <div className="font-semibold">{originLanguage}</div>
                <div className="font-semibold">{targetLanguage}</div>
                {unit.structure.map((item, itemIndex) => (
                  <>
                    <Input
                      key={`struct-origin-${itemIndex}`}
                      value={item.origin}
                      onChange={(e) => handleItemChange(
                        unitIndex, 
                        CourseStructureVocabulary.STRUCTURE, 
                        itemIndex, 
                        LanguagePairField.ORIGIN, 
                        e.target.value
                      )}
                    />
                    <Input
                      key={`struct-target-${itemIndex}`}
                      value={item.target}
                      onChange={(e) => handleItemChange(
                        unitIndex, 
                        CourseStructureVocabulary.STRUCTURE, 
                        itemIndex, 
                        LanguagePairField.TARGET, 
                        e.target.value
                      )}
                    />
                  </>
                ))}
              </div>
              <Button variant="outline" className="mt-2" onClick={() => addItem(unitIndex, CourseStructureVocabulary.STRUCTURE)}>
                Add New
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}