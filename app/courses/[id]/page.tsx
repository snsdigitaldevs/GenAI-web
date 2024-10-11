'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { getCourseById, updateCourse } from './action'
import { Course, LanguageUnit } from '@/lib/course/types'
import { useRouter } from 'next/navigation';
import { CourseStructureVocabulary, LanguagePairField } from '../type';
import LessonCard from '../components/lesson-card'

interface CoursePageProps {
  params: {
    id: string
  }
}

export default function CoursePage({ params }: CoursePageProps) {
  const [course, setCourse] = useState<Course>();
  const [units, setUnits] = useState<LanguageUnit[]>([]);
  const router = useRouter();
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    getCourseById(params.id).then((course) => {
      console.log(course)
      setCourse(course);
      const sortedUnits = JSON.parse(course?.structure_vocabulary || "").sort((a: LanguageUnit, b: LanguageUnit) => a.unit - b.unit);
      setUnits(sortedUnits);
    })
  }, [params.id]);

  const handleItemChange = (lessonIndex: number, type: CourseStructureVocabulary, itemIndex: number, field: LanguagePairField, value: string) => {
    setUnits(prevUnits => {
      const newUnits = [...prevUnits]
      newUnits[lessonIndex][type][itemIndex][field] = value
      return newUnits
    })
  }

  const addItem = (lessonIndex: number, type: CourseStructureVocabulary) => {
    setUnits(prevUnits => {
      return prevUnits.map((unit, index) => {
        if (index === lessonIndex) {
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
    } as Course).then(() => {
      router.push(`/courses`);
    }).finally(() => {
      setConfirmLoading(false);
    })
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto">
        <div className="pb-16 flex flex-col gap-8">
          {units.map((unit, lessonIndex) => (
            <div key={unit.unit}>
              <h2 className="text-2xl font-bold mb-4 mt-4">Lesson {unit.unit}</h2>
              <div className="grid grid-cols-2 gap-4">
                <LessonCard
                  title="Vocabulary"
                  items={unit.vocabulary}
                  originLanguage={course?.origin || LanguagePairField.ORIGIN}
                  targetLanguage={course?.target || LanguagePairField.TARGET}
                  lessonIndex={lessonIndex}
                  type={CourseStructureVocabulary.VOCABULARY}
                  handleItemChange={handleItemChange}
                  addItem={addItem}
                  showEditButton={false}
                />
                <LessonCard
                  title="Structures"
                  items={unit.structure}
                  originLanguage={course?.origin || LanguagePairField.ORIGIN}
                  targetLanguage={course?.target || LanguagePairField.TARGET}
                  lessonIndex={lessonIndex}
                  type={CourseStructureVocabulary.STRUCTURE}
                  handleItemChange={handleItemChange}
                  addItem={addItem}
                  showEditButton={false}
                />
              </div>
            </div>
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