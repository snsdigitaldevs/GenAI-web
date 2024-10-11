'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { CourseStructureVocabulary, LanguagePairField } from '../type'
import { useState } from "react";

interface LessonCardProps {
  title: string;
  items: { origin: string; target: string }[];
  originLanguage: string;
  targetLanguage: string;
  lessonIndex: number;
  type: CourseStructureVocabulary;
  handleItemChange: (lessonIndex: number, type: CourseStructureVocabulary, itemIndex: number, field: LanguagePairField, value: string) => void;
  addItem: (lessonIndex: number, type: CourseStructureVocabulary) => void;
  showEditButton: boolean;
  handleSummitItem?: () => void;
}

export default function LessonCard({
  title,
  items,
  originLanguage,
  targetLanguage,
  lessonIndex,
  type,
  handleItemChange,
  addItem,
  showEditButton,
  handleSummitItem
}: LessonCardProps) {
  const [editing, setEditing] = useState(!showEditButton);

  const renderCardButtons = () => {
    if (showEditButton) {
      return editing ? 
        <Button onClick={() => {
          handleSummitItem?.();
          setEditing(false);
        }}>Confirm</Button> : 
        <Button onClick={() => setEditing(true)}>Edit</Button>
    }
    return null;
  }

  return (
    <Card className="h-[700px] flex flex-col">
      <CardHeader className="flex-shrink-0 gap-2">
        <div className="flex justify-between items-center">
          <CardTitle>{title}</CardTitle>
          {renderCardButtons()}
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2 bg-[#F8FAFC] text-[#94A3B8] h-[56px]">
          <div className="font-semibold flex items-center pl-4">{originLanguage}</div>
          <div className="font-semibold flex items-center pl-4">{targetLanguage}</div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto mb-4">
        <div className="grid grid-cols-2 gap-y-2 gap-x-8 pl-2">
          {items.map((item, itemIndex) => (
            <>
              <Input
                disabled={!editing}
                value={item.origin}
                onChange={(e) => handleItemChange(
                  lessonIndex,
                  type,
                  itemIndex,
                  LanguagePairField.ORIGIN,
                  e.target.value
                )}
              />
              <Input
                disabled={!editing}
                value={item.target}
                onChange={(e) => handleItemChange(
                  lessonIndex,
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
      {editing && <div className="p-6 flex-shrink-0 border-t">
        <Button variant="outline" className="w-full" onClick={() => addItem(lessonIndex, type)}>
          Add New
        </Button>
      </div>}
    </Card>
  )
}