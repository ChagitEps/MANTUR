import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col">
        <section className="mx-auto w-full max-w-4xl px-4 py-12 sm:py-20">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
              לאן בא לכם לברוח?
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-base text-foreground/60 sm:text-lg">
              תגידו תקציב ותאריך — נמצא לכם לאן הכי שווה, בארץ או בעולם.
            </p>
          </div>
          <SearchBar />
        </section>
      </main>
    </>
  );
}
