"use client";

import {LanguageSwitcher} from "@/components/LanguageSwitcher";
import {ExportButton} from "@/components/overtime/ExportButton";
import {OvertimeGrid, OvertimeRecord} from "@/components/overtime/OvertimeGrid";
import {StatsCard} from "@/components/overtime/StatsCard";
import {TimeEntryDialog} from "@/components/overtime/TimeEntryDialog";
import {Button} from "@/components/ui/button";
import {useTimeEntries} from "@/hooks/useTimeEntries";
import {Link} from "@/i18n/routing";
import {ArrowRightLeft, Clock, LogOut, Plus, TrendingUp, User} from "lucide-react";
import {signOut} from "next-auth/react";
import {useTranslations} from "next-intl";
import {useState} from "react";
import {toast} from "sonner";

export interface DashboardProps {
  initialRecords: OvertimeRecord[];
}

export default function Dashboard({initialRecords = []}: DashboardProps) {
  const t = useTranslations("Dashboard");
  const tc = useTranslations("Common");
  const {records, addRecord, updateRecord, removeRecord} = useTimeEntries(initialRecords);

  // Estados para modais
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<OvertimeRecord | null>(null);

  // Calculate stats
  const totalExtra = records
    .filter((r) => r.type === "extra")
    .reduce((acc, r) => acc + r.totalHours, 0);

  const totalCompensation = records
    .filter((r) => r.type === "compensation")
    .reduce((acc, r) => acc + r.totalHours, 0);

  const balance = totalExtra - totalCompensation;

  const formatHours = (hours: number) => {
    const h = Math.floor(Math.abs(hours));
    const m = Math.round((Math.abs(hours) - h) * 60);
    const sign = hours < 0 ? "-" : "";
    return `${sign}${h}h ${m.toString().padStart(2, "0")}min`;
  };

  const handleLogout = async () => {
    await signOut({redirect: true, callbackUrl: "/"});
  };

  const handleNewEntry = () => {
    setSelectedEntry(null);
    setIsDialogOpen(true);
  };

  const handleEdit = (entry: OvertimeRecord) => {
    setSelectedEntry(entry);
    setIsDialogOpen(true);
  };

  const handleDelete = (entry: OvertimeRecord) => {
    toast(t("deleteConfirm", {activity: entry.activity}), {
      description: t("deleteDescription"),
      action: {
        label: tc("delete"),
        onClick: async () => {
          try {
            await removeRecord(entry.id);
            toast.success(t("deleteSuccess"));
          } catch (error) {
            toast.error(t("deleteError"));
          }
        },
      },
      cancel: {
        label: tc("cancel"),
      },
    });
  };

  const handleSuccess = (action: 'create' | 'update', record?: OvertimeRecord) => {
    if (action === 'create' && record) {
      addRecord(record);
    } else if (action === 'update' && record) {
      updateRecord(record.id, record);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b shadow-sm" style={{backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))'}}>
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg gradient-primary p-2">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{color: 'hsl(var(--foreground))'}}>{t("title")}</h1>
              <p className="text-sm" style={{color: 'hsl(var(--muted-foreground))'}}>{t("subtitle")}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ExportButton records={records} />
            <Link href="/profile">
              <Button variant="ghost" size="sm">
                <User className="mr-2 h-4 w-4" />
                {tc("profile")}
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              style={{color: 'hsl(var(--muted-foreground))'}}
              className="hover:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              {tc("logout")}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatsCard
            title={t("totalExtra")}
            value={formatHours(totalExtra)}
            subtitle={t("totalExtraSub")}
            icon={TrendingUp}
            variant="extra"
          />
          <StatsCard
            title={t("totalCompensated")}
            value={formatHours(totalCompensation)}
            subtitle={t("totalCompensatedSub")}
            icon={ArrowRightLeft}
            variant="compensation"
          />
          <div className="sm:col-span-2 lg:col-span-1">
            <StatsCard
              title={t("balance")}
              value={formatHours(balance)}
              subtitle={balance >= 0 ? t("balanceSubPos") : t("balanceSubNeg")}
              icon={Clock}
              variant="balance"
              isNegative={balance < 0}
            />
          </div>
        </div>

        {/* Table Section */}
        <div>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold" style={{color: 'hsl(var(--foreground))'}}>{t("records")}</h2>
              <p className="text-sm" style={{color: 'hsl(var(--muted-foreground))'}}>
                {t("recordsSubtitle")}
              </p>
            </div>
            <Button
              className="gradient-primary hover:opacity-90 transition-opacity text-white"
              onClick={handleNewEntry}
            >
              <Plus className="mr-2 h-4 w-4" />
              {t("newEntry")}
            </Button>
          </div>

          <OvertimeGrid
            records={records}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>

        {/* Modais */}
        <TimeEntryDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          entry={selectedEntry}
          onSuccess={handleSuccess}
        />
      </main>
    </div>
  );
}
