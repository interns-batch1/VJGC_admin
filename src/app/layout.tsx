import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "next-themes"

export const metadata = {
  title: {
    default: "VJS Admin",
    template: "%s | VJS Admin",
  },
  description: "VJS Admin Dashboard for Managing Website Content.",
  icons: {
    icon: "/images/vjs-logo.png",
  },
}

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}