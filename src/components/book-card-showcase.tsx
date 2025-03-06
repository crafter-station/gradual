'use client';

import { BookCard } from './book-card';

// Define the color type to match BookCard's color prop
type BookCardColor =
  | 'cyan'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'blue'
  | 'purple'
  | 'magenta'
  | 'amber'
  | 'lime'
  | 'emerald'
  | 'teal'
  | 'sky'
  | 'indigo'
  | 'violet'
  | 'fuchsia'
  | 'pink'
  | 'rose'
  | 'slate'
  | 'gray'
  | 'zinc'
  | 'neutral'
  | 'stone';

// Array of all available colors
const colors: BookCardColor[] = [
  'cyan',
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'magenta',
  'amber',
  'lime',
  'emerald',
  'teal',
  'sky',
  'indigo',
  'violet',
  'fuchsia',
  'pink',
  'rose',
  'slate',
  'gray',
  'zinc',
  'neutral',
  'stone',
];

// Sample book data
const bookData = [
  {
    title: 'The Art of Programming',
    author: 'Jane Smith',
    year: '2023',
    category: 'Technology',
    unitCount: 12,
  },
  {
    title: 'Design Patterns Explained',
    author: 'John Doe',
    year: '2022',
    category: 'Development',
    unitCount: 8,
  },
  {
    title: 'Machine Learning Fundamentals',
    author: 'Alex Johnson',
    year: '2023',
    category: 'AI',
    unitCount: 10,
  },
  {
    title: 'Web Development Mastery',
    author: 'Sarah Williams',
    year: '2021',
    category: 'Web',
    unitCount: 15,
  },
  {
    title: 'Data Structures & Algorithms',
    author: 'Michael Brown',
    year: '2022',
    category: 'Computer Science',
    unitCount: 9,
  },
];

export function BookCardShowcase() {
  return (
    <div className="container mx-auto py-12">
      <h1 className="mb-8 text-center font-bold text-3xl">
        BookCard Color Showcase
      </h1>

      <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {colors.map((color, index) => {
          // Cycle through the sample book data
          const bookInfo = bookData[index % bookData.length];
          console.log(bookInfo);

          return (
            <div key={color} className="mb-10 h-[280px] px-2">
              <div className="flex h-full flex-col items-center">
                <div className="block h-full w-full">
                  <BookCard
                    title={`${bookInfo.title}`}
                    author={bookInfo.author}
                    year={bookInfo.year}
                    category={bookInfo.category}
                    color={color}
                    unitCount={bookInfo.unitCount}
                  />
                </div>
                <span className="mt-2 text-center font-medium text-sm">
                  {color}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
