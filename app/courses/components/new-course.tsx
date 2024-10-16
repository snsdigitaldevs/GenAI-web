"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircledIcon } from '@radix-ui/react-icons'
import { createScript, generateStructuresAndVocabulary, createCourse } from "../actions"
import { useRouter } from "next/navigation"
import { Course } from "@/lib/course/types"
import { MultiStepLoader } from "@/components/ui/multi-step-loader"

const FormSchema = z.object({
  originLanguage: z.string().min(2, {
    message: "Origin Language must be at least 2 characters.",
  }),
  targetLanguage: z.string().min(2, {
    message: "Target Language must be at least 2 characters.",
  }),
  description: z.string().optional(),
  prompt: z.string().optional(),
})

const loadingStates = [
  { text: "Analyzing language patterns" },
  { text: "Generating vocabulary list" },
  { text: "Crafting grammar structures" },
  { text: "Creating cultural context" },
  { text: "Optimizing learning sequence" },
  { text: "Personalizing course content" },
  { text: "Finalizing course structure" },
  { text: "Generating Lesson 1" },
  { text: "Generating Lesson 2" },
  { text: "Generating Lesson 3" },
  { text: "Generating Lesson 4" },
  { text: "Generating Lesson 5" },
];

export function NewCourse() {
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      originLanguage: "English",
      targetLanguage: "Chinese",
    },
  })

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    setLoading(true)
    console.info(`Submitting task: ${data.originLanguage} -> ${data.targetLanguage}`)

    try {
      setIsDialogOpen(false)
      const structureVocabulary = await generateStructuresAndVocabulary(data.targetLanguage, data.originLanguage, data.prompt)
      console.info(`Structure Vocabulary: ${structureVocabulary}`)

      const course = await createCourse({
        origin: data.originLanguage,
        target: data.targetLanguage,
        prompt: data.prompt,
        description: data.description,
        structure_vocabulary: JSON.stringify(structureVocabulary),
      } as unknown as Course)
      console.info(`Course submitted: ${JSON.stringify(course)}`)

      if (!course.data) {
        throw new Error("Failed to create course")
      }

      await createScript(course.data.id, structureVocabulary)
      router.push(`/courses/${course.data?.id}`);
      setLoading(false)
    } catch (error) {
      console.error(`Error submitting task: ${error}`)
      setLoading(false)
      setIsDialogOpen(false)
    }
  }

  return (
    <>
      <MultiStepLoader loadingStates={loadingStates} loading={loading} duration={5000} />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsDialogOpen(true)}>
            <PlusCircledIcon className="size-4 mr-2" />
            Add Course
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-4xl">
          <DialogHeader>
            <DialogTitle>Add New Course</DialogTitle>
            <DialogDescription>
              Add a new course to your list.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
              <FormField
                control={form.control}
                name="originLanguage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origin Language</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your origin language.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetLanguage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Language</FormLabel>
                    <FormControl>
                      <Input placeholder="shadcn" {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your target language.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prompt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Optional"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your prompt.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Optional"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This is your description.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
