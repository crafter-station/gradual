import { Button } from '@/components/ui/button';
import { ChevronRight, Sparkles, Target, Zap } from 'lucide-react';

interface StatsCardProps {
  xp: number;
  time: number;
  precision: number;
}

function formatTime(time: number) {
  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function StatsCard({ xp, time, precision }: StatsCardProps) {
  const isPerfect = precision === 1;
  const speedRating =
    time < 120000 ? 'Supersonic!' : time < 300000 ? 'Blazing!' : 'Steady!';
  const precisionRating =
    precision === 1 ? 'Flawless!' : precision > 0.9 ? 'Amazing!' : 'Great!';

  return (
    <div className="mx-auto w-full max-w-md animate-fade-up space-y-8">
      {/* Celebration Header */}
      <div className="relative flex flex-col items-center text-center">
        <div className="relative">
          {/* Pixel Art Cat */}
          <svg
            className="mb-4 h-32 w-32"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Cat</title>
            <g className="animate-bounce-slow">
              <rect
                x="24"
                y="16"
                width="16"
                height="16"
                className="fill-flexoki-purple"
              />
              <rect
                x="20"
                y="20"
                width="4"
                height="4"
                className="fill-flexoki-purple"
              />
              <rect
                x="40"
                y="20"
                width="4"
                height="4"
                className="fill-flexoki-purple"
              />
              <rect x="28" y="24" width="8" height="4" className="fill-white" />
              <rect x="28" y="20" width="2" height="2" className="fill-white" />
              <rect x="34" y="20" width="2" height="2" className="fill-white" />
            </g>

            {/* Celebration particles */}
            <g className="animate-pulse">
              <circle cx="18" cy="14" r="2" className="fill-flexoki-yellow" />
              <circle cx="46" cy="12" r="2" className="fill-flexoki-yellow" />
              <circle cx="32" cy="8" r="2" className="fill-flexoki-yellow" />
            </g>
          </svg>

          {/* Floating achievement badges */}
          <div className="-right-4 -top-4 absolute animate-float">
            <div className="rounded-full border border-flexoki-yellow/20 bg-flexoki-yellow/10 p-2">
              <Sparkles className="h-4 w-4 text-flexoki-yellow" />
            </div>
          </div>
        </div>

        <h1 className="mb-2 bg-gradient-to-r from-flexoki-yellow to-flexoki-purple bg-clip-text font-bold text-2xl text-transparent">
          {isPerfect ? '🎯 Perfect Score!' : '🌟 Lesson Complete!'}
        </h1>
        <p className="text-muted-foreground">
          {isPerfect
            ? "You're absolutely crushing it!"
            : "You're doing fantastic!"}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-4">
        {/* XP Card */}
        <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-b from-flexoki-yellow/5 to-transparent p-4 transition-all hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-r from-flexoki-yellow/0 via-flexoki-yellow/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="relative space-y-2">
            <div className="font-medium text-muted-foreground text-sm">
              EARNED XP
            </div>
            <div className="flex items-baseline gap-1.5">
              <Sparkles className="h-4 w-4 animate-pulse text-flexoki-yellow" />
              <span className="font-bold text-2xl text-flexoki-yellow">
                {xp}
              </span>
            </div>
          </div>
        </div>

        {/* Time Card */}
        <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-b from-flexoki-blue/5 to-transparent p-4 transition-all hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-r from-flexoki-blue/0 via-flexoki-blue/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="relative space-y-2">
            <div className="font-medium text-muted-foreground text-sm">
              {speedRating}
            </div>
            <div className="flex items-baseline gap-1.5">
              <Zap className="h-4 w-4 animate-pulse text-flexoki-blue" />
              <span className="font-bold text-2xl text-flexoki-blue">
                {formatTime(time)}
              </span>
            </div>
          </div>
        </div>

        {/* Precision Card */}
        <div className="group relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-b from-flexoki-green/5 to-transparent p-4 transition-all hover:scale-105">
          <div className="absolute inset-0 bg-gradient-to-r from-flexoki-green/0 via-flexoki-green/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          <div className="relative space-y-2">
            <div className="font-medium text-muted-foreground text-sm">
              {precisionRating}
            </div>
            <div className="flex items-baseline gap-1.5">
              <Target className="h-4 w-4 animate-pulse text-flexoki-green" />
              <span className="font-bold text-2xl text-flexoki-green">
                {Math.round(precision * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Continue Button */}
      <Button
        className="group relative w-full overflow-hidden bg-flexoki-blue text-white hover:bg-flexoki-blue/90"
        size="lg"
      >
        <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-500 group-hover:translate-x-[100%]" />
        Continue
        <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Button>
    </div>
  );
}
