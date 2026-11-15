
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import {
    Animated,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type TaskCardProps = {
  title: string;
  category: string;
  dueDate: string;
  completed: boolean;
  onToggle: () => void;
  onPress: () => void;
};

export default function TaskCard({
  title,
  category,
  dueDate,
  completed,
  onToggle,
  onPress,
}: TaskCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const getDeadlineStatus = () => {
    if (completed) {
      return {
        label: 'Completed',
        color: '#42A978',
        backgroundColor: '#E7F7EF',
        icon: 'checkmark-circle-outline' as const,
      };
    }

    const parts = dueDate.split('/');

    if (parts.length !== 3) {
      return {
        label: 'Upcoming',
        color: '#42A978',
        backgroundColor: '#E7F7EF',
        icon: 'calendar-outline' as const,
      };
    }

    const deadline = new Date(
      Number(parts[2]),
      Number(parts[1]) - 1,
      Number(parts[0])
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);

    const difference = Math.round(
      (deadline.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24)
    );

    if (difference < 0) {
      return {
        label: 'Overdue',
        color: '#D94B4B',
        backgroundColor: '#FDECEC',
        icon: 'alert-circle-outline' as const,
      };
    }

    if (difference === 0) {
      return {
        label: 'Due Today',
        color: '#D98A24',
        backgroundColor: '#FFF3DF',
        icon: 'time-outline' as const,
      };
    }

    if (difference === 1) {
      return {
        label: 'Tomorrow',
        color: '#B77A20',
        backgroundColor: '#FFF5E5',
        icon: 'calendar-outline' as const,
      };
    }

    return {
      label: 'Upcoming',
      color: '#42A978',
      backgroundColor: '#E7F7EF',
      icon: 'calendar-outline' as const,
    };
  };

  const deadlineStatus = getDeadlineStatus();

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.checkButton}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Ionicons
          name={completed ? 'checkmark-circle' : 'ellipse-outline'}
          size={25}
          color={completed ? '#8B5CF6' : '#A78BFA'}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.taskInfo}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.taskTitle,
            completed && styles.completedTitle,
          ]}
        >
          {title}
        </Text>

        <Text style={styles.category}>{category}</Text>

        <View style={styles.dateContainer}>
          <Ionicons
            name="calendar-outline"
            size={14}
            color="#9991AC"
          />
          <Text style={styles.date}>{dueDate}</Text>
        </View>

        <View
          style={[
            styles.deadlineBadge,
            { backgroundColor: deadlineStatus.backgroundColor },
          ]}
        >
          <Ionicons
            name={deadlineStatus.icon}
            size={12}
            color={deadlineStatus.color}
          />
          <Text
            style={[
              styles.deadlineText,
              { color: deadlineStatus.color },
            ]}
          >
            {deadlineStatus.label}
          </Text>
        </View>
      </TouchableOpacity>

      <View
        style={[
          styles.status,
          completed ? styles.doneStatus : styles.pendingStatus,
        ]}
      >
        <Text
          style={[
            styles.statusText,
            completed ? styles.doneText : styles.pendingText,
          ]}
        >
          {completed ? 'Done' : 'Pending'}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F0ECF7',
  },
  checkButton: {
    marginRight: 12,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#302B3D',
    marginBottom: 5,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#A39BAD',
  },
  category: {
    fontSize: 12,
    color: '#8B5CF6',
    marginBottom: 7,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    fontSize: 11,
    color: '#9991AC',
    marginLeft: 5,
  },
  deadlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 7,
    marginTop: 8,
    gap: 5,
  },
  deadlineText: {
    fontSize: 10,
    fontWeight: '700',
  },
  status: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  pendingStatus: {
    backgroundColor: '#FFF4DF',
  },
  doneStatus: {
    backgroundColor: '#EDE7FF',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  pendingText: {
    color: '#D99A32',
  },
  doneText: {
    color: '#8B5CF6',
  },
});
