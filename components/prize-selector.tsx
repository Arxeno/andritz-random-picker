"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Gift, Image as ImageIcon } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface Prize {
  _id: Id<"prizes">;
  name: string;
  imageStorageId?: Id<"_storage">;
}

interface PrizeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (prizeId?: Id<"prizes">) => void;
  winnerName: string;
  isLoading?: boolean;
}

export function PrizeSelector({
  open,
  onOpenChange,
  onConfirm,
  winnerName,
  isLoading = false,
}: PrizeSelectorProps) {
  const [selectedPrizeId, setSelectedPrizeId] = useState<
    Id<"prizes"> | undefined
  >(undefined);

  // Fetch only available prizes
  const prizes = useQuery(api.prizes.listAvailablePrizes);

  const handleConfirm = () => {
    onConfirm(selectedPrizeId);
  };

  const handleSkip = () => {
    onConfirm(undefined);
  };

  const selectedPrize = prizes?.find((p) => p._id === selectedPrizeId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Assign Prize to Winner
          </DialogTitle>
          <DialogDescription>
            Select a prize for <strong>{winnerName}</strong> or skip to confirm
            without a prize.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {prizes === undefined ? (
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground">Loading prizes...</p>
            </div>
          ) : prizes.length === 0 ? (
            <div className="text-center py-4">
              <Gift className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-1">
                No prizes available
              </p>
              <p className="text-xs text-muted-foreground">
                You can still confirm the winner without a prize
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="prize">Select Prize (Optional)</Label>
                <Select
                  value={selectedPrizeId}
                  onValueChange={(value) =>
                    setSelectedPrizeId(value as Id<"prizes">)
                  }
                  disabled={isLoading}
                >
                  <SelectTrigger id="prize">
                    <SelectValue placeholder="Choose a prize..." />
                  </SelectTrigger>
                  <SelectContent>
                    {prizes.map((prize) => (
                      <SelectItem key={prize._id} value={prize._id}>
                        {prize.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {selectedPrize && (
                <div className="border rounded-lg p-4 bg-muted/50">
                  <p className="text-sm font-medium mb-2">Selected Prize:</p>
                  <div className="flex items-center gap-3">
                    {selectedPrize.imageStorageId ? (
                      <PrizeImage storageId={selectedPrize.imageStorageId} />
                    ) : (
                      <div className="w-16 h-16 bg-background rounded flex items-center justify-center border">
                        <ImageIcon className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{selectedPrize.name}</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleSkip}
            disabled={isLoading}
            type="button"
          >
            Skip (No Prize)
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading} type="button">
            {isLoading ? "Confirming..." : "Confirm Winner"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Component to display prize image from Convex storage
function PrizeImage({ storageId }: { storageId: Id<"_storage"> }) {
  const imageUrl = useQuery(api.files.getUrl, { storageId });

  if (!imageUrl) {
    return <div className="w-16 h-16 bg-background rounded animate-pulse" />;
  }

  return (
    <img
      src={imageUrl}
      alt="Prize"
      className="w-16 h-16 object-cover rounded border"
    />
  );
}
