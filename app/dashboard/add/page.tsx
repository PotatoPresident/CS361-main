"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { addExpense } from "@/app/actions" // Update the import path according to your file structure

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

export default function AddExpensePage() {
    const router = useRouter()
    const [expense, setExpense] = useState({
        name: "",
        category: "",
        cost: "",
        date: "",
        notes: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            await addExpense({
                name: expense.name,
                category: expense.category,
                cost: Number.parseFloat(expense.cost),
                date: expense.date,
                notes: expense.notes
            })

            router.push("/dashboard")
            router.refresh() // Refresh the page to show the new data
        } catch (error) {
            console.error("Failed to add expense:", error)
            // You might want to show an error message to the user here
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

    return (
        <div className="container mx-auto p-4">
            <Card className="mx-auto max-w-2xl">
                <CardHeader>
                    <CardTitle>Add New Expense</CardTitle>
                    <CardDescription>Enter the details of your new expense.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" placeholder="Expense name" onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select onValueChange={handleSelectChange} required>
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
                            <Input id="cost" type="number" placeholder="0.00" onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="date">Date</Label>
                            <Input id="date" type="date" onChange={handleChange} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes">Additional Notes</Label>
                            <Textarea id="notes" placeholder="Add any additional notes here..." onChange={handleChange} />
                        </div>
                        <div className="flex justify-end space-x-4">
                            <Button variant="outline" onClick={() => router.back()} type="button">
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Adding..." : "Add Expense"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}