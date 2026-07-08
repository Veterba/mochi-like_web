export async function sendVerifyCode(email, code) {
  if (process.env.RESEND_API_KEY) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: 'onboarding@resend.dev',
          to: email,
          subject: 'Your verification code',
          text: `Your verification code is: ${code}`
        })
      })
    } catch (err) {
      console.error('[mail] failed to send email:', err)
    }
  } else {
    console.log(`[mail] verification code for ${email}: ${code}`)
  }
}
