import { Button, buttonVariants } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { getScopedI18n } from "@/locales/server";
import { currentUser } from "@clerk/nextjs/server";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUpIcon,
  PaperclipIcon,
  BrainIcon,
  SearchIcon
} from "lucide-react";

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
}

export default async function HomePage() {
  const t = await getScopedI18n('home');
  const user = await currentUser();
  const time = getTimeOfDay();

  const greeting = t('greeting', {
    time: ` ${time}`,
    name: user?.firstName || 'anon'
  });

  return (
    <div
      data-pagefind-ignore
      className="relative flex h-[calc(100dvh-4rem)] items-center justify-center md:h-dvh"
    >
      <div className="mx-auto w-full max-w-2xl px-6">
        <div className="relative flex h-full w-full flex-col">
          <h1 className="mb-2 text-center font-medium text-4xl leading-none tracking-tighter">
            {greeting}
          </h1>
          <p className="mb-8 text-center text-2xl text-muted-foreground">
            {t("subtitle")}
          </p>
          <div className="relative rounded-lg border bg-background shadow-sm">
            <Textarea
              placeholder={t("placeholder")}
              className="min-h-[100px] resize-none border-0 pb-14 text-lg shadow-none focus-visible:ring-0"
              autoFocus
            />
            <div className='absolute bottom-2 left-2 flex items-center gap-2'>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <PaperclipIcon className="h-4 w-4" />
              </Button>
              <Toggle size="sm" className="gap-2">
                <SearchIcon className="h-4 w-4" />
                {t("deepSearch")}
              </Toggle>
              <Toggle size="sm" className="gap-2">
                <BrainIcon className="h-4 w-4" />
                {t("think")}
              </Toggle>
            </div>

            <div className="absolute right-2 bottom-2 flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Grok 3
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    GPT-4
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Claude 3
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Grok 3
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button size="icon" className="h-8 w-8">
                <ArrowUpIcon className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!user && (
            <div className="mt-6 flex justify-end">
              <a
                href="/sign-in"
                className={cn(buttonVariants({ variant: "secondary" }))}
              >
                {t("signIn")}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
