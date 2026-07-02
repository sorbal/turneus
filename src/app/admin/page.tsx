import {
  Activity,
  BadgeCheck,
  CalendarDays,
  Gamepad2,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";

import { AdminDashboardActivityCard } from "@/components/admin/admin-dashboard-activity-card";
import { AdminDashboardCardGrid } from "@/components/admin/admin-dashboard-card-grid";
import { AdminDashboardInsightCard } from "@/components/admin/admin-dashboard-insight-card";
import { AdminDashboardLayout } from "@/components/admin/admin-dashboard-layout";
import { AdminDashboardPriorityCard } from "@/components/admin/admin-dashboard-priority-card";
import { AdminDashboardStatusCard } from "@/components/admin/admin-dashboard-status-card";
import { AdminSectionHeader } from "@/components/admin/admin-section-header";

const stats = [
  {
    title: "Module active",
    value: "3",
    description: "Auth, admin layout si jocuri.",
    icon: Activity,
    tone: "success" as const,
    meta: "Foundation",
  },
  {
    title: "Sprint curent",
    value: "v0.3.0",
    description: "Dashboard si Games CRUD.",
    icon: Trophy,
    tone: "info" as const,
    meta: "In dezvoltare",
  },
  {
    title: "Jocuri initiale",
    value: "4",
    description: "Remi, Table, FIFA si Pescuit.",
    icon: Gamepad2,
    tone: "default" as const,
    meta: "Extensibil",
  },
  {
    title: "Sezon activ",
    value: "2026",
    description: "Fundatie pentru clasamente.",
    icon: CalendarDays,
    tone: "warning" as const,
    meta: "2026",
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

const statusItems = [
  {
    title: "Repository",
    description: "Ultimul status documentat: clean",
    icon: BadgeCheck,
    tone: "success" as const,
  },
  {
    title: "Arhitectura",
    description: "Services si repositories raman separate de pagini.",
    icon: ShieldCheck,
    tone: "info" as const,
  },
];

const insightItems = [
  "Layout-ul admin premium este pregatit pentru module CRUD complete.",
  "Sidebar, header si cards folosesc componente reutilizabile.",
  "Urmatorul focus ramane Games CRUD complet, conform roadmap v0.3.0.",
];

const activityItems = [
  {
    title: "Premium sidebar",
    description: "Navigatie grupata, linkuri active si fundatie extensibila.",
    status: "done" as const,
  },
  {
    title: "Premium header",
    description: "Actiuni vizuale, status sprint si zona user rafinata.",
    status: "done" as const,
  },
  {
    title: "Dashboard cards",
    description: "Grid statistic si carduri operationale extrase in componente.",
    status: "done" as const,
  },
  {
    title: "Dashboard final",
    description: "Finisare UI pentru baza admin din Epic 2.",
    status: "active" as const,
  },
];

export default async function AdminDashboard() {
  return (
    <AdminDashboardLayout
      header={
        <AdminSectionHeader
          eyebrow="Dashboard"
          title="Administrare Turneus"
          description="Fundatia premium pentru operatiunile platformei: module clare, status vizibil si acces rapid catre administrare."
        />
      }
      stats={<AdminDashboardCardGrid stats={stats} />}
      main={
        <>
          <AdminDashboardPriorityCard modules={nextModules} />
          <AdminDashboardStatusCard items={statusItems} />
        </>
      }
      secondary={
        <>
          <AdminDashboardInsightCard
            title="Foundation gata pentru productie"
            description="Dashboard-ul admin este pregatit pentru urmatoarele module fara schimbari de arhitectura."
            items={insightItems}
          />
          <AdminDashboardActivityCard items={activityItems} />
        </>
      }
    />
  );
}
