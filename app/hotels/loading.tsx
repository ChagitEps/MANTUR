import { Header } from "@/components/Header";

export default function Loading() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <div className="mb-6 h-7 w-48 animate-pulse rounded bg-black/10" />
        <div className="flex flex-col gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-xl border border-border bg-black/5"
            />
          ))}
        </div>
      </main>
    </>
  );
}
