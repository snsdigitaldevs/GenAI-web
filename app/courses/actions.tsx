'use server'
import { Course } from "@/app/courses/data/schema";
import { model } from "@/lib/ai";
import LanguageUnitsSchema from "@/lib/course/types";
import { cookieBasedClient as client } from "@/lib/server";
import { generateObject } from 'ai';

export async function getCourses() {
  const { data, errors } =  await client.models.courses.list()
  return data as Course[]
}

export async function generateStructuresAndVocabulary(targetLanguage: string) {
  const prompts =  await client.models.prompts.list({
      filter: {
        type: { eq: 'S&C Prompt' },
      },
  })

  const prompt = prompts.data[0].text

  if (!prompt) {
    throw new Error('Prompt not found')
  }

  const allStructuresAndVocabulary = await client.models.resources.list({
    filter: {
      type: { eq: 'S&C' },
      index: { eq: 0 },
    },
  })

  const allStructuresAndVocabularyText = allStructuresAndVocabulary.data[0].text

  if (!allStructuresAndVocabularyText) {
    throw new Error('Structures and Vocabulary not found')
  }

  const finalPrompt = prompt?.replace('{target_language}', targetLanguage).replace('{replace_S&C}', allStructuresAndVocabularyText)

  const { object: data } = await generateObject({
    model: model,
    schema: LanguageUnitsSchema,
    prompt: finalPrompt,
  });
  console.log("generateStructuresAndVocabulary", data)

  return data;
}

