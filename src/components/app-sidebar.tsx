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
  GraduationCapIcon,
  HomeIcon,
  LogIn,
  UploadIcon,
} from 'lucide-react';

import { useI18n } from '@/locales/client';
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useAuth,
} from '@clerk/nextjs';
import { GradualLogo } from './gradual-logo';
import Link from 'next/link';
import { cn } from '@/lib/utils';

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
                  className="text-foreground"
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
    <SidebarGroup className="p-0">
      <SidebarMenu>
        <SidebarMenuItem>
          <SignedIn>
            <SidebarMenuButton
              className="!p-0 group-data-[collapsible=icon]:!p-0 flex w-full items-center justify-start gap-2 text-foreground text-sm transition-colors hover:bg-muted/50"
              tooltip="User Profile"
              asChild
            >
              <UserButton showName={true} />
            </SidebarMenuButton>
          </SignedIn>
          <SignedOut>
            <SignInButton mode="modal">
              <SidebarMenuButton
                className={cn(
                  'flex h-10 w-full items-center justify-center gap-1.5 rounded-sm px-2 py-1 font-medium text-base transition-colors duration-150',
                  'active:!bg-sidebar-accent/60 active:!text-foreground bg-sidebar-accent text-foreground hover:bg-sidebar-accent/80 hover:text-foreground',
                  'group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-1 group-data-[collapsible=icon]:text-[10px]',
                  'aria-label:Sign in to your account',
                )}
              >
                <LogIn className="h-6 w-6 shrink-0" />
                <span className="group-data-[collapsible=icon]:hidden">
                  Sign In
                </span>
              </SidebarMenuButton>
            </SignInButton>
          </SignedOut>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="flex flex-row items-center gap-2 pt-2">
        <SidebarMenuButton
          size="lg"
          className="cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          asChild
        >
          <Link href="/">
            <div className="rounded-lg border border-border bg-background p-1">
              <GradualLogo className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-semibold text-base text-foreground leading-tight">
                Gradual
              </span>
              <span className="text-foreground text-xs">
                Learn anything, anywhere
              </span>
            </div>
          </Link>
        </SidebarMenuButton>
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
