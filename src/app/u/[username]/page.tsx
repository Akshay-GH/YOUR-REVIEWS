"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { ApiResponse } from "@/types/apiResponse";
import { messageSchema } from "@/schemas/messageSchema";

type MessageFormData = z.infer<typeof messageSchema>;

export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();

  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [purpose, setPurpose] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: { content: "" },
  });

  useEffect(() => {
    const fetchPurpose = async () => {
      try {
        const response = await axios.get<ApiResponse>(
          `/api/message-purpose?userName=${encodeURIComponent(
            decodeURIComponent(username),
          )}`,
        );
        setPurpose(response.data.purpose || "");
      } catch (error) {
        console.error("Failed to fetch message purpose", error);
      }
    };

    fetchPurpose();
  }, [username]);

  // Send anonymous message
  const onSubmit = async (data: MessageFormData) => {
    setIsSending(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-messages", {
        userName: decodeURIComponent(username),
        content: data.content,
      });
      toast("Success", { description: response.data.message });
      reset();
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast("Error", {
        description:
          axiosError.response?.data.message || "Failed to send message",
      });
    } finally {
      setIsSending(false);
    }
  };

  // Fetch AI suggested messages
  const handleSuggestMessages = async () => {
    setIsSuggestLoading(true);
    setSuggestedMessages([]);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ purpose }),
      });

      if (!response.ok) {
        let errorMessage = "Failed to fetch suggestions";
        try {
          const errorData = await response.json();
          if (errorData.error) {
            if (errorData.resetTimeMs) {
              const time = new Date(errorData.resetTimeMs).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
              errorMessage = `Too many requests, cannot suggest messages till ${time}`;
            } else {
              errorMessage = errorData.error;
            }
          }
        } catch (_) {}
        throw new Error(errorMessage);
      }

      const text = await response.text();
      const questions = text
        .split("||")
        .map((q) => q.trim())
        .filter(Boolean);
      setSuggestedMessages(questions);
    } catch (error: any) {
      console.error(error);
      toast("Error", { description: error.message || "Failed to suggest messages" });
    } finally {
      setIsSuggestLoading(false);
    }
  };

  // Click on suggested message → copy to textarea
  const handleMessageClick = (message: string) => {
    setValue("content", message, { shouldValidate: true });
    toast("Message copied to textarea!");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(60%_80%_at_20%_10%,#ffe7b8_0%,#fff7ea_40%,#f7f2ff_70%,#eef2ff_100%)] dark:bg-[radial-gradient(60%_80%_at_20%_10%,#1e1b4b_0%,#0f172a_40%,#020617_70%,#000000_100%)] transition-colors duration-500">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,#ff6b6b_0%,transparent_60%)] dark:bg-[radial-gradient(circle,#818cf8_0%,transparent_60%)] opacity-30 dark:opacity-20 blur-3xl transition-opacity duration-500" />
      <div className="pointer-events-none absolute bottom-[-120px] right-[-80px] h-80 w-80 rounded-full bg-[radial-gradient(circle,#22c55e_0%,transparent_60%)] dark:bg-[radial-gradient(circle,#34d399_0%,transparent_60%)] opacity-20 dark:opacity-10 blur-3xl transition-opacity duration-500" />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            MessageMint
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
            Send a thoughtful note to @{decodeURIComponent(username)}
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Messages are anonymous. Keep it kind and constructive.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="rounded-3xl border border-white/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-950/80 p-6 shadow-xl backdrop-blur transition-colors duration-500">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
             {purpose.toUpperCase()}
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Aim for at least 10 characters. Max 500.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
              <textarea
                {...register("content")}
                placeholder="Share something thoughtful..."
                className="min-h-[140px] w-full resize-none rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/50 px-4 py-3 text-sm text-slate-700 dark:text-slate-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300 dark:focus:ring-slate-700 transition-colors duration-500"
              />
              {errors.content && (
                <p className="text-sm text-rose-500 dark:text-rose-400">
                  {errors.content.message}
                </p>
              )}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Your message will be sent instantly.
                </span>
                <Button
                  type="submit"
                  disabled={isSending}
                  className="rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200"
                >
                  {isSending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Send message
                </Button>
              </div>
            </form>
          </div>

          <div className="rounded-3xl border border-white/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-950/80 p-6 shadow-xl backdrop-blur transition-colors duration-500">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Need inspiration?
            </h2>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Tap for AI-written starters. Click one to autofill.
            </p>
            <Button
              onClick={handleSuggestMessages}
              disabled={isSuggestLoading}
              variant="outline"
              className="mt-4 w-full rounded-full border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 dark:text-slate-100"
            >
              {isSuggestLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Suggest messages
            </Button>

            {suggestedMessages.length > 0 && (
              <Card className="mt-6 border-slate-200/70 dark:border-slate-800 bg-white/80 dark:bg-slate-900/50 shadow-sm transition-colors duration-500">
                <CardHeader>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Suggestions
                  </h3>
                </CardHeader>
                <CardContent className="space-y-2">
                  {suggestedMessages.map((msg, index) => (
                    <button
                      key={index}
                      onClick={() => handleMessageClick(msg)}
                      className="w-full rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/50 px-3 py-3 text-left text-sm text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      {msg}
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
