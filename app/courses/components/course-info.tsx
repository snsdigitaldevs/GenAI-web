import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Course } from "../data/schema"

export default function CourseInfo({ course }: { course: Course }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Information</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-2">
          <div>
            <dt className="font-semibold">Origin Language</dt>
            <dd>{course.origin}</dd>
          </div>
          <div>
            <dt className="font-semibold">Target Language</dt>
            <dd>{course.target}</dd>
          </div>
          <div>
            <dt className="font-semibold">Description</dt>
            <dd>{course.description}</dd>
          </div>
          <div>
            <dt className="font-semibold">Prompt</dt>
            <dd>{course.prompt}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  )
}