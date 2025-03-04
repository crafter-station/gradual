'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useI18n } from '@/locales/client';
import {
  BookmarkIcon,
  PlusIcon,
  SearchIcon,
  SlidersHorizontalIcon,
} from 'lucide-react';
import { useState } from 'react';

interface FilterOption {
  value: 'all' | 'bookmarked' | 'mastered' | 'learning' | string;
  label: string;
}

interface FlashcardProps {
  card: Flashcard;
}

interface Flashcard {
  id: string;
  topic: string;
  question: string;
  answer: string;
  isBookmarked: boolean;
  status?: 'mastered' | 'learning' | 'new';
}

export function FlashcardsTab() {
  const t = useI18n();
  const [isFiltering, setIsFiltering] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filters: FilterOption[] = [
    { value: 'all', label: t('course.flashcards.filters.all') },
    { value: 'bookmarked', label: t('course.flashcards.filters.bookmarked') },
    { value: 'mastered', label: t('course.flashcards.filters.mastered') },
    { value: 'learning', label: t('course.flashcards.filters.learning') },
  ];

  return (
    <div className="grid gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="font-semibold text-xl">
            {t('course.flashcards.title')}
          </h2>
          <p className="text-muted-foreground/80 text-sm">
            {t('course.flashcards.description')}
          </p>
        </div>
        <Button className="gap-2 bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90">
          <PlusIcon className="h-4 w-4" />
          {t('course.flashcards.create')}
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="relative space-y-2">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <SearchIcon className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('course.notes.search')}
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsFiltering(!isFiltering)}
            className={`h-10 w-10 transition-colors duration-200 ${
              isFiltering
                ? 'border-primary/50 bg-primary/10 text-primary'
                : 'border-muted-foreground/20'
            }`}
          >
            <SlidersHorizontalIcon className="h-4 w-4" />
          </Button>
        </div>

        {/* Filter Options with subtle slide animation */}
        <div
          className={`overflow-hidden transition-all duration-200 ease-out ${
            isFiltering ? 'h-10 opacity-100' : 'h-0 opacity-0'
          }`}
        >
          <div className="flex gap-2">
            {filters.map((filter) => (
              <Button
                key={filter.value}
                variant="outline"
                size="sm"
                onClick={() => setActiveFilter(filter.value)}
                className={`transition-colors ${
                  activeFilter === filter.value
                    ? 'border-primary/50 bg-primary/10 text-primary'
                    : 'bg-background/50 hover:bg-muted/50'
                }`}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Flashcards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <FlashCard
            key={i}
            card={{
              id: i.toString(),
              topic: 'SQL Basics',
              question: 'What is a primary key in a database?',
              answer:
                'A primary key is a column or set of columns in a database table that uniquely identifies each row.',
              isBookmarked: false,
            }}
          />
        ))}
      </div>
    </div>
  );
}

function FlashCard({ card }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(card.isBookmarked);
  const t = useI18n();

  return (
    <div className="group h-[250px] [perspective:1000px]">
      <div
        className={`relative h-full w-full transition-transform duration-500 [transform-style:preserve-3d] ${
          isFlipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* Front of card */}
        <Card className="absolute inset-0 border bg-card [backface-visibility:hidden]">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-muted/50">
                {card.topic}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsBookmarked(!isBookmarked);
                }}
              >
                <BookmarkIcon
                  className={`h-4 w-4 transition-colors duration-300 ${
                    isBookmarked
                      ? 'fill-primary text-primary'
                      : 'text-muted-foreground/50'
                  }`}
                />
              </Button>
            </div>
            <div className="flex min-h-[100px] items-center justify-center">
              <p className="text-center font-medium">{card.question}</p>
            </div>
            <Button
              variant="outline"
              className="w-full hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
              onClick={() => setIsFlipped(true)}
            >
              {t('course.flashcards.showAnswer')}
            </Button>
          </CardContent>
        </Card>

        {/* Back of card */}
        <Card className="absolute inset-0 border bg-muted/30 [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="bg-muted/50">
                {card.topic}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsBookmarked(!isBookmarked);
                }}
              >
                <BookmarkIcon
                  className={`h-4 w-4 transition-colors duration-300 ${
                    isBookmarked
                      ? 'fill-primary text-primary'
                      : 'text-muted-foreground/50'
                  }`}
                />
              </Button>
            </div>
            <div className="flex min-h-[100px] items-center justify-center">
              <p className="text-center text-muted-foreground">{card.answer}</p>
            </div>
            <Button
              variant="outline"
              className="w-full bg-muted/50 hover:bg-muted/70"
              onClick={() => setIsFlipped(false)}
            >
              {t('course.flashcards.hideAnswer')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
