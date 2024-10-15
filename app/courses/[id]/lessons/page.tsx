import { getCourse } from "@/app/courses/actions"
import { LanguageUnit } from "@/lib/course/types"
import { notFound } from "next/navigation"
import CourseInfo from "../../components/course-info"
import LessonTable from "../../components/lessons-table"
import TitleText from "../../components/title-text"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function LessonsPage({ params }: { params: { id: string } }) {
  const course = await getCourse(params.id)

  if (!course) {
    notFound()
  }

  const lessons = JSON.parse(course.structure_vocabulary || "[]") as LanguageUnit[]

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              <TitleText title="Lessons" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <LessonTable lessons={lessons} courseId={course.id} />
          </CardContent>
        </Card>
        <div>
          <CourseInfo course={course} />
        </div>
      </div>
    </div>
  )
}

