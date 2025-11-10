"use client";

import { useEffect, useRef, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { WHEEL_CONFIG, UI_CONFIG } from "@/lib/config";

interface Participant {
  _id: Id<"participants">;
  fullName: string;
  email: string;
  phone: string;
}

interface WheelProps {
  participants: Participant[];
  isSpinning: boolean;
  onSpinComplete: (winner: Participant) => void;
}

export function Wheel({
  participants,
  isSpinning,
  onSpinComplete,
}: WheelProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const targetRotationRef = useRef<number>(0);
  const selectedIndexRef = useRef<number>(0);

  // Draw the wheel
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || participants.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Save context state
    ctx.save();

    // Translate to center and rotate
    ctx.translate(centerX, centerY);
    ctx.rotate((rotation * Math.PI) / 180);

    // Draw segments
    const segmentAngle = (2 * Math.PI) / participants.length;

    participants.forEach((participant, index) => {
      const startAngle = index * segmentAngle;
      const endAngle = startAngle + segmentAngle;

      // Draw segment
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();

      // Fill with color
      ctx.fillStyle = WHEEL_CONFIG.COLORS[index % WHEEL_CONFIG.COLORS.length];
      ctx.fill();

      // Draw border
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.rotate(startAngle + segmentAngle / 2);
      ctx.textAlign = "right";
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 14px sans-serif";
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 3;

      // Truncate long names
      let displayName = participant.fullName;
      if (displayName.length > UI_CONFIG.MAX_NAME_LENGTH_ON_WHEEL) {
        displayName =
          displayName.substring(0, UI_CONFIG.TRUNCATED_NAME_LENGTH) + "...";
      }

      ctx.fillText(displayName, radius - 10, 5);
      ctx.restore();
    });

    // Restore context state
    ctx.restore();

    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = "#2c3e50";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.stroke();

    // Draw pointer at top
    ctx.beginPath();
    ctx.moveTo(centerX, 10);
    ctx.lineTo(centerX - 15, 40);
    ctx.lineTo(centerX + 15, 40);
    ctx.closePath();
    ctx.fillStyle = "#e74c3c";
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [participants, rotation]);

  // Spin animation
  useEffect(() => {
    if (!isSpinning) return;

    // Select random winner using crypto API for true randomness
    const randomIndex =
      crypto.getRandomValues(new Uint32Array(1))[0] % participants.length;
    selectedIndexRef.current = randomIndex;

    // Calculate target rotation
    const segmentAngle = 360 / participants.length;
    const baseRotation = 360 * WHEEL_CONFIG.FULL_ROTATIONS;
    const targetSegmentRotation = randomIndex * segmentAngle;
    // Add 90 degrees to align with top pointer
    const finalRotation = baseRotation + (360 - targetSegmentRotation) + 90;

    targetRotationRef.current = finalRotation;
    startTimeRef.current = Date.now();

    // Animation function with easing
    const animate = () => {
      const elapsed = Date.now() - (startTimeRef.current || 0);
      const duration = WHEEL_CONFIG.SPIN_DURATION;

      if (elapsed < duration) {
        // Easing function: cubic-bezier(0.17, 0.67, 0.12, 0.99)
        const progress = elapsed / duration;
        const eased = 1 - Math.pow(1 - progress, 3);
        const currentRotation = eased * targetRotationRef.current;

        setRotation(currentRotation);
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animation complete
        setRotation(targetRotationRef.current);
        onSpinComplete(participants[selectedIndexRef.current]);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isSpinning, participants, onSpinComplete]);

  if (participants.length === 0) {
    return (
      <div className="flex items-center justify-center h-[500px] bg-muted rounded-lg">
        <p className="text-muted-foreground text-lg">
          No participants to display
        </p>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center">
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="max-w-full h-auto"
      />
    </div>
  );
}
