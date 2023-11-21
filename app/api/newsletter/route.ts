import { NewsletterAPI } from 'pliny/newsletter'
import siteMetadata from '@/data/siteMetadata'

const handler = NewsletterAPI({
  // @ts-ignore
  provider: null,
  // provider: siteMetadata.newsletter.provider,
})

export { handler as GET, handler as POST }
