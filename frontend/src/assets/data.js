// Single source of card/section data used across the homepage.

export const languages = [
  "Norwegian", "English", "German", "Spanish", "Japanese", "Russian",
  "Ukrainian", "French", "Italian", "Arabic", "Chinese", "Portuguese",
]

export const accents = [
  "border-accent-1", "border-accent-2", "border-accent-3",
  "border-accent-4", "border-accent-5", "border-accent-6",
]

export const heroCards = [
  "Learn words using flashcards. Shuffle the word cards and gain a new experience.",
  "Everyone can learn a language in the way that suits them best. Localization for everyone.",
  "Practice your pronunciation with AI. The site also offers plenty of practice exercises for every situation.",
]

export const sections = [
  {
    id: "how-it-works",
    heading: "How does it work",
    paragraphs: [
      "Pick a language, get a ready-made deck, and start learning in minutes.",
      "Review words with flashcards, then practice speaking and listening until they stick.",
    ],
    link: { label: "Let's use it", href: "#auth" },
    cards: [
      { title: "Pick a language", text: "Choose from twelve languages and jump straight into a starter deck." },
      { title: "Study flashcards", text: "Flip, shuffle, and repeat cards until every word feels familiar." },
      { title: "Track progress", text: "See what you have learned and what still needs another round." },
    ],
  },
  {
    id: "method",
    heading: "Method",
    paragraphs: [
      "Spaced repetition brings cards back exactly when you are about to forget them.",
      "Localization lets everyone learn in the way that suits them best, at their own pace.",
    ],
    link: { label: "Let's use it", href: "#auth" },
    cards: [
      { title: "Spaced repetition", text: "Cards resurface right before you forget, so review time is never wasted." },
      { title: "Localization", text: "Interface and explanations adapt to your native language." },
      { title: "Daily goals", text: "Small, steady goals keep the habit going without burnout." },
    ],
  },
  {
    id: "flashcards",
    heading: "Flashcards",
    paragraphs: [
      "Shuffle the deck for a fresh order every session and keep your memory on its toes.",
      "Practice pronunciation with AI and turn passive words into ones you can actually say.",
    ],
    link: { label: "Let's use it", href: "#auth" },
    cards: [
      { title: "Shuffle mode", text: "Randomize the order so you learn the word, not its position." },
      { title: "AI pronunciation", text: "Hear and compare your pronunciation against a native model." },
      { title: "Custom decks", text: "Build your own decks from the words that matter to you." },
    ],
  },
]
