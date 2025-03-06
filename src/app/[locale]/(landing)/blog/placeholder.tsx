

interface BlogImagePlaceholderProps {
  title: string;
  className?: string;
}

export function BlogImagePlaceholder({
  title,
  className = '',
}: BlogImagePlaceholderProps) {
  // Generate a deterministic color based on the title
  const hash = title.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  const hue = Math.abs(hash % 360);
  const saturation = 70;
  const lightness = 60;

  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br ${className}`}
      style={{
        background: `linear-gradient(135deg, hsl(${hue}, ${saturation}%, ${lightness}%), hsl(${(hue + 40) % 360}, ${saturation}%, ${lightness - 10}%))`,
      }}
    >
      <div className='max-w-[80%] p-4 text-center font-bold text-white'>
        {title}
      </div>
    </div>
  );
}
