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
      setCourse(course);
      const sortedUnits = JSON.parse(course?.structure_vocabulary || "").sort((a: LanguageUnit, b: LanguageUnit) => a.unit - b.unit);
      setUnits(sortedUnits);
    })
  }, [params.id]);

  const handleItemChange = (
    lessonIndex: number,
    type: CourseStructureVocabulary,
    itemIndex: number,
    field: LanguagePairField,
    value: string
  ) => {
    setUnits(preLessons => {
      const newLessons = [...preLessons]
      newLessons[lessonIndex][type][itemIndex][field] = value
      return newLessons
    })
  }

  const addItem = (lessonIndex: number, type: CourseStructureVocabulary) => {
    setUnits(preLessons => {
      return preLessons.map((lesson, index) => {
        if (index === lessonIndex) {
          return {
            ...lesson,
            [type]: [...lesson[type], { origin: '', target: '' }]
          };
        }
        return lesson;
      });
    });
  };

  const deleteItem = (lessonIndex: number, type: CourseStructureVocabulary, itemIndex: number) => {
    setUnits(preLessons => {
      return preLessons.map((lesson, index) => 
        index === lessonIndex ? { ...lesson, [type]: lesson[type].filter((_, i) => i !== itemIndex) } : lesson
    );
    });
  };

  const handleConfirm = () => {
    setConfirmLoading(true);
    updateCourse({
      ...course,
      structure_vocabulary: JSON.stringify(units),
    } as Course).then(() => {
      router.push(`/courses/${params.id}/lessons`);
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
                  showEditButton={false}
                  handleItemChange={handleItemChange}
                  addItem={addItem}
                  deleteItem={deleteItem}
                />
                <LessonCard
                  title="Structures"
                  items={unit.structure}
                  originLanguage={course?.origin || LanguagePairField.ORIGIN}
                  targetLanguage={course?.target || LanguagePairField.TARGET}
                  lessonIndex={lessonIndex}
                  type={CourseStructureVocabulary.STRUCTURE}
                  showEditButton={false}
                  handleItemChange={handleItemChange}
                  addItem={addItem}
                  deleteItem={deleteItem}
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