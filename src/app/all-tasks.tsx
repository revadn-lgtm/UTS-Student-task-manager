
import { useTasks } from '@/hooks/TaskContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

type TaskFilter = 'All' | 'Pending' | 'Completed';
type SortOrder = 'earliest' | 'latest';

type DeadlineStatus = {
  label: string;
  color: string;
  backgroundColor: string;
};

const getDeadlineStatus = (
  dueDate: string,
  completed: boolean
): DeadlineStatus => {
  if (completed) {
    return {
      label: 'Completed',
      color: '#42A978',
      backgroundColor: '#E7F7EF',
    };
  }

  const parts = dueDate.split('/');

  if (parts.length !== 3) {
    return {
      label: 'Upcoming',
      color: '#42A978',
      backgroundColor: '#E7F7EF',
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
    };
  }

  if (difference === 0) {
    return {
      label: 'Due Today',
      color: '#D98A24',
      backgroundColor: '#FFF3DF',
    };
  }

  if (difference === 1) {
    return {
      label: 'Tomorrow',
      color: '#B77A20',
      backgroundColor: '#FFF5E5',
    };
  }

  return {
    label: 'Upcoming',
    color: '#42A978',
    backgroundColor: '#E7F7EF',
  };
};

export default function AllTasksScreen() {
  const router = useRouter();
  const { tasks, toggleTask } = useTasks();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<TaskFilter>('All');
  const [sortOrder, setSortOrder] = useState<SortOrder>('earliest');

  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.length - completedTasks;

  const filteredTasks = tasks
    .filter((task) => {
      const query = searchQuery.toLowerCase().trim();

      const matchesSearch =
        task.title.toLowerCase().includes(query) ||
        task.category.toLowerCase().includes(query);

      const matchesFilter =
        activeFilter === 'All' ||
        (activeFilter === 'Pending' && !task.completed) ||
        (activeFilter === 'Completed' && task.completed);

      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      const convertDate = (date: string) => {
        const parts = date.split('/');

        if (parts.length !== 3) return 0;

        return new Date(
          Number(parts[2]),
          Number(parts[1]) - 1,
          Number(parts[0])
        ).getTime();
      };

      const dateA = convertDate(a.dueDate);
      const dateB = convertDate(b.dueDate);

      return sortOrder === 'earliest'
        ? dateA - dateB
        : dateB - dateA;
    });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color="#30264A" />
        </TouchableOpacity>

        <View style={styles.headerText}>
          <Text style={styles.title}>All Tasks</Text>
          <Text style={styles.subtitle}>
            Manage all your assignments
          </Text>
        </View>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{tasks.length}</Text>
          <Text style={styles.summaryLabel}>Total Tasks</Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{pendingTasks}</Text>
          <Text style={styles.summaryLabel}>Pending</Text>
        </View>

        <View style={styles.summaryItem}>
          <Text style={styles.summaryNumber}>{completedTasks}</Text>
          <Text style={styles.summaryLabel}>Completed</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={21} color="#938CA1" />

        <TextInput
          style={styles.searchInput}
          placeholder="Search tasks or categories..."
          placeholderTextColor="#AAA3B5"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons
              name="close-circle"
              size={20}
              color="#938CA1"
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterContainer}>
        {(['All', 'Pending', 'Completed'] as TaskFilter[]).map(
          (filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                activeFilter === filter && styles.activeFilterButton,
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter && styles.activeFilterText,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          )
        )}
      </View>

      <View style={styles.sortContainer}>
        <View style={styles.sortLabelContainer}>
          <Ionicons
            name="swap-vertical"
            size={17}
            color="#8064C9"
          />
          <Text style={styles.sortLabel}>Sort by deadline</Text>
        </View>

        <View style={styles.sortOptions}>
          <TouchableOpacity
            style={[
              styles.sortButton,
              sortOrder === 'earliest' && styles.activeSortButton,
            ]}
            onPress={() => setSortOrder('earliest')}
          >
            <Text
              style={[
                styles.sortText,
                sortOrder === 'earliest' && styles.activeSortText,
              ]}
            >
              Earliest
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.sortButton,
              sortOrder === 'latest' && styles.activeSortButton,
            ]}
            onPress={() => setSortOrder('latest')}
          >
            <Text
              style={[
                styles.sortText,
                sortOrder === 'latest' && styles.activeSortText,
              ]}
            >
              Latest
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      >
        {tasks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="clipboard-outline"
              size={55}
              color="#B8A8DF"
            />

            <Text style={styles.emptyTitle}>No tasks yet</Text>

            <Text style={styles.emptyText}>
              You haven't added any assignments.
              Start organizing your study tasks!
            </Text>

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => router.push('/add-task')}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
              <Text style={styles.addButtonText}>
                Add New Task
              </Text>
            </TouchableOpacity>
          </View>
        ) : filteredTasks.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons
              name="search-outline"
              size={50}
              color="#B8A8DF"
            />

            <Text style={styles.emptyTitle}>No tasks found</Text>

            <Text style={styles.emptyText}>
              No tasks match your search or selected filter.
              Try another keyword or filter.
            </Text>
          </View>
        ) : (
          filteredTasks.map((task) => {
            const deadlineStatus = getDeadlineStatus(
              task.dueDate,
              task.completed
            );

            return (
              <View key={task.id} style={styles.taskCard}>
                <TouchableOpacity
                  style={styles.taskContent}
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
                >
                  <View style={styles.taskIcon}>
                    <Ionicons
                      name="book-outline"
                      size={22}
                      color="#8968D5"
                    />
                  </View>

                  <View style={styles.taskInfo}>
                    <Text
                      style={[
                        styles.taskTitle,
                        task.completed && styles.completedTitle,
                      ]}
                    >
                      {task.title}
                    </Text>

                    <Text style={styles.taskCategory}>
                      {task.category}
                    </Text>

                    <View style={styles.dateContainer}>
                      <Ionicons
                        name="calendar-outline"
                        size={13}
                        color="#938CA1"
                      />
                      <Text style={styles.taskDate}>
                        {task.dueDate}
                      </Text>
                    </View>

                    <View
                      style={[
                        styles.deadlineBadge,
                        {
                          backgroundColor:
                            deadlineStatus.backgroundColor,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.deadlineBadgeText,
                          { color: deadlineStatus.color },
                        ]}
                      >
                        {deadlineStatus.label}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    task.completed && styles.statusCompleted,
                  ]}
                  onPress={() => toggleTask(task.id)}
                >
                  <Ionicons
                    name={
                      task.completed
                        ? 'checkmark-circle'
                        : 'ellipse-outline'
                    }
                    size={25}
                    color={
                      task.completed ? '#42A978' : '#B8A8DF'
                    }
                  />
                </TouchableOpacity>

                <Text
                  style={[
                    styles.statusText,
                    task.completed && styles.statusTextCompleted,
                  ]}
                >
                  {task.completed ? 'Completed' : 'Pending'}
                </Text>
              </View>
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F6FC',
    paddingHorizontal: 22,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
    gap: 15,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: '#30264A',
    fontSize: 26,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#938CA1',
    fontSize: 12,
    marginTop: 4,
  },
  summaryContainer: {
    flexDirection: 'row',
    backgroundColor: '#8064C9',
    borderRadius: 20,
    padding: 18,
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryNumber: {
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: 'bold',
  },
  summaryLabel: {
    color: '#E5DDF8',
    fontSize: 11,
    marginTop: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 50,
    marginBottom: 15,
    gap: 10,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    color: '#30264A',
    fontSize: 13,
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 9,
    marginBottom: 15,
  },
  filterButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 11,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E9E2F5',
  },
  activeFilterButton: {
    backgroundColor: '#8064C9',
    borderColor: '#8064C9',
  },
  filterText: {
    color: '#938CA1',
    fontSize: 12,
    fontWeight: '600',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  sortContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 17,
  },
  sortLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sortLabel: {
    color: '#554B68',
    fontSize: 11,
    fontWeight: '600',
  },
  sortOptions: {
    flexDirection: 'row',
    backgroundColor: '#EDE7F8',
    borderRadius: 10,
    padding: 3,
  },
  sortButton: {
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 8,
  },
  activeSortButton: {
    backgroundColor: '#8064C9',
  },
  sortText: {
    color: '#8064C9',
    fontSize: 10,
    fontWeight: '600',
  },
  activeSortText: {
    color: '#FFFFFF',
  },
  listContainer: {
    paddingBottom: 35,
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 15,
    marginBottom: 13,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  taskContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  taskIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: '#F0E9FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    color: '#30264A',
    fontSize: 14,
    fontWeight: 'bold',
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#A9A2B5',
  },
  taskCategory: {
    color: '#8968D5',
    fontSize: 11,
    marginTop: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 6,
  },
  taskDate: {
    color: '#938CA1',
    fontSize: 10,
  },
  deadlineBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 7,
    marginTop: 8,
  },
  deadlineBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
  },
  statusButton: {
    marginLeft: 8,
  },
  statusCompleted: {
    opacity: 0.9,
  },
  statusText: {
    position: 'absolute',
    right: 15,
    bottom: 8,
    color: '#E9A23B',
    fontSize: 9,
  },
  statusTextCompleted: {
    color: '#42A978',
  },
  emptyContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    marginTop: 15,
    elevation: 2,
  },
  emptyTitle: {
    color: '#30264A',
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 15,
  },
  emptyText: {
    color: '#938CA1',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 7,
  },
  addButton: {
    backgroundColor: '#8064C9',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 13,
    marginTop: 20,
    gap: 6,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
