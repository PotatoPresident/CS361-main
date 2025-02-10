"use server"

import { promises as fs } from "fs"
import { revalidatePath } from "next/cache"
import path from "path"
import { getServerSession } from "next-auth/next"

import type { Expense } from "@/types"
import { authOptions } from "./api/auth/[...nextauth]/route"

async function getUserExpensesFile(userId: string) {
    const filePath = path.join(process.cwd(), "data", `${userId}-expenses.json`)
    try {
        const data = await fs.readFile(filePath, "utf8")
        return JSON.parse(data)
    } catch (error) {
        // If the file doesn't exist, return an empty expense list
        return { expenses: [] }
    }
}

async function saveUserExpensesFile(userId: string, expenses: Expense[]) {
    const filePath = path.join(process.cwd(), "data", `${userId}-expenses.json`)
    await fs.writeFile(filePath, JSON.stringify({ expenses }, null, 2))
    revalidatePath("/dashboard")
}

export async function getExpenses() {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) throw new Error("User not authenticated")

    const data = await getUserExpensesFile(session.user.email)
    return data.expenses
}

export async function addExpense(expense: Omit<Expense, "id">) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) throw new Error("User not authenticated")

    const data = await getUserExpensesFile(session.user.email)
    const newExpense = {
        ...expense,
        id: Date.now().toString(),
    }
    data.expenses.push(newExpense)
    await saveUserExpensesFile(session.user.email, data.expenses)
    return newExpense
}

export async function updateExpense(id: string, expense: Omit<Expense, "id">) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) throw new Error("User not authenticated")

    const data = await getUserExpensesFile(session.user.email)
    const index = data.expenses.findIndex((e: Expense) => e.id === id)
    if (index !== -1) {
        data.expenses[index] = { ...expense, id }
        await saveUserExpensesFile(session.user.email, data.expenses)
        return data.expenses[index]
    }
    return null
}

export async function deleteExpense(id: string) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) throw new Error("User not authenticated")

    const data = await getUserExpensesFile(session.user.email)
    data.expenses = data.expenses.filter((e: Expense) => e.id !== id)
    await saveUserExpensesFile(session.user.email, data.expenses)
}

export async function getExpense(id: string) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) throw new Error("User not authenticated")

    const data = await getUserExpensesFile(session.user.email)
    return data.expenses.find((e: Expense) => e.id === id)
}
