import React from 'react'
import { getAdminStats } from "@/actions/getAdminStats";
import AdminDashboard from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
  const stats = await getAdminStats();

  return (
    <div className="p-8 pt-6">
      <AdminDashboard stats={stats} />
    </div>
  )
}