// ============================================================================
// KinetiQ Mock Data — Replace with API calls when backend is ready
// ============================================================================

export const continueLearning = [
  {
    id: 1,
    title: "Gravitational Orbits",
    subject: "Physics",
    topic: "Mechanics",
    progress: 65,
    type: "simulation",
    action: "Resume",
    gradient: "from-violet-600/40 to-indigo-600/40",
  },
  {
    id: 2,
    title: "Surface Tension Lab",
    subject: "Physics",
    topic: "Fluids",
    progress: 40,
    type: "simulation",
    action: "Resume",
    gradient: "from-cyan-600/40 to-blue-600/40",
  },
  {
    id: 3,
    title: "Quantum Entanglement",
    subject: "Physics",
    topic: "Quantum",
    progress: 30,
    type: "tutor",
    action: "Continue Chat",
    gradient: "from-purple-600/40 to-pink-600/40",
  },
  {
    id: 4,
    title: "Data Structures Quiz",
    subject: "Computer Science",
    topic: "DSA",
    progress: 80,
    type: "test",
    action: "Review Results",
    gradient: "from-emerald-600/40 to-teal-600/40",
  },
];

export const recentSimulations = [
  { id: 1, title: "Molecular Dynamics", timestamp: "2 days ago", gradient: "from-rose-500/30 to-orange-500/30" },
  { id: 2, title: "Droplet Collision", timestamp: "3 days ago", gradient: "from-blue-500/30 to-cyan-500/30" },
  { id: 3, title: "Solar System 3D", timestamp: "5 days ago", gradient: "from-indigo-500/30 to-purple-500/30" },
  { id: 4, title: "Pendulum Motion", timestamp: "1 week ago", gradient: "from-amber-500/30 to-yellow-500/30" },
];

export const subjectProgress = [
  { name: "Physics", progress: 82, color: "#8b5cf6", icon: "⚛️" },
  { name: "Mathematics", progress: 76, color: "#6366f1", icon: "📐" },
  { name: "Computer Science", progress: 68, color: "#ef4444", icon: "💻" },
  { name: "Chemistry", progress: 54, color: "#f59e0b", icon: "🧪" },
  { name: "Biology", progress: 40, color: "#22d3ee", icon: "🧬" },
];

export const weeklyStreak = [
  { day: "Mon", completed: true },
  { day: "Tue", completed: true },
  { day: "Wed", completed: true },
  { day: "Thu", completed: true },
  { day: "Fri", completed: true },
  { day: "Sat", completed: true },
  { day: "Sun", completed: false, isToday: true },
];

export const upcomingTest = {
  title: "Mechanics Test",
  difficulty: "Medium",
  questions: 10,
  duration: "15 min",
  date: { month: "MAY", day: 25 },
  topics: ["Newton's Laws", "Friction", "Work"],
};

export const weeklyStats = {
  overallProgress: 72,
  simulations: 12,
  testsAttempted: 8,
  accuracy: 78,
};

export const savedBookmarks = [
  { id: 1, title: "Gravitational Orbits Simulation", type: "simulation", subject: "Physics", savedAt: "2 days ago" },
  { id: 2, title: "Surface Tension Explained", type: "tutor", subject: "Physics", savedAt: "3 days ago" },
  { id: 3, title: "Binary Search Quiz", type: "test", subject: "Computer Science", savedAt: "5 days ago" },
  { id: 4, title: "Wave Interference Pattern", type: "simulation", subject: "Physics", savedAt: "1 week ago" },
  { id: 5, title: "Organic Chemistry Chat", type: "tutor", subject: "Chemistry", savedAt: "1 week ago" },
];

export const tutorConversations = [
  { id: 1, title: "Surface Tension Discussion", preview: "Surface tension is the tendency...", time: "2h ago" },
  { id: 2, title: "Newton's Laws Explained", preview: "Newton's first law states...", time: "Yesterday" },
  { id: 3, title: "Binary Search Algorithm", preview: "Binary search works by...", time: "3 days ago" },
];

export const sampleTestQuestions = [
  {
    id: 1,
    question: "A ball is thrown vertically upward with an initial velocity of 20 m/s. What is the maximum height reached? (g = 10 m/s²)",
    options: ["10 m", "20 m", "30 m", "40 m"],
    correctAnswer: 1,
    explanation: "Using v² = u² - 2gh, at max height v=0: 0 = 400 - 20h, h = 20m",
  },
  {
    id: 2,
    question: "Which of Newton's laws explains why a passenger lurches forward when a bus suddenly stops?",
    options: ["First Law (Inertia)", "Second Law (F=ma)", "Third Law (Action-Reaction)", "Law of Gravitation"],
    correctAnswer: 0,
    explanation: "Newton's First Law: An object in motion stays in motion unless acted upon by an external force.",
  },
  {
    id: 3,
    question: "What is the SI unit of force?",
    options: ["Joule", "Pascal", "Newton", "Watt"],
    correctAnswer: 2,
    explanation: "The SI unit of force is Newton (N), named after Sir Isaac Newton.",
  },
  {
    id: 4,
    question: "If a 5 kg object accelerates at 3 m/s², what net force is acting on it?",
    options: ["8 N", "15 N", "1.67 N", "2 N"],
    correctAnswer: 1,
    explanation: "F = ma = 5 × 3 = 15 N",
  },
  {
    id: 5,
    question: "Which type of friction is generally the strongest?",
    options: ["Kinetic friction", "Static friction", "Rolling friction", "Fluid friction"],
    correctAnswer: 1,
    explanation: "Static friction is generally the strongest as it prevents an object from starting to move.",
  },
  {
    id: 6,
    question: "Work done is zero when the angle between force and displacement is:",
    options: ["0°", "45°", "90°", "180°"],
    correctAnswer: 2,
    explanation: "W = F·d·cos(θ). When θ = 90°, cos(90°) = 0, so W = 0.",
  },
  {
    id: 7,
    question: "What happens to kinetic energy when the velocity of an object is doubled?",
    options: ["Doubles", "Triples", "Quadruples", "Halves"],
    correctAnswer: 2,
    explanation: "KE = ½mv². If v doubles, KE = ½m(2v)² = 4(½mv²), so it quadruples.",
  },
  {
    id: 8,
    question: "The coefficient of friction depends on:",
    options: ["Area of contact", "Nature of surfaces", "Weight of object", "Velocity of object"],
    correctAnswer: 1,
    explanation: "The coefficient of friction depends on the nature/material of the surfaces in contact.",
  },
  {
    id: 9,
    question: "A force of 10 N moves an object 5 m in the direction of force. What is the work done?",
    options: ["2 J", "15 J", "50 J", "0.5 J"],
    correctAnswer: 2,
    explanation: "W = F × d = 10 × 5 = 50 J",
  },
  {
    id: 10,
    question: "Conservation of momentum is applicable when:",
    options: ["External force is maximum", "No external force acts", "Friction is present", "Gravity acts on the system"],
    correctAnswer: 1,
    explanation: "Conservation of momentum applies when no external force acts on the system.",
  },
];