const MAIL_FROM = process.env.MAIL_FROM || 'onboarding@resend.dev'

export async function sendVerifyCode(email, code) {
  // No key configured (e.g. local dev): log the code instead of emailing.
  if (!process.env.RESEND_API_KEY) {
    console.log(`[mail] verification code for ${email}: ${code}`)
    return
  }

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: MAIL_FROM,
      to: email,
      subject: 'Your verification code',
      text: `Your verification code is: ${code}`
    })
  })

  // Surface rejections (bad key, unverified domain, sandbox recipient block)
  // instead of swallowing them — a silent 403 is what made codes "vanish".
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    console.error(`[mail] Resend rejected send to ${email}: ${res.status} ${detail}`)
    throw new Error('Failed to send verification email')
  }
}
