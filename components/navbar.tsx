"use client"

import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"

import { Button } from "@/components/ui/button"

export function Navbar() {
    const { data: session, status } = useSession()

    return (
        <nav className="border-b">
            <div className="flex h-16 items-center px-4">
                <div className="flex items-center space-x-4">
                    <Link href="/" className="text-xl font-bold">
                        Easy Expense Tracker
                    </Link>
                    <Link href="/dashboard">
                        <Button variant="ghost">Dashboard</Button>
                    </Link>
                </div>
                <div className="ml-auto">
                    {status === "loading" ? (
                        <Button variant="ghost" disabled>
                            Loading...
                        </Button>
                    ) : session ? (
                        <Button variant="outline" onClick={() => signOut()}>
                            Sign Out
                        </Button>
                    ) : (
                        <Button onClick={() => signIn("google")}>Sign in with Google</Button>
                    )}
                </div>
            </div>
        </nav>
    )
}

