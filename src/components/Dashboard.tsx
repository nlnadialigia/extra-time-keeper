"use client";

import {DeleteConfirmDialog} from "@/components/overtime/DeleteConfirmDialog";
import {ExportButton} from "@/components/overtime/ExportButton";
import {OvertimeGrid, OvertimeRecord} from "@/components/overtime/OvertimeGrid";
import {StatsCard} from "@/components/overtime/StatsCard";
import {TimeEntryDialog} from "@/components/overtime/TimeEntryDialog";
import {Button} from "@/components/ui/button";
import {useTimeEntries} from "@/hooks/useTimeEntries";
import {ArrowRightLeft, Clock, LogOut, Plus, Shield, TrendingUp, User} from "lucide-react";
import {signOut} from "next-auth/react";
import Link from "next/link";
import {useState} from "react";

// Mock data - replace with your data fetching logic
const mockRecords: OvertimeRecord[] = [
  {
    id: "1",
    date: new Date("2024-01-15"),
    activity: "Deploy de emergência em produção",
    type: "extra",
    startTime: "18:00",
    endTime: "22:30",
    totalHours: 4.5,
  },
  {
    id: "2",
    date: new Date("2024-01-18"),
    activity: "Reunião com cliente internacional",
    type: "extra",
    startTime: "07:00",
    endTime: "09:00",
    totalHours: 2,
  },
  {
    id: "3",
    date: new Date("2024-01-22"),
    activity: "Compensação - Consulta médica",
    type: "compensation",
    startTime: "14:00",
    endTime: "18:00",
    totalHours: 4,
  },
  {
    id: "4",
    date: new Date("2024-01-25"),
    activity: "Suporte crítico ao sistema",
    type: "extra",
    startTime: "20:00",
    endTime: "23:00",
    totalHours: 3,
  },
  {
    id: "5",
    date: new Date("2024-01-28"),
    activity: "Compensação - Assuntos pessoais",
    type: "compensation",
    startTime: "09:00",
    endTime: "12:00",
    totalHours: 3,
  },
  {
    id: "6",
    date: new Date("2024-02-01"),
    activity: "Migração de banco de dados",
    type: "extra",
    startTime: "21:00",
    endTime: "02:00",
    totalHours: 5,
  },
];

export interface DashboardProps {
  initialRecords: OvertimeRecord[];
  isAdmin?: boolean;
}

export default function Dashboard({initialRecords = [], isAdmin = false}: DashboardProps) {
  const {records, addRecord, updateRecord, removeRecord} = useTimeEntries(initialRecords);

  // Estados para modais
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<OvertimeRecord | null>(null);
  const [entryToDelete, setEntryToDelete] = useState<{id: string; activity: string;} | null>(null);

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
    setEntryToDelete({id: entry.id, activity: entry.activity});
    setIsDeleteDialogOpen(true);
  };

  const handleSuccess = (action: 'create' | 'update' | 'delete', record?: OvertimeRecord) => {
    if (action === 'create' && record) {
      addRecord(record);
    } else if (action === 'update' && record) {
      updateRecord(record.id, record);
    } else if (action === 'delete' && entryToDelete) {
      removeRecord(entryToDelete.id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg gradient-primary p-2">
              <Clock className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Controle de Horas</h1>
              <p className="text-sm text-muted-foreground">Gerencie suas horas extras</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ExportButton records={records} />
            {isAdmin && (
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <Shield className="mr-2 h-4 w-4" />
                  Admin
                </Button>
              </Link>
            )}
            <Link href="/profile">
              <Button variant="ghost" size="sm">
                <User className="mr-2 h-4 w-4" />
                Perfil
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="animate-slide-up" style={{animationDelay: "0ms"}}>
            <StatsCard
              title="Total Horas Extras"
              value={formatHours(totalExtra)}
              subtitle="Horas trabalhadas além do expediente"
              icon={TrendingUp}
              variant="extra"
            />
          </div>
          <div className="animate-slide-up" style={{animationDelay: "100ms"}}>
            <StatsCard
              title="Total Compensado"
              value={formatHours(totalCompensation)}
              subtitle="Horas já compensadas"
              icon={ArrowRightLeft}
              variant="compensation"
            />
          </div>
          <div className="animate-slide-up sm:col-span-2 lg:col-span-1" style={{animationDelay: "200ms"}}>
            <StatsCard
              title="Saldo de Horas"
              value={formatHours(balance)}
              subtitle={balance >= 0 ? "Horas a compensar" : "Horas em débito"}
              icon={Clock}
              variant="balance"
              isNegative={balance < 0}
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="animate-fade-in" style={{animationDelay: "300ms"}}>
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">Registros</h2>
              <p className="text-sm text-muted-foreground">
                Histórico de horas extras e compensações
              </p>
            </div>
            <Button
              className="gradient-primary hover:opacity-90 transition-opacity"
              onClick={handleNewEntry}
            >
              <Plus className="mr-2 h-4 w-4" />
              Novo Registro
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

        {entryToDelete && (
          <DeleteConfirmDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            entryId={entryToDelete.id}
            entryActivity={entryToDelete.activity}
            onSuccess={() => handleSuccess('delete')}
          />
        )}
      </main>
    </div>
  );
}
