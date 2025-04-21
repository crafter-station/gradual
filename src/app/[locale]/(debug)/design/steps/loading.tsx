export default function StepsLoading() {
  return (
    <>
      {new Array(10)
        .fill(null)
        .map((_, i) => i)
        .map((i) => (
          <div
            className="h-48 w-full animate-pulse rounded-lg bg-muted"
            key={`loading-${i}`}
          />
        ))}
    </>
  );
}
