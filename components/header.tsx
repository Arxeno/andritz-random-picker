"use client";

import { useAuthActions } from "@convex-dev/auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  const { signOut } = useAuthActions();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/signin");
  };

  return (
      <header className="sticky top-0 z-50 w-full border-b px-4 bg-white/20 backdrop-blur ">
      <div className="flex h-16 w-full items-center justify-between">
        <Link href={"/"}>
          <Image
            src={"/logo.svg"}
            alt="Doorprize App"
            width={128}
            height={32}
            className="bg-white px-4 py-2 rounded-md"
          />
        </Link>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-white uppercase">Doorprize App</h1>
        </div>
        <Button variant="outline" size="sm" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </header>
  );
}
