import { useEffect } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  runOnJS,
  interpolateColor,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

const THRESHOLD = 120;
const SCREEN_W = Dimensions.get('window').width;

const BORDER_KNOW = '#4F6815';
const BORDER_DONT = '#A31E21';

// Render with key={seq} from useSwipeDeck: each committed swipe then mounts a
// fresh instance whose shared values start at 0, so the incoming card can never
// inherit the previous card's off-screen transform — even when a reshuffle
// serves the same card id again.
export default function SwipeCard({ card, next, flipped, flip, commit, buffer, learned, theme }) {
  const BORDER_NEUTRAL = theme.border;

  const translateX = useSharedValue(0);
  const animating = useSharedValue(false);

  useEffect(() => {
    translateX.value = 0;
    animating.value = false;
  }, [card?.id]);

  const commitWithHaptic = (known) => {
    Haptics.notificationAsync(
      known ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning
    ).catch(() => {});
    commit(known);
  };

  const flipWithHaptic = () => {
    Haptics.selectionAsync().catch(() => {});
    flip();
  };

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${translateX.value * 0.04}deg` },
    ],
    borderColor: interpolateColor(
      translateX.value,
      [-40, 0, 40],
      [BORDER_DONT, BORDER_NEUTRAL, BORDER_KNOW]
    ),
  }));

  const dontLabelStyle = useAnimatedStyle(() => ({
    color: translateX.value < -40 ? BORDER_DONT : theme.subtext,
  }));

  const knowLabelStyle = useAnimatedStyle(() => ({
    color: translateX.value > 40 ? BORDER_KNOW : theme.subtext,
  }));

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      if (animating.value) return;
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      if (animating.value) return;
      if (e.translationX > THRESHOLD) {
        animating.value = true;
        translateX.value = withTiming(SCREEN_W + 100, { duration: 280 }, (finished) => {
          if (finished) runOnJS(commitWithHaptic)(true);
        });
      } else if (e.translationX < -THRESHOLD) {
        animating.value = true;
        translateX.value = withTiming(-(SCREEN_W + 100), { duration: 280 }, (finished) => {
          if (finished) runOnJS(commitWithHaptic)(false);
        });
      } else {
        translateX.value = withSpring(0);
      }
    });

  const tap = Gesture.Tap().onEnd(() => {
    if (animating.value) return;
    runOnJS(flipWithHaptic)();
  });

  const gesture = Gesture.Exclusive(pan, tap);

  const cardFace = {
    backgroundColor: theme.surface,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 }}>
      {/* Intent labels */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 12, paddingHorizontal: 4 }}>
        <Animated.Text
          style={[{ fontSize: 10, fontWeight: 'bold', letterSpacing: 2, textTransform: 'uppercase' }, dontLabelStyle]}
        >
          ← DON'T KNOW
        </Animated.Text>
        <Animated.Text
          style={[{ fontSize: 10, fontWeight: 'bold', letterSpacing: 2, textTransform: 'uppercase' }, knowLabelStyle]}
        >
          KNOW →
        </Animated.Text>
      </View>

      {/* Card stack */}
      <View style={{ width: '100%', aspectRatio: 3 / 2 }}>
        <View
          style={[
            cardFace,
            { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderColor: theme.faint },
          ]}
        >
          {next ? (
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.subtext, textAlign: 'center' }}>
              {next.front || '—'}
            </Text>
          ) : null}
        </View>

        <GestureDetector gesture={gesture}>
          <Animated.View
            style={[
              cardFace,
              { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
              cardStyle,
            ]}
          >
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.text, textAlign: 'center' }}>
              {flipped ? (card?.back || '—') : (card?.front || '—')}
            </Text>
            <Text style={{ fontSize: 10, color: theme.subtext, marginTop: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
              {flipped ? 'back · tap to flip' : 'tap to flip'}
            </Text>
          </Animated.View>
        </GestureDetector>
      </View>

      {/* Buffer and learned piles */}
      <View style={{ flexDirection: 'row', marginTop: 24, width: '100%', gap: 12 }}>
        {/* REST / buffer */}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 10, fontWeight: 'bold', color: theme.subtext, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>
            REST · {buffer.length}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
              {buffer.map((c) => (
                <View key={c.id} style={{ borderWidth: 1, borderColor: BORDER_DONT, paddingHorizontal: 6, paddingVertical: 2 }}>
                  <Text style={{ fontSize: 10, color: BORDER_DONT }} numberOfLines={1}>
                    {c.front}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* LEARNED pile */}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 10, fontWeight: 'bold', color: theme.subtext, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>
            LEARNED · {learned.length}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4 }}>
              {learned.map((c) => (
                <View key={c.id} style={{ borderWidth: 1, borderColor: BORDER_KNOW, paddingHorizontal: 6, paddingVertical: 2 }}>
                  <Text style={{ fontSize: 10, color: BORDER_KNOW }} numberOfLines={1}>
                    {c.front}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}
