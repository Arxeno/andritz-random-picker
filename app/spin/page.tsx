"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import ReactCanvasConfetti from "react-canvas-confetti";
import type { CreateTypes } from "canvas-confetti";
import { toast } from "sonner";

import { Header } from "@/components/header";
import { Wheel } from "@/components/wheel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Sparkles,
  RotateCcw,
  CheckCircle,
  Trophy,
  Home,
  History,
} from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface Participant {
  _id: Id<"participants">;
  fullName: string;
  email: string;
  phone: string;
}

type SpinState = "idle" | "spinning" | "winner";
type ConfirmState = "idle" | "saving" | "confirmed" | "error";

export default function SpinPage() {
  const router = useRouter();
  const [spinState, setSpinState] = useState<SpinState>("idle");
  const [winner, setWinner] = useState<Participant | null>(null);
  const [spinCount, setSpinCount] = useState(0);
  const [confirmState, setConfirmState] = useState<ConfirmState>("idle");
  const confettiRef = useRef<CreateTypes | null>(null);

  // Fetch participants
  const participants = useQuery(api.spin.getEligibleParticipants);
  const participantCount = useQuery(api.spin.getParticipantCount);

  // Mutation to confirm winner
  const confirmWinnerMutation = useMutation(api.winners.confirmWinner);

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
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: {
          x: randomInRange(0.1, 0.3),
          y: Math.random() - 0.2,
        },
      });

      confettiRef.current?.({
        particleCount,
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: {
          x: randomInRange(0.7, 0.9),
          y: Math.random() - 0.2,
        },
      });
    }, 250);
  }, []);

  // Handle spin button click
  const handleSpin = () => {
    if (!participants || participants.length === 0) return;
    setSpinState("spinning");
    setWinner(null);
    setSpinCount((prev) => prev + 1);
  };

  // Handle spin complete
  const handleSpinComplete = useCallback(
    (selectedWinner: Participant) => {
      setWinner(selectedWinner);
      setSpinState("winner");
      fireConfetti();
    },
    [fireConfetti],
  );

  // Handle re-spin
  const handleRespin = () => {
    setSpinState("spinning");
    setWinner(null);
    setSpinCount((prev) => prev + 1);
  };

  // Handle confirm winner
  const handleConfirmWinner = async () => {
    if (!winner) return;

    setConfirmState("saving");

    try {
      await confirmWinnerMutation({ participantId: winner._id });
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
  };

  // Handle spin for next prize
  const handleSpinForNextPrize = () => {
    setSpinState("idle");
    setWinner(null);
    setSpinCount(0);
    setConfirmState("idle");
  };

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
      <main className="container py-8 max-w-7xl">
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
            {/* Wheel */}
            <div className="mb-8">
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
                  onClick={handleSpin}
                  disabled={hasNoParticipants}
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

            {/* Winner display */}
            {spinState === "winner" && winner && (
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-center text-3xl">
                    {confirmState === "confirmed" ? (
                      <>
                        <Trophy className="inline-block h-8 w-8 mr-2 text-yellow-500" />
                        Winner Confirmed!
                        <Trophy className="inline-block h-8 w-8 ml-2 text-yellow-500" />
                      </>
                    ) : (
                      "🎉 Winner Selected! 🎉"
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    {/* Status message */}
                    {confirmState === "confirmed" ? (
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 mb-4">
                        <p className="text-green-800 dark:text-green-200 font-medium">
                          ✅ Winner confirmed and saved!
                        </p>
                      </div>
                    ) : (
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
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
                        <span className="font-semibold">Email:</span>{" "}
                        {winner.email}
                      </p>
                      <p>
                        <span className="font-semibold">Phone:</span>{" "}
                        {winner.phone}
                      </p>
                    </div>

                    {/* Action buttons */}
                    {confirmState === "confirmed" ? (
                      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
                        <Button
                          size="lg"
                          onClick={handleSpinForNextPrize}
                          className="w-full sm:w-auto"
                        >
                          <Trophy className="h-5 w-5 mr-2" />
                          Spin for Next Prize
                        </Button>
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => router.push("/winners")}
                          className="w-full sm:w-auto"
                        >
                          <History className="h-5 w-5 mr-2" />
                          View Winner History
                        </Button>
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={() => router.push("/")}
                          className="w-full sm:w-auto"
                        >
                          <Home className="h-5 w-5 mr-2" />
                          Back to Menu
                        </Button>
                      </div>
                    ) : (
                      <div className="flex gap-4 justify-center pt-6">
                        <Button
                          variant="outline"
                          size="lg"
                          onClick={handleRespin}
                          disabled={
                            spinState === "spinning" ||
                            confirmState === "saving"
                          }
                        >
                          <RotateCcw className="h-5 w-5 mr-2" />
                          Re-spin
                        </Button>
                        <Button
                          size="lg"
                          onClick={handleConfirmWinner}
                          disabled={
                            spinState === "spinning" ||
                            confirmState === "saving"
                          }
                        >
                          <CheckCircle className="h-5 w-5 mr-2" />
                          {confirmState === "saving"
                            ? "Saving..."
                            : "Confirm Winner"}
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>

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
