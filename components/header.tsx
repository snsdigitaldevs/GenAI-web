import { IconSeparator } from '@/components/ui/icons'
import Link from 'next/link'

export async function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center w-full h-16 px-4 border-b shrink-0 bg-white ">  
      <Link href="/" rel="nofollow" className="mr-2 font-bold">
        AI POC
      </Link>

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
