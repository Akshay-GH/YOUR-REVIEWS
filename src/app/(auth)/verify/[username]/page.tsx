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
        <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(60%_80%_at_20%_10%,#ffe7b8_0%,#fff7ea_40%,#f7f2ff_70%,#eef2ff_100%)]">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,#ff6b6b_0%,transparent_60%)] opacity-35 blur-3xl" />
            <div className="pointer-events-none absolute bottom-[-120px] right-[-80px] h-80 w-80 rounded-full bg-[radial-gradient(circle,#22c55e_0%,transparent_60%)] opacity-25 blur-3xl" />
            <div className="relative mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-4 py-12">
                <div className="w-full max-w-md space-y-8 rounded-3xl border border-white/60 bg-white/80 p-8 shadow-xl backdrop-blur">
                    <div className="text-center">
                        <span className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/70 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-slate-600">
                            MessageMint
                        </span>
                        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
                            Verify Your Account
                        </h1>
                        <p className="mt-2 text-sm text-slate-600">
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
                                        <FormLabel className="text-slate-900">Verification Code</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Code" className="rounded-xl border-slate-200 bg-white/90" {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button type='submit' className="w-full rounded-full bg-slate-900 text-white hover:bg-slate-800">
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