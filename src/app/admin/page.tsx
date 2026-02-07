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

  // Get all users and entries for admin
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: {
        select: {
          timeEntries: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  const pendingEntries = await prisma.timeEntry.findMany({
    where: {
      status: "PENDING"
    },
    include: {
      user: {
        select: {
          name: true,
          email: true
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return <Admin users={users} pendingEntries={pendingEntries} />;
}
