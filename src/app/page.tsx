import TerminalOverlay from "@/components/TerminalOverlay";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen text-foreground overflow-hidden">
      <section className="relative z-10 py-24 flex-grow">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* MAIN CONTENT */}
            <div className="space-y-8 relative text-center flex flex-col items-center">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <div>
                  <span className="text-foreground">Master</span>
                </div>
                <div>
                  <span className="text-primary">BTech CS</span>
                </div>
                <div className="pt-2">
                  <span className="text-foreground">With AI-Powered</span>
                </div>
                <div className="pt-2">
                  <span className="text-foreground">Study</span>
                  <span className="text-primary"> Sessions</span>
                </div>
              </h1>

              {/* SEPERATOR LINE */}
              <div className="h-px w-full bg-gradient-to-r from-primary via-secondary to-primary opacity-50"></div>

              <p className="text-xl text-muted-foreground">
                Generate focused study sessions for DBMS, DSA, OS, Networks & OOP with AI-curated tasks, quizzes, and smart revision scheduling
              </p>

              {/* STATS */}
              <div className="flex items-center justify-center gap-10 py-6 font-mono">
                <div className="flex flex-col group cursor-default">
                  <div className="text-2xl text-primary group-hover:scale-110 transition-transform duration-200">5</div>
                  <div className="text-xs uppercase tracking-wider">TASK TYPES</div>
                </div>
                <div className="h-12 w-px bg-gradient-to-b from-transparent via-border to-transparent"></div>
                <div className="flex flex-col group cursor-default">
                  <div className="text-2xl text-primary group-hover:scale-110 transition-transform duration-200">AI</div>
                  <div className="text-xs uppercase tracking-wider">QUIZ GEN</div>
                </div>
                <div className="h-12 w-px bg-gradient-to-b from-transparent via-border to-transparent"></div>
                <div className="flex flex-col group cursor-default">
                  <div className="text-2xl text-primary group-hover:scale-110 transition-transform duration-200">AUTO</div>
                  <div className="text-xs uppercase tracking-wider">REVISIONS</div>
                </div>
              </div>

              {/* BUTTON */}
              <div className="pt-6">
                <Button
                  size="lg"
                  asChild
                  className="overflow-hidden bg-primary text-primary-foreground px-8 py-6 text-lg font-medium hover:scale-[1.02] transition-transform duration-200 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30"
                >
                  <Link href={"/generate-study"} className="flex items-center font-mono group">
                    Generate Study Session
                    <ArrowRightIcon className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>

              {/* FEATURES */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 pt-4 w-full max-w-2xl">
                <div className="flex flex-col items-center p-3 bg-card/50 backdrop-blur-sm border border-border rounded-lg">
                  <span className="text-2xl mb-1 text-white">▣</span>
                  <span className="text-xs text-muted-foreground">Read</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-card/50 backdrop-blur-sm border border-border rounded-lg">
                  <span className="text-2xl mb-1 text-white font-mono">▶︎</span>
                  <span className="text-xs text-muted-foreground">Watch</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-card/50 backdrop-blur-sm border border-border rounded-lg">
                  <span className="text-2xl mb-1 text-white">⟨⟩</span>
                  <span className="text-xs text-muted-foreground">Practice</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-card/50 backdrop-blur-sm border border-border rounded-lg">
                  <span className="text-2xl mb-1 text-white">◈</span>
                  <span className="text-xs text-muted-foreground">Recall</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-card/50 backdrop-blur-sm border border-border rounded-lg col-span-2 md:col-span-1">
                  <span className="text-2xl mb-1 text-white">◉</span>
                  <span className="text-xs text-muted-foreground">Interview</span>
                </div>
              </div>
            </div>

            {/* IMAGE SECTION */}
            <div className="relative">
              <div className="absolute -inset-4 pointer-events-none">
                <div className="absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 border-border" />
                <div className="absolute top-0 right-0 w-16 h-16 border-r-2 border-t-2 border-border" />
                <div className="absolute bottom-0 left-0 w-16 h-16 border-l-2 border-b-2 border-border" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 border-border" />
              </div>

              <div className="relative aspect-square max-w-lg mx-auto">
                <div className="relative overflow-hidden rounded-lg bg-cyber-black">
                  <img
                    src="/hero-ai.png"
                    alt="AI Study Assistant"
                    className="size-full object-cover object-center"
                  />

                  <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,transparent_calc(50%-1px),var(--cyber-glow-primary)_50%,transparent_calc(50%+1px),transparent_100%)] bg-[length:100%_8px] animate-scanline pointer-events-none" />

                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/3 left-1/3 w-1/3 h-1/3 border border-primary/40 rounded-full" />
                    <div className="absolute top-1/2 left-0 w-1/4 h-px bg-primary/50" />
                    <div className="absolute top-1/2 right-0 w-1/4 h-px bg-primary/50" />
                    <div className="absolute top-0 left-1/2 h-1/4 w-px bg-primary/50" />
                    <div className="absolute bottom-0 left-1/2 h-1/4 w-px bg-primary/50" />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                </div>

                <TerminalOverlay />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default HomePage;
