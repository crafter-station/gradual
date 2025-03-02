'use client';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';

import {
  ChartPieIcon,
  FlagIcon,
  GraduationCapIcon,
  HomeIcon,
  StarIcon,
  UploadIcon,
} from 'lucide-react';

import { useI18n } from '@/locales/client';
import { SignInButton, UserButton, useAuth } from '@clerk/nextjs';

const navData = [
  {
    title: 'Home',
    url: '/',
    icon: HomeIcon,
    isActive: true,
  },
  {
    title: 'Courses',
    url: '/courses',
    icon: GraduationCapIcon,
  },
  {
    title: 'Upload',
    url: '/courses/new',
    icon: UploadIcon,
  },
  {
    title: 'Stats',
    url: '/stats',
    icon: ChartPieIcon,
  },
];

function NavMain({ items }: Readonly<{ items: typeof navData }>) {
  const t = useI18n();
  const pathname = usePathname();

  const navItems = items.map((item) => ({
    ...item,
    title: t(`breadcrumbs.${item.title.toLowerCase()}` as keyof typeof t),
    isActive: pathname === item.url || pathname.startsWith(`${item.url}/`),
  }));

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t('breadcrumbs.navigation')}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {navItems.map((item, idx) => (
            <SidebarMenuItem key={item.title + idx.toString()}>
              <SidebarMenuButton
                asChild
                isActive={item.isActive}
                tooltip={item.title}
              >
                <a
                  href={item.url}
                  className={
                    item.isActive ? 'text-foreground' : 'text-muted-foreground'
                  }
                  onClick={(e) => item.isActive && e.preventDefault()}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function UserNav() {
  const { isSignedIn } = useAuth();
  const { state } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        {isSignedIn ? (
          <UserButton showName={state === 'expanded'} />
        ) : (
          <SignInButton />
        )}
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton asChild tooltip="Help">
          <a href="/help" onClick={(e) => e.preventDefault()}>
            <FlagIcon className="h-4 w-4" />
            <span className="ml-1 origin-left transition-all duration-300 group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:scale-0 group-data-[collapsible=icon]:opacity-0">
              Feedback
            </span>
          </a>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="relative mt-2 flex items-center gap-3">
          <StarIcon className="ml-1 size-6 shrink-0" />
          <h1 className="absolute left-[calc(1rem+20px)] origin-left whitespace-nowrap font-mono font-semibold text-lg transition-all duration-300 group-data-[collapsible=icon]:scale-0 group-data-[collapsible=icon]:opacity-0">
            Gradual
          </h1>
        </div>
      </SidebarHeader>
      <SidebarContent className="overflow-hidden">
        <NavMain items={navData} />
      </SidebarContent>
      <SidebarFooter>
        <UserNav />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
