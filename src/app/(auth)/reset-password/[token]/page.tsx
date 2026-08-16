"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { resetPasswordSchema } from "@/schemas/resetPasswordSchema";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";

function page() {
  const { token } = useParams<{ token: string }>();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetError, setResetError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    if (!token) {
      const message = "Reset link is invalid or expired";
      setResetError(message);
      toast("Error", { description: message });
      return;
    }

    setIsSubmitting(true);
    setResetError(null);
    try {
      const response = await axios.post<ApiResponse>("/api/reset-password", {
        token,
        password: data.password,
      });
      toast("Success", { description: response.data.message });
      router.replace("/sign-in");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      const message =
        axiosError.response?.data.message || "Unable to reset password";
      setResetError(message);
      toast("Error", { description: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(60%_80%_at_20%_10%,#ffe7b8_0%,#fff7ea_40%,#f7f2ff_70%,#eef2ff_100%)] dark:bg-[radial-gradient(60%_80%_at_20%_10%,#1e1b4b_0%,#0f172a_40%,#020617_70%,#000000_100%)] transition-colors duration-500">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,#ff6b6b_0%,transparent_60%)] dark:bg-[radial-gradient(circle,#818cf8_0%,transparent_60%)] opacity-35 dark:opacity-20 blur-3xl transition-opacity duration-500" />
      <div className="pointer-events-none absolute bottom-[-120px] right-[-80px] h-80 w-80 rounded-full bg-[radial-gradient(circle,#22c55e_0%,transparent_60%)] dark:bg-[radial-gradient(circle,#34d399_0%,transparent_60%)] opacity-25 dark:opacity-10 blur-3xl transition-opacity duration-500" />
      <div className="relative mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-4 py-12">
        <div className="w-full max-w-md space-y-8 rounded-3xl border border-white/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-950/80 p-8 shadow-xl backdrop-blur transition-colors duration-500">
          <div className="text-center">
            <span className="inline-flex items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-400">
              MessageMint
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              Set a new password
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Choose a strong password you will remember.
            </p>
          </div>

          {resetError && (
            <div className="rounded-2xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/30 px-4 py-3 text-sm text-rose-700 dark:text-rose-400">
              {resetError}. Request a new link from{" "}
              <Link href="/forgot-password" className="font-semibold dark:text-rose-300">
                forgot password
              </Link>
              .
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-900 dark:text-slate-200">New password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="New password"
                        className="rounded-xl border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/50 dark:text-slate-100"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="confirmPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-900 dark:text-slate-200">Confirm password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Confirm password"
                        className="rounded-xl border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/50 dark:text-slate-100"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating
                  </>
                ) : (
                  "Update password"
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm text-slate-600 dark:text-slate-400">
            <p>
              Back to{" "}
              <Link href="/sign-in" className="font-semibold text-slate-900 dark:text-slate-200">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
