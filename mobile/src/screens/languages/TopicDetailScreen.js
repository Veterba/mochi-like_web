import { View, Text, ScrollView } from 'react-native';

function ChildItem({ child, depth = 0 }) {
  const indent = depth * 16;
  return (
    <View>
      <View
        style={{ marginLeft: indent, borderLeftWidth: 2, borderLeftColor: '#1c1e24', paddingLeft: 12, marginBottom: 8 }}
      >
        <Text className="text-text text-sm uppercase tracking-wide">{child.title}</Text>
      </View>
      {child.children?.map((grandchild) => (
        <ChildItem key={grandchild.title} child={grandchild} depth={depth + 1} />
      ))}
    </View>
  );
}

export default function TopicDetailScreen({ route }) {
  const { topic } = route.params;

  return (
    <ScrollView className="flex-1 bg-background" contentContainerStyle={{ padding: 24, paddingTop: 48 }}>
      <Text className="text-gray text-xs uppercase tracking-widest mb-2">grammar · English</Text>
      <Text className="text-text text-3xl font-black uppercase tracking-tight mb-6">
        {topic.title}
      </Text>

      {topic.children ? (
        <View>
          {topic.children.map((child) => (
            <ChildItem key={child.title} child={child} />
          ))}
        </View>
      ) : (
        <Text className="text-gray text-sm">Lesson content coming soon.</Text>
      )}
    </ScrollView>
  );
}
