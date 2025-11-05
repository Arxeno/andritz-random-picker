"use client";

import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Header } from "@/components/header";
import { StatCard } from "@/components/stat-card";
import { NavigationCard } from "@/components/navigation-card";
import {
  Users,
  Trophy,
  UserPlus,
  Disc3,
  History,
  Download,
} from "lucide-react";

export default function Home() {
  const stats = useQuery(api.dashboard.getStats);

  return (
    <>
      <Header />
      <main className="container py-8">
        <div className="space-y-8">
          {/* Dashboard Stats Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4">📊 Dashboard Stats</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
              <StatCard
                title="Total Participants"
                value={stats?.participantCount ?? 0}
                icon={Users}
                loading={stats === undefined}
              />
              <StatCard
                title="Total Winners"
                value={stats?.winnerCount ?? 0}
                icon={Trophy}
                loading={stats === undefined}
              />
            </div>
          </section>

          {/* Quick Actions Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4">🎯 Quick Actions</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <NavigationCard
                title="Manage Participants"
                description="Add, import, and manage event participants"
                icon={UserPlus}
                href="/participants"
              />
              <NavigationCard
                title="Spin the Wheel"
                description="Select winners with interactive spinning wheel"
                icon={Disc3}
                href="/spin"
              />
              <NavigationCard
                title="Winner History"
                description="View all confirmed winners from this event"
                icon={History}
                href="/winners"
              />
              <NavigationCard
                title="Export Data"
                description="Download winner list as Excel spreadsheet"
                icon={Download}
                href="/export"
              />
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
