'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { CourseContent } from '../components/course-content'
import { getCourseById, updateCourse } from './action'
import type { Schema } from "@/amplify/data/resource";
import { LanguageUnit } from '@/lib/course/types'
import { useRouter } from 'next/navigation';
import { CourseStructureVocabulary, LanguagePairField } from '../type';

interface CoursePageProps {
  params: {
    id: string
  }
}

export default function CoursePage({ params }: CoursePageProps) {
  const [course, setCourse] = useState<Schema["courses"]["type"]>();
  const [units, setUnits] = useState<LanguageUnit[]>([]);
  const router = useRouter();
  const [confirmLoading, setConfirmLoading] = useState(false);
  useEffect(() => {
    getCourseById(params.id).then((course) => {
      console.log(course)
      setCourse(course);
      setUnits(JSON.parse(course?.structure_vocabulary || ""));
    })
  }, [params.id]);

  const handleItemChange = (unitIndex: number, type: CourseStructureVocabulary, itemIndex: number, field: LanguagePairField, value: string) => {
    setUnits(prevUnits => {
      const newUnits = [...prevUnits]
      newUnits[unitIndex][type][itemIndex][field] = value
      return newUnits
    })
  }

  const addItem = (unitIndex: number, type: CourseStructureVocabulary) => {
    setUnits(prevUnits => {
      return prevUnits.map((unit, index) => {
        if (index === unitIndex) {
          return {
            ...unit,
            [type]: [...unit[type], { origin: '', target: '' }]
          };
        }
        return unit;
      });
    });
  };

  const handleConfirm = () => {
    setConfirmLoading(true);
    updateCourse({
      ...course,
      structure_vocabulary: JSON.stringify(units),
    } as Schema["courses"]["type"]).then(() => {
      router.push(`/courses`);
    }).finally(() => {
      setConfirmLoading(false);
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto p-4">
        <div className="pb-16">
          {units.map((unit, unitIndex) => (
            <CourseContent 
              key={unit.unit} 
              unit={unit} 
              unitIndex={unitIndex} 
              originLanguage={course?.origin || 'Origin'}
              targetLanguage={course?.target || 'Target'}
              handleItemChange={handleItemChange} 
              addItem={addItem} 
            />
          ))}
        </div>
      </main>
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 h-18">
        <div className="container mx-auto flex justify-end gap-2">
          <Button onClick={handleConfirm} disabled={confirmLoading}>{confirmLoading ? 'Confirming...' : 'Confirm'}</Button>
        </div>
      </footer>
    </div>
  )
}