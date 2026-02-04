import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-gradient-to-br from-cyber-dark via-cyber-darker to-black">
      <div className="w-full max-w-sm">
        <Card className="border-neon-lime/20 bg-cyber-dark/80 backdrop-blur-xl shadow-neon-lime">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-neon-lime/10 flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-neon-lime" />
            </div>
            <CardTitle className="text-2xl font-bold text-neon-lime">Check Your Email</CardTitle>
            <CardDescription className="text-cyber-text">We&apos;ve sent you a confirmation link</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-cyber-text text-center">
              Please check your email and click the confirmation link to activate your account. Once confirmed, you can
              sign in and start your wellness journey.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
