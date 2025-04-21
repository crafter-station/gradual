"use client";

import {
	Command,
	CommandDialog,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandSeparator,
} from "@/components/ui/command";
import { DialogContent } from "@/components/ui/dialog";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import {
	Search,
	Github,
	BookOpen,
	LineChart,
	MessageSquare,
	Mail,
	Calendar,
	FileCode,
	Video,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { sidebarData } from "./sidebar-data";
import { useI18n } from '@/locales/client';

interface CommandMenuProps {
	variant?: "default" | "icon";
	className?: string;
}

export const TOUR_STEP_IDS = {
	COMMAND_MENU: "command-menu",
} as const;

export function CommandMenu({
	variant = "default",
	className,
}: CommandMenuProps) {
	const [open, setOpen] = useState(false);
	const router = useRouter();
	const pathname = usePathname();
	const t = useI18n();

	React.useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
				e.preventDefault();
				setOpen((open) => !open);
			}
		};
		document.addEventListener("keydown", down);
		return () => document.removeEventListener("keydown", down);
	}, []);

	const integrations = [
		{ name: t('sidebar.integrations.items.github'), icon: Github, link: "/integrations/github" },
		{ name: t('sidebar.integrations.items.notion'), icon: BookOpen, link: "/integrations/notion" },
		{ name: t('sidebar.integrations.items.linear'), icon: LineChart, link: "/integrations/linear" },
		{ name: t('sidebar.integrations.items.discord'), icon: MessageSquare, link: "/integrations/discord" },
		{
			name: t('sidebar.integrations.items.slack'),
			icon: MessageSquare,
			link: "/integrations/slack",
			disabled: true,
			status: t('sidebar.integrations.soon'),
		},
		{
			name: t('sidebar.integrations.items.gmail'),
			icon: Mail,
			link: "/integrations/gmail",
			disabled: true,
			status: t('sidebar.integrations.soon'),
		},
		{
			name: t('sidebar.integrations.items.googleCalendar'),
			icon: Calendar,
			link: "/integrations/google-calendar",
			disabled: true,
			status: t('sidebar.integrations.soon'),
		},
		{
			name: t('sidebar.integrations.items.googleDocs'),
			icon: FileCode,
			link: "/integrations/google-docs",
			disabled: true,
			status: t('sidebar.integrations.soon'),
		},
		{
			name: t('sidebar.integrations.items.microsoftTeams'),
			icon: Video,
			link: "/integrations/microsoft-teams",
			disabled: true,
			status: t('sidebar.integrations.soon'),
		},
	];

	return (
		<>
			<SidebarMenuButton
				variant="outline"
				tooltip={t('sidebar.search.tooltip')}
				size="default"
				onClick={() => setOpen(true)}
				className={cn(
					'!h-9 relative flex w-full items-center justify-between border border-input px-2 text-muted-foreground text-sm transition-all',
					className,
				)}
			>
				<span className="inline-flex w-full items-center justify-between group-data-[collapsible=icon]:justify-center">
					<span className="flex items-center gap-2">
						<Search className="h-4 w-4" />
						<span className="group-data-[collapsible=icon]:hidden">
							{t('sidebar.search.placeholder')}
						</span>
					</span>
					<kbd className='pointer-events-none h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-medium font-mono text-[10px] text-foreground group-data-[collapsible=icon]:hidden sm:flex'>
						<span className="text-xs">⌘</span>K
					</kbd>
				</span>
			</SidebarMenuButton>

			<CommandDialog open={open} onOpenChange={setOpen}>
				<DialogContent
					className="!rounded-xl max-w-[640px] overflow-hidden border p-0 shadow-[0px_1px_1px_rgba(0,0,0,0.02),_0px_8px_16px_-4px_rgba(0,0,0,0.04),_0px_24px_32px_-8px_rgba(0,0,0,0.06)]"
					title="Command Menu"
				>
					<div className="relative flex flex-col overflow-hidden">
						<Command className="border-0">
							<CommandInput
								placeholder={t('sidebar.search.placeholder')}
								className="h-12 border-0 text-lg placeholder:text-muted-foreground/50 focus:ring-0"
							/>

							<CommandList className="min-h-[400px] overflow-y-auto">
								<CommandEmpty className="py-6 text-center text-muted-foreground text-sm">
									No results found.
								</CommandEmpty>

								{/* Main Navigation Sections */}
								{sidebarData.navMain.map((section) => (
									<React.Fragment key={section.title}>
										<CommandGroup
											// @ts-ignore
											heading={t(section.title)}
											className="px-2 py-1.5 font-medium text-muted-foreground text-sm [&_[cmdk-group-heading]]:py-2.5 [&_[cmdk-group-heading]]:font-normal [&_[cmdk-group-heading]]:text-[13px] [&_[cmdk-group-heading]]:text-muted-foreground/70"
										>
											{section.items?.map((item) => {
												const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`);
												return (
													<CommandItem
														key={item.url}
														onSelect={() => {
															router.push(item.url);
															setOpen(false);
														}}
														className={cn(
															"flex cursor-pointer items-center gap-3 px-2 py-2.5 aria-selected:bg-accent aria-selected:text-accent-foreground",
															isActive && "bg-accent/50 text-accent-foreground"
														)}
													>
														<item.icon className={cn("h-4 w-4", isActive ? "text-foreground" : "text-muted-foreground/70")} />
														{/* @ts-ignore */}
														<span className="font-medium">{t(item.title)}</span>
													</CommandItem>
												);
											})}
										</CommandGroup>
										<CommandSeparator />
									</React.Fragment>
								))}

								{/* Power Tools */}
								{sidebarData.powerTools.map((tool) => (
									<React.Fragment key={tool.title}>
										<CommandGroup
											// @ts-ignore
											heading={t(tool.title)}
											className="px-2 py-1.5 font-medium text-muted-foreground text-sm [&_[cmdk-group-heading]]:py-2.5 [&_[cmdk-group-heading]]:font-normal [&_[cmdk-group-heading]]:text-[13px] [&_[cmdk-group-heading]]:text-muted-foreground/70"
										>
											{tool.items?.map((item) => {
												const isActive = pathname === item.url || pathname.startsWith(`${item.url}/`);
												return (
													<CommandItem
														key={item.url}
														onSelect={() => {
															router.push(item.url);
															setOpen(false);
														}}
														className={cn(
															"flex cursor-pointer items-center gap-3 px-2 py-2.5 aria-selected:bg-accent aria-selected:text-accent-foreground",
															isActive && "bg-accent/50 text-accent-foreground"
														)}
													>
														<tool.icon className={cn("h-4 w-4", isActive ? "text-foreground" : "text-muted-foreground/70")} />
														{/* @ts-ignore */}
														<span className="font-medium">{t(item.title)}</span>
													</CommandItem>
												);
											})}
										</CommandGroup>
										<CommandSeparator />
									</React.Fragment>
								))}

								{/* Recent Courses */}
								<CommandGroup
									heading={t('courses.resumeLearning')}
									className="px-2 py-1.5 font-medium text-muted-foreground text-sm [&_[cmdk-group-heading]]:py-2.5 [&_[cmdk-group-heading]]:font-normal [&_[cmdk-group-heading]]:text-[13px] [&_[cmdk-group-heading]]:text-muted-foreground/70"
								>
									{sidebarData.recentCourses.map((course) => {
										const isActive = pathname === course.url || pathname.startsWith(`${course.url}/`);
										return (
											<CommandItem
												key={course.url}
												onSelect={() => {
													router.push(course.url);
													setOpen(false);
												}}
												className={cn(
													"flex cursor-pointer items-center gap-3 px-2 py-2.5 aria-selected:bg-accent aria-selected:text-accent-foreground",
													isActive && "bg-accent/50 text-accent-foreground"
												)}
											>
												<course.icon className={cn("h-4 w-4", isActive ? "text-foreground" : "text-muted-foreground/70")} />
												<span className="font-medium">{course.name}</span>
											</CommandItem>
										);
									})}
								</CommandGroup>

								<CommandSeparator />

								{/* Integrations */}
								<CommandGroup
									heading={t('sidebar.integrations.title')}
									className="px-2 py-1.5 font-medium text-muted-foreground text-sm [&_[cmdk-group-heading]]:py-2.5 [&_[cmdk-group-heading]]:font-normal [&_[cmdk-group-heading]]:text-[13px] [&_[cmdk-group-heading]]:text-muted-foreground/70"
								>
									{integrations.map((integration) => {
										const isActive = pathname === integration.link || pathname.startsWith(`${integration.link}/`);
										return (
											<CommandItem
												key={integration.name}
												onSelect={() => {
													if (!integration.disabled) {
														router.push(integration.link);
														setOpen(false);
													}
												}}
												disabled={integration.disabled}
												className={cn(
													"flex cursor-pointer items-center gap-3 px-2 py-2.5 aria-selected:bg-accent aria-selected:text-accent-foreground",
													isActive && "bg-accent/50 text-accent-foreground"
												)}
											>
												<integration.icon className={cn("h-4 w-4", isActive ? "text-foreground" : "text-muted-foreground/70")} />
												<span className="font-medium">{integration.name}</span>
												{integration.status && (
													<span className="ml-auto text-muted-foreground text-xs">
														{integration.status}
													</span>
												)}
											</CommandItem>
										);
									})}
								</CommandGroup>
							</CommandList>
						</Command>
					</div>
				</DialogContent>
			</CommandDialog>
		</>
	);
}
