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

const THRESHOLD = 120;
const SCREEN_W = Dimensions.get('window').width;

const BORDER_NEUTRAL = '#1c1e24';
const BORDER_KNOW = '#4F6815';
const BORDER_DONT = '#A31E21';

export default function SwipeCard({ card, flipped, flip, commitKnow, commitDont, buffer, learned }) {
  const translateX = useSharedValue(0);

  // Reset position when card changes
  useEffect(() => {
    translateX.value = 0;
  }, [card?.id]);

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
    color: translateX.value < -40 ? BORDER_DONT : '#989c9a',
  }));

  const knowLabelStyle = useAnimatedStyle(() => ({
    color: translateX.value > 40 ? BORDER_KNOW : '#989c9a',
  }));

  const pan = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      if (e.translationX > THRESHOLD) {
        translateX.value = withTiming(SCREEN_W + 100, { duration: 280 }, (finished) => {
          if (finished) runOnJS(commitKnow)();
        });
      } else if (e.translationX < -THRESHOLD) {
        translateX.value = withTiming(-(SCREEN_W + 100), { duration: 280 }, (finished) => {
          if (finished) runOnJS(commitDont)();
        });
      } else {
        translateX.value = withSpring(0);
      }
    });

  const tap = Gesture.Tap().onEnd(() => {
    runOnJS(flip)();
  });

  const gesture = Gesture.Exclusive(pan, tap);

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

      {/* Swipeable card */}
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[
            {
              width: '100%',
              aspectRatio: 3 / 2,
              backgroundColor: '#F9F7F5',
              borderWidth: 2,
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
            },
            cardStyle,
          ]}
        >
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1B1717', textAlign: 'center' }}>
            {flipped ? (card?.back || '—') : (card?.front || '—')}
          </Text>
          <Text style={{ fontSize: 10, color: '#989c9a', marginTop: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
            {flipped ? 'back · tap to flip' : 'tap to flip'}
          </Text>
        </Animated.View>
      </GestureDetector>

      {/* Buffer and learned piles */}
      <View style={{ flexDirection: 'row', marginTop: 24, width: '100%', gap: 12 }}>
        {/* REST / buffer */}
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#989c9a', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>
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
          <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#989c9a', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 6 }}>
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
