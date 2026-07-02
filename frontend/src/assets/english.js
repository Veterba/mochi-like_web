// Topic tree for the English language page. Top-level entries render as
// flags; nested entries render as sub-lists when a flag is opened.
export const englishTopics = [
  { title: "Alphabet, Pronunciation, Basic Words" },
  { title: "Articles and Nouns", children: [{ title: "Articles" }] },
  { title: "Pronouns" },
  {
    title: "Present Tense (Present)",
    children: [
      { title: "Present Simple" },
      { title: "Present Continuous" },
      { title: "Present Perfect" },
      { title: "Present Perfect Continuous" },
    ],
  },
  {
    title: "Past Tense (Past)",
    children: [
      { title: "Past Simple" },
      { title: "Past Continuous" },
      { title: "Past Perfect" },
      { title: "Past Perfect Continuous" },
    ],
  },
  {
    title: "Future Tense (Future)",
    children: [
      { title: "Future Simple (will)" },
      { title: "Future Continuous" },
      { title: "Future Perfect" },
      { title: "Future Perfect Continuous" },
    ],
  },
  { title: "Describing a Movie" },
  { title: "Negative Questions" },
  {
    title: "Modal Verbs",
    children: [
      { title: "Structure", children: [{ title: "Positive" }, { title: "Negative" }] },
      { title: "Questioning" },
      { title: "Can and Could" },
      { title: "May and Might", children: [{ title: "When we use" }] },
      { title: "Must and Have to" },
      { title: "Should" },
    ],
  },
  { title: "Adjectives and Adverbs" },
  {
    title: "Prepositions",
    children: [
      { title: "Of time: at, on, in" },
      { title: "Of place: at, on, in, next to, between" },
      { title: "Of movement: to, into, onto, from" },
    ],
  },
  {
    title: "Conjunctions and Complex Sentences",
    children: [{ title: "Conjunctions" }, { title: "Complex Sentences (word order)" }],
  },
  { title: "Passive Voice" },
  {
    title: "Conditionals",
    children: [
      { title: "Zero Conditional" },
      { title: "First Conditional" },
      { title: "Second Conditional" },
      { title: "Third Conditional" },
    ],
  },
  {
    title: "Phrasal Verbs",
    children: [
      { title: "Structure" },
      { title: "4 Grammatical Types" },
      { title: "Common Phrasal Verbs by Topic" },
      { title: "Tips" },
    ],
  },
  { title: 'The "used to / had to" Construction' },
]
