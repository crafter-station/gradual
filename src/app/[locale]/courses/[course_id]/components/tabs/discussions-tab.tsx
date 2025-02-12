import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { User } from '@/db/types';
import type { TFunction } from '@/locales/types';
import { HeartIcon, MessageSquareIcon } from 'lucide-react';

interface Discussion {
  id: string;
  author: User;
  content: string;
  createdAt: Date;
  likesCount: number;
  repliesCount: number;
  replies?: Discussion[];
}

interface DiscussionPostProps {
  discussion: Discussion;
  t: TFunction;
}

interface DiscussionsTabProps {
  t: TFunction;
}

export function DiscussionsTab() {
  return (
    <Card>
      <CardContent className="p-6">
        <NewDiscussion />
        <div className="mt-6 space-y-6">
          {[1, 2, 3].map((i) => (
            <DiscussionPost key={i} index={i} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function NewDiscussion() {
  return (
    <div className="flex gap-4">
      <Avatar>
        <AvatarImage src="/avatars/01.png" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <textarea
          className="w-full resize-none rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          placeholder="Start a discussion..."
          rows={3}
        />
        <div className="mt-2 flex justify-end">
          <Button>Post</Button>
        </div>
      </div>
    </div>
  );
}

function DiscussionPost({ index }: { index: number }) {
  return (
    <div className="flex gap-4">
      <Avatar>
        <AvatarImage src={`/avatars/0${index}.png`} />
        <AvatarFallback>U{index}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="font-medium">John Doe</span>
          <span className="text-muted-foreground text-xs">2 hours ago</span>
        </div>
        <p className="mt-1 text-muted-foreground text-sm">
          Can someone explain the difference between INNER JOIN and LEFT JOIN in
          more detail?
        </p>
        <div className="mt-2 flex items-center gap-4">
          <Button variant="ghost" size="sm">
            <MessageSquareIcon className="mr-2 h-4 w-4" />
            Reply
          </Button>
          <Button variant="ghost" size="sm">
            <HeartIcon className="mr-2 h-4 w-4" />
            Like
          </Button>
        </div>
      </div>
    </div>
  );
}
