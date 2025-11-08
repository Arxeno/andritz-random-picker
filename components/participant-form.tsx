"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, UserPlus } from "lucide-react";

interface ParticipantFormProps {
  onSubmit: (data: { fullName: string; department: string }) => Promise<void>;
  initialData?: { fullName: string; department: string };
  submitLabel?: string;
  title?: string;
}

export function ParticipantForm({
  onSubmit,
  initialData,
  submitLabel = "Add Participant",
  title = "Add Participant",
}: ParticipantFormProps) {
  const [fullName, setFullName] = useState(initialData?.fullName || "");
  const [department, setDepartment] = useState(initialData?.department || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsLoading(true);

    try {
      await onSubmit({ fullName, department });

      // Clear form only if not editing (no initial data)
      if (!initialData) {
        setFullName("");
        setDepartment("");
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save participant",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Input
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Engineering"
                required
                disabled={isLoading}
              />
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-800">
              <CheckCircle2 className="h-4 w-4" />
              <p>Participant saved successfully!</p>
            </div>
          )}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : submitLabel}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
