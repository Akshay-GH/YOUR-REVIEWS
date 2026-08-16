'use client'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { verifySchema } from '@/schemas/verifySchema'
import { ApiResponse } from '@/types/apiResponse'
import { zodResolver } from '@hookform/resolvers/zod'
import axios, { AxiosError } from 'axios'
import { useParams, useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

const VerifyAccount = () => {
    const router = useRouter()
    const params = useParams<{username: string}>()
    
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: ''
        }
    })

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
            const response = await axios.post<ApiResponse>('/api/verify-code', { username: params.username, code: data.code })
            console.log(response.data.message);
            toast.success(response.data.message)
            router.replace('/sign-in')
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>
            const errorMessage = axiosError.response?.data.message || axiosError.message;
            toast.error(errorMessage)
        }
    }
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
                            Verify Your Account
                        </h1>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            Enter the verification code sent to your email
                        </p>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                name="code"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-900 dark:text-slate-200">Verification Code</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Code" className="rounded-xl border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/50 dark:text-slate-100" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button type='submit' className="w-full rounded-full bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200">
                                Submit
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default VerifyAccount