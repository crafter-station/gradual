'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Tabs = ({ courseId }: Readonly<{ courseId: string }>) => {
  const pathname = usePathname();

  const tabs = ['Syllabus', 'Tasks', 'Resources', 'Students'];

  const isActive = (tab: string) => {
    return pathname.includes(tab.toLowerCase());
  };

  const isOverviewActive = () => {
    return pathname === `/courses/${courseId}`;
  };

  return (
    <div className="mb-8 flex w-full justify-start rounded-none bg-transparent p-0">
      <Link
        prefetch
        href={`/courses/${courseId}`}
        data-state={isOverviewActive() ? 'active' : 'inactive'}
        className="relative rounded-none border-transparent border-b-2 bg-transparent px-4 pt-2 pb-3 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary! data-[state=active]:text-foreground"
      >
        Overview
      </Link>
      {tabs.map((tab) => (
        <Link
          prefetch
          key={tab}
          href={`/courses/${courseId}/${tab.toLowerCase()}`}
          data-state={isActive(tab) ? 'active' : 'inactive'}
          className="relative rounded-none border-transparent border-b-2 bg-transparent px-4 pt-2 pb-3 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary! data-[state=active]:text-foreground"
        >
          {tab}
        </Link>
      ))}
    </div>
  );
};
