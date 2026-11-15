
import { useTasks } from '@/hooks/TaskContext';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, {
    DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
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

export default function AddTaskScreen() {
  const router = useRouter();
  const { addTask } = useTasks();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    setShowDatePicker(Platform.OS === 'ios');

    if (event.type === 'set' && selectedDate) {
      setDueDate(selectedDate);
    }
  };

  const handleSave = () => {
    if (!title.trim() || !category.trim() || !dueDate) {
      Alert.alert(
        'Incomplete Data',
        'Please fill in all fields.'
      );
      return;
    }

    const selectedDate = new Date(dueDate);
    selectedDate.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      Alert.alert(
        'Invalid Due Date',
        'Please select today or a future date.'
      );
      return;
    }

    addTask({
      title: title.trim(),
      category: category.trim(),
      dueDate: formatDate(dueDate),
    });

    Alert.alert(
      'Task Saved',
      'Your task has been added successfully.',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
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

        <Text style={styles.headerTitle}>Add New Task</Text>

        <View style={{ width: 25 }} />
      </View>

      <View style={styles.form}>
        <Text style={styles.heading}>Create Your Task</Text>

        <Text style={styles.description}>
          Add your task details and manage your time better.
        </Text>

        <Text style={styles.label}>Task Title</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter task title"
          placeholderTextColor="#AAA2B8"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Category</Text>

        <TextInput
          style={styles.input}
          placeholder="Example: Assignment, Exam, Project"
          placeholderTextColor="#AAA2B8"
          value={category}
          onChangeText={setCategory}
        />

        <Text style={styles.label}>Due Date</Text>

        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setShowDatePicker(true)}
        >
          <Text
            style={[
              styles.dateText,
              !dueDate && styles.placeholderText,
            ]}
          >
            {dueDate
              ? formatDate(dueDate)
              : 'Select task deadline'}
          </Text>

          <Ionicons
            name="calendar-outline"
            size={21}
            color="#8B5CF6"
          />
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={dueDate || new Date()}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={handleDateChange}
          />
        )}

        <View style={styles.reminderInfo}>
          <Ionicons
            name="information-circle-outline"
            size={21}
            color="#8B5CF6"
          />

          <Text style={styles.reminderText}>
            Your task deadline will be saved so you can manage
            your study schedule and track upcoming tasks.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSave}
        >
          <Ionicons
            name="add-circle-outline"
            size={20}
            color="#FFFFFF"
          />

          <Text style={styles.saveText}>Save Task</Text>
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
  form: {
    padding: 22,
  },
  heading: {
    fontSize: 25,
    fontWeight: '800',
    color: '#302B3D',
    marginBottom: 8,
  },
  description: {
    fontSize: 13,
    color: '#9991AC',
    lineHeight: 20,
    marginBottom: 30,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: '#302B3D',
    marginBottom: 9,
    marginTop: 17,
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE4F3',
    borderRadius: 13,
    padding: 15,
    fontSize: 13,
    color: '#302B3D',
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE4F3',
    borderRadius: 13,
    padding: 15,
  },
  dateText: {
    fontSize: 13,
    color: '#302B3D',
  },
  placeholderText: {
    color: '#AAA2B8',
  },
  reminderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0EAFE',
    padding: 14,
    borderRadius: 13,
    marginTop: 22,
    gap: 10,
  },
  reminderText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 17,
    color: '#777087',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8B5CF6',
    padding: 16,
    borderRadius: 14,
    marginTop: 35,
    gap: 9,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
