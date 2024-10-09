import { notFound } from 'next/navigation'

import { auth } from '@/auth'
import { getChat } from '@/app/actions'
import { Chat } from '@/components/chat/chat'
import { AI } from '@/lib/chat/actions'
import { Message, Session } from '@/lib/types'

export interface ChatPageProps {
  params: {
    id: string
  }
}

export default async function ChatPage({ params }: ChatPageProps) {
  const session = await auth() as Session

  const email = session?.user?.email as string
  const chat = await getChat(params.id, email)

  if (!chat || 'error' in chat) {
    console.error('Chat error ChatPage', chat)
    // redirect('/')
  } else {
    if (chat?.email !== session?.user?.email) {
      notFound()
    }

    return (
      <AI initialAIState={{ chatId: chat.id, messages: JSON.parse(chat.messages) as Message[] }}>
        <Chat
          id={chat.id}
          session={session}
          initialMessages={JSON.parse(chat.messages) as Message[]}
        />
      </AI>
    )
  }
}
