import {getTimeEntries} from "@/app/actions/entry";
import Dashboard from "@/components/Dashboard";
import {OvertimeRecord} from "@/components/overtime/OvertimeGrid";
import {authOptions} from "@/lib/auth";
import {prisma} from "@/lib/db";
import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  // Check if user is admin - redirect to admin page
  const user = await prisma.user.findUnique({
    where: {email: session.user?.email!},
    select: {role: true}
  });

  if (user?.role === "ADMIN") {
    redirect("/admin");
  }

  // Fetch real data
  const dbRecords = await getTimeEntries();

  const initialRecords: OvertimeRecord[] = dbRecords.map(r => ({
    id: r.id,
    date: r.date,
    activity: r.activity,
    type: r.type as "extra" | "compensation",
    startTime: r.startTime,
    endTime: r.endTime,
    totalHours: r.totalHours
  }));

  return <Dashboard initialRecords={initialRecords} />;
}
