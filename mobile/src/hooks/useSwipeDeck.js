import { useState, useRef } from 'react';

const THRESHOLD = 120;

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
  }));

  const current = state.queue[0] ?? null;

  const commitKnow = () => {
    setState((s) => {
      const card = s.queue[0];
      const rest = s.queue.slice(1);
      const learned = [...s.learned, card];
      if (rest.length === 0 && s.buffer.length > 0) {
        return { queue: shuffle(s.buffer), buffer: [], learned, flipped: false };
      }
      return { queue: rest, buffer: s.buffer, learned, flipped: false };
    });
  };

  const commitDont = () => {
    setState((s) => {
      const card = s.queue[0];
      const rest = s.queue.slice(1);
      const buffer = [...s.buffer, card];
      if (rest.length === 0 && buffer.length > 0) {
        return { queue: shuffle(buffer), buffer: [], learned: s.learned, flipped: false };
      }
      return { queue: rest, buffer, learned: s.learned, flipped: false };
    });
  };

  const flip = () => setState((s) => ({ ...s, flipped: !s.flipped }));

  return {
    current,
    buffer: state.buffer,
    learned: state.learned,
    flipped: state.flipped,
    flip,
    commitKnow,
    commitDont,
    THRESHOLD,
  };
}
