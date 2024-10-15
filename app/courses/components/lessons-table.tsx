'use client'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LanguageUnit } from "@/lib/course/types"
import { useRouter } from "next/navigation"

export default function LessonTable({ lessons, courseId }: { lessons: LanguageUnit[], courseId: string }) {
  const router = useRouter()
  return (
    <Table>
      <TableHeader className="bg-[#F8FAFC] h-14">
        <TableRow>
          <TableHead>Lesson No.</TableHead>
          <TableHead>Vocabulary count</TableHead>
          <TableHead>Structure count</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="border-b-[1px] border-[#E2E8F0]">
        {lessons.sort((a, b) => a.unit - b.unit).map((lesson) => (
          <TableRow 
            key={lesson.unit} 
            onClick={() => router.push(`/courses/${courseId}/lessons/${lesson.unit}`)}
            className="cursor-pointer"
          >
            <TableCell>{lesson.unit}</TableCell>
            <TableCell>{lesson.vocabulary.length}</TableCell>
            <TableCell>{lesson.structure.length}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}