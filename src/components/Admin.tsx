"use client";

import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {format} from "date-fns";
import {enUS, ptBR} from "date-fns/locale";
import {Download, LogOut, Shield, Users} from "lucide-react";
import {signOut} from "next-auth/react";
import {useLocale, useTranslations} from "next-intl";
import dynamic from "next/dynamic";
import {useEffect, useState} from "react";
import {LanguageSwitcher} from "./LanguageSwitcher";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {ssr: false}
);

interface TimeEntry {
  id: string;
  date: Date;
  activity: string;
  type: string;
  startTime: string;
  endTime: string;
  totalHours: number;
}

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
  timeEntries: TimeEntry[];
}

interface AdminProps {
  users: User[];
}

export default function Admin({users}: AdminProps) {
  const t = useTranslations("Admin");
  const tc = useTranslations("Common");
  const tr = useTranslations("Report");
  const tg = useTranslations("Grid");
  const locale = useLocale();
  const dateLocale = locale === "pt" ? ptBR : enUS;

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const selectedUser = users.find(u => u.id === selectedUserId);

  const handleLogout = async () => {
    await signOut({redirect: true, callbackUrl: "/"});
  };

  const formatHours = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m.toString().padStart(2, "0")}min`;
  };

  const getUserStats = (user: User) => {
    const extra = user.timeEntries
      .filter(e => e.type === "extra")
      .reduce((acc, e) => acc + e.totalHours, 0);

    const compensation = user.timeEntries
      .filter(e => e.type === "compensation")
      .reduce((acc, e) => acc + e.totalHours, 0);

    return {
      extra,
      compensation,
      balance: extra - compensation,
      total: user.timeEntries.length
    };
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
              <h1 className="text-xl font-bold text-foreground">{t("title")}</h1>
              <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              {tc("logout")}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Stats Card */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("totalUsers")}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>

          {/* Users List */}
          <Card>
            <CardHeader>
              <CardTitle>{t("usersListTitle")}</CardTitle>
              <CardDescription>
                {t("usersListSubtitle")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{tg("name")}</TableHead>
                    <TableHead>{tg("email")}</TableHead>
                    <TableHead>{tg("role")}</TableHead>
                    <TableHead>{tg("records")}</TableHead>
                    <TableHead>{tg("extra")}</TableHead>
                    <TableHead>{tg("compensation")}</TableHead>
                    <TableHead>{tg("balance")}</TableHead>
                    <TableHead>{t("createdAt")}</TableHead>
                    <TableHead>{tc("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => {
                    const stats = getUserStats(user);
                    return (
                      <TableRow
                        key={user.id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => setSelectedUserId(user.id === selectedUserId ? null : user.id)}
                      >
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === "ADMIN" ? "destructive" : "outline"}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{stats.total}</TableCell>
                        <TableCell className="text-green-600">{formatHours(stats.extra)}</TableCell>
                        <TableCell className="text-red-600">{formatHours(stats.compensation)}</TableCell>
                        <TableCell className={stats.balance >= 0 ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                          {formatHours(stats.balance)}
                        </TableCell>
                        <TableCell>
                          {format(new Date(user.createdAt), "dd/MM/yyyy", {locale: dateLocale})}
                        </TableCell>
                        <TableCell>
                          {user.role !== "ADMIN" && isClient && (
                            <PDFDownloadLink
                              document={
                                (() => {
                                  const {ReportPDF} = require("./overtime/ReportPDF");
                                  return <ReportPDF records={user.timeEntries.map(e => ({
                                    id: e.id,
                                    date: e.date,
                                    activity: e.activity,
                                    type: e.type as "extra" | "compensation",
                                    startTime: e.startTime,
                                    endTime: e.endTime,
                                    totalHours: e.totalHours
                                  }))}
                                    userName={user.name || user.email}
                                    tReport={tr}
                                    tGrid={tg}
                                    locale={locale}
                                  />;
                                })()
                              }
                              fileName={`relatorio-${user.name?.replace(/\s+/g, '-')}-${new Date().toISOString().split("T")[0]}.pdf`}
                            >
                              {({loading}) => (
                                <Button variant="ghost" size="sm" disabled={loading}>
                                  <Download className="h-4 w-4" />
                                </Button>
                              )}
                            </PDFDownloadLink>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* User Details */}
          {selectedUser && (
            <Card>
              <CardHeader>
                <CardTitle>{t("userMovementsTitle", {name: selectedUser.name})}</CardTitle>
                <CardDescription>
                  {t("userMovementsSubtitle")}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedUser.timeEntries.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">
                    {t("noRecordsFound")}
                  </p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{tg("date")}</TableHead>
                        <TableHead>{tg("activity")}</TableHead>
                        <TableHead>{tg("type")}</TableHead>
                        <TableHead>{tg("start")}</TableHead>
                        <TableHead>{tg("end")}</TableHead>
                        <TableHead>{tg("total")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedUser.timeEntries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell>
                            {format(new Date(entry.date), "dd/MM/yyyy", {locale: dateLocale})}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{entry.activity}</TableCell>
                          <TableCell>
                            <Badge variant={entry.type === "extra" ? "default" : "secondary"}>
                              {entry.type === "extra" ? tg("extra") : tg("compensation")}
                            </Badge>
                          </TableCell>
                          <TableCell>{entry.startTime}</TableCell>
                          <TableCell>{entry.endTime}</TableCell>
                          <TableCell className={entry.type === "extra" ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                            {formatHours(entry.totalHours)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
