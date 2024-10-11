import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { CourseStructureVocabulary, LanguagePairField } from '../type'

interface LessonCardProps {
  title: string;
  items: { origin: string; target: string }[];
  originLanguage: string;
  targetLanguage: string;
  unitIndex: number;
  type: CourseStructureVocabulary;
  handleItemChange: (unitIndex: number, type: CourseStructureVocabulary, itemIndex: number, field: LanguagePairField, value: string) => void;
  addItem: (unitIndex: number, type: CourseStructureVocabulary) => void;
}

export default function LessonCard({
  title,
  items,
  originLanguage,
  targetLanguage,
  unitIndex,
  type,
  handleItemChange,
  addItem
}: LessonCardProps) {
  return (
    <Card className="h-[700px] flex flex-col">
      <CardHeader className="flex-shrink-0 gap-2">
        <CardTitle>{title}</CardTitle>
        <div className="grid grid-cols-2 gap-2 mt-2 bg-[#F8FAFC] text-[#94A3B8] h-[56px]">
          <div className="font-semibold flex items-center pl-4">{originLanguage}</div>
          <div className="font-semibold flex items-center pl-4">{targetLanguage}</div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto">
        <div className="grid grid-cols-2 gap-y-2 gap-x-8 pl-2">
          {items.map((item, itemIndex) => (
            <>
              <Input
                key={`${type}-origin-${itemIndex}`}
                value={item.origin}
                onChange={(e) => handleItemChange(
                  unitIndex,
                  type,
                  itemIndex,
                  LanguagePairField.ORIGIN,
                  e.target.value
                )}
              />
              <Input
                key={`${type}-target-${itemIndex}`}
                value={item.target}
                onChange={(e) => handleItemChange(
                  unitIndex,
                  type,
                  itemIndex,
                  LanguagePairField.TARGET,
                  e.target.value
                )}
              />
            </>
          ))}
        </div>
      </CardContent>
      <div className="p-6 flex-shrink-0 border-t">
        <Button variant="outline" className="w-full" onClick={() => addItem(unitIndex, type)}>
          Add New
        </Button>
      </div>
    </Card>
  )
}