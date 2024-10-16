'use server'

import { model } from "@/lib/ai";
import UnitSchema, { Course, LanguageUnit, Script } from "@/lib/course/types";
import { cookieBasedClient as client, getOIDCClient } from "@/lib/server";
import { generateObject, generateText } from 'ai';
import { get } from "lodash";

export async function createCourse(course: Course) {
  return await client.models.courses.create(course)
}

export async function getCourses() {
  const { data, errors } = await client.models.courses.list({})
  return data as unknown as Course[]
}

export async function getCourse(courseId: string) {
  const { data, errors } = await client.models.courses.get({ id: courseId })
  return data as unknown as Course
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
  for (const lesson of lessons) {
    await client.models.scripts.create({
      courseId: courseId,
      lessonId: lesson.unit
    })
  }
}

export async function generateStructuresAndVocabulary(
  targetLanguage: string,
  originLanguage: string,
  customPrompt: string | undefined
) {
  const prompt = await getPrompt('S&V')

  const svTextArray = await getStructuresAndVocabularyJsonStringArray()

  const unitPromises = svTextArray.map(async (sv: any) => {
    const finalPrompt = prompt
      .replace('{target_language}', targetLanguage)
      .replace('{origin_language}', originLanguage)
      .replace('{replace_S&V}', sv)
      .replace('{custom_prompt}', customPrompt ?? '')

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
    await Promise.all(scripts.map((script) =>
      client.models.scripts.delete({ id: script.id })
    ));
  } catch (error) {
    console.error(`Error deleting course: ${error}`);
    throw new Error(`Error deleting course: ${error}`);
  }
}


export async function generateScript(
  lessonId: number,
  course: Course
) {
  const prompt = await getPrompt('script')

  const structuresAndVocabularyJsonString = await getStructuresAndVocabularyByLessonId(lessonId)

  const scriptText = await getScriptByLessonId(lessonId)

  const newStructuresAndVocabulary = JSON.parse(course.structure_vocabulary!) as LanguageUnit[]

  const replaceStructuresAndVocabulary = newStructuresAndVocabulary
    .filter((unit) => unit.unit === lessonId)
    .map((unit) => JSON.stringify(unit))[0]

  const finalPrompt = prompt
    .replace('{replace_origin_S&V}', structuresAndVocabularyJsonString)
    .replace('{replace_origin_script}', scriptText)
    .replace('{replace_new_S&V}', replaceStructuresAndVocabulary)
    .replace('{target_language}', course.target)
    .replace('{origin_language}', course.origin)
    .replace('{custom_prompt}', course.prompt ?? '')

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
  return data! as unknown as Script
}

const getPrompt = async (type: string) => {
  const oidcClient = await getOIDCClient();
  const { data: prompts, errors } = await oidcClient.models.prompts.list({
    filter: {
      type: { eq: type },
    },
  });

  if (errors) {
    console.error(`getPrompt error: ${errors}`)
    throw new Error(`getPrompt error: ${errors}`)
  }

  const prompt = prompts[0].text

  if (!prompt) {
    throw new Error('Prompt not found')
  }
  return prompt
}

const getStructuresAndVocabularyByLessonId = async (lessonId: number) => {
  const { data, errors } = await client.models.resources.list({
    filter: {
      type: { eq: 'S&V' },
      index: { eq: lessonId },
    },
  })

  if (errors) {
    console.error(`getStructuresAndVocabularyByLessonId error: ${errors}`)
    throw new Error(`getStructuresAndVocabularyByLessonId error: ${errors}`)
  }

  return data[0].text!
}

const getScriptByLessonId = async (lessonId: number) => {
  const { data, errors } = await client.models.resources.list({
    filter: {
      type: { eq: 'script' },
      index: { eq: lessonId },
    },
  })

  if (errors) {
    console.error(`getScriptByLessonId error: ${errors}`)
    throw new Error(`getScriptByLessonId error: ${errors}`)
  }

  return data[0].text!
}

const getStructuresAndVocabularyJsonStringArray = async () => {
  const { data, errors } = await client.models.resources.list({
    filter: {
      type: { eq: 'S&V' },
    },
  })

  if (errors) {
    console.error(`getStructuresAndVocabularyJsonStringArray error: ${errors}`)
    throw new Error(`getStructuresAndVocabularyJsonStringArray error: ${errors}`)
  }

  console.log("allStructuresAndVocabulary", data)

  const svTextArray = data.map((sv) => sv.text!)

  if (!svTextArray) {
    throw new Error('Structures and Vocabulary not found')
  }

  return svTextArray
}
