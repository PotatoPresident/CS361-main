"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Expense } from "@/types"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ExpenseTableProps {
    initialExpenses: Expense[]
}

export function ExpenseTable({ initialExpenses }: ExpenseTableProps) {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("all")

    // Filter expenses based on search query and category
    const filteredExpenses = initialExpenses.filter((expense) => {
        const matchesSearch = expense.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            expense.notes?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            expense.cost.toString().includes(searchQuery)

        const matchesCategory = selectedCategory === "all" || expense.category === selectedCategory

        return matchesSearch && matchesCategory
    })

    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                <Input
                    placeholder="Search expenses..."
                    className="max-w-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="food">Food</SelectItem>
                        <SelectItem value="transport">Transport</SelectItem>
                        <SelectItem value="utilities">Utilities</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead>Date</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {filteredExpenses.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={4} className="text-center">
                                No expenses found
                            </TableCell>
                        </TableRow>
                    ) : (
                        filteredExpenses.map((expense) => (
                            <TableRow
                                key={expense.id}
                                className="cursor-pointer hover:bg-muted/50"
                                onClick={() => router.push(`/dashboard/${expense.id}`)}
                            >
                                <TableCell>{expense.name}</TableCell>
                                <TableCell>{expense.category}</TableCell>
                                <TableCell>${expense.cost.toFixed(2)}</TableCell>
                                <TableCell>{expense.date}</TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}