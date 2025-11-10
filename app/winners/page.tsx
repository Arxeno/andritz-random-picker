"use client";

import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { WinnerTable } from "@/components/winner-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Trophy, Download, Disc3 } from "lucide-react";
import { api } from "@/convex/_generated/api";

export default function WinnersPage() {
  const router = useRouter();
  const winners = useQuery(api.winners.listWinners);

  // Loading state
  if (winners === undefined) {
    return (
      <>
        <Header />
        <main className="container p-8 mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Menu
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Winner History</h1>
              <p className="text-muted-foreground">Loading winners...</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  // Empty state
  if (winners.length === 0) {
    return (
      <>
        <Header />
        <main className="container p-8 mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Menu
            </Button>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Winner History</h1>
              <p className="text-muted-foreground flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                No winners yet
              </p>
            </div>

            <Card className="max-w-2xl mx-auto">
              <CardContent className="py-12">
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <Disc3 className="h-24 w-24 text-muted-foreground/50" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold">No winners yet</h2>
                    <p className="text-muted-foreground">
                      Start spinning to select your first winner!
                    </p>
                  </div>
                  <Button size="lg" onClick={() => router.push("/spin")}>
                    <Disc3 className="h-5 w-5 mr-2" />
                    Go to Spin Wheel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </>
    );
  }

  // Winners exist - show table
  return (
    <>
      <Header />
      <main className="container p-8 mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Menu
          </Button>

          <Button variant="outline" onClick={() => router.push("/export")}>
            <Download className="h-4 w-4 mr-2" />
            Export to Excel
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Winner History</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              {winners.length} winner{winners.length !== 1 ? "s" : ""}
            </p>
          </div>

          <WinnerTable winners={winners} />
        </div>
      </main>
    </>
  );
}
