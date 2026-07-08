import { useState } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'

function Field({ label, type = 'text', value, onChange, ...props }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-gray">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full border border-borders bg-background px-4 py-2 text-text outline-none focus:ring-1 focus:ring-text"
        {...props}
      />
    </label>
  )
}

function Auth({ isOpen, onClose }) {
  const { signup, login, verify, resend } = useAuth()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ identifier: '', email: '', login: '', password: '', verify: '' })
  const [verifyEmail, setVerifyEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const [resentMsg, setResentMsg] = useState(false)

  const isSignup = mode === 'signup'
  const isVerify = mode === 'verify'
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const switchToVerify = (email) => {
    setVerifyEmail(email)
    setCode('')
    setError('')
    setMode('verify')
  }

  const handleResend = async () => {
    try {
      await resend(verifyEmail)
      setResentMsg(true)
      setTimeout(() => setResentMsg(false), 3000)
    } catch {
      // silent
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (isVerify) {
      setPending(true)
      try {
        await verify(verifyEmail, code)
        onClose()
      } catch (err) {
        setError(err.message)
      } finally {
        setPending(false)
      }
      return
    }

    if (isSignup && form.password !== form.verify) {
      setError('Passwords do not match')
      return
    }
    setPending(true)
    try {
      if (isSignup) {
        const res = await signup({ email: form.email, login: form.login, password: form.password, verify: form.verify })
        switchToVerify(res.email)
      } else {
        await login({ identifier: form.identifier, password: form.password })
        onClose()
      }
    } catch (err) {
      if (err.message === 'Email not verified') {
        const id = form.identifier
        if (id.includes('@')) {
          await resend(id).catch(() => {})
          switchToVerify(id)
        } else {
          setError('Email not verified — sign up email required')
        }
      } else {
        setError(err.message)
      }
    } finally {
      setPending(false)
    }
  }

  if (!isOpen) return null

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md border border-borders bg-background p-12"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-text hover:text-gray"
        >
          x
        </button>

        <div className="flex flex-col gap-6">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-text">
              {isVerify ? 'Verify your email' : isSignup ? 'Create account' : 'Welcome back'}
            </h2>
            <p className="mt-1 text-sm text-gray">
              {isVerify
                ? `We sent a 6-digit code to ${verifyEmail}`
                : isSignup
                ? 'Sign up to get started'
                : 'Log in to continue'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {isVerify ? (
              <Field
                label="Verification code"
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            ) : isSignup ? (
              <>
                <Field label="Email" type="email" value={form.email} onChange={set('email')} />
                <Field label="Login" value={form.login} onChange={set('login')} />
                <div className="flex flex-col gap-1">
                  <Field label="Password" type="password" value={form.password} onChange={set('password')} />
                  <p className="text-xs text-gray">At least 8 characters, one uppercase letter, one lowercase letter and one digit</p>
                </div>
                <Field label="Verify password" type="password" value={form.verify} onChange={set('verify')} />
              </>
            ) : (
              <>
                <Field label="Email or login" value={form.identifier} onChange={set('identifier')} />
                <Field label="Password" type="password" value={form.password} onChange={set('password')} />
              </>
            )}

            {error && <p className="text-sm text-accent-2">{error}</p>}

            <button
              type="submit"
              disabled={pending}
              className="mt-2 border border-borders bg-text py-3 font-medium text-background transition hover:bg-background hover:text-text disabled:opacity-50"
            >
              {isVerify ? 'Confirm' : isSignup ? 'Sign up' : 'Log in'}
            </button>

            {isVerify && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-sm text-gray hover:text-text"
                >
                  Resend code
                </button>
                {resentMsg && <span className="ml-2 text-sm text-gray">Sent!</span>}
              </div>
            )}
          </form>

          {!isVerify && (
            <p className="text-center text-sm text-gray">
              {isSignup ? 'Already have an account?' : 'No account yet?'}{' '}
              <button
                type="button"
                onClick={() => setMode(isSignup ? 'login' : 'signup')}
                className="font-semibold text-text underline-offset-2 hover:underline"
              >
                {isSignup ? 'Log in' : 'Sign up'}
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Auth
