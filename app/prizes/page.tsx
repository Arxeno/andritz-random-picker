"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { PrizeForm } from "@/components/prize-form";
import { PrizeTable } from "@/components/prize-table";
import { ArrowLeft, Gift } from "lucide-react";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";

export default function PrizesPage() {
  const router = useRouter();
  const prizes = useQuery(api.prizes.listPrizes);
  const addPrize = useMutation(api.prizes.addPrize);
  const updatePrize = useMutation(api.prizes.updatePrize);
  const deletePrize = useMutation(api.prizes.deletePrize);

  const [editingPrize, setEditingPrize] = useState<{
    _id: Id<"prizes">;
    name: string;
    imageStorageId?: Id<"_storage">;
  } | null>(null);

  const handleAddPrize = async (data: {
    name: string;
    imageStorageId?: Id<"_storage">;
  }) => {
    try {
      await addPrize(data);
      toast.success("Prize added successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add prize",
      );
      throw error;
    }
  };

  const handleUpdatePrize = async (data: {
    name: string;
    imageStorageId?: Id<"_storage">;
  }) => {
    if (!editingPrize) return;

    try {
      await updatePrize({
        prizeId: editingPrize._id,
        ...data,
      });
      toast.success("Prize updated successfully!");
      setEditingPrize(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update prize",
      );
      throw error;
    }
  };

  const handleDeletePrize = async (prizeId: Id<"prizes">) => {
    try {
      await deletePrize({ prizeId });
      toast.success("Prize deleted successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete prize",
      );
    }
  };

  const handleEdit = (prize: {
    _id: Id<"prizes">;
    name: string;
    imageStorageId?: Id<"_storage">;
  }) => {
    setEditingPrize(prize);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingPrize(null);
  };

  if (prizes === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">Loading prizes...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 mx-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push("/")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Gift className="h-8 w-8" />
                Prize Management
              </h1>
              <p className="text-muted-foreground mt-1">
                Add and manage prizes for your event
              </p>
            </div>
          </div>
        </div>

        {/* Prize Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <PrizeForm
              onSubmit={editingPrize ? handleUpdatePrize : handleAddPrize}
              initialData={editingPrize || undefined}
              submitLabel={editingPrize ? "Update Prize" : "Add Prize"}
              title={editingPrize ? "Edit Prize" : "Add Prize"}
            />
            {editingPrize && (
              <Button
                variant="outline"
                className="w-full mt-4"
                onClick={handleCancelEdit}
              >
                Cancel Edit
              </Button>
            )}
          </div>

          {/* Prize Statistics */}
          <div className="space-y-4">
            <div className="bg-white rounded-lg p-6 border shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Prize Statistics</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total Prizes:</span>
                  <span className="text-2xl font-bold">{prizes.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">With Images:</span>
                  <span className="text-2xl font-bold">
                    {prizes.filter((p) => p.imageStorageId).length}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                💡 <strong>Tip:</strong> Add images to make your prizes more
                attractive! Images will be displayed when winners are announced.
              </p>
            </div>
          </div>
        </div>

        {/* Prize List */}
        <div>
          <h2 className="text-2xl font-bold mb-4">All Prizes</h2>
          <PrizeTable
            prizes={prizes}
            onEdit={handleEdit}
            onDelete={handleDeletePrize}
          />
        </div>
      </div>
    </div>
  );
}
