import { Button } from '@/components/ui/button.tsx'
import { useToast } from '@/hooks/use-toast.ts'
import { checkOTP, sendOTP } from '@/lib/Auth.ts'
import { UserContext } from '@/lib/context/UserContext.ts'
import { use, useState } from 'react'
import { z } from 'zod'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from './ui/input-otp.tsx'
import { Input } from './ui/input.tsx'

const EmailSchema = z.string().nonempty('Email is required').email('Email must be valid').max(255, 'Email must be less than 255 characters')

export const Login = () => {
  const { setUser, setIsLoginDialogOpen } = use(UserContext)
  const { toast } = useToast()

  const [emailInput, setEmailInput] = useState('')
  const [userId, setUserId] = useState('')

  const otpEntered = async (otp: string) => {
    try {
      const user = await checkOTP(userId, otp)
      setUser(user)
      setIsLoginDialogOpen(false)
    } catch {
      toast({ title: 'Invalid code', variant: 'destructive' })
    }
  }

  const submitEmail = async () => {
    const result = EmailSchema.safeParse(emailInput)
    if (!result.success) {
      toast({ title: 'Please enter a valid email address', variant: 'destructive' })
      return
    }

    const userId = await sendOTP(emailInput)
    setUserId(userId)
  }

  if (userId) {
    return (
      <>
        <p className="pt-4">Thank you. Fill in the 6-digit code from the email we've sent.</p>
        <div>
          <InputOTP maxLength={6} autoFocus onComplete={otpEntered}>
            <InputOTPGroup className="border-2 border-slate-600 shadow-none">
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup className="border-2 border-slate-600 shadow-none">
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
      </>
    )
  }

  return (
    <div className="pt-4">
      <p>
        Fill in your email address to get a magic link to login. If you don't have an account yet, we will automatically create one for you. We won't use your
        email address for anything else.
      </p>

      <div className="flex justify-center gap-2 pt-4 align-center">
        <Input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmailInput(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key === 'Enter') {
              await submitEmail()
            }
          }}
        />

        <Button onClick={submitEmail}>login / signup</Button>
      </div>
    </div>
  )
}
