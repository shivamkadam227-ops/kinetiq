/**
 * KinetiQ Data Store — localStorage-based persistence layer.
 * All functions are safe to call on the server (they no-op and return defaults).
 */

const isBrowser = typeof window !== "undefined";

function get(key, fallback) {
  if (!isBrowser) return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function set(key, value) {
  if (!isBrowser) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn("dataStore write error:", err);
  }
}

// ============================================================================
// BOOKMARKS
// ============================================================================
export function getBookmarks() {
  return get("kq_bookmarks", []);
}

export function addBookmark(bookmark) {
  const bookmarks = getBookmarks();
  // Prevent duplicates by id
  if (bookmarks.find((b) => b.id === bookmark.id)) return bookmarks;
  const entry = {
    ...bookmark,
    id: bookmark.id || Date.now().toString(),
    savedAt: new Date().toISOString(),
  };
  const updated = [entry, ...bookmarks];
  set("kq_bookmarks", updated);
  addNotification({ title: "Bookmark saved", desc: bookmark.title || "Item bookmarked", type: "bookmark" });
  return updated;
}

export function removeBookmark(id) {
  const updated = getBookmarks().filter((b) => b.id !== id);
  set("kq_bookmarks", updated);
  return updated;
}

export function isBookmarked(id) {
  return getBookmarks().some((b) => b.id === id);
}

// ============================================================================
// TEST HISTORY
// ============================================================================
export function getTestHistory() {
  return get("kq_test_history", []);
}

export function saveTestResult(result) {
  const history = getTestHistory();
  const entry = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    subject: result.subject || "General",
    topic: result.topic || "",
    score: result.score,
    total: result.total,
    accuracy: Math.round((result.score / result.total) * 100),
    questions: result.questions,
    answers: result.answers,
    difficulty: result.difficulty || "Medium",
  };
  const updated = [entry, ...history];
  set("kq_test_history", updated);

  // Log activity
  logActivity("test");

  // Update subject stats
  updateSubjectStats(entry);

  // Track weak topics
  updateWeakTopics(entry);

  addNotification({
    title: "Test completed",
    desc: `${entry.subject} — ${entry.score}/${entry.total} (${entry.accuracy}%)`,
    type: "test",
  });

  return entry;
}

export function getTestStats() {
  const history = getTestHistory();
  if (history.length === 0) {
    return { testsCompleted: 0, avgAccuracy: 0, totalQuestions: 0 };
  }
  const totalAcc = history.reduce((sum, t) => sum + t.accuracy, 0);
  return {
    testsCompleted: history.length,
    avgAccuracy: Math.round(totalAcc / history.length),
    totalQuestions: history.reduce((sum, t) => sum + t.total, 0),
  };
}

// ============================================================================
// SUBJECT STATS
// ============================================================================
function updateSubjectStats(testEntry) {
  const stats = get("kq_subject_stats", {});
  const subj = testEntry.subject;
  if (!stats[subj]) {
    stats[subj] = { tests: 0, totalScore: 0, totalQuestions: 0 };
  }
  stats[subj].tests += 1;
  stats[subj].totalScore += testEntry.score;
  stats[subj].totalQuestions += testEntry.total;
  set("kq_subject_stats", stats);
}

export function getSubjectStats() {
  const stats = get("kq_subject_stats", {});
  return Object.entries(stats).map(([name, data]) => ({
    name,
    progress: data.totalQuestions > 0 ? Math.round((data.totalScore / data.totalQuestions) * 100) : 0,
    tests: data.tests,
  }));
}

// ============================================================================
// WEAK TOPICS
// ============================================================================
function updateWeakTopics(testEntry) {
  const weakTopics = get("kq_weak_topics", []);
  if (!testEntry.questions || !testEntry.answers) return;

  testEntry.questions.forEach((q, i) => {
    if (testEntry.answers[i] !== q.correctAnswer) {
      // Add to weak topics if not already there
      const existing = weakTopics.find(
        (w) => w.question === q.question
      );
      if (!existing) {
        weakTopics.push({
          question: q.question,
          topic: testEntry.topic || testEntry.subject,
          subject: testEntry.subject,
          date: new Date().toISOString(),
        });
      }
    }
  });

  // Keep only last 20 weak topics
  set("kq_weak_topics", weakTopics.slice(-20));
}

export function getWeakTopics() {
  return get("kq_weak_topics", []);
}

// ============================================================================
// STREAK
// ============================================================================
export function getStreak() {
  return get("kq_streak", { count: 0, lastDate: null, history: {} });
}

export function updateStreak() {
  const streak = getStreak();
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

  if (streak.lastDate === today) {
    // Already logged today
    return streak;
  }

  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];

  if (streak.lastDate === yesterday) {
    // Consecutive day
    streak.count += 1;
  } else if (streak.lastDate === null) {
    // First ever visit
    streak.count = 1;
  } else {
    // Streak broken
    streak.count = 1;
  }

  streak.lastDate = today;
  streak.history[today] = true;

  set("kq_streak", streak);

  // Milestone notifications
  if (streak.count === 7 || streak.count === 30 || streak.count === 100) {
    addNotification({
      title: `🔥 ${streak.count}-day streak!`,
      desc: "Amazing dedication! Keep it up!",
      type: "streak",
    });
  }

  return streak;
}

export function getStreakDays() {
  const streak = getStreak();
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date();
  const todayDay = today.getDay(); // 0=Sun, 1=Mon...
  const result = [];

  for (let i = 0; i < 7; i++) {
    // Calculate date for each day of this week (starting Monday)
    const mondayOffset = todayDay === 0 ? -6 : 1 - todayDay;
    const dayDate = new Date(today);
    dayDate.setDate(today.getDate() + mondayOffset + i);
    const dateStr = dayDate.toISOString().split("T")[0];

    result.push({
      day: days[i],
      date: dateStr,
      completed: !!streak.history[dateStr],
      isToday: dateStr === today.toISOString().split("T")[0],
    });
  }

  return result;
}

// ============================================================================
// ACTIVITY LOG (for weekly activity graph)
// ============================================================================
export function logActivity(type) {
  const log = get("kq_activity_log", []);
  log.push({
    type, // "test", "simulation", "tutor"
    timestamp: new Date().toISOString(),
  });
  // Keep last 500 entries
  set("kq_activity_log", log.slice(-500));
}

export function getWeeklyActivity() {
  const log = get("kq_activity_log", []);
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date();
  const todayDay = today.getDay();
  const mondayOffset = todayDay === 0 ? -6 : 1 - todayDay;
  const result = [];

  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(today);
    dayDate.setDate(today.getDate() + mondayOffset + i);
    const dateStr = dayDate.toISOString().split("T")[0];

    const count = log.filter((entry) => entry.timestamp.startsWith(dateStr)).length;
    result.push({ day: days[i], sessions: count });
  }

  return result;
}

export function getSimulationCount() {
  const log = get("kq_activity_log", []);
  return log.filter((e) => e.type === "simulation").length;
}

// ============================================================================
// NOTIFICATIONS
// ============================================================================
export function getNotifications() {
  return get("kq_notifications", []);
}

export function addNotification({ title, desc, type }) {
  const notifications = getNotifications();
  const entry = {
    id: Date.now().toString(),
    title,
    desc,
    type, // "test", "bookmark", "streak", "simulation", "system"
    read: false,
    timestamp: new Date().toISOString(),
  };
  const updated = [entry, ...notifications].slice(0, 50); // Keep last 50
  set("kq_notifications", updated);
  return updated;
}

export function markNotificationRead(id) {
  const notifications = getNotifications();
  const updated = notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
  set("kq_notifications", updated);
  return updated;
}

export function markAllNotificationsRead() {
  const updated = getNotifications().map((n) => ({ ...n, read: true }));
  set("kq_notifications", updated);
  return updated;
}

export function clearNotifications() {
  set("kq_notifications", []);
  return [];
}

export function getUnreadCount() {
  return getNotifications().filter((n) => !n.read).length;
}

// ============================================================================
// SETTINGS
// ============================================================================
const DEFAULT_SETTINGS = {
  profile: { name: "", grade: "", school: "", bio: "" },
  appearance: { theme: "dark", accentColor: "purple", fontSize: "medium" },
  notifications: { inApp: true, streakReminders: true, testReminders: true },
  aiTutor: { responseStyle: "detailed", difficultyLevel: "medium" },
};

export function getSettings() {
  return get("kq_settings", DEFAULT_SETTINGS);
}

export function updateSettings(section, values) {
  const settings = getSettings();
  settings[section] = { ...settings[section], ...values };
  set("kq_settings", settings);
  return settings;
}

export function getSetting(section, key) {
  const settings = getSettings();
  return settings[section]?.[key] ?? DEFAULT_SETTINGS[section]?.[key];
}

// ============================================================================
// SIMULATION HISTORY (for bookmarks context)
// ============================================================================
export function saveSimulation({ query, simulation }) {
  logActivity("simulation");
  addNotification({ title: "Simulation generated", desc: query, type: "simulation" });
}
