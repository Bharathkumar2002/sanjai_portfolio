export default function LoadingProject() {
  return (
    <div className="container-page animate-pulse pb-16 pt-28 sm:pt-36" aria-busy="true" aria-label="Loading project">
      <div className="h-4 w-28 rounded-full bg-ink-800" />
      <div className="mt-10 h-4 w-24 rounded-full bg-ink-800" />
      <div className="mt-4 h-20 w-3/4 rounded-3xl bg-ink-800 sm:h-28" />
      <div className="mt-12 h-16 w-full rounded-3xl bg-ink-900" />
      <div className="mt-10 aspect-[16/9] w-full rounded-4xl bg-ink-800" />
    </div>
  );
}
