export default function SlugLoading() {
  return (
    <div className="animate-pulse space-y-8">
      <div className="h-12 w-3/4 max-w-2xl rounded-xl bg-zinc-800" />
      <div className="h-6 w-full max-w-xl rounded-lg bg-zinc-800/80" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 rounded-2xl bg-zinc-800/60" />
        ))}
      </div>
      <div className="h-64 rounded-2xl bg-zinc-800/40" />
      <div className="h-32 rounded-2xl bg-zinc-800/40" />
    </div>
  );
}
