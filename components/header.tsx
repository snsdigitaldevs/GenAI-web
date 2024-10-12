import { auth } from '@/auth'
import { ChatHistory } from '@/components/chat/chat-history'
import { SidebarMobile } from '@/components/chat/sidebar-mobile'
import { SidebarToggle } from '@/components/chat/sidebar-toggle'
import SignIn from '@/components/sign-in'
import { IconNextChat } from '@/components/ui/icons'
import { DividerVerticalIcon } from '@radix-ui/react-icons'
import { UserMenu } from '@/components/user-menu'
import { User } from '@/lib/types'
import { Session } from 'next-auth'
import Link from 'next/link'
import React from 'react'

async function UserOrLogin() {
  const session = (await auth()) as Session;
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
    </>
  )
}

export async function Header() {
  const session = await auth();
  return (
    <header className="sticky top-0 z-50 flex justify-between w-full h-16 px-4 border-b shrink-0 bg-white ">
      <section className='flex items-center'>

        <Link href="/">
          <span className="hidden md:flex">Home</span>
        </Link>

        <DividerVerticalIcon />

        <Link href="/courses">
          <span className="hidden md:flex">Courses</span>
        </Link>
      </section>

      <div className="flex items-center">
        {session?.user ? (
          <UserMenu user={session.user as User} />
        ) : (
          <SignIn />
        )}
      </div>
    </header>
  )
}
