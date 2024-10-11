'use server'

import { Course } from "@/lib/course/types";
import { cookieBasedClient as client } from "@/lib/server";

export const getCourseById = async (id: string): Promise<Course> => {
  const course = await client.models.courses.get({ id });
  return course?.data! as Course;
}

export const updateCourse = async (course: Course) => {
  const updatedCourse = await client.models.courses.update(course);
  return updatedCourse?.data! as Course;
}