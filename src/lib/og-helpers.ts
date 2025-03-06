import type { Metadata } from 'next';

type OGImageParams = {
  type: string;
  title?: string;
  description?: string;
  theme?: 'default' | 'dark' | 'gradient' | 'minimal';
  id?: string;
};

/**
 * Generate Open Graph metadata for a page
 */
export function generateOGMetadata({
  title,
  description,
  type,
  baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://gradual.com',
  ogParams,
}: {
  title: string;
  description: string;
  type:
    | 'landing'
    | 'course'
    | 'module'
    | 'lesson'
    | 'achievement'
    | 'profile'
    | 'progress';
  baseUrl?: string;
  ogParams?: Omit<OGImageParams, 'type'>;
}): Metadata {
  // Construct OG image URL
  const ogImageParams = new URLSearchParams();
  ogImageParams.set('type', type);

  if (ogParams?.title) {
    ogImageParams.set('title', ogParams.title);
  }

  if (ogParams?.description) {
    ogImageParams.set('description', ogParams.description);
  }

  if (ogParams?.theme) {
    ogImageParams.set('theme', ogParams.theme);
  }

  if (ogParams?.id) {
    ogImageParams.set('id', ogParams.id);
  }

  const ogImageUrl = `${baseUrl}/api/og?${ogImageParams.toString()}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: type === 'landing' ? 'website' : 'article',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

/**
 * Generate Open Graph metadata for landing pages
 */
export function generateLandingPageOG({
  title,
  description,
  type,
  theme = 'gradient',
}: {
  title: string;
  description: string;
  type:
    | 'home'
    | 'features'
    | 'about'
    | 'pricing'
    | 'roadmap'
    | 'careers'
    | 'changelog';
  theme?: 'default' | 'dark' | 'gradient' | 'minimal';
}): Metadata {
  return generateOGMetadata({
    title: `${title} - Gradual`,
    description,
    type: 'landing',
    ogParams: {
      title,
      description,
      theme,
    },
  });
}

/**
 * Generate Open Graph metadata for course pages
 */
export function generateCourseOG({
  title,
  description,
  courseId,
  theme = 'default',
}: {
  title: string;
  description: string;
  courseId: string;
  theme?: 'default' | 'dark' | 'gradient' | 'minimal';
}): Metadata {
  return generateOGMetadata({
    title: `${title} - Gradual Course`,
    description,
    type: 'course',
    ogParams: {
      title,
      description,
      theme,
      id: courseId,
    },
  });
}

/**
 * Generate Open Graph metadata for achievement pages
 */
export function generateAchievementOG({
  title,
  description,
  achievementId,
  theme = 'gradient',
}: {
  title: string;
  description: string;
  achievementId: string;
  theme?: 'default' | 'dark' | 'gradient' | 'minimal';
}): Metadata {
  return generateOGMetadata({
    title: `${title} - Achievement Unlocked`,
    description,
    type: 'achievement',
    ogParams: {
      title,
      description,
      theme,
      id: achievementId,
    },
  });
}

/**
 * Generate Open Graph metadata for user profile pages
 */
export function generateProfileOG({
  username,
  description,
  userId,
  theme = 'dark',
}: {
  username: string;
  description: string;
  userId: string;
  theme?: 'default' | 'dark' | 'gradient' | 'minimal';
}): Metadata {
  return generateOGMetadata({
    title: `${username}'s Learning Profile - Gradual`,
    description,
    type: 'profile',
    ogParams: {
      title: `${username}'s Learning Profile`,
      description,
      theme,
      id: userId,
    },
  });
}
