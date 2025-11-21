"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Gift, Image as ImageIcon } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface Winner {
  _id: Id<"winners">;
  participantName: string;
  prizeName?: string;
  prizeImageStorageId?: Id<"_storage">;
  _creationTime: number;
}

interface WinnerTableProps {
  winners: Winner[];
}

/**
 * Format timestamp to readable date/time string
 * Example: "Nov 5, 2025 at 2:45 PM"
 */
function formatTimestamp(timestamp: number): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(timestamp));
}

export function WinnerTable({ winners }: WinnerTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Filter winners based on search term
  const filteredWinners = useMemo(() => {
    if (!searchTerm.trim()) return winners;

    const lowerSearch = searchTerm.toLowerCase();
    return winners.filter(
      (winner) =>
        winner.participantName.toLowerCase().includes(lowerSearch) ||
        (winner.prizeName &&
          winner.prizeName.toLowerCase().includes(lowerSearch)),
    );
  }, [winners, searchTerm]);

  return (
    <div className="space-y-4">
      {/* Search box */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, department, or prize..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {searchTerm.trim() ? (
            <>
              Showing {filteredWinners.length} of {winners.length} winner
              {winners.length !== 1 ? "s" : ""}
            </>
          ) : (
            <>
              {winners.length} winner{winners.length !== 1 ? "s" : ""}
            </>
          )}
        </div>
      </div>

      {/* Read-only notice */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          ℹ️ Winner records cannot be modified (immutable audit trail)
        </p>
      </div>

      {/* Winner table */}
      {filteredWinners.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">Winner Name</TableHead>
                    <TableHead className="w-[200px]">Department</TableHead>
                    <TableHead className="w-[250px]">Prize</TableHead>
                    <TableHead className="w-[200px]">Date/Time Won</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWinners.map((winner) => (
                    <TableRow key={winner._id}>
                      <TableCell className="font-medium">
                        {winner.participantName}
                      </TableCell>
                      <TableCell>
                        {winner.prizeName ? (
                          <div className="flex items-center gap-2">
                            {winner.prizeImageStorageId ? (
                              <PrizeImage
                                storageId={winner.prizeImageStorageId}
                              />
                            ) : (
                              <div className="w-8 h-8 bg-muted rounded flex items-center justify-center shrink-0">
                                <Gift className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                            <span className="text-sm">{winner.prizeName}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            No prize assigned
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatTimestamp(winner._creationTime)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center text-muted-foreground">
              <p className="text-lg">No results found</p>
              <p className="text-sm mt-2">Try adjusting your search criteria</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Component to display prize image from Convex storage
function PrizeImage({ storageId }: { storageId: Id<"_storage"> }) {
  const imageUrl = useQuery(api.files.getUrl, { storageId });

  if (!imageUrl) {
    return <div className="w-8 h-8 bg-muted rounded animate-pulse shrink-0" />;
  }

  return (
    <img
      src={imageUrl}
      alt="Prize"
      className="w-8 h-8 object-cover rounded border shrink-0"
    />
  );
}
