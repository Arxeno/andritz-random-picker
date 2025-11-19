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
  Gift,
  QrCode,
  UserCheck,
} from "lucide-react";

export default function Home() {
  const stats = useQuery(api.dashboard.getStats);

  const devMode: boolean = false;

  return (
    <div>
      <Header />
      <main className="container p-8 mx-auto">
        <div className="space-y-8">
          {/* Dashboard Stats Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4">📊 Dashboard Stats</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <StatCard
                title="Total Participants"
                value={stats?.participantCount ?? 0}
                icon={Users}
                loading={stats === undefined}
                actionHref="/participants"
              />
              <StatCard
                title="Total Winners"
                value={stats?.winnerCount ?? 0}
                icon={Trophy}
                loading={stats === undefined}
              />
              <StatCard
                title="Total Prizes"
                value={stats?.prizeCount ?? 0}
                icon={Gift}
                loading={stats === undefined}
                actionHref="/prizes"
              />
            </div>
          </section>

          {/* Quick Actions Section */}
          <section>
            <h2 className="text-2xl font-bold mb-4">🎯 Quick Actions</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <NavigationCard
                title="Manage Participants"
                description="Add, import, and manage event participants"
                icon={UserPlus}
                href="/participants"
              />
              <NavigationCard
                title="Manage Prizes"
                description="Add and manage prizes for your event"
                icon={Gift}
                href="/prizes"
              />
              <NavigationCard
                title="Spin the Wheel"
                description="Select winners with interactive spinning wheel"
                icon={Disc3}
                href={devMode ? "/dummy-spin" : "/spin"}
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
              <NavigationCard
                title="QR Code Display"
                description="Display QR code on projector for participant registration"
                icon={QrCode}
                href="/register-qr"
              />
              <NavigationCard
                title="Registered Users"
                description="View all registered participants in card layout"
                icon={UserCheck}
                href="/registered-user"
              />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
