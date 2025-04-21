import {
  HomeIcon,
  Brain,
  Bot,
  Wrench,
  FileText,
  PenTool,
  Flashlight,
  Target,
  Zap,
  PieChart,
  Menu,
  Map as MapIcon,
  LayoutDashboard,
  Activity,
  BarChart3,
  GraduationCap,
  Square as Cards,
  CalendarClock,
  LineChart,
  PlusCircle,
  ScrollText,
  HelpCircle,
  Sparkles,
  Wand2,
  MessagesSquare,
  BookOpen,
  Library,
  File as FileTemplate,
  Users,
  HelpingHand,
} from 'lucide-react';

export const sidebarData = {
  user: {
    name: 'Student Name',
    email: 'student@gradual.com',
    avatar: '/avatar.jpg',
  },
  navMain: [
    {
      title: 'sidebar.navigation.overview.title',
      icon: HomeIcon,
      url: '/overview',
      items: [
        {
          title: 'sidebar.navigation.overview.items.dashboard',
          url: '/overview/dashboard',
          icon: LayoutDashboard,
        },
        {
          title: 'sidebar.navigation.overview.items.recentActivity',
          url: '/overview/activity',
          icon: Activity,
        },
        {
          title: 'sidebar.navigation.overview.items.statistics',
          url: '/overview/stats',
          icon: BarChart3,
        },
      ],
    },
    {
      title: 'sidebar.navigation.learn.title',
      icon: Brain,
      url: '/learn',
      items: [
        {
          title: 'sidebar.navigation.learn.items.myCourses',
          url: '/learn/courses',
          icon: GraduationCap,
        },
        {
          title: 'sidebar.navigation.learn.items.flashcards',
          url: '/learn/flashcards',
          icon: Cards,
        },
        {
          title: 'sidebar.navigation.learn.items.studyPlans',
          url: '/learn/plans',
          icon: CalendarClock,
        },
        {
          title: 'sidebar.navigation.learn.items.progress',
          url: '/learn/progress',
          icon: LineChart,
        },
      ],
    },
    {
      title: 'sidebar.navigation.create.title',
      icon: PenTool,
      url: '/create',
      items: [
        {
          title: 'sidebar.navigation.create.items.newCourse',
          url: '/create/course',
          icon: PlusCircle,
        },
        {
          title: 'sidebar.navigation.create.items.flashcardDeck',
          url: '/create/deck',
          icon: Cards,
        },
        {
          title: 'sidebar.navigation.create.items.studyGuide',
          url: '/create/guide',
          icon: ScrollText,
        },
        {
          title: 'sidebar.navigation.create.items.quizBuilder',
          url: '/create/quiz',
          icon: HelpCircle,
        },
      ],
    },
    {
      title: 'sidebar.navigation.ai.title',
      icon: Bot,
      url: '/ai',
      items: [
        {
          title: 'sidebar.navigation.ai.items.courseGenerator',
          url: '/ai/course',
          icon: Sparkles,
        },
        {
          title: 'sidebar.navigation.ai.items.flashcardAI',
          url: '/ai/flashcards',
          icon: Wand2,
        },
        {
          title: 'sidebar.navigation.ai.items.studyAssistant',
          url: '/ai/assistant',
          icon: MessagesSquare,
        },
        {
          title: 'sidebar.navigation.ai.items.contentAnalyzer',
          url: '/ai/analyzer',
          icon: BookOpen,
        },
      ],
    },
    {
      title: 'sidebar.navigation.resources.title',
      icon: FileText,
      url: '/resources',
      items: [
        {
          title: 'sidebar.navigation.resources.items.library',
          url: '/resources/library',
          icon: Library,
        },
        {
          title: 'sidebar.navigation.resources.items.templates',
          url: '/resources/templates',
          icon: FileTemplate,
        },
        {
          title: 'sidebar.navigation.resources.items.community',
          url: '/resources/community',
          icon: Users,
        },
        {
          title: 'sidebar.navigation.resources.items.helpCenter',
          url: '/resources/help',
          icon: HelpingHand,
        },
      ],
    },
  ],
  powerTools: [
    {
      title: 'sidebar.powerTools.title',
      icon: Wrench,
      url: '/tools',
      items: [
        {
          title: 'sidebar.powerTools.items.markdownEditor',
          url: '/tools/markdown',
          icon: FileText,
        },
        {
          title: 'sidebar.powerTools.items.pdfImport',
          url: '/tools/pdf',
          icon: FileText,
        },
        {
          title: 'sidebar.powerTools.items.contentOrganizer',
          url: '/tools/organizer',
          icon: LayoutDashboard,
        },
        {
          title: 'sidebar.powerTools.items.batchProcessing',
          url: '/tools/batch',
          icon: Activity,
        },
      ],
    },
  ],
  projects: [
    { name: 'Solar Dashboard', url: '/projects/solar', icon: PieChart },
    { name: 'Midnight Console', url: '/projects/midnight', icon: Menu },
    { name: 'Ocean Vibes', url: '/projects/ocean', icon: MapIcon },
  ],
  recentCourses: [
    { name: 'Mathematics 101', url: '/courses/math-101', icon: Target },
    { name: 'Spanish Basics', url: '/courses/spanish', icon: Flashlight },
    { name: 'Physics Advanced', url: '/courses/physics', icon: Zap },
  ],
};
