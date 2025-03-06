import { generateAchievementOG } from '@/lib/og-helpers';
import type { Metadata } from 'next';

// This would typically be fetched from a database based on the achievementId
// For demonstration purposes, we're using static data
export function generateMetadata({
  params,
}: { params: { achievementId: string } }): Metadata {
  const achievementId = params.achievementId;

  // In a real application, you would fetch achievement data here
  // const achievement = await getAchievementById(achievementId);

  // For demonstration, we're using static data
  const achievementData = {
    title: '30-Day Learning Streak',
    description:
      'Completed 30 consecutive days of learning activities. Consistency is key to mastery!',
  };

  return generateAchievementOG({
    title: achievementData.title,
    description: achievementData.description,
    achievementId,
    theme: 'gradient',
  });
}
