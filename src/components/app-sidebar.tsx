'use client';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';

import {
  ChartPieIcon,
  FlagIcon,
  GraduationCapIcon,
  HomeIcon,
  LogOutIcon,
  SettingsIcon,
  StarIcon,
  UploadIcon,
  UserIcon,
} from 'lucide-react';

import { useI18n } from '@/locales/client';

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
  const handleSignOut = () => {
    console.log('sign out');
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              asChild
              tooltip={'John Doe'}
              className="!px-1 group-data-[collapsible=icon]:!p-1"
            >
              <div className="flex cursor-pointer items-center gap-2 p-2">
                <UserIcon className="h-6 w-6" />
                <span className="origin-left transition-all duration-300 group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:scale-0 group-data-[collapsible=icon]:opacity-0">
                  John Doe
                </span>
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56"
            align="start"
            alignOffset={11}
            sideOffset={8}
          >
            <div className="flex items-center gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">John Doe</p>
                <p className="text-muted-foreground text-sm">
                  john.doe@example.com
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <a
                href="/settings"
                className="flex cursor-pointer items-center gap-2"
              >
                <SettingsIcon className="h-4 w-4" />
                <span>Settings</span>
              </a>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:!text-destructive flex cursor-pointer items-center gap-2 text-destructive"
              onSelect={(event) => {
                event.preventDefault();
                handleSignOut();
              }}
            >
              <LogOutIcon className="h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
