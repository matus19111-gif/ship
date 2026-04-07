// app/dashboard/page.js
import ButtonAccount from "@/components/ButtonAccount";
import DashboardClient from "./_components/DashboardClient";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  return <DashboardClient />;
}
