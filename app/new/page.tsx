import { redirect } from 'next/navigation'

export default async function NewPage() {
  console.log('New page')
  redirect('/')
}
