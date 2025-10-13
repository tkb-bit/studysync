import './globals.css'
import { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import Script from 'next/script'
import AuthProvider from '../components/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'StudySync AI - AI-Powered Academic Assistant',
  description: 'Professional academic management platform for teachers to upload and manage educational content',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <Script
          id="hydration-fix"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              // Prevent hydration mismatches from browser extensions
              window.addEventListener('DOMContentLoaded', function() {
                // Remove any attributes added by browser extensions that might cause hydration issues
                const html = document.documentElement;
                const body = document.body;
                
                // Store original attributes
                if (!window.__ORIGINAL_HTML_ATTRIBUTES) {
                  window.__ORIGINAL_HTML_ATTRIBUTES = {};
                  for (let attr of html.attributes) {
                    window.__ORIGINAL_HTML_ATTRIBUTES[attr.name] = attr.value;
                  }
                }
                
                if (!window.__ORIGINAL_BODY_ATTRIBUTES) {
                  window.__ORIGINAL_BODY_ATTRIBUTES = {};
                  for (let attr of body.attributes) {
                    window.__ORIGINAL_BODY_ATTRIBUTES[attr.name] = attr.value;
                  }
                }
              });
            `,
          }}
        />
      </head>
       <body className={inter.className} suppressHydrationWarning={true}>
        {/* 2. Wrap the children with AuthProvider */}
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
