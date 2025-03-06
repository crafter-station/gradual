import { generateCourseOG } from '@/lib/og-helpers';
import type { Metadata } from 'next';

// This would typically be fetched from a database based on the courseId
// For demonstration purposes, we're using static data
export function generateMetadata({
  params,
}: { params: { courseId: string } }): Metadata {
  const courseId = params.courseId;

  // In a real application, you would fetch course data here
  // const course = await getCourseById(courseId);

  // For demonstration, we're using static data
  const courseData = {
    title: 'Advanced Learning Techniques',
    description:
      'Master the science of effective learning with proven methods for retention and recall.',
  };

  return generateCourseOG({
    title: courseData.title,
    description: courseData.description,
    courseId,
    theme: 'gradient',
  });
}
