interface TaskContainerProps {
  currentStep: number;
  totalSteps: number;
  children: React.ReactNode;
}

export const TaskContainer = ({
  currentStep,
  totalSteps,
  children,
}: TaskContainerProps) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background/95">
      {/* Progress indicator */}
      <div className="fixed top-0 right-0 left-0 h-1.5 bg-muted/30">
        <div
          className="h-full bg-primary/60 transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Step counter */}
      <div className="fixed top-6 right-6 flex items-center gap-1.5 rounded-full border bg-background/60 px-3 py-1.5 font-medium text-sm shadow-sm backdrop-blur-sm">
        <span className="text-foreground/70 tabular-nums">{currentStep}</span>
        <span className="text-muted-foreground/30">/</span>
        <span className="text-muted-foreground/50 tabular-nums">
          {totalSteps}
        </span>
      </div>

      {/* Main content */}
      <main className="w-full max-w-3xl px-4 py-12">
        <div className="fade-in slide-in-from-bottom-8 animate-in fill-mode-both duration-700">
          {children}
        </div>
      </main>

      {/* Background elements */}
      <div className="-z-10 fixed inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background" />
        <div className="absolute inset-0 bg-[size:32px] bg-grid-white/[0.02]" />
      </div>
    </div>
  );
};
