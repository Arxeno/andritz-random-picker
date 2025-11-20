"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Search, User, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";

interface Participant {
  _id: Id<"participants">;
  fullName: string;
  department: string;
}

export default function RegisteredUserPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  // Query participants
  const allParticipants = useQuery(api.participants.listParticipants);
  const searchResults = useQuery(api.participants.searchParticipants, {
    searchTerm,
  });

  const participants = searchTerm ? searchResults : allParticipants;

  // Split participants into rows of 20
  const chunkParticipants = (arr: typeof participants, size: number) => {
    if (!arr) return [];
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const participantRows = chunkParticipants(participants, 10);

  return (
    <div className="min-h-screen bg-accent bg-gradient-to-b from-[#103457] via-[#1A558A] to-[#103457]">
      <div className="w-full mx-auto pt-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8 text-[#EBCC6F] max-w-7xl mx-auto">
          <Button variant="ghost" onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Menu
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Registered Participants</h1>
            <p className="text-[#DCB96E] mt-1">
              View all registered participants for the event
            </p>
          </div>
        </div>

        {/* Search and Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-7xl mx-auto">
          {/* Search */}
          <Card className="md:col-span-2 bg-linear-to-r from-0% from-[#DCB96E] via-80% via-[#CD974E] to-[#DCB96E] border-[#B06727]">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#B06727]" />
                <Input
                  placeholder="Search by name or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-[#DCB96E] placeholder:text-[#B06727]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Total Count */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Total Participants
                  </p>
                  <p className="text-3xl font-bold">
                    {allParticipants?.length || 0}
                  </p>
                </div>
                <Users className="h-12 w-12 text-primary/20" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Participants Grid */}
        {participants === undefined ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading participants...</p>
          </div>
        ) : participants.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm ? "No participants found" : "No participants yet"}
              </h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "Participants will appear here once they register"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="mb-4 text-sm text-[#DCB96E] text-center">
              Showing {participants.length} participant
              {participants.length !== 1 ? "s" : ""} in {participantRows.length}{" "}
              row{participantRows.length !== 1 ? "s" : ""}
            </div>

            {/* Seamless Scrolling Carousel - Multiple Rows */}
            <div className="space-y-4">
              <style jsx>{`
                @keyframes scroll-left {
                  0% {
                    transform: translateX(0);
                  }
                  100% {
                    transform: translateX(-50%);
                  }
                }
                @keyframes scroll-right {
                  0% {
                    transform: translateX(-50%);
                  }
                  100% {
                    transform: translateX(0);
                  }
                }
                .animate-scroll-left {
                  animation: scroll-left 30s linear infinite;
                }
                .animate-scroll-right {
                  animation: scroll-right 30s linear infinite;
                }
                .animate-scroll-left:hover,
                .animate-scroll-right:hover {
                  animation-play-state: paused;
                }
              `}</style>

              {participantRows.map((row, rowIndex) => (
                <div key={rowIndex} className="relative overflow-hidden">
                  <div
                    className={`flex ${
                      rowIndex % 2 === 0
                        ? "animate-scroll-left"
                        : "animate-scroll-right"
                    }`}
                  >
                    {/* First set */}
                    {row.map((participant) => (
                      <div key={participant._id} className="shrink-0 w-80 px-2">
                        <Card className="hover:shadow-lg transition-shadow duration-200 border-2 hover:border-primary/20">
                          <CardHeader className="pb-3">
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#DCB96E] to-[#CD974E] flex items-center justify-center shrink-0">
                                <User className="h-6 w-6 text-[#B06727]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-lg truncate">
                                  {participant.fullName}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground truncate mt-1">
                                  {participant.department}
                                </p>
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                      </div>
                    ))}

                    {/* Duplicate set for seamless loop */}
                    {row.map((participant) => (
                      <div
                        key={`duplicate-${participant._id}`}
                        className="shrink-0 w-80 px-2"
                      >
                        <Card className="hover:shadow-lg transition-shadow duration-200 border-2 hover:border-primary/20">
                          <CardHeader className="pb-3">
                            <div className="flex items-start gap-3">
                              <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#DCB96E] to-[#CD974E] flex items-center justify-center shrink-0">
                                <User className="h-6 w-6 text-[#B06727]" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-lg truncate">
                                  {participant.fullName}
                                </CardTitle>
                                <p className="text-sm text-muted-foreground truncate mt-1">
                                  {participant.department}
                                </p>
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
