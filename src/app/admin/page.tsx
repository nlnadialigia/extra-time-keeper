import Admin from "@/components/Admin";
import {authOptions} from "@/lib/auth";
import {prisma} from "@/lib/db";
import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: {email: session.user?.email!}
  });

  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Get all users with their time entries
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      timeEntries: {
        orderBy: {
          date: "desc"
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return <Admin users={users} />;
}
