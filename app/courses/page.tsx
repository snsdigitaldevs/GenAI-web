import sortBy from "lodash/sortBy"
import { getCourses } from "./actions"
import { columns } from "./components/columns"
import { DataTable } from "./components/data-table"
import { NewCourse } from "./components/new-course"

export default async function CoursePage() {
  const courses = await getCourses()
  const sortedCourses = sortBy(courses, ['updatedAt']).reverse()

  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your courses!
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <NewCourse />
          </div>
        </div>
        <DataTable data={sortedCourses} columns={columns} />
      </div>
    </>
  )
}
