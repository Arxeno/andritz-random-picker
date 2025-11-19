"use client";

import { useState, useCallback, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import Fireworks from "react-canvas-confetti/dist/presets/fireworks";
import { toast } from "sonner";

import { Header } from "@/components/header";
import { Wheel } from "@/components/wheel";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  ArrowLeft,
  Sparkles,
  RotateCcw,
  CheckCircle,
  Trophy,
  Home,
  AlertTriangle,
  Gift,
} from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import useSound from "use-sound";

interface Participant {
  _id: Id<"participants">;
  fullName: string;
  department: string;
}

interface Prize {
  _id: Id<"prizes">;
  name: string;
  imageStorageId?: Id<"_storage">;
  status: "available" | "won";
}

interface GroupedPrize {
  name: string;
  imageStorageId?: Id<"_storage">;
  totalCount: number;
  availableCount: number;
  wonCount: number;
  prizeIds: Id<"prizes">[];
}

type SpinState = "idle" | "spinning" | "winner";
type ConfirmState = "idle" | "saving" | "confirmed" | "error";

export default function SpinPage() {
  const router = useRouter();
  const [spinState, setSpinState] = useState<SpinState>("idle");
  const [winner, setWinner] = useState<Participant | null>(null);
  const [spinCount, setSpinCount] = useState(0);
  const [confirmState, setConfirmState] = useState<ConfirmState>("idle");
  const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
  const [winnerDialogOpen, setWinnerDialogOpen] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentPrizeIndex, setCurrentPrizeIndex] = useState(0);
  const [play] = useSound("/drum_and_celebration.ogg");

  // Fetch participants and prizes
  const participants = useQuery(api.spin.getEligibleParticipants);
  const participantCount = useQuery(api.spin.getParticipantCount);
  const availablePrizes = useQuery(api.prizes.listAvailablePrizes);
  const groupedPrizes = useQuery(api.prizes.listGroupedPrizes);

  // Mutation to confirm winner
  const confirmWinnerMutation = useMutation(api.winners.confirmWinner);

  // Filter grouped prizes to only show those with available count > 0
  const availableGroupedPrizes = groupedPrizes?.filter(
    (g) => g.availableCount > 0,
  );

  // Track carousel selection
  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setCurrentPrizeIndex(carouselApi.selectedScrollSnap());
    };

    carouselApi.on("select", onSelect);
    onSelect(); // Set initial index

    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  // Update selected prize when carousel changes
  useEffect(() => {
    if (availablePrizes && availablePrizes.length > 0) {
      // Get the first available prize from the selected group
      const groupedPrize = availableGroupedPrizes?.[currentPrizeIndex];
      if (groupedPrize) {
        const firstAvailable = availablePrizes.find(
          (p) => p.name === groupedPrize.name && p.status === "available",
        );
        setSelectedPrize(firstAvailable || null);
      }
    }
  }, [currentPrizeIndex, availablePrizes, availableGroupedPrizes]);

  // Handle spin complete (called by Wheel component)
  const handleSpinComplete = useCallback((selectedWinner: Participant) => {
    setWinner(selectedWinner);
    setSpinState("winner");
    setSpinCount((prev) => prev + 1);
    setWinnerDialogOpen(true);

    toast.success("Winner selected! 🎉", {
      description: `${selectedWinner.fullName} from ${selectedWinner.department}`,
    });
  }, []);

  // Handle spin
  const handleSpin = useCallback(() => {
    if (!participants || participants.length === 0) {
      toast.error("No participants available", {
        description: "Please add participants first.",
      });
      return;
    }

    setSpinState("spinning");
    setConfirmState("idle");
  }, [participants]);

  // Handle re-spin
  const handleRespin = useCallback(() => {
    setWinnerDialogOpen(false);
    setSpinState("idle");
    setWinner(null);
    setConfirmState("idle");
    toast.info("Ready to spin again", {
      description: "Click SPIN to select a new winner.",
    });
  }, []);

  // Handle confirm winner
  const handleConfirmWinner = useCallback(async () => {
    if (!winner) return;

    setConfirmState("saving");

    try {
      await confirmWinnerMutation({
        participantId: winner._id,
        prizeId: selectedPrize?._id,
      });
      setConfirmState("confirmed");
      toast.success("Winner confirmed! 🎉", {
        description: `${winner.fullName} has been saved to the winner list.`,
      });
    } catch (error) {
      setConfirmState("error");
      console.error("Failed to confirm winner:", error);
      toast.error("Failed to save winner", {
        description: "Please try again.",
      });
    }
  }, [winner, selectedPrize, confirmWinnerMutation]);

  // Handle spin for next prize
  const handleSpinForNextPrize = useCallback(() => {
    setWinnerDialogOpen(false);
    setSpinState("idle");
    setWinner(null);
    setConfirmState("idle");
    setSelectedPrize(null);
    toast.info("Ready for next prize", {
      description: "Click SPIN to select the next winner.",
    });
  }, []);

  // Loading state
  if (participants === undefined || participantCount === undefined) {
    return (
      <>
        <Header />
        <main className="container py-8 max-w-7xl">
          <div className="flex items-center justify-center h-[500px]">
            <p className="text-muted-foreground">Loading participants...</p>
          </div>
        </main>
      </>
    );
  }

  // No participants state
  const hasNoParticipants = participants.length === 0;

  return (
    <>
      <Header />
      <main className="container py-8 max-w-7xl mx-auto">
        {/* Back button */}
        <Button
          variant="ghost"
          onClick={() => router.push("/")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Menu
        </Button>

        {/* Page title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Spin the Wheel</h1>
          <p className="text-muted-foreground text-lg">
            {hasNoParticipants ? (
              "No participants yet. Add participants first."
            ) : (
              <>
                <Sparkles className="inline h-5 w-5 mr-1" />
                {participantCount} participant
                {participantCount !== 1 ? "s" : ""} in the draw
              </>
            )}
          </p>
        </div>

        {/* No participants message */}
        {hasNoParticipants ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg mb-4">
                  No participants found in the database.
                </p>
                <Button onClick={() => router.push("/participants")}>
                  Add Participants
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Prize Carousel and Wheel */}
            <div className="flex justify-center gap-6">
              {/* Prize Carousel */}
              <div className="max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold text-center mb-4">
                  Current Prize
                </h2>
                {!availablePrizes || availablePrizes.length === 0 ? (
                  <Card className="border-2 border-yellow-500/50 p-6 w-[400px] mx-auto">
                    <CardContent className="text-center space-y-4">
                      <AlertTriangle className="h-16 w-16 mx-auto text-yellow-500" />
                      <h3 className="text-xl font-bold">All Prizes Won!</h3>
                      <p className="text-muted-foreground">
                        All prizes have been distributed. No more prizes
                        available for spinning.
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <>
                    <Carousel
                      setApi={setCarouselApi}
                      opts={{
                        align: "center",
                        loop: true,
                      }}
                      className="w-[400px] mx-auto"
                    >
                      <CarouselContent>
                        {availableGroupedPrizes?.map((groupedPrize, index) => (
                          <CarouselItem
                            key={groupedPrize.name}
                            className="flex justify-center"
                          >
                            <Card className="border-2 border-primary/20 p-0 w-[300px]">
                              <CardContent>
                                <div className="flex flex-col items-center gap-2">
                                  {/* Prize Image */}
                                  {groupedPrize.imageStorageId ? (
                                    <PrizeImage
                                      storageId={groupedPrize.imageStorageId}
                                    />
                                  ) : (
                                    <div className="w-full max-w-sm aspect-square rounded-lg bg-muted flex items-center justify-center">
                                      <Gift className="h-24 w-24 text-muted-foreground" />
                                    </div>
                                  )}

                                  {/* Prize Name */}
                                  <div className="text-center">
                                    <h3 className="text-2xl font-bold text-primary">
                                      {groupedPrize.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      {groupedPrize.availableCount} available
                                      {groupedPrize.wonCount > 0 &&
                                        ` (${groupedPrize.wonCount} won)`}
                                    </p>
                                    <p className="text-sm text-muted-foreground mt-1">
                                      Prize {index + 1} of{" "}
                                      {availableGroupedPrizes.length}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-0" />
                      <CarouselNext className="right-0" />
                    </Carousel>
                    <p className="text-center text-sm text-muted-foreground mt-4">
                      ← Swipe or use arrows to select prize →
                    </p>
                  </>
                )}
              </div>

              {/* Wheel and Spin Button */}
              <div className="flex flex-col gap-2">
                {/* Wheel */}
                <div className="max-w-[500px]">
                  <Wheel
                    participants={participants}
                    isSpinning={spinState === "spinning"}
                    onSpinComplete={handleSpinComplete}
                  />
                </div>

                {/* Spin button */}
                {spinState === "idle" && (
                  <div className="text-center mb-8">
                    <Button
                      size="lg"
                      onClick={() => {
                        play();
                        handleSpin();
                      }}
                      className="text-xl px-12 py-6"
                      disabled={
                        !availablePrizes || availablePrizes.length === 0
                      }
                    >
                      <Sparkles className="h-6 w-6 mr-2" />
                      {!availablePrizes || availablePrizes.length === 0
                        ? "NO PRIZES AVAILABLE"
                        : "SPIN"}
                    </Button>
                  </div>
                )}

                {/* Spinning state */}
                {spinState === "spinning" && (
                  <div className="text-center mb-8">
                    <Button size="lg" disabled className="text-xl px-12 py-6">
                      Spinning...
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </main>

      {/* Winner Dialog */}
      {winner && (
        <Dialog open={winnerDialogOpen} onOpenChange={setWinnerDialogOpen}>
          <Fireworks autorun={{ speed: 3 }} />
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="text-center text-3xl">
                {confirmState === "confirmed" ? (
                  <>
                    <Trophy className="inline-block h-8 w-8 mr-2 text-yellow-500" />
                    Winner Confirmed!
                    <Trophy className="inline-block h-8 w-8 ml-2 text-yellow-500" />
                  </>
                ) : (
                  "🎉 Winner Selected! 🎉"
                )}
              </DialogTitle>
              <DialogDescription className="text-center">
                {confirmState === "confirmed"
                  ? "Winner has been confirmed and saved to the database"
                  : "Congratulations to our lucky winner!"}
              </DialogDescription>
            </DialogHeader>

            <div className="text-center space-y-4 py-4">
              <h2 className="text-4xl font-bold text-primary">
                {winner.fullName}
              </h2>
              <div className="space-y-2 text-lg">
                <p>
                  <span className="font-semibold">Department:</span>{" "}
                  {winner.department}
                </p>
              </div>
            </div>

            <DialogFooter className="grid grid-cols-2 gap-2 w-full">
              {confirmState === "confirmed" ? (
                <>
                  <Button size="lg" onClick={handleSpinForNextPrize}>
                    <Trophy className="h-5 w-5 mr-2" />
                    Spin for Next Prize
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      setWinnerDialogOpen(false);
                      router.push("/");
                    }}
                  >
                    <Home className="h-5 w-5 mr-2" />
                    Back to Menu
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleRespin}
                    disabled={
                      spinState === "spinning" || confirmState === "saving"
                    }
                  >
                    <RotateCcw className="h-5 w-5 mr-2" />
                    Re-spin
                  </Button>
                  <Button
                    size="lg"
                    onClick={handleConfirmWinner}
                    disabled={
                      spinState === "spinning" || confirmState === "saving"
                    }
                  >
                    <CheckCircle className="h-5 w-5 mr-2" />
                    {confirmState === "saving" ? "Saving..." : "Confirm Winner"}
                  </Button>
                </>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

// Component to display prize image from Convex storage
function PrizeImage({ storageId }: { storageId: Id<"_storage"> }) {
  const imageUrl = useQuery(api.files.getUrl, { storageId });

  if (!imageUrl) {
    return (
      <div className="w-fit max-w-sm aspect-square rounded-lg overflow-hidden bg-muted">
        <div className="w-[200px] aspect-square bg-muted animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-fit max-w-sm aspect-square rounded-lg overflow-hidden bg-muted">
      <img
        src={imageUrl}
        alt="Prize"
        className="w-[200px] aspect-square object-contain"
      />
    </div>
  );
}
