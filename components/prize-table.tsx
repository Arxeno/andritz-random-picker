"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Trash2,
  Image as ImageIcon,
  Trophy,
  CheckCircle,
} from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface GroupedPrize {
  name: string;
  imageStorageId?: Id<"_storage">;
  totalCount: number;
  availableCount: number;
  wonCount: number;
  prizeIds: Id<"prizes">[];
}

interface PrizeTableProps {
  prizes: GroupedPrize[];
  onEdit: (prize: {
    name: string;
    quantity: number;
    imageStorageId?: Id<"_storage">;
  }) => void;
  onDelete: (name: string) => void;
}

export function PrizeTable({ prizes, onEdit, onDelete }: PrizeTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [prizeToDelete, setPrizeToDelete] = useState<string | null>(null);

  const handleDeleteClick = (prizeName: string) => {
    setPrizeToDelete(prizeName);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (prizeToDelete) {
      onDelete(prizeToDelete);
      setPrizeToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  if (prizes.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium text-muted-foreground mb-1">
            No prizes yet
          </p>
          <p className="text-sm text-muted-foreground">
            Add your first prize to get started
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Prize Name</TableHead>
                  <TableHead className="w-[100px]">Quantity</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="text-right w-[150px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prizes.map((prize) => (
                  <TableRow key={prize.name}>
                    <TableCell>
                      {prize.imageStorageId ? (
                        <PrizeImage storageId={prize.imageStorageId} />
                      ) : (
                        <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{prize.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">Total: {prize.totalCount}</div>
                        <div className="text-xs text-muted-foreground">
                          {prize.availableCount} available
                          {prize.wonCount > 0 && `, ${prize.wonCount} won`}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {prize.availableCount === 0 ? (
                        <Badge
                          variant="secondary"
                          className="bg-secondary text-secondary-foreground"
                        >
                          <Trophy className="h-3 w-3 mr-1" />
                          All Won
                        </Badge>
                      ) : prize.wonCount > 0 ? (
                        <Badge
                          variant="outline"
                          className="bg-yellow-50 text-yellow-700 border-yellow-300"
                        >
                          Partial
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-accent/10 text-foreground border-accent"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Available
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            onEdit({
                              name: prize.name,
                              quantity: prize.totalCount,
                              imageStorageId: prize.imageStorageId,
                            })
                          }
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(prize.name)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete All ({prize.totalCount})
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete All Prizes</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete all instances of "{prizeToDelete}
              "? This will remove all{" "}
              {prizes.find((p) => p.name === prizeToDelete)?.totalCount ||
                0}{" "}
              prize(s) with this name. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

// Component to display prize image from Convex storage
function PrizeImage({ storageId }: { storageId: Id<"_storage"> }) {
  const imageUrl = useQuery(api.files.getUrl, { storageId });

  if (!imageUrl) {
    return <div className="w-16 h-16 bg-muted rounded animate-pulse" />;
  }

  return (
    <img
      src={imageUrl}
      alt="Prize"
      className="w-16 h-16 object-cover rounded border"
    />
  );
}
