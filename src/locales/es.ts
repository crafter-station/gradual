export default {
  breadcrumbs: {
    navigation: 'Navegación',
    home: 'Inicio',
    courses: 'Cursos',
    upload: 'Crear Nuevo Curso',
    stats: 'Estadísticas',
  },
  hello: 'Hola',
  'hello.world': '¡Hola mundo!',
  welcome: '¡Hola {name}!',
  dashboard: {
    title: 'Panel de Control',
    viewStats: 'Ver Estadísticas',
    actions: {
      courses: 'Cursos',
      coursesDescription: 'Ver todos los cursos',
      reviews: 'Reseñas',
      reviewsDescription: 'Ver todas las reseñas',
      upload: 'Subir',
      uploadDescription: 'Subir un nuevo curso',
    },
    progress: '{completed}/{total} secciones completadas',
    continue: 'Continuar',
    continueLeaning: 'Continuar Aprendiendo',
  },
  courses: {
    uploadPdf: 'Subir Nuevo PDF',
    topicsCount: '{count} Temas',
    sectionsProgress: '{completed} de {total} Secciones',
    progress: 'Progreso',
    resumeLearning: 'Continuar Aprendiendo',
  },
  course: {
    notFound: 'Curso no encontrado',
    about: {
      title: 'Sobre este curso',
      description:
        'Domina los fundamentos de la gestión de bases de datos y SQL con proyectos prácticos y escenarios del mundo real. Perfecto para principiantes y desarrolladores intermedios que buscan fortalecer sus habilidades en datos.',
    },
    features: {
      beginner: {
        title: 'Apto para Principiantes',
        description: 'No se requiere experiencia previa',
      },
      duration: {
        title: '6 Horas de Contenido',
        description: 'Completa a tu propio ritmo',
      },
      certificate: {
        title: 'Certificado',
        description: 'Gana al completar',
      },
    },
    stats: {
      units: '{count} Unidades',
      continue: {
        title: 'Continuar Aprendiendo',
        subtitle: 'Continúa donde lo dejaste',
        progress: '{percentage}% Completado',
      },
      completed: {
        title: 'Secciones Completadas',
        count: '{completed} / {total}',
      },
    },
    learningPoints: {
      title: 'Qué aprenderás',
      'Database design fundamentals': 'Fundamentos de diseño de bases de datos',
      'SQL query optimization': 'Optimización de consultas SQL',
      'Data modeling best practices': 'Mejores prácticas de modelado de datos',
      'Security and access control': 'Seguridad y control de acceso',
      'Performance tuning techniques': 'Técnicas de ajuste de rendimiento',
    },
    prerequisites: {
      title: 'Requisitos previos',
      'Basic computer literacy': 'Conocimientos básicos de informática',
      'Understanding of basic programming concepts':
        'Comprensión de conceptos básicos de programación',
    },
    topic: {
      sections: '{completed} de {total} secciones',
      study: 'Estudiar Tema',
      locked: 'Completa el Tema Anterior Primero',
    },
    syllabus: {
      title: 'Programa del Curso',
      description:
        'Domina los fundamentos a través de rutas de aprendizaje estructuradas',
      download: 'Descargar PDF',
    },
    flashcards: {
      title: 'Tarjetas de Memoria',
      description: 'Repasa y memoriza conceptos clave',
      create: 'Crear Nueva',
      search: 'Buscar tarjetas...',
      showAnswer: 'Mostrar Respuesta',
      hideAnswer: 'Ocultar Respuesta',
      filters: {
        all: 'Todas las Tarjetas',
        bookmarked: 'Marcadas',
        mastered: 'Mastered',
        learning: 'Aprendiendo',
      },
    },
    notes: {
      title: 'Mis Notas',
      description: 'Revisa y administra tus notas del curso',
      export: 'Exportar',
      create: 'Nueva Nota',
      new: 'Nueva Nota',
      edit: 'Editar Nota',
      editDescription: 'Escribe tus pensamientos y observaciones',
      save: 'Guardar Nota',
      titleLabel: 'Título',
      titlePlaceholder: 'Ingresa un título para tu nota...',
      contentLabel: 'Contenido',
      contentPlaceholder: 'Comienza a escribir tu nota...',
      soundToggle: 'Activar/Desactivar sonido de teclado',
      aiAssistant: 'Asistente AI',
      aiSuggestions: 'Sugerencias de Escritura',
      lastSaved: 'Última guardada a las {time}',
      filters: {
        all: 'Todas las Notas',
        'ai-generated': 'Generadas por IA',
        'my-notes': 'Mis Notas',
      },
      selectNote: 'Selecciona una nota para ver o editar',
    },
  },
  landing: {
    badge: {
      introducing: 'Presentamos Gradual',
      alpha: 'Alpha',
      alphaDescription: 'Acceso Anticipado',
    },
    hero: {
      description:
        'Una plataforma de aprendizaje que descompone temas complejos en pasos digeribles. Aprende a tu propio ritmo con nuestro sistema de aprendizaje adaptativo.',
      startButton: 'Comenzar a Aprender',
      methodologyButton: 'Nuestro Método',
      methodologyHint: 'Descubre cómo funciona nuestro sistema',
    },
    waitlist: {
      title: 'Únete a la Lista de Espera',
      description:
        'Sé de los primeros en experimentar la plataforma de aprendizaje adaptativa de Gradual.',
      namePlaceholder: 'Tu nombre',
      emailPlaceholder: 'Tu email',
      joinButton: 'Unirse',
    },
    learnMore: {
      text: 'Conoce nuestra metodología',
    },
  },
} as const;
