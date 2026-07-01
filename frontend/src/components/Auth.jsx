import { useState } from "react"

function Field({ label, type = "text", value, onChange }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-gray">{label}</span>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="w-full border border-borders bg-background px-4 py-2 text-text outline-none focus:ring-1 focus:ring-text"
      />
    </label>
  )
}

function Auth({ isOpen, onClose }) {
  const [mode, setMode] = useState("login") // 'login' | 'signup'
  const [form, setForm] = useState({
    identifier: "",
    email: "",
    login: "",
    password: "",
    verify: "",
  })

  const isSignup = mode === "signup"
  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: wire to backend
    console.log(mode, form)
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
              {isSignup ? "Create account" : "Welcome back"}
            </h2>
            <p className="mt-1 text-sm text-gray">
              {isSignup ? "Sign up to get started" : "Log in to continue"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {isSignup ? (
              <>
                <Field label="Email" type="email" value={form.email} onChange={set("email")} />
                <Field label="Login" value={form.login} onChange={set("login")} />
                <Field label="Password" type="password" value={form.password} onChange={set("password")} />
                <Field label="Verify password" type="password" value={form.verify} onChange={set("verify")} />
              </>
            ) : (
              <>
                <Field label="Email or login" value={form.identifier} onChange={set("identifier")} />
                <Field label="Password" type="password" value={form.password} onChange={set("password")} />
              </>
            )}

            <button
              type="submit"
              className="mt-2 border border-borders bg-text py-3 font-medium text-background transition hover:bg-background hover:text-text"
            >
              {isSignup ? "Sign up" : "Log in"}
            </button>
          </form>

          <p className="text-center text-sm text-gray">
            {isSignup ? "Already have an account?" : "No account yet?"}{" "}
            <button
              type="button"
              onClick={() => setMode(isSignup ? "login" : "signup")}
              className="font-semibold text-text underline-offset-2 hover:underline"
            >
              {isSignup ? "Log in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Auth
