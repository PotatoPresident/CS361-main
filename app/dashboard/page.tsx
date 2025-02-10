import { Plus } from "lucide-react"
import Link from "next/link"
import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"

import { getExpenses } from "@/app/actions"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { Button } from "@/components/ui/button"
import { ExpenseTable } from "./expense-table"

export default async function DashboardPage() {
    const session = await getServerSession(authOptions)
    if (!session) {
        redirect("/api/auth/signin")
    }

    const expenses = await getExpenses()

    return (
        <div className="min-h-screen">
            <div className="container mx-auto p-4">
                <div className="mb-8 flex items-center justify-between">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold">Expenses</h1>
                        <p className="text-muted-foreground">
                            Manage and track your expenses here, {session.user?.name}.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/dashboard/add">
                            <Plus className="mr-2 h-4 w-4" />
                            Add Expense
                        </Link>
                    </Button>
                </div>

                <ExpenseTable initialExpenses={expenses} />
            </div>
        </div>
    )
}