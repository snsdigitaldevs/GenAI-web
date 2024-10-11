"use client"

import { LanguageUnit } from "@/lib/course/types";
import { CourseStructureVocabulary, LanguagePairField } from "../type";
import { Course } from "@/lib/course/types";
import { useState } from "react";
import LessonCard from "./lesson-card";
import { updateCourse } from "../[id]/action";

export default function LessonEditor({ course, lessonId }: { course: Course, lessonId: string }) {
  const [currentCourse, setCurrentCourse] = useState<Course>(course);
  const currentLessons = JSON.parse(currentCourse.structure_vocabulary || "[]") as LanguageUnit[];
  const currentLessonIndex = currentLessons.findIndex(lesson => lesson.unit === parseInt(lessonId));
  const [lessons, setLessons] = useState<LanguageUnit[]>(currentLessons);

  const handleItemChange = (lessonIndex: number, type: CourseStructureVocabulary, itemIndex: number, field: LanguagePairField, value: string) => {
    setLessons(prevUnits => {
      const newUnits = [...prevUnits]
      newUnits[lessonIndex][type][itemIndex][field] = value
      return newUnits
    })
  }

  const addItem = (lessonIndex: number, type: CourseStructureVocabulary) => {
    setLessons(prevUnits => {
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

  const handleSummitItem = () => {
    const updatedCourse: Course = {
      ...currentCourse,
      structure_vocabulary: JSON.stringify(lessons)
    }
    updateCourse(updatedCourse).then((course) => {
      setCurrentCourse(course as Course);
      setLessons(JSON.parse(course.structure_vocabulary || "[]") as LanguageUnit[]);
    })
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <LessonCard
        title="Vocabulary"
        items={lessons[currentLessonIndex].vocabulary}
        originLanguage={currentCourse?.origin || LanguagePairField.ORIGIN}
        targetLanguage={currentCourse?.target || LanguagePairField.TARGET}
        lessonIndex={currentLessonIndex}
        type={CourseStructureVocabulary.VOCABULARY}
        handleItemChange={handleItemChange}
        addItem={addItem}
        showEditButton={true}
        handleSummitItem={handleSummitItem}
      />
      <LessonCard
        title="Structures"
        items={lessons[currentLessonIndex].structure}
        originLanguage={currentCourse?.origin || LanguagePairField.ORIGIN}
        targetLanguage={currentCourse?.target || LanguagePairField.TARGET}
        lessonIndex={currentLessonIndex}
        type={CourseStructureVocabulary.STRUCTURE}
        handleItemChange={handleItemChange}
        addItem={addItem}
        showEditButton={true}
        handleSummitItem={handleSummitItem}
      />
    </div>
  )
}