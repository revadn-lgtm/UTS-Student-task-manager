
import { useTasks } from '@/hooks/TaskContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function StatisticsScreen() {
  const router = useRouter();
  const { tasks } = useTasks();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  const getDeadlineDifference = (dueDate: string) => {
    const parts = dueDate.split('/');

    if (parts.length !== 3) return null;

    const deadline = new Date(
      Number(parts[2]),
      Number(parts[1]) - 1,
      Number(parts[0])
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);

    return Math.round(
      (deadline.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24)
    );
  };

  const activeTasks = tasks.filter((task) => !task.completed);

  const overdueTasks = activeTasks.filter((task) => {
    const difference = getDeadlineDifference(task.dueDate);
    return difference !== null && difference < 0;
  }).length;

  const dueTodayTasks = activeTasks.filter((task) => {
    return getDeadlineDifference(task.dueDate) === 0;
  }).length;

  const upcomingTasks = activeTasks.filter((task) => {
    const difference = getDeadlineDifference(task.dueDate);
    return difference !== null && difference > 0;
  }).length;

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.heading}>Statistics</Text>
        <Text style={styles.subtitle}>
          Track your productivity
        </Text>
      </View>

      <View style={styles.summaryCard}>
        <Ionicons name="bar-chart" size={35} color="#FFFFFF" />
        <Text style={styles.summaryTitle}>Your Productivity</Text>
        <Text style={styles.summaryDescription}>
          Keep working toward your academic goals!
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Task Overview</Text>

      <View style={styles.statCard}>
        <View style={styles.iconBox}>
          <Ionicons name="layers-outline" size={25} color="#8B5CF6" />
        </View>
        <View style={styles.statInfo}>
          <Text style={styles.statTitle}>Total Tasks</Text>
          <Text style={styles.statDescription}>All your tasks</Text>
        </View>
        <Text style={styles.number}>{totalTasks}</Text>
      </View>

      <View style={styles.statCard}>
        <View style={[styles.iconBox, { backgroundColor: '#FFF4DF' }]}>
          <Ionicons name="time-outline" size={25} color="#D99A32" />
        </View>
        <View style={styles.statInfo}>
          <Text style={styles.statTitle}>Pending Tasks</Text>
          <Text style={styles.statDescription}>Tasks to complete</Text>
        </View>
        <Text style={styles.number}>{pendingTasks}</Text>
      </View>

      <View style={styles.statCard}>
        <View style={[styles.iconBox, { backgroundColor: '#EDE7FF' }]}>
          <Ionicons name="checkmark-circle-outline" size={25} color="#8B5CF6" />
        </View>
        <View style={styles.statInfo}>
          <Text style={styles.statTitle}>Completed Tasks</Text>
          <Text style={styles.statDescription}>Successfully finished</Text>
        </View>
        <Text style={styles.number}>{completedTasks}</Text>
      </View>

      <Text style={styles.sectionTitle}>Deadline Overview</Text>

      <View style={styles.statCard}>
        <View style={[styles.iconBox, { backgroundColor: '#FDECEC' }]}>
          <Ionicons name="alert-circle-outline" size={25} color="#D94B4B" />
        </View>
        <View style={styles.statInfo}>
          <Text style={styles.statTitle}>Overdue Tasks</Text>
          <Text style={styles.statDescription}>
            Deadlines that have passed
          </Text>
        </View>
        <Text style={[styles.number, { color: '#D94B4B' }]}>
          {overdueTasks}
        </Text>
      </View>

      <View style={styles.statCard}>
        <View style={[styles.iconBox, { backgroundColor: '#FFF3DF' }]}>
          <Ionicons name="today-outline" size={25} color="#D98A24" />
        </View>
        <View style={styles.statInfo}>
          <Text style={styles.statTitle}>Due Today</Text>
          <Text style={styles.statDescription}>
            Tasks due today
          </Text>
        </View>
        <Text style={[styles.number, { color: '#D98A24' }]}>
          {dueTodayTasks}
        </Text>
      </View>

      <View style={styles.statCard}>
        <View style={[styles.iconBox, { backgroundColor: '#E7F7EF' }]}>
          <Ionicons name="calendar-outline" size={25} color="#42A978" />
        </View>
        <View style={styles.statInfo}>
          <Text style={styles.statTitle}>Upcoming Deadlines</Text>
          <Text style={styles.statDescription}>
            Tasks with future deadlines
          </Text>
        </View>
        <Text style={[styles.number, { color: '#42A978' }]}>
          {upcomingTasks}
        </Text>
      </View>

      <View style={styles.tipCard}>
        <Ionicons name="bulb-outline" size={22} color="#8B5CF6" />
        <Text style={styles.tipText}>
          Tip: Break large assignments into smaller tasks to make
          them easier to complete.
        </Text>
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
    paddingBottom: 20,
  },
  header: {
    padding: 22,
    paddingTop: 35,
  },
  heading: {
    fontSize: 27,
    fontWeight: '800',
    color: '#302B3D',
  },
  subtitle: {
    fontSize: 13,
    color: '#9991AC',
    marginTop: 5,
  },
  summaryCard: {
    marginHorizontal: 22,
    padding: 22,
    borderRadius: 20,
    backgroundColor: '#8B5CF6',
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 15,
  },
  summaryDescription: {
    fontSize: 12,
    color: '#F0EAFE',
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#302B3D',
    marginHorizontal: 22,
    marginTop: 28,
    marginBottom: 15,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 22,
    marginBottom: 12,
    padding: 16,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#F0ECF7',
  },
  iconBox: {
    width: 45,
    height: 45,
    borderRadius: 13,
    backgroundColor: '#F0EAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statInfo: {
    flex: 1,
    marginLeft: 13,
  },
  statTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#302B3D',
  },
  statDescription: {
    fontSize: 11,
    color: '#9991AC',
    marginTop: 4,
  },
  number: {
    fontSize: 22,
    fontWeight: '800',
    color: '#8B5CF6',
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0EAFE',
    margin: 22,
    padding: 17,
    borderRadius: 15,
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    color: '#68518F',
    lineHeight: 19,
  },
});
