import { auth } from '@/auth'
import { ChatHistory } from '@/components/chat/chat-history'
import { SidebarMobile } from '@/components/chat/sidebar-mobile'
import { SidebarToggle } from '@/components/chat/sidebar-toggle'
import SignIn from '@/components/sign-in'
import { IconNextChat, IconSeparator } from '@/components/ui/icons'
import { UserMenu } from '@/components/user-menu'
import { User } from '@/lib/types'
import { Session } from 'next-auth'
import Link from 'next/link'
import React from 'react'

async function UserOrLogin() {
  const session = (await auth()) as Session
  return (
    <>
      {session?.user ? (
        <>
          <SidebarMobile>
            <ChatHistory email={session?.user?.email} />
          </SidebarMobile>
          <SidebarToggle />
        </>
      ) : (
        <Link href="/new" rel="nofollow">
          <IconNextChat className="size-6 mr-2 dark:hidden" inverted />
          <IconNextChat className="hidden size-6 mr-2 dark:block" />
        </Link>
      )}
      <div className="flex items-center">
        <IconSeparator className="size-6 text-muted-foreground/50" />
        {session?.user ? (
          <UserMenu user={session.user as User} />
        ) : (
          <SignIn />
        )}
      </div>
    </>
  )
}

export async function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center w-full h-16 px-4 border-b shrink-0 bg-white ">
      <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
        <UserOrLogin />
      </React.Suspense>

      <IconSeparator />

      <Link
        href="/tasks"
      >
        <span className="hidden md:flex">Tasks</span>
      </Link>

      <IconSeparator />

      <Link
        href="/documents"
      >
        <span className="hidden md:flex">Documents</span>
      </Link>
    </header>
  )
}
