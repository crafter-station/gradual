export default {
  breadcrumbs: {
    navigation: 'Navigation',
    home: 'Home',
    courses: 'Courses',
    upload: 'Create New Course',
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
    stats: {
      topics: '{count} Topics',
      sections: '{count} Sections',
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
    topic: {
      sections: '{completed} of {total} sections',
      study: 'Study Topic',
      locked: 'Complete Previous Topic First',
    },
  },
} as const;
