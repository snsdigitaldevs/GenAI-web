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
import { client } from "@/lib/client"
import { Amplify } from 'aws-amplify';
import outputs from '../../../../amplify_outputs.json';
import { useState } from "react"

const FormSchema = z.object({
  originLanguage: z.string().min(2, {
    message: "Origin Language must be at least 2 characters.",
  }),
  targetLanguage: z.string().min(2, {
    message: "Target Language must be at least 2 characters.",
  }),
})

export function NewTask() {
  const [loading, setLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

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
    Amplify.configure(outputs);
    const task = await client.models.tasks.create({
      origin: data.originLanguage,
      target: data.targetLanguage,
      status: "In Progress",
    })
    console.info(`Task submitted: ${JSON.stringify(task)}`)
    setLoading(false)
    setIsDialogOpen(false)
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsDialogOpen(true)}>New Task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Add a new task to your list.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
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
        <Button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </Form>
      </DialogContent>
    </Dialog>
  )
}
