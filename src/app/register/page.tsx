'use client'

import {useState} from 'react'
import {useRouter} from 'next/navigation'
import Link from 'next/link'

export default function RegisterPage() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name, email, password}),
            })

            if (res.ok) {
                router.push('/login')
            } else {
                const data = await res.json()
                setError(data.message || 'Something went wrong')
            }
        } catch (err) {
            setError('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 bg-card p-8 rounded-xl border border-border shadow-2xl">
                <div>
                    <h2 className="text-center text-3xl font-black tracking-tighter text-white uppercase">
                        PROMPT<span className="text-primary">VAULT</span> REGISTRY
                    </h2>
                    <p className="mt-2 text-center text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        New Account Provisioning
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div
                            className="rounded-md bg-red-950/50 border border-red-900 p-4 text-sm text-red-400 font-bold">
                            {error}
                        </div>
                    )}
                    <div className="space-y-4">
                        <div>
                            <label
                                className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
                                Full Name / Designation
                            </label>
                            <input
                                type="text"
                                required
                                className="block w-full rounded-lg bg-slate-900 border border-border py-2.5 px-3 text-white placeholder:text-slate-600 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label
                                className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
                                Corporate Email
                            </label>
                            <input
                                type="email"
                                required
                                className="block w-full rounded-lg bg-slate-900 border border-border py-2.5 px-3 text-white placeholder:text-slate-600 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="name@corporate.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label
                                className="block text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1.5 ml-1">
                                Secure Authorization Key
                            </label>
                            <input
                                type="password"
                                required
                                className="block w-full rounded-lg bg-slate-900 border border-border py-2.5 px-3 text-white placeholder:text-slate-600 focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative flex w-full justify-center rounded-lg bg-primary px-3 py-3 text-sm font-black text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 transition-all uppercase tracking-widest shadow-lg shadow-blue-500/20"
                        >
                            {loading ? 'PROVISIONING...' : 'Register'}
                        </button>
                    </div>
                </form>
                <div className="text-center pt-4 border-t border-border">
                    <Link href="/login"
                          className="text-xs font-black text-primary hover:text-white uppercase tracking-widest transition-colors">
                        Already Registered? Authenticate
                    </Link>
                </div>
            </div>
        </div>
    )
}
