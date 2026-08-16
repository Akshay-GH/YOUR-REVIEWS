"use client";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signInSchema } from "@/schemas/signInSchema";
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
import { signIn } from "next-auth/react";
function page() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: { identifier: "", password: "" },
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });
    if (result?.error) {
      toast.error("Login Failed", {
        description: "Incorrect Username or password",
      });
    }
    if (result?.url) {
      toast.success("Success", {
        description: "Login Successfully",
      });
      router.replace("/dashboard");
    }
    setIsSubmitting(false);
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
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Sign in to see what people are saying.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="dark:text-slate-200">Email or Username</FormLabel>
                    <FormControl>
                      <Input className="dark:bg-slate-900/50 dark:border-slate-800 dark:text-slate-100" placeholder="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="dark:text-slate-200">Password</FormLabel>
                      <Link
                        href="/forgot-password"
                        className="text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input
                        className="dark:bg-slate-900/50 dark:border-slate-800 dark:text-slate-100"
                        placeholder="password"
                        {...field}
                        type="password"
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
                    {" "}
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                    wait{" "}
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>
          </Form>
          <div className="text-center text-sm text-slate-600 dark:text-slate-400">
            <p>
              Don't have an account?{" "}
              <Link href="/sign-up" className="font-semibold text-slate-900 dark:text-slate-100">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
