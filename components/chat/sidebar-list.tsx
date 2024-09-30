import { clearChats, getChats } from '@/app/actions'
import { ClearHistory } from '@/components/chat/clear-history'
import { SidebarItems } from '@/components/chat/sidebar-items'
import { redirect } from 'next/navigation'
import { cache } from 'react'

interface SidebarListProps {
  email?: string
  children?: React.ReactNode
}

const loadChats = cache(async (email?: string) => {
  return await getChats(email)
})

export async function SidebarList({ email }: SidebarListProps) {
  const chats = await loadChats(email)

  if (!chats || 'error' in chats) {
    console.error('Chat error SidebarList', chats)
  } else {
    return (
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex-1 overflow-auto">
          {chats?.length ? (
            <div className="space-y-2 px-2">
              <SidebarItems chats={chats} />
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-sm text-muted-foreground">No chat history</p>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between p-4">
          <ClearHistory clearChats={clearChats} isEnabled={chats?.length > 0} />
        </div>
      </div>
    )
  }
}
