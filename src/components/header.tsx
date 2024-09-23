import { buttonVariants } from '@/components/ui/button'
import { IconSeparator, IconVercel } from '@/components/ui/icons'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export async function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between w-full h-16 px-4 border-b shrink-0 bg-white ">  
      <Link href="/genui" rel="nofollow" className="mr-2 font-bold">
        Next.js AI Lite
      </Link>
      <IconSeparator />
      <Link
        href="/"
        className={cn(buttonVariants({ variant: 'link' }), "mr-auto font-normal")}
      >
        <span className="hidden md:flex">GenUI</span>
      </Link>
      <Link
        href="https://vercel.com/new"
        target="_blank"
        className={cn(buttonVariants())}
      >
        <IconVercel className="mr-2" />
        <span className="hidden sm:block">Deploy to Vercel</span>
        <span className="sm:hidden">Deploy</span>
      </Link>
    </header>
  )
}
