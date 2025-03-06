export default {
  breadcrumbs: {
    navigation: 'Navigation',
    home: 'Home',
    courses: 'Courses',
    upload: 'New Course',
    stats: 'Stats',
  },
  hello: 'Hello',
  'hello.world': 'Hello world!',
  welcome: 'Hello {name}!',
  dashboard: {
    title: 'Dashboard',
    viewStats: 'View Stats',
    actions: {
      courses: 'Courses',
      coursesDescription: 'View all courses',
      reviews: 'Reviews',
      reviewsDescription: 'View all reviews',
      upload: 'Upload',
      uploadDescription: 'Upload a new course',
    },
    progress: '{completed}/{total} sections completed',
    continue: 'Continue',
    continueLeaning: 'Continue Learning',
  },
  courses: {
    uploadPdf: 'Upload New PDF',
    topicsCount: '{count} Topics',
    sectionsProgress: '{completed} of {total} Sections',
    progress: 'Progress',
    resumeLearning: 'Resume Learning',
  },
  course: {
    notFound: 'Course not found',
    about: {
      title: 'About this course',
    },
    features: {
      beginner: {
        title: 'Beginner Friendly',
        description: 'No prior experience needed',
      },
      duration: {
        title: '6 Hours of Content',
        description: 'Complete at your own pace',
      },
      certificate: {
        title: 'Certificate',
        description: 'Earn upon completion',
      },
    },
    stats: {
      units: '{count} Units',
      continue: {
        title: 'Continue Learning',
        subtitle: 'Pick up where you left off',
        progress: '{percentage}% Complete',
      },
      completed: {
        title: 'Sections Done',
        count: '{completed} / {total}',
      },
    },
    learningPoints: {
      title: "What you'll learn",
      'Database design fundamentals': 'Database design fundamentals',
      'SQL query optimization': 'SQL query optimization',
      'Data modeling best practices': 'Data modeling best practices',
      'Security and access control': 'Security and access control',
      'Performance tuning techniques': 'Performance tuning techniques',
    },
    prerequisites: {
      title: 'Prerequisites',
      'Basic computer literacy': 'Basic computer literacy',
      'Understanding of basic programming concepts':
        'Understanding of basic programming concepts',
    },
    topic: {
      sections: '{completed} of {total} sections',
      study: 'Study Topic',
      locked: 'Complete Previous Topic First',
    },
    syllabus: {
      title: 'Course Syllabus',
      description: 'Master the fundamentals through structured learning paths',
      download: 'Download PDF',
      viewSource: 'View Source',
    },
    flashcards: {
      title: 'Flashcards',
      description: 'Review and memorize key concepts',
      create: 'Create New',
      search: 'Search flashcards...',
      showAnswer: 'Show Answer',
      hideAnswer: 'Hide Answer',
      filters: {
        all: 'All Cards',
        bookmarked: 'Bookmarked',
        mastered: 'Mastered',
        learning: 'Still Learning',
      },
    },
    students: {
      title: 'Students',
      description: 'View all students enrolled in this course',
    },
    notes: {
      title: 'My Notes',
      description: 'Review and manage your course notes',
      export: 'Export',
      create: 'New Note',
      sections: {
        lecture: 'Lecture Notes',
        tasks: 'Study Tasks',
      },
      dueDate: 'Due {date}',
      new: 'New Note',
      edit: 'Edit Note',
      editDescription: 'Write down your thoughts and insights',
      save: 'Save Note',
      titleLabel: 'Title',
      titlePlaceholder: 'Enter a title for your note...',
      contentLabel: 'Content',
      contentPlaceholder: 'Start writing your note...',
      soundToggle: 'Toggle typing sound',
      aiAssistant: 'AI Assistant',
      aiSuggestions: 'Writing Suggestions',
      lastSaved: 'Last saved at {time}',
      emptyContent: 'Start writing or choose a template...',
      search: 'Search notes...',
      filters: {
        all: 'All Notes',
        'ai-generated': 'AI Generated',
        'my-notes': 'My Notes',
      },
      selectNote: 'Select a note to view or edit',
      editor: {
        placeholder: "Start typing or use '/' for commands...",
        aiSuggestion: 'Get AI suggestions',
        save: 'Save changes',
        cancel: 'Cancel',
        delete: 'Delete note',
        addTag: 'Add tag...',
        autoTag: 'Auto-tag',
        lastEdited: 'Last edited {{time}}',
      },
      actions: {
        new: 'New Note',
        edit: 'Edit',
        save: 'Save',
        delete: 'Delete',
        share: 'Share',
      },
    },
  },
  landing: {
    badge: {
      introducing: 'Introducing Gradual',
      alpha: 'Alpha',
      alphaDescription: 'Early Access',
    },
    hero: {
      description:
        'An adaptive learning platform that breaks down complex subjects into digestible steps. Learn what you need, when you need it.',
      startButton: 'Start Learning',
      methodologyButton: 'Our Method',
      methodologyHint: 'See how our system works',
    },
    stats: {
      learners: {
        label: 'Early Adopters',
        description: 'Growing community',
      },
      courses: {
        label: 'Beta Courses',
        description: 'In development',
      },
      success: {
        label: 'Completion Rate',
        description: 'Beta testers',
      },
    },
    waitlist: {
      title: 'Join the Waitlist',
      description:
        "Be among the first to experience Gradual's adaptive learning platform.",
      namePlaceholder: 'Your name',
      emailPlaceholder: 'Your email',
      joinButton: 'Join Waitlist',
    },
    learnMore: {
      text: 'Learn about our methodology',
    },
  },
  createCourse: {
    title: 'New Course',
    subtitle: 'Add a new course to Gradual',
    form: {
      tabs: {
        label: 'Source',
        file: {
          title: 'PDF',
          label: 'Select a file',
        },
        url: {
          title: 'URL',
          label: 'Enter a URL',
          placeholder: 'https://example.com/course',
        },
      },
      buttonLabel: {
        loading: 'Loading...',
        default: 'Initiate Course Creation',
      },
      success: {
        title: 'Course Creation Initiated',
        description:
          'Your course is being created.. It will be ready in 10min max',
      },
      error: {
        title: 'Error',
        description: 'Failed to create course',
      },
    },
  },
  waitlist: {
    title: 'Join the Waitlist',
    empty: 'No waitlist users found',
    requested: 'Requested',
    acceptButton: 'Accept',
    rejectButton: 'Reject',
    joinToast: 'You have joined the waitlist',
    updateSuccess: 'Waitlist updated successfully',
  },
} as const;
