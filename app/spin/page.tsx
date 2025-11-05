"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import ReactCanvasConfetti from "react-canvas-confetti";
import type { CreateTypes } from "canvas-confetti";

import { Header } from "@/components/header";
import { Wheel } from "@/components/wheel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Sparkles, RotateCcw, CheckCircle } from "lucide-react";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface Participant {
  _id: Id<"participants">;
  fullName: string;
  email: string;
  phone: string;
}

type SpinState = "idle" | "spinning" | "winner";

export default function SpinPage() {
  const router = useRouter();
  const [spinState, setSpinState] = useState<SpinState>("idle");
  const [winner, setWinner] = useState<Participant | null>(null);
  const confettiRef = useRef<CreateTypes | null>(null);

  // Fetch participants
  const participants = useQuery(api.spin.getEligibleParticipants);
  const participantCount = useQuery(api.spin.getParticipantCount);

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
    setSpinState("idle");
    setWinner(null);
  };

  // Handle confirm winner (placeholder for STORY-006)
  const handleConfirmWinner = () => {
    // This will be implemented in STORY-006
    console.log("Confirm winner:", winner);
    alert("Winner confirmation will be implemented in STORY-006");
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
                    🎉 Winner Selected! 🎉
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
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
                    <div className="flex gap-4 justify-center pt-6">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={handleRespin}
                      >
                        <RotateCcw className="h-5 w-5 mr-2" />
                        Re-spin
                      </Button>
                      <Button size="lg" onClick={handleConfirmWinner}>
                        <CheckCircle className="h-5 w-5 mr-2" />
                        Confirm Winner
                      </Button>
                    </div>
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
