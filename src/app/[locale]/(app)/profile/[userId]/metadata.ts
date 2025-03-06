import { generateProfileOG } from '@/lib/og-helpers';
import type { Metadata } from 'next';

// This would typically be fetched from a database based on the userId
// For demonstration purposes, we're using static data
export function generateMetadata({
  params,
}: { params: { userId: string } }): Metadata {
  const userId = params.userId;

  // In a real application, you would fetch user data here
  // const user = await getUserById(userId);

  // For demonstration, we're using static data
  const userData = {
    username: 'Sarah Johnson',
    description:
      'Learning enthusiast with a focus on cognitive science and effective study techniques.',
    stats: {
      coursesCompleted: 12,
      hoursLearned: 87,
      streak: 42,
    },
  };

  return generateProfileOG({
    username: userData.username,
    description: `${userData.description} Completed ${userData.stats.coursesCompleted} courses with ${userData.stats.hoursLearned} hours of focused learning.`,
    userId,
    theme: 'dark',
  });
}
