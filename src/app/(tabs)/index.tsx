
import TaskCard from '@/components/TaskCard';
import { useTasks } from '@/hooks/TaskContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import {
  Animated,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { tasks, toggleTask } = useTasks();

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const progress = totalTasks === 0 ? 0 : (completedTasks / totalTasks) * 100;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const bookFloat = useRef(new Animated.Value(0)).current;
  const flowerLeftFloat = useRef(new Animated.Value(0)).current;
  const flowerRightFloat = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();

    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 800,
      useNativeDriver: false,
    }).start();
  }, [fadeAnim, progressAnim, progress]);

  useEffect(() => {
    const bookAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bookFloat, {
          toValue: -12,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(bookFloat, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    );

    const leftFlowerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(flowerLeftFloat, {
          toValue: -15,
          duration: 2200,
          useNativeDriver: true,
        }),
        Animated.timing(flowerLeftFloat, {
          toValue: 0,
          duration: 2200,
          useNativeDriver: true,
        }),
      ])
    );

    const rightFlowerAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(flowerRightFloat, {
          toValue: 12,
          duration: 1900,
          useNativeDriver: true,
        }),
        Animated.timing(flowerRightFloat, {
          toValue: 0,
          duration: 1900,
          useNativeDriver: true,
        }),
      ])
    );

    bookAnimation.start();
    leftFlowerAnimation.start();
    rightFlowerAnimation.start();

    return () => {
      bookAnimation.stop();
      leftFlowerAnimation.stop();
      rightFlowerAnimation.stop();
    };
  }, [bookFloat, flowerLeftFloat, flowerRightFloat]);

  const handleButtonPress = () => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.94,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.push('/add-task');
    });
  };

  return (
    <Animated.View style={[styles.screen, { opacity: fadeAnim }]}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headingInfo}>
            <Text style={styles.greeting}>HELLO, STUDENT! 👋</Text>
            <Text style={styles.title}>My Tasks</Text>
            <Text style={styles.subtitle}>
              Let's organize your study today.
            </Text>
          </View>

          <View style={styles.profileContainer}>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>Reva Dwi Nurrahma</Text>
              <Text style={styles.profileRole}>Informatics Student</Text>
            </View>

            <Image
              source={require('../../../assets/images/profile.jpeg')}
              style={styles.avatar}
            />
          </View>
        </View>

        {/* Dekorasi buku dan bunga bergerak */}
        <View style={styles.decorationContainer}>
          <Animated.Image
            source={require('../../../assets/images/flower.png')}
            style={[
              styles.leftFlower,
              {
                transform: [
                  { translateY: flowerLeftFloat },
                  { rotate: '-15deg' },
                ],
              },
            ]}
            resizeMode="contain"
          />

          <Animated.Image
            source={require('../../../assets/images/book-flower.png')}
            style={[
              styles.bookImage,
              {
                transform: [{ translateY: bookFloat }],
              },
            ]}
            resizeMode="contain"
          />

          <Animated.Image
            source={require('../../../assets/images/flower.png')}
            style={[
              styles.rightFlower,
              {
                transform: [
                  { translateY: flowerRightFloat },
                  { rotate: '15deg' },
                ],
              },
            ]}
            resizeMode="contain"
          />
        </View>

        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Your Progress</Text>
          <Text style={styles.progressNumber}>
            {completedTasks} / {totalTasks}
          </Text>
          <Text style={styles.progressText}>Tasks completed</Text>

          <View style={styles.progressBar}>
            <Animated.View
              style={[
                styles.progressFill,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 100],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Task Overview</Text>
          <Text style={styles.seeAll}>This week</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.iconBox, { backgroundColor: '#F0E9FF' }]}>
              <Ionicons name="book-outline" size={24} color="#8968D5" />
            </View>
            <Text style={styles.statNumber}>{totalTasks}</Text>
            <Text style={styles.statLabel}>Total Tasks</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.iconBox, { backgroundColor: '#FFF0DB' }]}>
              <Ionicons name="time-outline" size={24} color="#E9A23B" />
            </View>
            <Text style={styles.statNumber}>{pendingTasks}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>

          <View style={styles.statCard}>
            <View style={[styles.iconBox, { backgroundColor: '#E2F7EC' }]}>
              <Ionicons name="checkmark-circle-outline" size={24} color="#42A978" />
            </View>
            <Text style={styles.statNumber}>{completedTasks}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Tasks</Text>
          <TouchableOpacity onPress={() => router.push('/all-tasks')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {tasks.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="clipboard-outline" size={48} color="#B8A8DF" />
            <Text style={styles.emptyTitle}>No tasks yet</Text>
            <Text style={styles.emptyText}>
              Your assignments will appear here.
              Start by adding your first task!
            </Text>
          </View>
        ) : (
          <View style={styles.taskList}>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                title={task.title}
                category={task.category}
                dueDate={task.dueDate}
                completed={task.completed}
                onToggle={() => toggleTask(task.id)}
                onPress={() =>
                  router.push({
                    pathname: '/task-detail',
                    params: {
                      id: task.id,
                      title: task.title,
                      category: task.category,
                      dueDate: task.dueDate,
                      completed: String(task.completed),
                    },
                  })
                }
              />
            ))}
          </View>
        )}

        <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={handleButtonPress}
            activeOpacity={0.85}
          >
            <Ionicons name="add-circle-outline" size={23} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Add New Task</Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F8F6FC',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F6FC',
    paddingHorizontal: 22,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 65,
    marginBottom: 25,
  },
  headingInfo: {
    flex: 1,
  },
  greeting: {
    color: '#9179C7',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  title: {
    color: '#30264A',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 5,
  },
  subtitle: {
    color: '#938CA1',
    fontSize: 13,
    marginTop: 5,
  },
  profileContainer: {
    alignItems: 'center',
    gap: 8,
  },
  profileInfo: {
    alignItems: 'flex-end',
  },
  profileName: {
    color: '#30264A',
    fontSize: 11,
    fontWeight: 'bold',
  },
  profileRole: {
    color: '#938CA1',
    fontSize: 10,
    marginTop: 3,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#D8C7FF',
  },
  decorationContainer: {
    height: 145,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  bookImage: {
    width: 155,
    height: 135,
  },
  leftFlower: {
    width: 55,
    height: 55,
    position: 'absolute',
    left: 12,
    top: 15,
  },
  rightFlower: {
    width: 48,
    height: 48,
    position: 'absolute',
    right: 15,
    bottom: 12,
  },
  summary: {
    backgroundColor: '#8064C9',
    padding: 22,
    borderRadius: 22,
    marginBottom: 28,
  },
  summaryTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  progressNumber: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 15,
  },
  progressText: {
    color: '#E5DDF8',
    fontSize: 12,
    marginTop: 3,
  },
  progressBar: {
    height: 7,
    backgroundColor: '#A995DC',
    borderRadius: 10,
    marginTop: 18,
  },
  progressFill: {
    height: 7,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    color: '#30264A',
    fontSize: 18,
    fontWeight: 'bold',
  },
  seeAll: {
    color: '#8A6BCB',
    fontSize: 12,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 17,
    padding: 13,
    elevation: 2,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: {
    color: '#30264A',
    fontSize: 23,
    fontWeight: 'bold',
    marginTop: 12,
  },
  statLabel: {
    color: '#938CA1',
    fontSize: 10,
    marginTop: 3,
  },
  emptyCard: {
    backgroundColor: '#FFFFFF',
    padding: 28,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 2,
  },
  emptyTitle: {
    color: '#30264A',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
  },
  emptyText: {
    color: '#938CA1',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 7,
  },
  taskList: {
    gap: 12,
  },
  addButton: {
    backgroundColor: '#8064C9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 15,
    marginTop: 20,
    marginBottom: 35,
    gap: 8,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
