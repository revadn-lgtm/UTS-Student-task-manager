
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function EmptyState() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Ionicons
          name="clipboard-outline"
          size={38}
          color="#A78BFA"
        />
      </View>

      <Text style={styles.title}>No tasks yet!</Text>

      <Text style={styles.description}>
        Your tasks will appear here. Start adding your first task
        and stay organized.
      </Text>

      <TouchableOpacity
        style={styles.addButton}
        activeOpacity={0.8}
        onPress={() => router.push('/add-task')}
      >
        <Ionicons name="add" size={20} color="#FFFFFF" />
        <Text style={styles.addButtonText}>
          Create Your First Task
        </Text>
      </TouchableOpacity>

      <View style={styles.encouragement}>
        <Ionicons
          name="sparkles-outline"
          size={15}
          color="#A78BFA"
        />
        <Text style={styles.encouragementText}>
          Every great achievement starts with one task.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F0ECF7',
  },
  iconCircle: {
    width: 75,
    height: 75,
    borderRadius: 25,
    backgroundColor: '#F3EEFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#302B3D',
    marginBottom: 8,
  },
  description: {
    fontSize: 12,
    color: '#9991AC',
    textAlign: 'center',
    lineHeight: 20,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
    gap: 7,
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  encouragement: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 18,
    gap: 6,
  },
  encouragementText: {
    fontSize: 10,
    color: '#A39BAD',
    fontStyle: 'italic',
  },
});
