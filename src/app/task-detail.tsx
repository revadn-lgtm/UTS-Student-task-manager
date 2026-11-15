
import { useTasks } from '@/hooks/TaskContext';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function TaskDetailScreen() {
  const router = useRouter();
  const { tasks, deleteTask } = useTasks();

  const { id, title, category, dueDate, completed } =
    useLocalSearchParams<{
      id: string;
      title: string;
      category: string;
      dueDate: string;
      completed: string;
    }>();

  const currentTask = tasks.find((task) => task.id === id);

  const currentTitle = currentTask?.title ?? title;
  const currentCategory = currentTask?.category ?? category;
  const currentDueDate = currentTask?.dueDate ?? dueDate;
  const currentCompleted =
    currentTask?.completed ?? completed === 'true';

  const handleEdit = () => {
    router.push({
      pathname: '/edit-task',
      params: {
        id: id,
      },
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteTask(id);
            router.back();
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={25} color="#302B3D" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Task Details</Text>
        <View style={{ width: 25 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons
            name="clipboard-outline"
            size={35}
            color="#8B5CF6"
          />
        </View>

        <Text style={styles.heading}>Task Information</Text>

        <View style={styles.detailCard}>
          <Text style={styles.label}>Task Title</Text>
          <Text style={styles.value}>
            {currentTitle || 'No title'}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.label}>Category</Text>
          <Text style={styles.value}>
            {currentCategory || 'No category'}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.label}>Due Date</Text>
          <Text style={styles.value}>
            {currentDueDate || 'No due date'}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.label}>Status</Text>
          <Text style={styles.value}>
            {currentCompleted ? 'Completed' : 'Pending'}
          </Text>
        </View>

        <Text style={styles.note}>
          Stay focused and complete your tasks on time!
        </Text>

        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEdit}
        >
          <Ionicons name="create-outline" size={20} color="#FFFFFF" />
          <Text style={styles.editText}>Edit Task</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
        >
          <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
          <Text style={styles.deleteText}>Delete Task</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F7FC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 22,
    paddingTop: 35,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#302B3D',
  },
  content: {
    padding: 22,
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 25,
    backgroundColor: '#F0EAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 23,
    fontWeight: '800',
    color: '#302B3D',
    marginBottom: 22,
  },
  detailCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F0ECF7',
  },
  label: {
    fontSize: 12,
    color: '#9991AC',
    marginBottom: 7,
  },
  value: {
    fontSize: 16,
    fontWeight: '700',
    color: '#302B3D',
  },
  divider: {
    height: 1,
    backgroundColor: '#F0ECF7',
    marginVertical: 17,
  },
  note: {
    fontSize: 12,
    color: '#9991AC',
    textAlign: 'center',
    marginTop: 25,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8064C9',
    width: '100%',
    padding: 16,
    borderRadius: 14,
    marginTop: 25,
    gap: 8,
  },
  editText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E05252',
    width: '100%',
    padding: 16,
    borderRadius: 14,
    marginTop: 12,
    gap: 8,
  },
  deleteText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
