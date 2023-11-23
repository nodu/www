import 'css/tailwind.css'
import 'pliny/search/algolia.css'

// import { Space_Grotesk, Crimson_Pro, Noto_Serif, Karla, Nunito_Sans, Cormorant, Roboto_Mono, Yrsa, Varta, Overpass } from 'next/font/google'
import { Overpass, Crimson_Pro, Karla } from 'next/font/google'
import { Analytics, AnalyticsConfig } from 'pliny/analytics'
import { SearchProvider, SearchConfig } from 'pliny/search'
import Header from '@/components/Header'
import SectionContainer from '@/components/SectionContainer'
import Footer from '@/components/Footer'
import siteMetadata from '@/data/siteMetadata'
import { ThemeProviders } from './theme-providers'
import { Metadata } from 'next'

// const space_grotesk = Space_Grotesk({
//   subsets: ['latin'],
//   display: 'swap',
//   variable: '--font-space-grotesk',
// })
// const cormorant = Cormorant({
//   subsets: ['latin'],
//   display: 'swap',
//   variable: '--font-cormorant',
// })
// const roboto_mono = Roboto_Mono({
//   subsets: ['latin'],
//   display: 'swap',
//   variable: '--font-roboto-mono',
// })
// const yrsa = Yrsa({
//   subsets: ['latin'],
//   display: 'swap',
//   variable: '--font-yrsa',
// })
// const varta = Varta({
//   subsets: ['latin'],
//   display: 'swap',
//   variable: '--font-varta',
// })
const overpass = Overpass({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-overpass',
})
// const nunito_sans = Nunito_Sans({
//   subsets: ['latin'],
//   display: 'swap',
//   variable: '--font-nunito-sans',
// })
// const noto_serif = Noto_Serif({
//   subsets: ['latin'],
//   display: 'swap',
//   variable: '--font-noto-serif',
// })
const crimson_pro = Crimson_Pro({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-crimson-pro',
})
const karla = Karla({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-karla',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteMetadata.siteUrl),
  title: {
    default: siteMetadata.title,
    template: `%s | ${siteMetadata.title}`,
  },
  description: siteMetadata.description,
  openGraph: {
    title: siteMetadata.title,
    description: siteMetadata.description,
    url: './',
    siteName: siteMetadata.title,
    images: [siteMetadata.socialBanner],
    locale: 'en_US',
    type: 'website',
  },
  alternates: {
    canonical: './',
    types: {
      'application/rss+xml': `${siteMetadata.siteUrl}/feed.xml`,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    title: siteMetadata.title,
    card: 'summary_large_image',
    images: [siteMetadata.socialBanner],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang={siteMetadata.language}
      // className={`${cormorant.variable} ${noto_serif.variable} ${crimson_pro.variable} ${karla.variable} ${nunito_sans.variable} ${space_grotesk.variable} ${yrsa.variable} ${overpass.variable} ${varta.variable} ${roboto_mono.variable} scroll-smooth`}
      className={`${overpass.variable} ${crimson_pro.variable} ${karla.variable} } scroll-smooth`}
      suppressHydrationWarning
    >
      <link rel="apple-touch-icon" sizes="76x76" href="/static/favicons/apple-touch-icon.png" />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/static/favicons/favicon-32x32.png?v=2"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/static/favicons/favicon-16x16.png?v=2"
      />
      <link rel="manifest" href="/static/favicons/site.webmanifest" />
      <link rel="mask-icon" href="/static/favicons/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" media="(prefers-color-scheme: light)" content="#fff" />
      <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
      <link rel="alternate" type="application/rss+xml" href="/feed.xml" />
      <body className="bg-white text-black antialiased dark:bg-gray-950 dark:text-white">
        <ThemeProviders>
          <Analytics analyticsConfig={siteMetadata.analytics as AnalyticsConfig} />
          <SectionContainer>
            <div className="flex h-screen flex-col justify-between font-serif">
              <SearchProvider searchConfig={siteMetadata.search as SearchConfig}>
                <Header />
                <main className="mb-auto">{children}</main>
              </SearchProvider>
              <Footer />
            </div>
          </SectionContainer>
        </ThemeProviders>
      </body>
    </html>
  )
}
