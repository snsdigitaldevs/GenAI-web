'use server'
import { cookieBasedClient as client } from "@/lib/server"
import {Course} from "@/app/courses/data/schema";

export async function getCourses() {
  const { data, errors } =  await client.models.courses.list()
  return data as Course[]
}
