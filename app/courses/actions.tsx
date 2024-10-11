'use server'

import { model } from "@/lib/ai";
import UnitSchema, {Course, LanguageUnit, Script} from "@/lib/course/types";
import { cookieBasedClient as client } from "@/lib/server";
import { generateObject } from 'ai';

export async function getCourses() {
  const { data, errors } =  await client.models.courses.list()
  return data as Course[]
}

export async function getCourse(courseId: string) {
  const { data, errors } = await client.models.courses.get({ id: courseId })
  return data as Course
}

export async function getScript(courseId: string, lessonId: number): Promise<Script> {
  const {data, errors} = await client.models.scripts.list({
    filter: {
      courseId: { eq: courseId },
      lessonId: { eq: lessonId },
    },
  })
  if (errors) {
    console.error(`getScript error: ${errors}`)
  }
  return data[0] as Script
}

export async function createScript(courseId: string, lessons: LanguageUnit[]) {
  lessons.forEach(async (lesson) => {
    await client.models.scripts.create({
      courseId: courseId,
      lessonId: lesson.unit
    })
  })
}

export async function generateStructuresAndVocabulary(targetLanguage: string) {
  const prompts =  await client.models.prompts.list({
      filter: {
        type: { eq: 'S&V' },
      },
  })

  console.log("prompts", prompts)

  const prompt = prompts.data[0].text

  if (!prompt) {
    throw new Error('Prompt not found')
  }


  const allStructuresAndVocabulary = await client.models.resources.list({
    filter: {
      type: { eq: 'S&V' },
    },
  })

  console.log("allStructuresAndVocabulary", allStructuresAndVocabulary)

  const svTextArray = allStructuresAndVocabulary.data.map((sv) => sv.text!)

  if (!svTextArray) {
    throw new Error('Structures and Vocabulary not found')
  }

  const unitPromises = svTextArray.map(async (sv) => {
    const finalPrompt = prompt?.replace('{target_language}', targetLanguage).replace('{replace_S&V}', sv)
    console.log("finalPrompt", finalPrompt)
    const { object: data } = await generateObject({
      model: model,
      schema: UnitSchema,
      output: "object",
      prompt: finalPrompt,
    });
    console.log("generateStructuresAndVocabulary", data)
    return data as LanguageUnit;
  });

  const units = await Promise.all(unitPromises);

  console.log("generated units", units)

  return units;
}

export async function deleteCourse(courseId: string) {
  await client.models.courses.delete({ id: courseId })
}
