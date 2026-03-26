export default function HaberLoading() {
  return (
    <div className="mx-auto flex min-h-[50vh] max-w-6xl animate-pulse flex-col gap-6 px-6 py-12 sm:px-8 lg:px-10">
      <div className="h-10 w-3/4 rounded-lg bg-zinc-800" />
      <div className="h-4 w-full rounded bg-zinc-800" />
      <div className="h-4 w-5/6 rounded bg-zinc-800" />
      <div className="aspect-video w-full rounded-2xl bg-zinc-800" />
    </div>
  );
}
