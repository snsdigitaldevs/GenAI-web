"use client"

import ScriptPromptEditor from '@/app/courses/components/script-prompt-editor';
import ScriptView from '@/app/courses/components/script-view';
import { getCourse, getScript, updateScriptText, generateScript } from "@/app/courses/actions"
import LessonEditor from '@/app/courses/components/lesson-editor';
import VocabularyRecallFrequency from '@/app/courses/components/vocabulary-recall-frequency';
import { Course, Script } from '@/lib/course/types';
import { useCallback, useEffect, useState } from 'react';

export default function LessonPage({ params }: { params: { id: string, lessonId: string } }) {
  const [course, setCourse] = useState<Course>();
  const [script, setScript] = useState<Script>({} as Script);

  useEffect(() => {
    getCourse(params.id).then((course) => {
      setCourse(course);
    })
    getScript(params.id, parseInt(params.lessonId)).then((script) => {
      setScript(script);
    })
  }, [params.id, params.lessonId]);

  const generate = async () => {
    const text = await generateScript(script.lessonId, course as Course);
    await updateScriptText(script.id, text);
    setScript({ ...script, text: text });
  }

  const saveScriptContent = useCallback(async (content: string) => {
    await updateScriptText(script.id, content);
    setScript({ ...script, text: content });
  }, [script.id]);

  if (!course) {
    return <div className="flex items-center justify-center h-screen">
      <div className="spinner spinner-primary">Loading...</div>
    </div>
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Lesson {params.lessonId}</h1>
      <LessonEditor course={course} lessonId={params.lessonId} />
      <ScriptPromptEditor script={script} />
      <ScriptView script={script} generateScript={generate} saveScriptContent={saveScriptContent} />
      <VocabularyRecallFrequency script={script} course={course} />
    </div>
  );
}