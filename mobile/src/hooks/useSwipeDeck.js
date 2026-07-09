import { useState } from 'react';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function useSwipeDeck(cards) {
  const [state, setState] = useState(() => ({
    queue: shuffle(cards),
    buffer: [],
    learned: [],
    flipped: false,
    seq: 0,
  }));

  // known=true → learned pile; known=false → buffer, re-queued for another pass.
  const commit = (known) => {
    setState((s) => {
      const card = s.queue[0];
      if (!card) return s;
      const rest = s.queue.slice(1);
      const learned = known ? [...s.learned, card] : s.learned;
      const buffer = known ? s.buffer : [...s.buffer, card];
      const base = { learned, flipped: false, seq: s.seq + 1 };
      if (rest.length === 0 && buffer.length > 0) {
        return { ...base, queue: shuffle(buffer), buffer: [] };
      }
      return { ...base, queue: rest, buffer };
    });
  };

  const flip = () => setState((s) => ({ ...s, flipped: !s.flipped }));

  return {
    current: state.queue[0] ?? null,
    // Card known to come up next; null when the next card is decided by a
    // reshuffle (or the deck is about to end).
    next: state.queue[1] ?? null,
    buffer: state.buffer,
    learned: state.learned,
    flipped: state.flipped,
    seq: state.seq,
    flip,
    commit,
  };
}
