'use client';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import { GradualLogo } from '../gradual-logo';
import { NavMain } from './nav-main';
import { NavProjects } from './nav-projects';
import { sidebarData } from './sidebar-data';
import { CommandMenu, TOUR_STEP_IDS } from './command-menu';
import { NavUser } from './nav-user';
import { useI18n } from '@/locales/client';

export function AppSidebar() {
  const pathname = usePathname();
  const t = useI18n();

  const mainNavItems = sidebarData.navMain.map((item) => ({
    ...item,
    // @ts-ignore
    title: t(item.title),
    items: item.items?.map((subItem) => ({
      ...subItem,
      // @ts-ignore
      title: t(subItem.title),
      isActive: pathname.includes(subItem.url),
    })),
    isActive: pathname.includes(item.url),
  }));

  console.log(
    pathname,
    mainNavItems
  );

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="space-y-2">
        <div className="flex items-center space-x-2">
          <div className='rounded-lg border border-border bg-background p-1'>
            <GradualLogo className="size-6" />
          </div>
          <div className='group-data-[collapsible=icon]:hidden'>
            <span className="font-semibold text-foreground">{t('sidebar.brand.title')}</span>
            <div className='text-muted-foreground text-xs'>{t('sidebar.brand.subtitle')}</div>
          </div>
        </div>
        <SidebarGroup className='p-0'>
          <div className="relative w-full" id={TOUR_STEP_IDS.COMMAND_MENU}>
            <CommandMenu
              variant="default"
              className='group-data-[collapsible=icon]:variant-icon w-full'
            />
          </div>
        </SidebarGroup>
      </SidebarHeader>

      <SidebarContent className="space-y-4">
        <NavMain items={mainNavItems} label={t('breadcrumbs.navigation')} />
        <NavProjects
          tools={sidebarData.powerTools.map(tool => ({
            ...tool,
            // @ts-ignore
            title: t(tool.title),
            items: tool.items?.map(item => ({
              ...item,
              // @ts-ignore
              title: t(item.title),
            })),
          }))}
          projects={sidebarData.projects}
          recent={sidebarData.recentCourses}
        />
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
