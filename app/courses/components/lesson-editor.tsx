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

  const handleItemChange = (
    lessonIndex: number,
    type: CourseStructureVocabulary,
    itemIndex: number,
    field: LanguagePairField,
    value: string
  ) => {
    setLessons(preLessons => {
      const newLessons = [...preLessons]
      newLessons[lessonIndex][type][itemIndex][field] = value
      return newLessons
    })
  }

  const addItem = (lessonIndex: number, type: CourseStructureVocabulary) => {
    setLessons(preLessons => {
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
    setLessons(preLessons => {
      return preLessons.map((lesson, index) => 
        index === lessonIndex ? { ...lesson, [type]: lesson[type].filter((_, i) => i !== itemIndex) } : lesson
      );
    });
  };

  const handleSummitItem = async () => {
    const updatedCourse: Course = {
      ...currentCourse,
      structure_vocabulary: JSON.stringify(lessons)
    }
    return updateCourse(updatedCourse).then((course) => {
      setCurrentCourse(course as Course);
      setLessons(JSON.parse(course.structure_vocabulary || "[]") as LanguageUnit[]);
    })
  }

  const handleCancelItem = () => {
    setLessons(currentLessons);
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
        showEditButton={true}
        handleItemChange={handleItemChange}
        addItem={addItem}
        deleteItem={deleteItem}
        handleSummitItem={handleSummitItem}
        handleCancelItem={handleCancelItem}
      />
      <LessonCard
        title="Structures"
        items={lessons[currentLessonIndex].structure}
        originLanguage={currentCourse?.origin || LanguagePairField.ORIGIN}
        targetLanguage={currentCourse?.target || LanguagePairField.TARGET}
        lessonIndex={currentLessonIndex}
        type={CourseStructureVocabulary.STRUCTURE}
        showEditButton={true}
        handleItemChange={handleItemChange}
        addItem={addItem}
        deleteItem={deleteItem}
        handleSummitItem={handleSummitItem}
        handleCancelItem={handleCancelItem}
      />
    </div>
  )
}