import { getCourse } from "@/app/courses/actions"
import { LanguageUnit } from "@/lib/course/types"
import { notFound } from "next/navigation"
import CourseInfo from "../../components/course-info"
import LessonTable from "../../components/lessons-table"

export default async function LessonsPage({ params }: { params: { id: string } }) {
  const course = await getCourse(params.id)

  if (!course) {
    notFound()
  }

  const lessons = JSON.parse(course.structure_vocabulary || "[]") as LanguageUnit[]

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lessons</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <LessonTable lessons={lessons} courseId={course.id} />
        </div>
        <div>
          <CourseInfo course={course} />
        </div>
      </div>
    </div>
  )
}

