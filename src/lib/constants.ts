import {
  AtomIcon,
  BinaryIcon,
  BotIcon,
  BrainIcon,
  CodeIcon,
  CpuIcon,
  DatabaseIcon,
  MicroscopeIcon,
  PuzzleIcon,
  RocketIcon,
} from 'lucide-react';

// Light mode (600 values)
export const bookStylesLight = [
  { icon: RocketIcon, color: '#AF3029', textColor: '#FFFCF0' }, // Red
  { icon: BrainIcon, color: '#66800B', textColor: '#FFFCF0' }, // Green
  { icon: DatabaseIcon, color: '#205EA6', textColor: '#FFFCF0' }, // Blue

  { icon: CodeIcon, color: '#24837B', textColor: '#FFFCF0' }, // Cyan
  { icon: BinaryIcon, color: '#BC5215', textColor: '#FFFCF0' }, // Orange
  { icon: CpuIcon, color: '#5E409D', textColor: '#FFFCF0' }, // Purple

  { icon: AtomIcon, color: '#AD8301', textColor: '#100F0F' }, // Yellow
  { icon: MicroscopeIcon, color: '#24837B', textColor: '#FFFCF0' }, // Cyan
  { icon: BotIcon, color: '#A02F6F', textColor: '#FFFCF0' }, // Magenta

  { icon: PuzzleIcon, color: '#66800B', textColor: '#FFFCF0' }, // Green
];

// Dark mode (400 values)
export const bookStylesDark = [
  { icon: RocketIcon, color: '#D14D41', textColor: '#100F0F' }, // Red
  { icon: BrainIcon, color: '#879A39', textColor: '#100F0F' }, // Green
  { icon: DatabaseIcon, color: '#4385BE', textColor: '#100F0F' }, // Blue

  { icon: CodeIcon, color: '#3AA99F', textColor: '#100F0F' }, // Cyan
  { icon: BinaryIcon, color: '#DA702C', textColor: '#100F0F' }, // Orange
  { icon: CpuIcon, color: '#8B7EC8', textColor: '#100F0F' }, // Purple

  { icon: AtomIcon, color: '#D0A215', textColor: '#100F0F' }, // Yellow
  { icon: MicroscopeIcon, color: '#3AA99F', textColor: '#100F0F' }, // Cyan
  { icon: BotIcon, color: '#CE5D97', textColor: '#100F0F' }, // Magenta

  { icon: PuzzleIcon, color: '#879A39', textColor: '#100F0F' }, // Green
];

export const LOADING_MESSAGES = [
  'Analyzing your PDF content...',
  'Extracting key concepts...',
  'Generating course structure...',
  'Creating interactive sections...',
  'Crafting engaging questions...',
  'Polishing learning materials...',
  'Almost there...',
];

export const CHUNK_SIZE = 2048;
export const AI_GENERATION_BATCH_SIZE = 40;
export const AI_GENERATION_DELAY = 5000;

export const EMAIL_SENDER = 'Gradual <no-reply@send.crafter-station.com>';
