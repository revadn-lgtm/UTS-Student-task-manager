
import { useTasks } from '@/hooks/TaskContext';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const guides = [
  {
    icon: 'add-circle-outline' as const,
    title: 'Add New Task',
    description:
      'Tambahkan tugas baru dengan mengisi judul, kategori, dan tanggal tenggat tugas.',
  },
  {
    icon: 'checkbox-outline' as const,
    title: 'Manage Your Tasks',
    description:
      'Tekan ikon lingkaran pada tugas untuk mengubah status dari Pending menjadi Completed.',
  },
  {
    icon: 'document-text-outline' as const,
    title: 'Task Details',
    description:
      'Pilih salah satu tugas untuk melihat informasi lengkap seperti judul, kategori, tanggal, dan status.',
  },
  {
    icon: 'trash-outline' as const,
    title: 'Delete Task',
    description:
      'Hapus tugas yang sudah tidak diperlukan melalui halaman Task Details.',
  },
  {
    icon: 'stats-chart-outline' as const,
    title: 'View Statistics',
    description:
      'Pantau jumlah seluruh tugas, tugas yang belum selesai, dan tugas yang sudah diselesaikan.',
  },
];

export default function ExploreScreen() {
  const router = useRouter();
  const { tasks } = useTasks();

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const months: Record<string, number> = {
    januari: 0,
    februari: 1,
    maret: 2,
    april: 3,
    mei: 4,
    juni: 5,
    juli: 6,
    agustus: 7,
    september: 8,
    oktober: 9,
    november: 10,
    desember: 11,
  };

  const getDateDifference = (dateString: string) => {
    if (!dateString) {
      return null;
    }

    const value = dateString.trim().toLowerCase();

    let day: number;
    let month: number;
    let year: number;

    // Format DD/MM/YYYY
    if (value.includes('/')) {
      const parts = value.split('/');

      if (parts.length !== 3) {
        return null;
      }

      day = Number(parts[0]);
      month = Number(parts[1]) - 1;
      year = Number(parts[2]);
    } else {
      // Format DD Month YYYY
      // Contoh: 17 November 2026
      const parts = value.split(/\s+/);

      if (parts.length !== 3) {
        return null;
      }

      day = Number(parts[0]);
      month = months[parts[1]];
      year = Number(parts[2]);
    }

    if (
      !Number.isInteger(day) ||
      !Number.isInteger(month) ||
      !Number.isInteger(year) ||
      month < 0 ||
      month > 11 ||
      day < 1 ||
      day > 31 ||
      year < 1900
    ) {
      return null;
    }

    const date = new Date(year, month, day);

    // Memastikan tanggal benar-benar valid
    if (
      date.getFullYear() !== year ||
      date.getMonth() !== month ||
      date.getDate() !== day
    ) {
      return null;
    }

    date.setHours(0, 0, 0, 0);

    return Math.round(
      (date.getTime() - today.getTime()) /
        (1000 * 60 * 60 * 24)
    );
  };

  const pendingTasks = tasks.filter(
    (task) => !task.completed
  );

  const overdueTasks = pendingTasks.filter((task) => {
    const difference = getDateDifference(task.dueDate);
    return difference !== null && difference < 0;
  });

  const dueTodayTasks = pendingTasks.filter((task) => {
    return getDateDifference(task.dueDate) === 0;
  });

  const upcomingTasks = pendingTasks
    .filter((task) => {
      const difference = getDateDifference(task.dueDate);
      return difference !== null && difference > 0;
    })
    .sort((a, b) => {
      const dateA = getDateDifference(a.dueDate) ?? 0;
      const dateB = getDateDifference(b.dueDate) ?? 0;
      return dateA - dateB;
    });

  const todayFormatted = today.toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const openTaskDetail = (task: (typeof tasks)[number]) => {
    router.push({
      pathname: '/task-detail',
      params: {
        id: task.id,
        title: task.title,
        category: task.category,
        dueDate: task.dueDate,
        completed: String(task.completed),
      },
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>LEARN YOUR APP</Text>
        <Text style={styles.headerTitle}>Explore</Text>
        <Text style={styles.headerDescription}>
          Pelajari cara menggunakan Student Task Manager untuk
          mengatur tugas kuliah agar lebih terorganisir.
        </Text>
      </View>

      <View style={styles.introCard}>
        <View style={styles.introIcon}>
          <Ionicons
            name="school-outline"
            size={32}
            color="#8B5CF6"
          />
        </View>

        <View style={styles.introText}>
          <Text style={styles.introTitle}>
            Student Task Manager
          </Text>
          <Text style={styles.introDescription}>
            Your personal study assistant. Plan, organize, and
            complete your academic tasks.
          </Text>
        </View>
      </View>

      {/* DEADLINE SUMMARY */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Deadline</Text>
        <Text style={styles.sectionSubtitle}>
          Ringkasan tenggat waktu tugasmu
        </Text>

        <View style={styles.deadlineGrid}>
          <View style={[styles.deadlineCard, styles.overdueCard]}>
            <View style={styles.deadlineIcon}>
              <Ionicons
                name="alert-circle-outline"
                size={21}
                color="#D94B4B"
              />
            </View>
            <Text style={styles.deadlineNumber}>
              {overdueTasks.length}
            </Text>
            <Text style={styles.deadlineLabel}>Overdue</Text>
          </View>

          <View style={[styles.deadlineCard, styles.todayCard]}>
            <View style={styles.deadlineIcon}>
              <Ionicons
                name="today-outline"
                size={21}
                color="#D98A24"
              />
            </View>
            <Text style={styles.deadlineNumber}>
              {dueTodayTasks.length}
            </Text>
            <Text style={styles.deadlineLabel}>Due Today</Text>
          </View>

          <View style={[styles.deadlineCard, styles.upcomingCard]}>
            <View style={styles.deadlineIcon}>
              <Ionicons
                name="calendar-outline"
                size={21}
                color="#42A978"
              />
            </View>
            <Text style={styles.deadlineNumber}>
              {upcomingTasks.length}
            </Text>
            <Text style={styles.deadlineLabel}>Upcoming</Text>
          </View>
        </View>
      </View>

      {/* TODAY'S TASKS */}
      <View style={styles.section}>
        <View style={styles.todayHeader}>
          <View>
            <Text style={styles.sectionTitle}>Today's Tasks</Text>
            <Text style={styles.sectionSubtitle}>
              {todayFormatted}
            </Text>
          </View>

          <View style={styles.todayIcon}>
            <Ionicons
              name="sunny-outline"
              size={23}
              color="#8B5CF6"
            />
          </View>
        </View>

        {dueTodayTasks.length > 0 ? (
          dueTodayTasks.map((task) => (
            <TouchableOpacity
              key={task.id}
              style={styles.taskCard}
              activeOpacity={0.75}
              onPress={() => openTaskDetail(task)}
            >
              <View style={styles.taskIcon}>
                <Ionicons
                  name="book-outline"
                  size={21}
                  color="#8B5CF6"
                />
              </View>

              <View style={styles.taskContent}>
                <Text style={styles.taskTitle}>
                  {task.title}
                </Text>
                <Text style={styles.taskCategory}>
                  {task.category}
                </Text>
              </View>

              <View style={styles.todayBadge}>
                <Text style={styles.todayBadgeText}>Today</Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color="#AAA2B8"
              />
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons
              name="checkmark-circle-outline"
              size={35}
              color="#42A978"
            />
            <Text style={styles.emptyTitle}>
              No tasks due today!
            </Text>
            <Text style={styles.emptyDescription}>
              Tidak ada tugas yang harus dikumpulkan hari ini. Manfaatkan
              waktu untuk mengerjakan tugas berikutnya.
            </Text>
          </View>
        )}
      </View>

      {/* UPCOMING TASKS */}
      <View style={styles.section}>
        <View style={styles.upcomingHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              Upcoming Tasks
            </Text>
            <Text style={styles.sectionSubtitle}>
              Tugas dengan deadline terdekat
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push('/all-tasks')}
          >
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {upcomingTasks.length > 0 ? (
          upcomingTasks.slice(0, 3).map((task) => {
            const difference = getDateDifference(task.dueDate);

            return (
              <TouchableOpacity
                key={task.id}
                style={styles.taskCard}
                activeOpacity={0.75}
                onPress={() => openTaskDetail(task)}
              >
                <View style={styles.taskIcon}>
                  <Ionicons
                    name="time-outline"
                    size={21}
                    color="#8B5CF6"
                  />
                </View>

                <View style={styles.taskContent}>
                  <Text style={styles.taskTitle}>
                    {task.title}
                  </Text>
                  <Text style={styles.taskCategory}>
                    {task.category} {'\u2022'} {task.dueDate}
                  </Text>
                </View>

                <View style={styles.daysBadge}>
                  <Text style={styles.daysBadgeText}>
                    {difference === 1
                      ? '1 day'
                      : `${difference} days`}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons
              name="calendar-clear-outline"
              size={32}
              color="#A99CC4"
            />
            <Text style={styles.emptyTitle}>
              No upcoming tasks
            </Text>
            <Text style={styles.emptyDescription}>
              Belum ada tugas dengan deadline mendatang.
            </Text>
          </View>
        )}
      </View>

      {/* HOW TO USE */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How to Use</Text>
        <Text style={styles.sectionSubtitle}>
          Panduan fitur aplikasi
        </Text>

        {guides.map((guide, index) => (
          <View style={styles.guideCard} key={index}>
            <View style={styles.guideIcon}>
              <Ionicons
                name={guide.icon}
                size={24}
                color="#8B5CF6"
              />
            </View>

            <View style={styles.guideContent}>
              <Text style={styles.guideTitle}>
                {guide.title}
              </Text>
              <Text style={styles.guideDescription}>
                {guide.description}
              </Text>
            </View>
          </View>
        ))}
      </View>

      {/* STUDY TIP */}
      <View style={styles.tipCard}>
        <Ionicons
          name="bulb-outline"
          size={24}
          color="#D99A32"
        />

        <View style={styles.tipContent}>
          <Text style={styles.tipTitle}>Study Tip</Text>
          <Text style={styles.tipDescription}>
            Kerjakan tugas berdasarkan prioritas dan tenggat waktu.
            Jangan menunda pekerjaan agar kegiatan kuliah tetap
            teratur.
          </Text>
        </View>
      </View>

      <Text style={styles.footer}>
        Student Task Manager {'\u2022'} Stay Productive!
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F7FC',
  },
  contentContainer: {
    paddingBottom: 25,
  },
  header: {
    paddingHorizontal: 22,
    paddingTop: 55,
    paddingBottom: 25,
  },
  headerSubtitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8B5CF6',
    letterSpacing: 2,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#302B3D',
    marginBottom: 10,
  },
  headerDescription: {
    fontSize: 13,
    lineHeight: 21,
    color: '#9991AC',
  },
  introCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0EAFE',
    marginHorizontal: 22,
    padding: 18,
    borderRadius: 18,
    marginBottom: 30,
  },
  introIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  introText: {
    flex: 1,
  },
  introTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#302B3D',
    marginBottom: 6,
  },
  introDescription: {
    fontSize: 11,
    lineHeight: 17,
    color: '#777087',
  },
  section: {
    paddingHorizontal: 22,
    marginBottom: 27,
  },
  sectionTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#302B3D',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#9991AC',
    marginTop: 5,
    marginBottom: 17,
  },
  deadlineGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  deadlineCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 16,
  },
  overdueCard: {
    backgroundColor: '#FDECEC',
  },
  todayCard: {
    backgroundColor: '#FFF3DF',
  },
  upcomingCard: {
    backgroundColor: '#E7F7EF',
  },
  deadlineIcon: {
    marginBottom: 7,
  },
  deadlineNumber: {
    fontSize: 23,
    fontWeight: '800',
    color: '#302B3D',
  },
  deadlineLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#777087',
    marginTop: 4,
  },
  todayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  todayIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: '#F0EAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  upcomingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  seeAll: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#F0ECF7',
    marginBottom: 10,
  },
  taskIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: '#F0EAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#302B3D',
    marginBottom: 5,
  },
  taskCategory: {
    fontSize: 10,
    color: '#9991AC',
  },
  todayBadge: {
    backgroundColor: '#FFF3DF',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 7,
    marginRight: 7,
  },
  todayBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#D98A24',
  },
  daysBadge: {
    backgroundColor: '#E7F7EF',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 7,
  },
  daysBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#42A978',
  },
  emptyCard: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 22,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0ECF7',
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#302B3D',
    marginTop: 10,
    marginBottom: 5,
  },
  emptyDescription: {
    fontSize: 11,
    lineHeight: 18,
    color: '#9991AC',
    textAlign: 'center',
  },
  guideCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0ECF7',
    marginBottom: 12,
  },
  guideIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: '#F0EAFE',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },
  guideContent: {
    flex: 1,
  },
  guideTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#302B3D',
    marginBottom: 6,
  },
  guideDescription: {
    fontSize: 11,
    lineHeight: 18,
    color: '#9991AC',
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF8E9',
    marginHorizontal: 22,
    marginTop: 0,
    padding: 17,
    borderRadius: 16,
    gap: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#A87520',
    marginBottom: 6,
  },
  tipDescription: {
    fontSize: 11,
    lineHeight: 18,
    color: '#927B56',
  },
  footer: {
    fontSize: 11,
    color: '#A39BAD',
    textAlign: 'center',
    marginTop: 28,
    marginBottom: 15,
  },
});
