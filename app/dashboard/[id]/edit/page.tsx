"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import { getExpense, updateExpense } from "@/app/actions"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function EditExpensePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params)
    const router = useRouter()
    const [expense, setExpense] = useState({
        name: "",
        category: "",
        cost: "",
        date: "",
        notes: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadExpense = async () => {
            try {
                const data = await getExpense(resolvedParams.id)
                if (data) {
                    setExpense({
                        name: data.name,
                        category: data.category,
                        cost: data.cost.toString(),
                        date: data.date,
                        notes: data.notes || "",
                    })
                }
            } catch (error) {
                console.error("Failed to load expense:", error)
            } finally {
                setIsLoading(false)
            }
        }

        loadExpense()
    }, [resolvedParams.id])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            await updateExpense(resolvedParams.id, {
                name: expense.name,
                category: expense.category,
                cost: Number.parseFloat(expense.cost),
                date: expense.date,
                notes: expense.notes
            })

            router.push("/dashboard")
            router.refresh()
        } catch (error) {
            console.error("Failed to update expense:", error)
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setExpense({ ...expense, [e.target.id]: e.target.value })
    }

    const handleSelectChange = (value: string) => {
        setExpense({ ...expense, category: value })
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

    return (
        <div className="container mx-auto p-4">
            <Card className="mx-auto max-w-2xl">
                <CardHeader>
                    <CardTitle>Edit Expense</CardTitle>
                    <CardDescription>Update the details of your expense.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="Expense name"
                                onChange={handleChange}
                                value={expense.name}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select
                                onValueChange={handleSelectChange}
                                value={expense.category}
                                required
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="food">Food</SelectItem>
                                    <SelectItem value="transport">Transport</SelectItem>
                                    <SelectItem value="utilities">Utilities</SelectItem>
                                    <SelectItem value="entertainment">Entertainment</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cost">Cost</Label>
                            <Input
                                id="cost"
                                type="number"
                                placeholder="0.00"
                                onChange={handleChange}
                                value={expense.cost}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input
                                id="date"
                                type="date"
                                onChange={handleChange}
                                value={expense.date}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes">Additional Notes</Label>
                            <Textarea
                                id="notes"
                                placeholder="Add any additional notes here..."
                                onChange={handleChange}
                                value={expense.notes}
                            />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <Button variant="outline" onClick={() => router.back()} type="button">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Updating..." : "Update Expense"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}