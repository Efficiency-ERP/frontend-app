
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/login" className="flex items-center gap-2 font-medium">
            <img src="/logo.svg" alt="Logo" className="h-6 w-32 dark:hidden" />
            <img src="/logo_dark.svg" alt="Logo" className="h-6 w-32 hidden dark:block" />
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <img
          src="/placeholder.svg"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}

function LoginForm() {
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Since this is fake authentication, just navigate to dashboard
    navigate('/dashboard')
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-2xl font-bold">Login</h1>
        <p className="text-balance text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="flex flex-col gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            <a
              href="#"
              className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input id="password" type="password" required />
        </div>
        <Button type="submit" className="w-full">
          Login
        </Button>
        <Button variant="outline" className="w-full">
          Login with Google
        </Button>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="#" className="underline underline-offset-4">
          Sign up
        </a>
      </div>
    </form>
  )
}
