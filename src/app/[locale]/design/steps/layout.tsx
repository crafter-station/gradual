import { StepTypes } from '@/db/schema';
import { StepButton } from './step-button';

export const revalidate = 3600;

export default function StepsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="space-y-8">
      <div className="container mx-auto flex flex-wrap gap-x-6 gap-y-2">
        {StepTypes.map((x) => (
          <StepButton key={x} type={x} />
        ))}
      </div>
      <div className="mx-auto grid max-w-lg grid-cols-1 gap-16">{children}</div>
    </div>
  );
}
