'use client';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface BlurNumberProps {
  value: string;
  blurStrength?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function BlurNumber({
  value,
  blurStrength = 'md',
  className,
}: BlurNumberProps) {
  const [isHovered, setIsHovered] = useState(false);

  const blurClass = {
    sm: 'blur-[2px]',
    md: 'blur-[3px]',
    lg: 'blur-[4px]',
  }[blurStrength];

  return (
    <span
      className={cn(
        'transition-all duration-500',
        !isHovered && blurClass,
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {value}
    </span>
  );
}
