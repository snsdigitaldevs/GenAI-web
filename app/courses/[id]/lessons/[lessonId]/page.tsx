import ScriptPromptEditor from '@/app/courses/components/script-prompt-editor';
import ScriptView from '@/app/courses/components/script-view';
import { getCourse, getScript } from "@/app/courses/actions"
import { notFound } from 'next/navigation';
import { LanguageUnit } from '@/lib/course/types';

export default async function LessonPage({ params }: { params: { id: string, lessonId: string } }) {
  const course = await getCourse(params.id)

  if (!course) {
    notFound()
  }

  const lessons = JSON.parse(course.structure_vocabulary || "[]") as LanguageUnit[]

  const script = await getScript(params.id, parseInt(params.lessonId))

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Lesson {params.lessonId}</h1>

      <ScriptPromptEditor script={script} />
      <ScriptView script={script} course={course} />
    </div>
  );
}