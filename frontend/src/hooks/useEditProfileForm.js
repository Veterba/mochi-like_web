import { useState } from "react"

// Draft state for the edit-profile form. Reads a picked image file into a
// data URL so the preview and saved value are the same string.
export default function useEditProfileForm(initial) {
  const [nickname, setNickname] = useState(initial.nickname)
  const [avatar, setAvatar] = useState(initial.avatar)

  const pickPhoto = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatar(reader.result)
    reader.readAsDataURL(file)
  }

  return { nickname, setNickname, avatar, pickPhoto }
}
