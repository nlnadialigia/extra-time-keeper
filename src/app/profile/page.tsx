import Profile from "@/components/Profile";
import {authOptions} from "@/lib/auth";
import {getServerSession} from "next-auth";
import {redirect} from "next/navigation";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return <Profile />;
}
