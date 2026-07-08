import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect("/login");
  }

  const role = session.user.role?.toLowerCase() || "student";
  redirect(`/dashboard/${role}`);
}
