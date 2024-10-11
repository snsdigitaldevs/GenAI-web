import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LanguageUnit } from "@/lib/course/types"
import { useRouter } from "next/router"

export default function LessonTable({ lessons, courseId }: { lessons: LanguageUnit[], courseId: string }) {
  const router = useRouter()
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Lesson No.</TableHead>
          <TableHead>Vocabulary count</TableHead>
          <TableHead>Structure count</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {lessons.sort((a, b) => a.unit - b.unit).map((lesson) => (
          <TableRow key={lesson.unit} onClick={() => router.push(`/courses/${courseId}/lessons/${lesson.unit}`)}>
            <TableCell>{lesson.unit}</TableCell>
            <TableCell>{lesson.vocabulary.length}</TableCell>
            <TableCell>{lesson.structure.length}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}