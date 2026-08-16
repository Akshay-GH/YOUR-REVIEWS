"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Autoplay from "embla-carousel-autoplay";
import messages from "@/messages.json";
import { DM_Serif_Display, Space_Grotesk } from "next/font/google";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const headingFont = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
});

const bodyFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Home() {
  return (
    <>
      <main
        className={`${bodyFont.className} relative min-h-screen overflow-hidden text-slate-900`}
      >
        <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,#ff6b6b_0%,transparent_60%)] opacity-40 blur-3xl" />
        <div className="pointer-events-none absolute bottom-[-120px] right-[-80px] h-80 w-80 rounded-full bg-[radial-gradient(circle,#22c55e_0%,transparent_60%)] opacity-30 blur-3xl" />
        <div className="pointer-events-none absolute left-[-120px] top-1/3 h-64 w-64 rounded-full bg-[radial-gradient(circle,#6366f1_0%,transparent_60%)] opacity-25 blur-3xl" />

        <section className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pb-20 pt-16 md:flex-row md:items-center md:gap-16 md:px-8">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-600 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              Honest feedback, zero awkwardness
            </div>

            <h1
              className={`${headingFont.className} text-4xl leading-tight tracking-tight text-slate-900 md:text-6xl`}
            >
              Make anonymous feedback feel safe, elegant, and actually useful.
            </h1>
            <p className="max-w-xl text-base leading-relaxed text-slate-600 md:text-lg">
              Share a link, invite candid notes, and keep the tone positive with
              AI-powered conversation starters. Perfect for creators, teams, and
              community builders.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full px-6 text-base">
                <Link href="/sign-up">Start your inbox</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-slate-300 px-6 text-base"
              >
                <Link href="/sign-in">I already have an account</Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-4 text-sm text-slate-600 dark:text-slate-400 md:grid-cols-3">
              <div className="rounded-2xl border border-white/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/70 px-4 py-3 shadow-sm transition-colors duration-500">
                <p className="text-slate-900 dark:text-slate-100">Spam protection</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Accept or pause inboxes.</p>
              </div>
              <div className="rounded-2xl border border-white/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/70 px-4 py-3 shadow-sm transition-colors duration-500">
                <p className="text-slate-900 dark:text-slate-100">AI icebreakers</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Keep messages thoughtful.</p>
              </div>
              <div className="rounded-2xl border border-white/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-900/70 px-4 py-3 shadow-sm transition-colors duration-500">
                <p className="text-slate-900 dark:text-slate-100">Private by default</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Only you see the inbox.</p>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="rounded-3xl border border-white/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-950/80 p-6 shadow-xl backdrop-blur transition-colors duration-500">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                  Live community notes
                </p>
                <span className="rounded-full bg-amber-100 dark:bg-amber-900/30 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
                  New
                </span>
              </div>

              <Carousel
                plugins={[Autoplay({ delay: 2600 })]}
                className="mt-6"
              >
                <CarouselContent>
                  {messages.map((message, index) => (
                    <CarouselItem key={index} className="p-2">
                      <Card className="border-slate-200/60 dark:border-slate-800 bg-white/90 dark:bg-slate-900/50 shadow-md transition-colors duration-500">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base text-slate-900 dark:text-slate-100">
                            {message.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-start gap-3 text-sm text-slate-600 dark:text-slate-400">
                          <div className="flex items-start gap-3">
                            <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              <Mail className="h-4 w-4" />
                            </span>
                            <div>
                              <p className="text-slate-700 dark:text-slate-300">{message.content}</p>
                              <p className="text-xs text-slate-400 dark:text-slate-500">
                                {message.received}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-4 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800" />
                <CarouselNext className="-right-4 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800" />
              </Carousel>
            </div>
          </div>
        </section>
      </main>

      <footer className="text-center p-4 md:p-6 border-t border-white/60 dark:border-slate-800/60 bg-white/70 dark:bg-slate-950/70 text-slate-600 dark:text-slate-400 transition-colors duration-500">
        © 2026 MessageMint. All rights reserved.
      </footer>
    </>
  );
}
