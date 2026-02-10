import Login from "@/components/Login";
import {redirect} from "@/i18n/routing";
import {authOptions} from "@/lib/auth";
import {getServerSession} from "next-auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <main>
      <Login />
    </main>
  );
}
