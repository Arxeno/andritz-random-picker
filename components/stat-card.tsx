import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon, Plus } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  loading?: boolean;
  actionHref?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  loading,
  actionHref,
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          {actionHref && (
            <Link href={actionHref}>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 rounded-full hover:bg-primary/10 hover:text-primary"
                aria-label={`Add ${title.toLowerCase()}`}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </Link>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-2xl font-bold text-muted-foreground">...</div>
        ) : (
          <div className="text-2xl font-bold">{value}</div>
        )}
      </CardContent>
    </Card>
  );
}
