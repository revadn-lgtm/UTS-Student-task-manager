
import { useTasks } from '@/hooks/TaskContext';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function EditTaskScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { tasks, updateTask } = useTasks();

  const currentTask = tasks.find((task) => task.id === id);

  const [title, setTitle] = useState(currentTask?.title ?? '');
  const [category, setCategory] = useState(currentTask?.category ?? '');
  const [dueDate, setDueDate] = useState(currentTask?.dueDate ?? '');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSave = () => {
    if (!title.trim() || !category.trim() || !dueDate.trim()) {
      Alert.alert('Incomplete Form', 'Please fill in all fields.');
      return;
    }

    updateTask(id, {
      title: title.trim(),
      category: category.trim(),
      dueDate,
    });

    Alert.alert('Success', 'Task has been updated successfully.', [
      {
        text: 'OK',
        onPress: () => router.back(),
      },
    ]);
  };

  const handleDateChange = (
    event: any,
    selectedDate?: Date
  ) => {
    setShowDatePicker(Platform.OS === 'ios');

    if (selectedDate) {
      const formattedDate = selectedDate.toLocaleDateString('en-GB');
      setDueDate(formattedDate);
    }
  };

  if (!currentTask) {
    return (
      <View style={styles.container}>
        <Text style={styles.notFound}>Task not found.</Text>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={25} color="#302B3D" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Edit Task</Text>

        <View style={{ width: 25 }} />
      </View>

      <View style={styles.iconCircle}>
        <Ionicons name="create-outline" size={35} color="#8064C9" />
      </View>

      <Text style={styles.heading}>Update Your Task</Text>
      <Text style={styles.subtitle}>
        Make changes to your task information below.
      </Text>

      <View style={styles.formCard}>
        <Text style={styles.label}>Task Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter task title"
          placeholderTextColor="#AAA3B8"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Category</Text>
        <TextInput
          style={styles.input}
          placeholder="Example: Assignment, Study"
          placeholderTextColor="#AAA3B8"
          value={category}
          onChangeText={setCategory}
        />

        <Text style={styles.label}>Due Date</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons name="calendar-outline" size={20} color="#8064C9" />
          <Text style={styles.dateText}>
            {dueDate || 'Select due date'}
          </Text>
          <Ionicons name="chevron-down" size={18} color="#9991AC" />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={
              dueDate
                ? (() => {
                    const parts = dueDate.split('/');
                    return new Date(
                      Number(parts[2]),
                      Number(parts[1]) - 1,
                      Number(parts[0])
                    );
                  })()
                : new Date()
            }
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
          <Text style={styles.saveText}>Save Changes</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelText}>Cancel</Text>
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
  contentContainer: {
    paddingBottom: 30,
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
  iconCircle: {
    width: 75,
    height: 75,
    borderRadius: 24,
    backgroundColor: '#F0EAFE',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 15,
  },
  heading: {
    fontSize: 23,
    fontWeight: '800',
    color: '#302B3D',
    textAlign: 'center',
    marginTop: 18,
  },
  subtitle: {
    fontSize: 12,
    color: '#9991AC',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 22,
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 22,
    padding: 20,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#F0ECF7',
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#554B68',
    marginBottom: 9,
    marginTop: 12,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E9E2F5',
    borderRadius: 12,
    paddingHorizontal: 14,
    color: '#302B3D',
    fontSize: 13,
    backgroundColor: '#FCFBFE',
  },
  dateButton: {
    height: 50,
    borderWidth: 1,
    borderColor: '#E9E2F5',
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FCFBFE',
  },
  dateText: {
    flex: 1,
    color: '#554B68',
    fontSize: 13,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8064C9',
    padding: 16,
    borderRadius: 14,
    marginTop: 28,
    gap: 8,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F0EAFE',
    padding: 15,
    borderRadius: 14,
    marginTop: 12,
  },
  cancelText: {
    color: '#8064C9',
    fontSize: 14,
    fontWeight: '700',
  },
  notFound: {
    textAlign: 'center',
    marginTop: 100,
    color: '#302B3D',
    fontSize: 16,
  },
});
