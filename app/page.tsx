import {Navbar} from "@/components/navbar";
import {Button} from "@/components/ui/button";

export default function Home() {
  return (
      <div className="min-h-screen">
        <main className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center space-y-8 text-center">
            <h1 className="text-4xl font-bold sm:text-6xl">Easy Expense Tracker</h1>
            <p className="max-w-[600px] text-lg text-muted-foreground">
                Track your expenses, achieve your goals — effortlessly.
                Sign in with Google to keep your data secure.
            </p>
            <Button size="lg" asChild>
              <a href="/dashboard">Get Started</a>
            </Button>
          </div>
        </main>
      </div>
  )
}
