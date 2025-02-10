"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { getExpense, deleteExpense } from "@/app/actions" // Update path as needed
import type { Expense } from "@/types"

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
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {Pencil, Trash2} from "lucide-react";

export default function ExpensePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const router = useRouter()
    const [expense, setExpense] = useState<Expense | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        const loadExpense = async () => {
            try {
                const data = await getExpense(resolvedParams.id)
                setExpense(data)
            } catch (error) {
                console.error("Failed to load expense:", error)
                // You might want to show an error message to the user here
            } finally {
                setIsLoading(false)
            }
        }

        loadExpense()
    }, [resolvedParams.id])

    const handleDelete = async () => {
        if (!expense) return

        setIsDeleting(true)
        try {
            await deleteExpense(expense.id)
            router.push("/dashboard")
            router.refresh() // Refresh the page to show updated data
        } catch (error) {
            console.error("Failed to delete expense:", error)
            // You might want to show an error message to the user here
        } finally {
            setIsDeleting(false)
        }
    }

    if (isLoading) {
        return (
            <div className="container mx-auto p-4">
                <Card className="mx-auto max-w-2xl">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-center">Loading...</div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!expense) {
        return (
            <div className="container mx-auto p-4">
                <Card className="mx-auto max-w-2xl">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-center">Expense not found</div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-4">
            <Card className="mx-auto max-w-2xl">
                <CardHeader>
                    <CardTitle>View Expense</CardTitle>
                    <CardDescription>View or edit the details of your expense.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-medium">Name</h3>
                            <p className="text-muted-foreground">{expense.name}</p>
                        </div>
                        <div>
                            <h3 className="font-medium">Category</h3>
                            <p className="text-muted-foreground">{expense.category}</p>
                        </div>
                        <div>
                            <h3 className="font-medium">Cost</h3>
                            <p className="text-muted-foreground">${expense.cost.toFixed(2)}</p>
                        </div>
                        <div>
                            <h3 className="font-medium">Date</h3>
                            <p className="text-muted-foreground">{expense.date}</p>
                        </div>
                        <div>
                            <h3 className="font-medium">Notes</h3>
                            <p className="text-muted-foreground">{expense.notes || 'No notes'}</p>
                        </div>
                        <div className="flex justify-end space-x-4">
                            <Button variant="outline" onClick={() => router.back()}>
                                Back
                            </Button>
                            <Button onClick={() => router.push(`/dashboard/${resolvedParams.id}/edit`)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" disabled={isDeleting}>
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        {isDeleting ? "Deleting..." : "Delete"}
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Expense</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to delete this expense? This action cannot be undone.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            className="bg-destructive text-destructive-foreground"
                                            onClick={handleDelete}
                                            disabled={isDeleting}
                                        >
                                            {isDeleting ? "Deleting..." : "Delete"}
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
