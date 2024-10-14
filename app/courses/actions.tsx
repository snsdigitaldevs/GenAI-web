'use server'

import { model } from "@/lib/ai";
import UnitSchema, { Course, LanguageUnit, Script } from "@/lib/course/types";
import { cookieBasedClient as client } from "@/lib/server";
import { generateObject, generateText } from 'ai';

export async function createCourse(course: Course) {
  return await client.models.courses.create(course)
}

export async function getCourses() {
  const { data, errors } = await client.models.courses.list()
  return data as Course[]
}

export async function getCourse(courseId: string) {
  const { data, errors } = await client.models.courses.get({ id: courseId })
  return data as Course
}

export async function getScript(courseId: string, lessonId: number): Promise<Script> {
  const { data, errors } = await client.models.scripts.list({
    filter: {
      courseId: { eq: courseId },
      lessonId: { eq: lessonId },
    },
  })
  if (errors) {
    console.error(`getScript error: ${errors}`)
  }
  console.log("getScript", data)
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
  const prompt = await getPrompt('S&V')

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

export async function deleteCourse(courseId: string): Promise<void> {
  const { data: scripts, errors } = await client.models.scripts.list({
    filter: {
      courseId: { eq: courseId },
    },
  });
  
  if (errors) {
    console.error(`Error fetching scripts: ${errors}`);
    throw new Error(`Error fetching scripts: ${errors}`);
  }

  try {
    await client.models.courses.delete({ id: courseId });
    await Promise.all(scripts.map((script: Script) => 
      client.models.scripts.delete({ id: script.id })
    ));
  } catch (error) {
    console.error(`Error deleting course: ${error}`);
    throw new Error(`Error deleting course: ${error}`);
  }
}

export async function generateScript(lessonId: number, targetLanguage: string) {
  const prompt = await getPrompt('script')

  const { data, errors } = await client.models.resources.list({
    filter: {
      type: { eq: 'S&V' },
      index: { eq: lessonId },
    },
  })

  const svJsonString = data[0].text!

  const { data: scriptData, errors: scriptErrors } = await client.models.resources.list({
    filter: {
      type: { eq: 'script' },
      index: { eq: lessonId },
    },
  })

  const scriptText = scriptData[0].text!

  const finalPrompt = prompt  
    .replace('{replace_S&V}', svJsonString)
    .replace('{replace_script}', scriptText)
    .replace('{target_language}', targetLanguage)

  console.log("finalPrompt", finalPrompt)

  const { text } = await generateText({
    model: model,
    prompt: finalPrompt,
  })

  console.log("generated text", text)

  return text
}

export const updateScriptText = async (id: string, text: string) => {
  console.log("updateScriptText", id, text)
  const { data, errors } = await client.models.scripts.update({ id: id, text: text })
  if (errors) {
    console.error(`updateScript error: ${errors}`)
    throw new Error(`updateScript error: ${errors}`)
  }
  return data!
}

export const updateScriptPrompt = async (id: string, prompt: string) => {
  console.log("updateScriptPrompt", id)
  const { data, errors } = await client.models.scripts.update({ id, prompt })
  if (errors) {
    console.error(`updateScript error: ${errors}`)
    throw new Error(`updateScript error: ${errors}`)
  }
  return data! as Script
}

const getPrompt = async (type: string) => {
  const prompts = await client.models.prompts.list({
    filter: {
      type: { eq: type },
    },
  })

  const prompt = prompts.data[0].text

  if (!prompt) {
    throw new Error('Prompt not found')
  }
  return prompt
}
