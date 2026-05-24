"use client";

import { Message } from "@/models/user";
import React, { useCallback, useEffect } from "react";
import { toast } from "sonner";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Loader2, RefreshCcw } from "lucide-react";
import { MessageCard } from "@/components/messageCard";

export default function Page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleDeleteMessage = (messageid?: string) => {
    setMessages(
      messages.filter((message) => message._id?.toString() !== messageid),
    );
  };

  const { data: session, status } = useSession();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });
  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const baseUrl =
    typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.host}`
      : "";
  const profileUrl = session?.user?.userName
    ? `${baseUrl}/u/${session.user.userName}`
    : "";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast("URL Copied!", {
      description: "Profile URL has been copied to clipboard.",
    });
  };

  const fetchAcceptingMessages = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get("/api/accept-message");
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ||
          "Error fetching accepting messages status",
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);
        if (refresh) {
          toast("Refresh Messages", {
            description: "Showing latest messages",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        const errorMessage = axiosError.response?.data.message;
        toast("Error", {
          description: "Failed to fetch messages",
        });
        console.log("Failed to fetch message settings", errorMessage);
      } finally {
        setLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setLoading, setMessages],
  );

  useEffect(() => {
    if (!session || !session.user) {
      return;
    }
    fetchMessages();
    fetchAcceptingMessages();
  }, [session, setValue, fetchAcceptingMessages, fetchMessages]);

  // handle switch change to accept messages
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-message", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast("Success", {
        description: response.data.message,
      });
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message;
      toast("Error", {
        description: "Failed to update Accepting Message status",
      });
      console.log("Failed updating Accepting Message status", errorMessage);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session || !session.user) {
    router.replace("/");
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(60%_80%_at_20%_10%,#ffe7b8_0%,#fff7ea_40%,#f7f2ff_70%,#eef2ff_100%)]">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,#ff6b6b_0%,transparent_60%)] opacity-30 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-120px] right-[-80px] h-80 w-80 rounded-full bg-[radial-gradient(circle,#22c55e_0%,transparent_60%)] opacity-20 blur-3xl" />

      <div className="relative mx-auto w-full max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Message Mint
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
              Dashboard
            </h1>
            <p className="text-sm text-slate-600">
              Manage your inbox, share your link, and keep the vibe positive.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-lg backdrop-blur">
              <h2 className="text-base font-semibold text-slate-900">
                Your shareable link
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Anyone with this link can send you an anonymous message.
              </p>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                <input
                  type="text"
                  value={profileUrl}
                  disabled
                  className="w-full rounded-full border border-slate-200 bg-white/90 px-4 py-2 text-sm text-slate-600 shadow-sm"
                />
                <Button
                  onClick={copyToClipboard}
                  className="rounded-full bg-slate-900 text-white hover:bg-slate-800"
                >
                  Copy link
                </Button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-lg backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    Accepting messages
                  </h2>
                  <p className="mt-1 text-xs text-slate-500">
                    Pause your inbox whenever you need a break.
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    acceptMessages
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {acceptMessages ? "On" : "Off"}
                </span>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <Switch
                  {...register("acceptMessages")}
                  checked={acceptMessages}
                  onCheckedChange={handleSwitchChange}
                  disabled={isSwitchLoading}
                />
                <span className="text-sm text-slate-600">
                  {acceptMessages
                    ? "You are currently accepting new messages."
                    : "Your inbox is paused."}
                </span>
              </div>
            </div>
          </div>

          <Separator className="bg-white/60" />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Inbox</h2>
              <p className="text-xs text-slate-500">
                {messages.length} message{messages.length === 1 ? "" : "s"}
              </p>
            </div>
            <Button
              variant="outline"
              className="rounded-full border-slate-200 bg-white/80"
              onClick={(e) => {
                e.preventDefault();
                fetchMessages(true);
              }}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCcw className="mr-2 h-4 w-4" />
              )}
              Refresh
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <MessageCard
                  key={msg._id?.toString() || index}
                  message={msg}
                  onMessageDelete={handleDeleteMessage}
                />
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-200 bg-white/70 p-8 text-center text-sm text-slate-500">
                No messages yet. Share your link to start collecting feedback.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
