import FileUpload from "@/components/FileUpload";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-5 py-12">

      <div className="w-full max-w-2xl">

        <div className="mb-10">
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            Understand what you are signing.
          </h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-400">
            Upload a contract and CreatorShield will identify potentially
            risky clauses and explain them in simpler language.
          </p>
        </div>

        <FileUpload />

      </div>

    </main>
  );
}