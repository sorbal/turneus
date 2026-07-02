import {
  Activity,
  BadgeCheck,
  CalendarDays,
  Gamepad2,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";

import { AdminSectionHeader } from "@/components/admin/admin-section-header";
import { AdminStatCard } from "@/components/admin/admin-stat-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const stats = [
  {
    title: "Module active",
    value: "3",
    description: "Auth, admin layout si jocuri.",
    icon: Activity,
    tone: "success" as const,
  },
  {
    title: "Sprint curent",
    value: "v0.3.0",
    description: "Dashboard si Games CRUD.",
    icon: Trophy,
    tone: "info" as const,
  },
  {
    title: "Jocuri initiale",
    value: "4",
    description: "Remi, Table, FIFA si Pescuit.",
    icon: Gamepad2,
    tone: "default" as const,
  },
  {
    title: "Sezon activ",
    value: "2026",
    description: "Fundatie pentru clasamente.",
    icon: CalendarDays,
    tone: "warning" as const,
  },
];

const nextModules = [
  {
    title: "Games CRUD",
    description: "Listare, adaugare, editare, stergere si validari.",
    icon: Gamepad2,
  },
  {
    title: "Cities CRUD",
    description: "Administrare orase pentru turnee si profiluri publice.",
    icon: Users,
  },
  {
    title: "Organizer Flow",
    description: "Aprobare organizatori si administrare profiluri locale.",
    icon: ShieldCheck,
  },
];

export default async function AdminDashboard() {
  return (
    <div className="space-y-8">
      <AdminSectionHeader
        eyebrow="Dashboard"
        title="Administrare Turneus"
        description="Fundatia premium pentru operatiunile platformei: module clare, status vizibil si acces rapid catre administrare."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <AdminStatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            tone={stat.tone}
          />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-white/10 bg-card/80">
          <CardHeader>
            <CardTitle>Prioritati v0.3.0</CardTitle>
            <CardDescription>
              Ordinea de lucru ramane incrementala, cu fiecare modul dus pana la
              build.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {nextModules.map((module) => (
              <div
                key={module.title}
                className="flex gap-3 rounded-lg border border-border bg-background/60 p-4"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                  <module.icon className="size-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{module.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {module.description}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-card/80">
          <CardHeader>
            <CardTitle>Status platforma</CardTitle>
            <CardDescription>
              Snapshot operational pentru sprintul curent.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between gap-4 rounded-lg bg-background/60 p-4">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Repository
                </p>
                <p className="text-sm text-muted-foreground">
                  Ultimul status documentat: clean
                </p>
              </div>
              <BadgeCheck
                className="size-5 text-emerald-400"
                aria-hidden="true"
              />
            </div>
            <div className="flex items-center justify-between gap-4 rounded-lg bg-background/60 p-4">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Arhitectura
                </p>
                <p className="text-sm text-muted-foreground">
                  Services si repositories raman separate de pagini.
                </p>
              </div>
              <ShieldCheck
                className="size-5 text-sky-400"
                aria-hidden="true"
              />
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
