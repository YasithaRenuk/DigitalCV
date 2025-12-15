"use client";

import React, { useEffect, useState } from 'react';
import AdminDashboard from "@/components/admin/AdminDashboard";

export default function AdminPage() {
  const [stats, setStats] = useState({
    userCount: 0,
    monthlyEarnings: 0,
    earningsChartData: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        const data = await response.json();

        if (data.success) {
          setStats(data.stats);
        } else {
          setError(data.error || "Failed to fetch stats");
        }
      } catch (err) {
        console.error("Error fetching admin stats:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="pl-8 pr-8 flex justify-center items-center h-full min-h-[50vh]">
        <div className="text-gray-500">Loading dashboard...</div>
        {/* You could replace this with a proper Spinner component if available */}
      </div>
    );
  }

  if (error) {
     return (
        <div className="pl-8 pr-8 pt-8 text-center text-red-500">
           {error}
        </div>
     )
  }

  return (
    <div className="pl-8 pr-8">
      <AdminDashboard stats={stats} />
    </div>
  )
}