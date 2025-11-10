"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import ReactCanvasConfetti from "react-canvas-confetti";
import type { CreateTypes } from "canvas-confetti";
import { toast } from "sonner";

import { Header } from "@/components/header";
import { Wheel } from "@/components/wheel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  History,
  AlertTriangle,
  Gift,
} from "lucide-react";

import { DUMMY_PARTICIPANTS, DUMMY_PRIZES } from "@/lib/dummy-data";
import type { DummyParticipant, DummyPrize } from "@/lib/dummy-data";

type SpinState = "idle" | "spinning" | "winner";
type ConfirmState = "idle" | "saving" | "confirmed" | "error";

export default function DummySpinPage() {
  const router = useRouter();
  const [spinState, setSpinState] = useState<SpinState>("idle");
  const [winner, setWinner] = useState<DummyParticipant | null>(null);
  const [spinCount, setSpinCount] = useState(0);
  const [confirmState, setConfirmState] = useState<ConfirmState>("idle");
  const [selectedPrize, setSelectedPrize] = useState<DummyPrize | null>(null);
  const [winnerDialogOpen, setWinnerDialogOpen] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentPrizeIndex, setCurrentPrizeIndex] = useState(0);
  const confettiRef = useRef<CreateTypes | null>(null);

  // Use dummy data
  const participants = DUMMY_PARTICIPANTS;
  const prizes = DUMMY_PRIZES;

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
    setSelectedPrize(prizes[currentPrizeIndex]);
  }, [currentPrizeIndex, prizes]);

  // Confetti instance
  const getInstance = useCallback((instance: CreateTypes | null) => {
    confettiRef.current = instance;
  }, []);

  // Fire confetti
  const fireConfetti = useCallback(() => {
    if (!confettiRef.current) return;

    const duration = 3000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      confettiRef.current?.({
        particleCount,
        spread: 360,
        startVelocity: 30,
        ticks: 60,
        origin: {
          x: randomInRange(0.1, 0.9),
          y: Math.random() - 0.2,
        },
        colors: ["#4f46e5", "#7c3aed", "#ec4899", "#f59e0b"],
      });
    }, 250);
  }, []);

  // Handle spin
  const handleSpin = useCallback(() => {
    if (participants.length === 0) {
      toast.error("No participants available", {
        description: "Please add participants first.",
      });
      return;
    }

    setSpinState("spinning");
    setConfirmState("idle");

    // Simulate spinning delay
    setTimeout(() => {
      // Randomly select a winner using crypto.getRandomValues for fairness
      const randomIndex = Math.floor(
        (crypto.getRandomValues(new Uint32Array(1))[0] / 0xffffffff) *
          participants.length,
      );
      const selectedWinner = participants[randomIndex];

      setWinner(selectedWinner);
      setSpinState("winner");
      setSpinCount((prev) => prev + 1);
      setWinnerDialogOpen(true); // Open the dialog

      // Fire confetti
      fireConfetti();

      toast.success("Winner selected! 🎉", {
        description: `${selectedWinner.fullName} from ${selectedWinner.department}`,
      });
    }, 3000); // 3 second spin duration
  }, [participants, fireConfetti]);

  // Handle re-spin
  const handleRespin = useCallback(() => {
    setWinnerDialogOpen(false); // Close the dialog
    setSpinState("idle");
    setWinner(null);
    setConfirmState("idle");
    setSelectedPrize(null);
    toast.info("Ready to spin again", {
      description: "Click SPIN to select a new winner.",
    });
  }, []);

  // Handle confirm winner (dummy - just logs to console)
  const handleConfirmWinner = useCallback(() => {
    if (!winner) return;

    setConfirmState("saving");

    // Simulate saving delay
    setTimeout(() => {
      console.log("🎉 DUMMY WINNER CONFIRMED:", {
        winner,
        prize: selectedPrize,
        spinCount,
        timestamp: new Date().toISOString(),
      });

      setConfirmState("confirmed");
      toast.success("Winner confirmed! 🎉 (Development Mode)", {
        description: `${winner.fullName} - Check console for details`,
      });
    }, 1000);
  }, [winner, selectedPrize, spinCount]);

  // Handle spin for next prize
  const handleSpinForNextPrize = useCallback(() => {
    setWinnerDialogOpen(false); // Close the dialog
    setSpinState("idle");
    setWinner(null);
    setConfirmState("idle");
    setSelectedPrize(null);
    toast.info("Ready for next prize", {
      description: "Click SPIN to select the next winner.",
    });
  }, []);

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Development Warning Banner */}
        <div className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400 shrink-0" />
            <div>
              <h3 className="font-bold text-yellow-900 dark:text-yellow-100">
                🚧 DEVELOPMENT PAGE - NOT CONNECTED TO DATABASE
              </h3>
              <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
                This is a dummy page for testing. Using {participants.length}{" "}
                dummy participants and {prizes.length} dummy prizes. No data
                will be saved.
              </p>
            </div>
          </div>
        </div>

        {/* Back button */}
        <Button
          variant="outline"
          onClick={() => router.push("/")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Menu
        </Button>

        {/* Page title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">
            🎡 Spin the Wheel (Development)
          </h1>
          <p className="text-muted-foreground">
            Test the wheel with {participants.length} dummy participants
          </p>
        </div>

        {/* Main content */}
        {participants.length === 0 ? (
          <Card className="max-w-2xl mx-auto">
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <Sparkles className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No participants available</p>
                <p className="text-sm">
                  Add dummy participants to lib/dummy-data.ts
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Prize Carousel */}
            <div className="mb-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-center mb-4">
                Current Prize
              </h2>
              <Carousel
                setApi={setCarouselApi}
                opts={{
                  align: "center",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {prizes.map((prize, index) => (
                    <CarouselItem key={prize.id}>
                      <Card className="border-2 border-primary/20">
                        <CardContent className="p-6">
                          <div className="flex flex-col items-center gap-4">
                            {/* Prize Image */}
                            {prize.imageUrl ? (
                              <div className="w-full max-w-sm aspect-square rounded-lg overflow-hidden bg-muted">
                                <img
                                  src={prize.imageUrl}
                                  alt={prize.name}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            ) : (
                              <div className="w-full max-w-sm aspect-square rounded-lg bg-muted flex items-center justify-center">
                                <Gift className="h-24 w-24 text-muted-foreground" />
                              </div>
                            )}

                            {/* Prize Name */}
                            <div className="text-center">
                              <h3 className="text-2xl font-bold text-primary">
                                {prize.name}
                              </h3>
                              <p className="text-sm text-muted-foreground mt-2">
                                Prize {index + 1} of {prizes.length}
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
            </div>

            {/* Wheel */}
            <div className="mb-8">
              <Wheel
                participants={participants.map((p) => ({
                  _id: p.id as any,
                  fullName: p.fullName,
                  department: p.department,
                }))}
                isSpinning={spinState === "spinning"}
                winner={
                  winner
                    ? {
                        _id: winner.id as any,
                        fullName: winner.fullName,
                        department: winner.department,
                      }
                    : null
                }
              />
            </div>

            {/* Spin button */}
            {spinState === "idle" && (
              <div className="text-center mb-8">
                <Button
                  size="lg"
                  onClick={handleSpin}
                  className="text-xl px-12 py-6"
                >
                  <Sparkles className="h-6 w-6 mr-2" />
                  SPIN
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
          </>
        )}
      </main>

      {/* Winner Dialog */}
      {winner && (
        <Dialog open={winnerDialogOpen} onOpenChange={setWinnerDialogOpen}>
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
                  ? "Winner has been confirmed and logged to console"
                  : "Congratulations to our lucky winner!"}
              </DialogDescription>
            </DialogHeader>

            <div className="text-center space-y-4 py-4">
              {/* Status message */}
              {confirmState === "confirmed" ? (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                  <p className="text-green-800 dark:text-green-200 font-medium">
                    ✅ Winner confirmed (check console)
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                  <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                    ⚠️ Winner pending confirmation
                  </p>
                  {spinCount > 1 && (
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                      Spin #{spinCount}
                    </p>
                  )}
                </div>
              )}

              <h2 className="text-4xl font-bold text-primary">
                {winner.fullName}
              </h2>
              <div className="space-y-2 text-lg">
                <p>
                  <span className="font-semibold">Department:</span>{" "}
                  {winner.department}
                </p>
                <p className="text-sm text-muted-foreground">ID: {winner.id}</p>
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

      {/* Confetti canvas */}
      <ReactCanvasConfetti
        refConfetti={getInstance}
        style={{
          position: "fixed",
          pointerEvents: "none",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
        }}
      />
    </>
  );
}
