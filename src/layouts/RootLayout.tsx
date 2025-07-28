import type { ReactNode } from "react"

function RootLayout({ children }: {children: ReactNode}) {
  return (
    <div className="min-w-screen bg-background text-foreground antialiased">
      {children}
    </div>
  )
}

export default RootLayout