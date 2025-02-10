import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, Target, Trophy } from 'lucide-react';

interface LessonCompleteCardProps {
  xp: number;
  time: number; // in miliseconds
  precision: number; // as a fraction
}
function formatTime(time: number) {
  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default function StatsCard({
  xp,
  time,
  precision,
}: LessonCompleteCardProps) {
  return (
    <Card className="mx-auto w-full max-w-md bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900">
      <CardHeader className="text-center">
        <CardTitle className="font-bold text-2xl text-green-600 dark:text-green-400">
          Lesson Complete!
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <span className="font-semibold text-xl">XP Earned</span>
          </div>
          <span className="font-bold text-2xl text-green-600 dark:text-green-400">
            {xp}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="h-8 w-8 text-blue-500" />
            <span className="font-semibold text-xl">Time</span>
          </div>
          <span className="font-bold text-2xl text-blue-600 dark:text-blue-400">
            {formatTime(time)}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-purple-500" />
              <span className="font-semibold text-xl">Precision</span>
            </div>
            <span className="font-bold text-2xl text-purple-600 dark:text-purple-400">
              {Math.round(precision * 100)}%
            </span>
          </div>
          <Progress
            value={precision * 100}
            className="h-3 bg-purple-200 dark:bg-purple-700"
          >
            <div
              className="h-full rounded-full bg-purple-500"
              style={{ width: `${precision}%` }}
            />
          </Progress>
        </div>
      </CardContent>
    </Card>
  );
}
