"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { ApiResponse } from "@/types/apiResponse";

const messageSchema = z.object({
  content: z
    .string()
    .min(10, { message: "Message must be at least 10 characters" })
    .max(300, { message: "Message must be no longer than 300 characters" }),
});

type MessageFormData = z.infer<typeof messageSchema>;

export default function PublicProfilePage() {
  const { username } = useParams<{ username: string }>();

  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [isSuggestLoading, setIsSuggestLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);

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
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch suggestions");
      }

      const text = await response.text();
      const questions = text
        .split("||")
        .map((q) => q.trim())
        .filter(Boolean);
      setSuggestedMessages(questions);
    } catch (error) {
      console.error(error);
      toast("Error", { description: "Failed to suggest messages" });
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
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(60%_80%_at_20%_10%,#ffe7b8_0%,#fff7ea_40%,#f7f2ff_70%,#eef2ff_100%)]">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,#ff6b6b_0%,transparent_60%)] opacity-30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-120px] right-[-80px] h-80 w-80 rounded-full bg-[radial-gradient(circle,#22c55e_0%,transparent_60%)] opacity-20 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Message Mint
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Send a thoughtful note to @{decodeURIComponent(username)}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Messages are anonymous. Keep it kind and constructive.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
          <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur">
            <h2 className="text-base font-semibold text-slate-900">
              Write your message
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Aim for at least 10 characters. Max 300.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
              <textarea
                {...register("content")}
                placeholder="Share something thoughtful..."
                className="min-h-[140px] w-full resize-none rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 text-sm text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              />
              {errors.content && (
                <p className="text-sm text-rose-500">
                  {errors.content.message}
                </p>
              )}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-xs text-slate-500">
                  Your message will be sent instantly.
                </span>
                <Button
                  type="submit"
                  disabled={isSending}
                  className="rounded-full bg-slate-900 text-white hover:bg-slate-800"
                >
                  {isSending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Send message
                </Button>
              </div>
            </form>
          </div>

          <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-xl backdrop-blur">
            <h2 className="text-base font-semibold text-slate-900">
              Need inspiration?
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Tap for AI-written starters. Click one to autofill.
            </p>
            <Button
              onClick={handleSuggestMessages}
              disabled={isSuggestLoading}
              variant="outline"
              className="mt-4 w-full rounded-full border-slate-200 bg-white/80"
            >
              {isSuggestLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Suggest messages
            </Button>

            {suggestedMessages.length > 0 && (
              <Card className="mt-6 border-slate-200/70 bg-white/80 shadow-sm">
                <CardHeader>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Suggestions
                  </h3>
                </CardHeader>
                <CardContent className="space-y-2">
                  {suggestedMessages.map((msg, index) => (
                    <button
                      key={index}
                      onClick={() => handleMessageClick(msg)}
                      className="w-full rounded-2xl border border-slate-200 bg-white/90 px-3 py-3 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50"
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
