import ContactUs from '@/components/ContactUs'
import { genPageMetadata } from 'app/seo'

export const metadata = genPageMetadata({ title: 'Contact' })

export default function Page() {
  return (
    <>
      <ContactUs />
    </>
  )
}
