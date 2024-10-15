'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { CourseStructureVocabulary, LanguagePairField } from '../type'
import { useState } from "react";
import { PlusCircledIcon, TrashIcon } from "@radix-ui/react-icons"
import LessonCardEditButton from "./lesson-card-edit-button"

interface LessonCardProps {
  title: string;
  items: { origin: string; target: string }[];
  originLanguage: string;
  targetLanguage: string;
  lessonIndex: number;
  type: CourseStructureVocabulary;
  showEditButton: boolean;
  handleItemChange: (
    lessonIndex: number,
    type: CourseStructureVocabulary,
    itemIndex: number,
    field: LanguagePairField,
    value: string
  ) => void;
  addItem: (lessonIndex: number, type: CourseStructureVocabulary) => void;
  deleteItem: (lessonIndex: number, type: CourseStructureVocabulary, itemIndex: number) => void;
  handleSummitItem?: () => Promise<void>;
  handleCancelItem?: () => void;
}

export default function LessonCard({
  title,
  items,
  originLanguage,
  targetLanguage,
  lessonIndex,
  type,
  showEditButton,
  handleItemChange,
  addItem,
  handleSummitItem,
  deleteItem,
  handleCancelItem
}: LessonCardProps) {
  const [editing, setEditing] = useState(!showEditButton);
  const [confirmLoading, setConfirmLoading] = useState(false);

  return (
    <Card className="h-[700px] flex flex-col">
      <CardHeader className="flex-shrink-0 gap-2">
        <div className="flex justify-between items-center">
          <CardTitle>{title}</CardTitle>
          {showEditButton && <LessonCardEditButton 
            editing={editing} 
            setEditing={setEditing} 
            confirmLoading={confirmLoading}
            handleSummitItem={() => {
              if (handleSummitItem) {
                setConfirmLoading(true);
                handleSummitItem().finally(() => {
                  setConfirmLoading(false);
                  setEditing(false);
                });
              }
            }} 
            handleCancelItem={() => {
              if (handleCancelItem) {
                handleCancelItem();
                setEditing(false);
              }
            }}
          />}
        </div>
        <div className="grid grid-cols-2 mt-2 bg-[#F8FAFC] text-[#94A3B8] h-[56px] border-b-[1px] border-[#E2E8F0]">
          <div className="font-semibold flex items-center pl-4">{originLanguage}</div>
          <div className="font-semibold flex items-center">{targetLanguage}</div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto mb-4">
        <div className="flex flex-col gap-2">
          {items.map((item, itemIndex) => (
            <div key={itemIndex} className="flex gap-2">
              <Input
                disabled={!editing || confirmLoading}
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
                disabled={!editing || confirmLoading}
                value={item.target}
                onChange={(e) => handleItemChange(
                  lessonIndex,
                  type,
                  itemIndex,
                  LanguagePairField.TARGET,
                  e.target.value
                )}
              />
              <Button
                variant="outline" 
                size="icon" 
                className="flex-shrink-0" 
                disabled={!editing || confirmLoading}
                onClick={() => deleteItem(lessonIndex, type, itemIndex)}
              >
                <TrashIcon />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
      {editing && <div className="py-4 px-6 flex-shrink-0 border-t flex justify-center">
        <Button disabled={confirmLoading} variant="outline" className="w-full" onClick={() => addItem(lessonIndex, type)}>
          <PlusCircledIcon className="size-4 mr-2" />
          Add New
        </Button>
      </div>}
    </Card>
  )
}