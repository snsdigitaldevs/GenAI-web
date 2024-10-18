import 'server-only'

import {
  createAI,
  createStreamableUI,
  getMutableAIState,
  getAIState,
  streamUI,
  createStreamableValue
} from 'ai/rsc'
import { model } from '@/lib/ai'

import { z } from 'zod'

import { nanoid, sleep } from '@/lib/utils'
import { saveChat } from '@/app/actions'
import { Chat, Message } from '@/lib/types'
import { auth } from '@/auth'
import { BotCard, BotMessage, BotSkeleton, SpinnerMessage, UserMessage } from '@/components/chat/message'
import CourseInfo from '@/app/courses/components/course-info'
import { getCoursesByLanguage, getScript } from '@/app/courses/actions'
import { Course } from '../course/types'

async function submitUserMessage(content: string) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()

  aiState.update({
    ...aiState.get(),
    messages: [
      ...aiState.get().messages,
      {
        id: nanoid(),
        role: 'user',
        content
      }
    ]
  })

  let textStream: undefined | ReturnType<typeof createStreamableValue<string>>
  let textNode: undefined | React.ReactNode

  const result = await streamUI({
    model: model,
    initial: <SpinnerMessage />,
    system: `\
    You are a courses management conversation bot and you can help users get courses information.
    You and the user can discuss courses information and the user can adjust the fields of courses they want to update.

    If you want to get or query the courses information, call \`getCourses\`.
    If you want to get or query the script information, call \`getScript\`.

    Besides that, you can also chat with users if needed.`,
    messages: [
      ...aiState.get().messages.map((message: any) => ({
        role: message.role,
        content: message.content,
        name: message.name
      }))
    ],
    text: ({ content, done, delta }) => {
      if (!textStream) {
        textStream = createStreamableValue('')
        textNode = <BotMessage content={textStream.value} />
      }

      if (done) {
        textStream?.done()
        aiState.done({
          ...aiState.get(),
          messages: [
            ...aiState.get().messages,
            {
              id: nanoid(),
              role: 'assistant',
              content
            }
          ]
        })
      } else {
        textStream?.update(delta)
      }

      return textNode
    },
    tools: {
      getCourses: {
        description: 'Get or Query the courses by language',
        parameters: z.object({
          origin_language: z.string().describe('The origin language of the course'),
          target_language: z.string().describe('The target language of the course'),
        }),
        generate: async function* ({ origin_language, target_language }) {

          const courses = await getCoursesByLanguage(origin_language, target_language);

          const toolCallId = nanoid()

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'assistant',
                content: [
                  {
                    type: 'tool-call',
                    toolName: 'getCourses',
                    toolCallId,
                    args: { origin_language, target_language }
                  }
                ]
              },
              {
                id: nanoid(),
                role: 'tool',
                content: [
                  {
                    type: 'tool-result',
                    toolName: 'getCourses',
                    toolCallId,
                    result: courses.map((course) => {
                      const { structure_vocabulary, updatedAt, ...rest } = course;
                      return rest;
                    })
                  }
                ]
              }
            ]
          })

          return (
            courses?.length > 0 ?
              (
                <BotCard>
                  {courses.map((course) => (
                    <CourseInfo key={course.id} course={course} />
                  ))}
                </BotCard>
              ) :
              <BotMessage content="No courses found" />
          )
        }
      },
      getScript: {
        description: 'Get or Query the script by course id and lesson id',
        parameters: z.object({
          course_id: z.string().describe('The course id of the script'),
          lesson_id: z.number().describe('The lesson id of the script'),
        }),
        generate: async function* ({ course_id, lesson_id }) {

          const script = await getScript(course_id, lesson_id);

          const toolCallId = nanoid()

          aiState.done({
            ...aiState.get(),
            messages: [
              ...aiState.get().messages,
              {
                id: nanoid(),
                role: 'assistant',
                content: [
                  {
                    type: 'tool-call',
                    toolName: 'getCourses',
                    toolCallId,
                    args: { course_id, lesson_id }
                  }
                ]
              },
              {
                id: nanoid(),
                role: 'tool',
                content: [
                  {
                    type: 'tool-result',
                    toolName: 'getScript',
                    toolCallId,
                    result: script.text
                  }
                ]
              }
            ]
          })

          return (
            script ?
              (
                <BotCard>
                  {script.text}
                </BotCard>
              ) :
              <BotMessage content="No script found" />
          )
        }
      },
    }
  })

  return {
    id: nanoid(),
    display: result.value
  }
}

export type AIState = {
  chatId: string
  messages: Message[]
}

export type UIState = {
  id: string
  display: React.ReactNode
}[]

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },
  onGetUIState: async () => {
    'use server'

    const session = await auth()

    if (session && session.user) {
      const aiState = getAIState() as Chat

      if (aiState) {
        const uiState = getUIStateFromAIState(aiState)
        return uiState
      }
    } else {
      return
    }
  },
  onSetAIState: async ({ state, done }) => {
    'use server'

    if (!done) return

    const session = await auth()
    if (!session || !session.user) return

    const { chatId, messages } = state

    const createdAt = new Date()
    const email = session.user.email as string
    const path = `/chat/${chatId}`

    const firstMessageContent = messages[0].content as string
    const title = firstMessageContent.substring(0, 100)

    const chat: Chat = {
      id: chatId,
      title,
      email,
      createdAt: createdAt.toISOString(),
      messages,
      path
    }

    await saveChat(chat)
  }
})

export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState.messages
    .filter(message => message.role !== 'system')
    .map((message, index) => ({
      id: `${aiState.chatId}-${index}`,
      display:
      message.role === 'tool' ? (
        message.content.map(tool => {
          return tool.toolName === 'getCourses' ? (
            <BotCard>
              {/* @ts-expect-error */}
              {tool.result.map((course: Course) => (
                <CourseInfo key={course.id} course={course} />
              ))}
            </BotCard>
          ) : tool.toolName === 'getScript' ? (
            <BotCard>
              {/* @ts-expect-error */}
              {tool.result}
            </BotCard>
          ) : null
        })
      ) : message.role === 'user' ? (
        <UserMessage>{message.content as string}</UserMessage>
      ) : message.role === 'assistant' &&
        typeof message.content === 'string' ? (
        <BotMessage content={message.content} />
      ) : null
    }))
}
