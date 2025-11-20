import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

interface ParticipantCardProps {
  participant: {
    _id: Id<"participants">;
    fullName: string;
    department: string;
  };
}

export const ParticipantCard = ({ participant }: ParticipantCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-2 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#DCB96E] to-[#CD974E] flex items-center justify-center shrink-0">
            <User className="h-6 w-6 text-[#B06727]" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg truncate">
              {participant.fullName}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

