"use client";

import {approveTimeEntry, rejectTimeEntry} from "@/app/actions/admin";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {useToast} from "@/hooks/use-toast";
import {ArrowLeft, Check, Shield, Users, X, Clock} from "lucide-react";
import Link from "next/link";
import {format} from "date-fns";
import {ptBR} from "date-fns/locale";
import {useState} from "react";

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
  _count: {
    timeEntries: number;
  };
}

interface PendingEntry {
  id: string;
  date: Date;
  activity: string;
  type: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  status: string;
  user: {
    name: string | null;
    email: string;
  };
  createdAt: Date;
}

interface AdminProps {
  users: User[];
  pendingEntries: PendingEntry[];
}

export default function Admin({users, pendingEntries}: AdminProps) {
  const {toast} = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleApproveEntry = async (entryId: string) => {
    setIsLoading(true);
    try {
      await approveTimeEntry(entryId);
      
      toast({
        title: "Registro aprovado!",
        description: "O registro foi aprovado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao aprovar registro.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRejectEntry = async (entryId: string) => {
    setIsLoading(true);
    try {
      await rejectTimeEntry(entryId);
      
      toast({
        title: "Registro rejeitado!",
        description: "O registro foi rejeitado.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Erro ao rejeitar registro.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatHours = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m.toString().padStart(2, "0")}min`;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="rounded-lg gradient-primary p-2">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Painel Administrativo</h1>
              <p className="text-sm text-muted-foreground">Gerencie usuários e aprovações</p>
            </div>
          </div>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Stats Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{users.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Registros Pendentes</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingEntries.length}</div>
              </CardContent>
            </Card>
          </div>

          {/* Pending Entries */}
          <Card>
            <CardHeader>
              <CardTitle>Registros Pendentes de Aprovação</CardTitle>
              <CardDescription>
                Registros que aguardam sua aprovação ou rejeição
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingEntries.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  Nenhum registro pendente de aprovação
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Atividade</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Horas</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{entry.user.name}</div>
                            <div className="text-sm text-muted-foreground">{entry.user.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(new Date(entry.date), "dd/MM/yyyy", {locale: ptBR})}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{entry.activity}</TableCell>
                        <TableCell>
                          <Badge variant={entry.type === "extra" ? "default" : "secondary"}>
                            {entry.type === "extra" ? "Extra" : "Compensação"}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatHours(entry.totalHours)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleApproveEntry(entry.id)}
                              disabled={isLoading}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleRejectEntry(entry.id)}
                              disabled={isLoading}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Users Management */}
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Usuários</CardTitle>
              <CardDescription>
                Lista de todos os usuários do sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Registros</TableHead>
                    <TableHead>Cadastro</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === "ADMIN" ? "destructive" : "outline"}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{user._count.timeEntries}</TableCell>
                      <TableCell>
                        {format(new Date(user.createdAt), "dd/MM/yyyy", {locale: ptBR})}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
