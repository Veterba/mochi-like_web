import { useRef, useState } from 'react'

const MIME_TYPES = ['audio/ogg;codecs=opus', 'audio/webm;codecs=opus', 'audio/mp4']

export default function useRecorder() {
  const [recording, setRecording] = useState(false)
  const mediaRef = useRef(null)
  const chunksRef = useRef([])

  async function start() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    chunksRef.current = []
    const mimeType = MIME_TYPES.find(t => MediaRecorder.isTypeSupported(t)) || ''
    const mr = new MediaRecorder(stream, mimeType ? { mimeType } : {})
    mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
    mr.start()
    mediaRef.current = mr
    setRecording(true)
  }

  function stop() {
    return new Promise((resolve, reject) => {
      const mr = mediaRef.current
      if (!mr) return reject(new Error('not recording'))
      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mr.mimeType })
        mr.stream.getTracks().forEach(t => t.stop())
        mediaRef.current = null
        const reader = new FileReader()
        reader.onload = () => {
          const dataUrl = reader.result
          const base64 = dataUrl.slice(dataUrl.indexOf(',') + 1)
          resolve({ base64, mimeType: blob.type })
        }
        reader.onerror = reject
        reader.readAsDataURL(blob)
      }
      mr.stop()
      setRecording(false)
    })
  }

  return { recording, start, stop }
}
