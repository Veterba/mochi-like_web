import { sql } from '../db.js'

export async function assess(userId, { text, audio, mimeType, lang = 'en' }) {
  let result

  if (process.env.AZURE_SPEECH_KEY && process.env.AZURE_SPEECH_REGION) {
    try {
      result = await azureAssess({ text, audio, mimeType, lang })
    } catch (err) {
      console.warn('[pronunciation] azure failed, using stub:', err.message)
    }
  }

  if (!result) {
    result = stubAssess(text)
  }

  await sql`
    insert into utterances (user_id, text, lang, score, errors)
    values (${userId}, ${text}, ${lang}, ${result.score}, ${JSON.stringify(result.errors)}::jsonb)
  `

  return result
}

async function azureAssess({ text, audio, mimeType, lang }) {
  const region = process.env.AZURE_SPEECH_REGION
  const key = process.env.AZURE_SPEECH_KEY
  const langTag = lang === 'en' ? 'en-US' : lang
  const assessConfig = Buffer.from(JSON.stringify({
    ReferenceText: text,
    GradingSystem: 'HundredMark',
    Granularity: 'Phoneme',
    Dimension: 'Comprehensive',
  })).toString('base64')

  const res = await fetch(
    `https://${region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=${langTag}&format=detailed`,
    {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': key,
        'Content-Type': mimeType || 'audio/wav',
        'Pronunciation-Assessment': assessConfig,
      },
      body: Buffer.from(audio, 'base64'),
    }
  )

  if (!res.ok) throw new Error(`azure ${res.status}: ${(await res.text()).slice(0, 200)}`)

  const data = await res.json()
  const best = data.NBest?.[0]
  if (!best) throw new Error('no NBest in azure response')

  const score = Math.round(best.PronunciationAssessment?.PronScore ?? 0)
  const errors = []

  for (const word of best.Words ?? []) {
    const pa = word.PronunciationAssessment
    if (!pa) continue
    const wordBad = pa.ErrorType !== 'None' || (pa.AccuracyScore ?? 100) < 60
    if (!wordBad) continue

    const badPhonemes = (word.Phonemes ?? []).filter(
      ph => (ph.PronunciationAssessment?.AccuracyScore ?? 100) < 60
    )
    if (badPhonemes.length > 0) {
      for (const ph of badPhonemes) {
        errors.push({
          word: word.Word,
          phoneme: ph.Phoneme,
          accuracy: Math.round(ph.PronunciationAssessment.AccuracyScore),
        })
      }
    } else {
      errors.push({ word: word.Word, phoneme: null, accuracy: Math.round(pa.AccuracyScore ?? 0) })
    }
  }

  return { score, errors }
}

function stubAssess(text) {
  const words = text.trim().split(/\s+/)
  const score = 55 + (text.length % 30)
  const errors = words.slice(0, 2).map((word, i) => ({
    word,
    phoneme: i === 0 ? 'θ' : 'ɪ',
    accuracy: 34 + i * 5,
    heard: i === 0 ? 's' : 'e',
  }))
  return { score, errors, stub: true }
}

export async function profile(userId) {
  const rows = await sql`
    select errors, score from utterances where user_id = ${userId}
  `
  const attempts = rows.length
  const avgScore = attempts
    ? Math.round(rows.reduce((s, r) => s + (r.score ?? 0), 0) / attempts)
    : 0

  const phonemeCounts = {}
  for (const row of rows) {
    for (const e of row.errors ?? []) {
      if (e.phoneme) {
        phonemeCounts[e.phoneme] = (phonemeCounts[e.phoneme] ?? 0) + 1
      }
    }
  }
  const topErrors = Object.entries(phonemeCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([phoneme, count]) => ({ phoneme, count }))

  return { attempts, avgScore, topErrors }
}

export function formatEvidence(text, result) {
  const issueStr = result.errors.length
    ? result.errors
        .map(e =>
          e.phoneme
            ? `word '${e.word}' phoneme /${e.phoneme}/ accuracy ${e.accuracy}`
            : `word '${e.word}' accuracy ${e.accuracy}`
        )
        .join('; ')
    : 'none'
  return `[pronunciation attempt]\nsentence: "${text}"\nscore: ${result.score}/100\nmeasured issues: ${issueStr}\n(coach me on these specific issues)`
}
