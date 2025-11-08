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
import { Edit, Trash2, Users } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

interface Participant {
  _id: Id<"participants">;
  fullName: string;
  department: string;
}

interface ParticipantTableProps {
  participants: Participant[];
  onEdit: (participant: Participant) => void;
  onDelete: (id: Id<"participants">) => Promise<void>;
}

export function ParticipantTable({
  participants,
  onEdit,
  onDelete,
}: ParticipantTableProps) {
  const [deleteId, setDeleteId] = useState<Id<"participants"> | null>(null);
  const [deleteName, setDeleteName] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (participant: Participant) => {
    setDeleteId(participant._id);
    setDeleteName(participant.fullName);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    try {
      await onDelete(deleteId);
      setDeleteId(null);
      setDeleteName("");
    } catch (error) {
      // Error will be handled by parent component
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (participants.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Users className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No participants yet</h3>
        <p className="text-sm text-muted-foreground">
          Add your first participant using the form above.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Full Name</TableHead>
              <TableHead>Department</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {participants.map((participant) => (
              <TableRow key={participant._id}>
                <TableCell className="font-medium">
                  {participant.fullName}
                </TableCell>
                <TableCell>{participant.department}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(participant)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(participant)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        open={deleteId !== null}
        onOpenChange={() => setDeleteId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteName}</strong>?
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
