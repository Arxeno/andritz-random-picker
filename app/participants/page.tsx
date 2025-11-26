"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Header } from "@/components/header";
import { ParticipantForm } from "@/components/participant-form";
import { ParticipantTable } from "@/components/participant-table";
import { ImportDialog } from "@/components/import-dialog";
import { ArrowLeft, FileSpreadsheet, Search, Users } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { toast } from "sonner";

interface Participant {
  _id: Id<"participants">;
  fullName: string;
  // department: string;
}

export default function ParticipantsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [editingParticipant, setEditingParticipant] =
    useState<Participant | null>(null);
  const [importDialogOpen, setImportDialogOpen] = useState(false);

  // Queries
  const allParticipants = useQuery(api.participants.listParticipants);
  const searchResults = useQuery(api.participants.searchParticipants, {
    searchTerm,
  });

  // Mutations
  const addParticipant = useMutation(api.participants.addParticipant);
  const updateParticipant = useMutation(api.participants.updateParticipant);
  const deleteParticipant = useMutation(api.participants.deleteParticipant);
  const bulkAddParticipants = useMutation(api.participants.bulkAddParticipants);

  // Use search results if searching, otherwise all participants
  const participants = searchTerm ? searchResults : allParticipants;

  const handleAddParticipant = async (data: {
    fullName: string;
    // department: string;
  }) => {
    try {
      await addParticipant(data);
      toast.success("Participant added successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add participant",
      );
      throw error;
    }
  };

  const handleUpdateParticipant = async (data: {
    fullName: string;
  }) => {
    if (!editingParticipant) return;

    try {
      await updateParticipant({
        id: editingParticipant._id,
        ...data,
      });
      toast.success("Participant updated successfully!");
      setEditingParticipant(null);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update participant",
      );
      throw error;
    }
  };

  const handleDeleteParticipant = async (id: Id<"participants">) => {
    try {
      await deleteParticipant({ id });
      toast.success("Participant deleted successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete participant",
      );
      throw error;
    }
  };

  const handleBulkImport = async (
    importedParticipants: { fullName: string }[],
  ) => {
    try {
      const result = await bulkAddParticipants({
        participants: importedParticipants,
      });

      if (result.failed > 0) {
        toast.error(
          `Import completed with errors: ${result.success} succeeded, ${result.failed} failed`,
        );
        console.error("Import errors:", result.errors);
      } else {
        toast.success(`Successfully imported ${result.success} participants!`);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to import participants",
      );
      throw error;
    }
  };

  const totalCount = allParticipants?.length || 0;
  const filteredCount = participants?.length || 0;

  return (
    <>
      <Header />
      <main className="container mx-auto p-8 max-w-7xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Menu
          </Button>
          <h1 className="text-3xl font-bold">Manage Participants</h1>
        </div>

        {/* Add Participant Form */}
        <div className="mb-6">
          <ParticipantForm onSubmit={handleAddParticipant} />
        </div>

        {/* Import Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileSpreadsheet className="h-5 w-5" />
              Bulk Import
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Import multiple participants at once from an Excel file (.xlsx)
            </p>
            <Button onClick={() => setImportDialogOpen(true)}>
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Import from Excel
            </Button>
          </CardContent>
        </Card>

        {/* Participant List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Participants
                {totalCount > 0 && (
                  <span className="text-sm font-normal text-muted-foreground">
                    (
                    {searchTerm
                      ? `${filteredCount} of ${totalCount}`
                      : totalCount}
                    )
                  </span>
                )}
              </CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search participants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {participants === undefined ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading...
              </div>
            ) : (
              <ParticipantTable
                participants={participants}
                onEdit={setEditingParticipant}
                onDelete={handleDeleteParticipant}
              />
            )}
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog
          open={editingParticipant !== null}
          onOpenChange={() => setEditingParticipant(null)}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Participant</DialogTitle>
              <DialogDescription>
                Update participant information below.
              </DialogDescription>
            </DialogHeader>
            {editingParticipant && (
              <ParticipantForm
                onSubmit={handleUpdateParticipant}
                initialData={editingParticipant}
                submitLabel="Save Changes"
                title=""
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Import Dialog */}
        <ImportDialog
          open={importDialogOpen}
          onOpenChange={setImportDialogOpen}
          onImport={handleBulkImport}
        />
      </main>
    </>
  );
}
