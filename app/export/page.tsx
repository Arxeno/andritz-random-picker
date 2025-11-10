"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Download, Disc3, FileSpreadsheet } from "lucide-react";
import { api } from "@/convex/_generated/api";
import * as XLSX from "xlsx";
import { toast } from "sonner";

/**
 * Format timestamp to date string
 * Example: "Nov 5, 2025"
 */
function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(timestamp));
}

/**
 * Format timestamp to time string
 * Example: "2:45 PM"
 */
function formatTime(timestamp: number): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(timestamp));
}

/**
 * Get current date in YYYY-MM-DD format for filename
 */
function getCurrentDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function ExportPage() {
  const router = useRouter();
  const winners = useQuery(api.winners.listWinners);
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    if (!winners || winners.length === 0) return;

    setIsExporting(true);

    try {
      // Prepare data - sort oldest first for chronological story
      const sortedWinners = [...winners].sort(
        (a, b) => a._creationTime - b._creationTime,
      );

      const data = sortedWinners.map((winner) => ({
        "Winner Name": winner.participantName,
        Department: winner.participantDepartment,
        Prize: winner.prizeName || "No prize assigned",
        "Date Won": formatDate(winner._creationTime),
        "Time Won": formatTime(winner._creationTime),
      }));

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(data);

      // Auto-size columns
      const colWidths = [
        { wch: 20 }, // Winner Name
        { wch: 20 }, // Department
        { wch: 30 }, // Prize
        { wch: 15 }, // Date Won
        { wch: 10 }, // Time Won
      ];
      ws["!cols"] = colWidths;

      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Winners");

      // Generate filename with current date
      const filename = `doorprize-winners-${getCurrentDateString()}.xlsx`;

      // Download file
      XLSX.writeFile(wb, filename);

      // Show success message
      toast.success("Export successful! 🎉", {
        description: `Downloaded ${winners.length} winner${
          winners.length !== 1 ? "s" : ""
        } to ${filename}`,
      });
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Export failed", {
        description: "Please try again.",
      });
    } finally {
      setIsExporting(false);
    }
  };

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
              <h1 className="text-3xl font-bold mb-2">Export Data</h1>
              <p className="text-muted-foreground">Loading...</p>
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
              <h1 className="text-3xl font-bold mb-2">Export Data</h1>
            </div>

            <Card className="max-w-2xl mx-auto">
              <CardContent className="py-12">
                <div className="text-center space-y-6">
                  <div className="flex justify-center">
                    <FileSpreadsheet className="h-24 w-24 text-muted-foreground/50" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-semibold">
                      No winners to export yet
                    </h2>
                    <p className="text-muted-foreground">
                      Spin the wheel to select winners first.
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

  // Winners exist - show export interface
  const filename = `doorprize-winners-${getCurrentDateString()}.xlsx`;

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
            <h1 className="text-3xl font-bold mb-2">Export Data</h1>
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-12">
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <FileSpreadsheet className="h-24 w-24 text-primary" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">Export Winner List</h2>
                  <p className="text-muted-foreground">
                    Download all {winners.length} winner
                    {winners.length !== 1 ? "s" : ""} as an Excel spreadsheet to
                    share with family.
                  </p>
                </div>

                <Button size="lg" onClick={handleExport} disabled={isExporting}>
                  <Download className="h-5 w-5 mr-2" />
                  {isExporting
                    ? "Exporting..."
                    : `Export ${winners.length} Winner${
                        winners.length !== 1 ? "s" : ""
                      } to Excel`}
                </Button>

                <div className="text-sm text-muted-foreground space-y-1">
                  <p>File: {filename}</p>
                  <p className="flex items-center justify-center gap-2">
                    ℹ️ The file will download to your Downloads folder.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
