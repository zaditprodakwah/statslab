import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminIndexPage() {
  const user = await getCurrentUser();
  if (user && (user.role === "ADMIN" || user.role === "PENELITI")) {
    redirect("/admin/dashboard");
  }
  redirect("/login?redirect=/admin");
}
