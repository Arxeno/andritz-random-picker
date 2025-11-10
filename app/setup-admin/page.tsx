"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useQuery } from "convex/react";
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
 * One-time admin setup page
 * This page allows creating the initial admin account
 * It will only work if no users exist in the system
 * After the admin account is created, this page will show an error
 */
export default function SetupAdmin() {
  const { signIn } = useAuthActions();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const hasUsers = useQuery(api.adminSetup.hasUsers);

  // If users already exist, show message
  if (hasUsers === true) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              Setup Complete
            </CardTitle>
            <CardDescription className="text-center">
              Admin account already exists
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 rounded-md bg-muted p-3 text-sm">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <p>The admin account has already been created.</p>
            </div>
            <Button onClick={() => router.push("/signin")} className="w-full">
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-green-600">
              Admin Account Created!
            </CardTitle>
            <CardDescription className="text-center">
              You can now sign in
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 rounded-md bg-green-50 p-3 text-sm text-green-800">
              <CheckCircle2 className="h-4 w-4" />
              <p>Admin account created successfully.</p>
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
            Create Admin Account
          </CardTitle>
          <CardDescription className="text-center">
            One-time setup for Doorprize Manager
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 rounded-md bg-blue-50 p-3 text-sm text-blue-800">
            <p className="font-semibold mb-1">Recommended Credentials:</p>
            <p className="font-mono text-xs">Email: admin@doorprize.local</p>
            <p className="font-mono text-xs">Password: DoorprizeAdmin2025!</p>
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
                .then(() => {
                  setSuccess(true);
                  setIsLoading(false);
                })
                .catch((error) => {
                  setError(error.message || "Failed to create admin account");
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
                placeholder="admin@doorprize.local"
                defaultValue="admin@t.c"
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
                placeholder="Enter a strong password"
                defaultValue="123456"
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
              {isLoading ? "Creating Account..." : "Create Admin Account"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            <p>This page will only work once.</p>
            <p>After setup, use the regular sign-in page.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
