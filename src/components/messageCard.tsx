"use client";

import React, { useState } from "react";
import axios, { AxiosError } from "axios";
import dayjs from "dayjs";
import { X } from "lucide-react";
import { Message } from "@/models/user";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { ApiResponse } from "@/types/apiResponse";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

export function MessageCard({ message, onMessageDelete }: MessageCardProps) {
  const [isThreatRevealed, setIsThreatRevealed] = useState(false);
  const isFiltered = message.status === "filtered";
  const isThreat = message.flagReason === "THREAT";

  const handleDeleteConfirm = async () => {
    try {
      const response = await axios.delete<ApiResponse>(
        `/api/delete-message/${message._id}`,
      );
      toast(response.data.message);
      onMessageDelete(message._id.toString());
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast("Error", {
        description:
          axiosError.response?.data.message ?? "Failed to delete message",
      });
    }
  };

  return (
    <Card className="border-slate-200/70 dark:border-slate-800/60 bg-white/85 dark:bg-slate-900/80 shadow-sm backdrop-blur transition-colors duration-500">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-base text-slate-900 dark:text-slate-100">
              Anonymous note
            </CardTitle>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {dayjs(message.createdAt).format("MMM D, YYYY h:mm A")}
            </p>
            {isFiltered ? (
              <p className="mt-2 w-fit rounded-full bg-amber-100 dark:bg-amber-900/30 px-3 py-1 text-xs font-semibold text-amber-700 dark:text-amber-400">
                Filtered: {message.flagReason}
              </p>
            ) : null}
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                className="h-9 w-9 rounded-full border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="dark:bg-slate-900 dark:border-slate-800 transition-colors duration-500">
              <AlertDialogHeader>
                <AlertDialogTitle className="dark:text-slate-100">Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="dark:text-slate-400">
                  This action cannot be undone. This will permanently delete
                  this message.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-700">Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteConfirm} className="dark:bg-rose-900 dark:text-rose-100 dark:hover:bg-rose-800">
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent className="pt-0 text-sm text-slate-700 dark:text-slate-300">
        {isThreat && !isThreatRevealed ? (
          <div className="space-y-3 rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 p-4 text-rose-800 dark:text-rose-400 transition-colors duration-500">
            <p className="text-sm font-medium">
              View flagged content — may include threatening language.
            </p>
            <Button
              variant="outline"
              className="border-rose-200 dark:border-rose-800 bg-white dark:bg-slate-900 text-rose-700 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/50"
              onClick={() => setIsThreatRevealed(true)}
            >
              View flagged content
            </Button>
          </div>
        ) : (
          message.content
        )}
      </CardContent>
    </Card>
  );
}
