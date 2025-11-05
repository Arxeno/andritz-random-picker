import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface NavigationCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

export function NavigationCard({ title, description, icon: Icon, href }: NavigationCardProps) {
  return (
    <Link href={href}>
      <Card className="h-full transition-all hover:shadow-md hover:border-primary/50 cursor-pointer">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription>{description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}

