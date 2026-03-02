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
        userName: username,
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
    <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      <h1 className="text-4xl font-bold text-center mb-6">
        send an anonymous message to @{username}
      </h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">
            Write Your Anonymous Message
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <textarea
            {...register("content")}
            placeholder="Write your anonymous message here"
            className="w-full p-3 border rounded-md min-h-[100px] resize-none focus:outline-none focus:ring-2 focus:ring-gray-300"
          />
          {errors.content && (
            <p className="text-red-500 text-sm">{errors.content.message}</p>
          )}
          <div className="flex justify-center">
            <Button type="submit" disabled={isSending}>
              {isSending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Send It
            </Button>
          </div>
        </form>
      </div>

      <Separator className="my-6" />

      <div className="mb-4">
        <Button onClick={handleSuggestMessages} disabled={isSuggestLoading}>
          {isSuggestLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : null}
          Suggest Messages
        </Button>
        <p className="text-sm text-muted-foreground mt-2">
          Click on any message below to select it.
        </p>
      </div>

      {suggestedMessages.length > 0 && (
        <Card>
          <CardHeader>
            <h3 className="text-xl font-bold">Messages</h3>
          </CardHeader>
          <CardContent className="space-y-2">
            {suggestedMessages.map((msg, index) => (
              <button
                key={index}
                onClick={() => handleMessageClick(msg)}
                className="w-full text-left p-3 border rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
              >
                {msg}
              </button>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
