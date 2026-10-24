import type { Metadata } from 'next'
import { PlainView } from '@/components/showroom/PlainView'

export const metadata: Metadata = {
  title: 'Shreyansh Sancheti, AI Infrastructure Engineer (plain view)',
  alternates: { canonical: '/plain' },
}

export default function Plain() {
  return <PlainView />
}
