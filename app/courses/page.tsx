import sortBy from "lodash/sortBy"
import { getCourses } from "./actions"
import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { NewCourse } from "./components/new-course"
import TitleText from "./components/title-text"
import { Card, CardTitle, CardHeader, CardDescription, CardContent } from "@/components/ui/card"

export default async function CoursePage() {
  const courses = await getCourses()
  const sortedCourses = sortBy(courses, ['updatedAt']).reverse()

  return (
    <>
      <div className="h-full flex-1">
        <Card>
          <CardHeader className="flex flex-row justify-between space-y-0">
            <section>
              <CardTitle>
                <TitleText title="Courses" />
              </CardTitle>
              <CardDescription>
                Here&apos;s a list of your courses!
              </CardDescription>
            </section>
            <NewCourse />
          </CardHeader>
          <CardContent>
            <DataTable data={sortedCourses} columns={columns} />
          </CardContent>
        </Card>
      </div>
    </>
  )
}
