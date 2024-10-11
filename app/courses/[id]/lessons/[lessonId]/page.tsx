import ScriptPromptEditor from '@/app/courses/components/script-prompt-editor';
import ScriptView from '@/app/courses/components/script-view';

export default function LessonPage({ params }: { params: { id: string, lessonId: string } }) {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-4">Lesson {params.lessonId}</h1>

      <ScriptPromptEditor />
      <ScriptView />
    </div>
  );
}