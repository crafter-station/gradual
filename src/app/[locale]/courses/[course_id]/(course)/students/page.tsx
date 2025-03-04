import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { getCourse, getCourses, getStudents } from '@/db/utils';
import { getI18n, getStaticParams } from '@/locales/server';
import { setStaticParamsLocale } from 'next-international/server';
import { notFound } from 'next/navigation';

export const revalidate = 3600;

export async function generateStaticParams() {
  const courses = await getCourses.execute();
  const locales = getStaticParams();

  return locales.flatMap((locale) =>
    courses.map((course) => ({
      ...locale,
      course_id: course.id,
    })),
  );
}

export default async function SyllabusPage({
  params,
}: Readonly<{
  params: Promise<{
    course_id: string;
    locale: string;
  }>;
}>) {
  const { course_id, locale } = await params;

  setStaticParamsLocale(locale);
  const t = await getI18n();

  const [course] = await getCourse.execute({ courseId: course_id });

  if (!course) {
    notFound();
  }

  const students = await getStudents.execute({ courseId: course_id });

  return (
    <div className="w-full">
      <div className="mb-8 flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="animate-fade-up font-semibold text-2xl">
            {t('course.students.title')}
          </h2>
          <p className="animate-fade-up text-muted-foreground delay-100">
            {t('course.students.description')}
          </p>
        </div>
      </div>

      <div className="relative min-h-[400px] w-full">
        <div className="grid grid-cols-1 gap-4">
          {students.map((student) => (
            <div key={student.id} className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={student.avatarUrl} />
              </Avatar>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <p>{student.fullname}</p>
                  {student.id === course.creatorId && (
                    <Badge variant="outline">Creator</Badge>
                  )}
                </div>
                <span className="text-muted-foreground text-sm">
                  Joined{' '}
                  <time suppressHydrationWarning>
                    {new Date(student.enrollmentDate).toLocaleDateString()}
                  </time>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
