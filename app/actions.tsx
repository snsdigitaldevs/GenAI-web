'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { auth } from '@/auth'
import { type Chat } from '@/lib/types'
import { dataClient as client } from "@/lib/server"

export async function getChats(email?: string | null) {
  const session = await auth()

  if (!email) {
    return []
  }

  if (email !== session?.user?.email) {
    return {
      error: 'Unauthorized'
    }
  }

  try {
    const chats = await client.models.chats.list({
      filter: {
        email: { eq: email },
      },
    })

    return chats.data.map((chat) => ({
      ...chat,
      messages: JSON.parse(chat.messages),
    })) as Chat[]
  } catch (error) {
    return []
  }
}

export async function getChat(id: string, email: string) {
  const session = await auth()

  console.log('getChat', id, email)

  if (email !== session?.user?.email) {
    return {
      error: 'Unauthorized'
    }
  }

  const chats = await client.models.chats.list({
    filter: {
      chatId: { eq: id },
    }
  })

  const chat = chats.data[0]

  console.log('getChat funcition', chat)

  if (!chat || (email && chat?.email !== email)) {
    return null
  }

  return chat
}

export async function removeChat({ id, path }: { id: string; path: string }) {
  const session = await auth()

  if (!session) {
    return {
      error: 'Unauthorized'
    }
  }

  const chat = await client.models.chats.get({
    id,
  })

  if (chat.data?.email !== session?.user?.email) {
    return {
      error: 'Unauthorized'
    }
  }

  await client.models.chats.delete({
    id,
  })

  revalidatePath('/')
  return revalidatePath(path)
}

export async function clearChats() {
  const session = await auth()

  if (!session?.user?.email) {
    return {
      error: 'Unauthorized'
    }
  }

  const chats = await client.models.chats.list({
    filter: {
      email: { eq: session.user.email },
    }
  })

  chats.data.forEach(async (chat) => {
    await client.models.chats.delete({
      id: chat.id,
    })
  })

  revalidatePath('/')
  return redirect('/')
}

export async function saveChat(chat: Chat) {
  const session = await auth()

  if (session && session.user) {
    console.log('saveChat', chat)
    const result = await client.models.chats.create({
      chatId: chat.id,
      email: session.user.email,
      messages: JSON.stringify(chat.messages),
      title: chat.title,
      path: chat.path,
    })
    console.log('saveChat result', result)
  } else {
    return
  }
}

export async function refreshHistory(path: string) {
  redirect(path)
}
