"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Row } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import { deleteCourse } from "../actions"
import { courseSchema } from "@/lib/course/types";
import { useState } from "react"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const course = courseSchema.parse(row.original)
  const route = useRouter()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteCourseLoading, setDeleteCourseLoading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDeleteCourse = async () => {
    setDeleteCourseLoading(true)
    await deleteCourse(course.id)
    setDeleteCourseLoading(false)
    setIsDialogOpen(false)
  }

  const handleDownloadFlashCard = async () => {
    setIsDownloading(true)
    try {
      const response = await fetch(`/api/flash-card?courseId=${course.id}`, {
        method: 'GET',
      })
      if (!response.ok) throw new Error('Download failed')

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `flashcard_${course.id}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error downloading flash card:', error)
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[180px]">
          <DropdownMenuItem className="cursor-pointer" asChild>
            <div onClick={() => route.push(`/courses/${course.id}/lessons`)}>
              Open Lessons
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handleDownloadFlashCard}
            disabled={isDownloading}
          >
            {isDownloading ? 'Downloading...' : 'Download Flash Card'}
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" onClick={() => setIsDialogOpen(true)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure you want to delete this course?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your course and all its data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDeleteCourse} disabled={deleteCourseLoading}>
              {deleteCourseLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
