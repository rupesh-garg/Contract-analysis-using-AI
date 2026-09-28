import FileUpload from "@/components/FileUpload";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center p-8 sm:p-24 selection:bg-primary selection:text-black">
      <header className="w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex mb-24">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-muted bg-background/50 backdrop-blur-md pb-6 pt-8 text-muted-foreground lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-muted/50 lg:p-4">
          <span className="text-primary mr-2">STATUS:</span> OPERATIONAL
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-background via-background lg:static lg:h-auto lg:w-auto lg:bg-none">
          <span className="text-xs text-muted-foreground">V 1.0.0 // CREATOR_SHIELD</span>
        </div>
      </header>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 text-center">
        <div className="mb-8 inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-xs text-zinc-400 backdrop-blur-xl">
          <span className="mr-2 flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          AI-Powered Protection
        </div>

        <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl mb-6">
          Creator<span className="text-zinc-500">Shield</span>
        </h1>

        <p className="mt-2 text-lg leading-8 text-zinc-400 max-w-xl mb-12">
          Review contracts instantly with cynical AI analysis. <br />
          <span className="text-zinc-500 text-sm">Detect hidden risks before you sign.</span>
        </p>

        <FileUpload />
      </main>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-3 lg:text-left mt-24">
        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-border hover:bg-muted/20">
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Secure{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            End-to-end encrypted analysis. Your contracts never leave our secure enclave.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-border hover:bg-muted/20">
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Fast{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Instant PDF parsing and AI extraction powered by Gemini 1.5 Pro.
          </p>
        </div>

        <div className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-border hover:bg-muted/20">
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Intelligent{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            Advanced pattern recognition to identify predatory terms.
          </p>
        </div>
      </div>
    </div>
  );
}

