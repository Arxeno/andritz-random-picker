"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle2 } from "lucide-react";

/**
 * Staff account setup page
 * This page allows creating a staff account with limited access
 * Staff can only access /registered-user and /spin pages
 */
export default function SetupStaff() {
  const { signIn } = useAuthActions();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const assignStaffRole = useMutation(api.staffSetup.assignStaffRole);

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-green-600">
              Staff Account Created!
            </CardTitle>
            <CardDescription className="text-center">
              You can now sign in
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-800">
              <CheckCircle2 className="h-4 w-4" />
              <p>Staff account created successfully.</p>
            </div>
            <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-800">
              <p className="font-semibold mb-1">Access Permissions:</p>
              <ul className="list-disc list-inside text-xs space-y-1">
                <li>Registered Users page</li>
                <li>Spin Wheel page</li>
              </ul>
            </div>
            <Button onClick={() => router.push("/signin")} className="w-full">
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create Staff Account
          </CardTitle>
          <CardDescription className="text-center">
            Setup for Doorprize App Staff
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 rounded-md bg-blue-50 p-3 text-sm text-blue-800">
            <p className="font-semibold mb-1">Default Credentials:</p>
            <p className="font-mono text-xs">Email: staff@andritz.com</p>
            <p className="font-mono text-xs">Password: Staff2025!</p>
          </div>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setError(null);
              setIsLoading(true);
              const formData = new FormData(e.target as HTMLFormElement);
              formData.set("flow", "signUp");
              void signIn("password", formData)
                .then(async () => {
                  // Assign STAFF role after successful signup
                  await assignStaffRole();
                  setSuccess(true);
                  setIsLoading(false);
                })
                .catch((error) => {
                  setError(error.message || "Failed to create staff account");
                  setIsLoading(false);
                });
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="staff@andritz.com"
                defaultValue="staff@andritz.com"
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter password"
                defaultValue="Staff2025!"
                required
                disabled={isLoading}
              />
            </div>
            {error && (
              <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <p>{error}</p>
              </div>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating Account..." : "Create Staff Account"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>Staff accounts have limited access.</p>
            <p>Only /registered-user and /spin pages are accessible.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

