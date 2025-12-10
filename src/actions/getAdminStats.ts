'use server'

import User from "@/models/User";
import Payment from "@/models/Payment";
import connectDB from "@/lib/mongodb";

export async function getAdminStats() {
    try {
        await connectDB();

        // 1. Get User Count (role: 'user')
        const userCount = await User.countDocuments({ role: 'user' });

        // 2. Get Monthly Earnings (current month, status: 'CONFIRMED')
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        const payments = await Payment.find({
            status: 'CONFIRMED',
            createdAt: {
                $gte: startOfMonth,
                $lte: endOfMonth
            }
        });

        const monthlyEarnings = payments.reduce((acc, payment) => acc + (payment.amount || 0), 0);

        // 3. Prepare Chart Data (Daily earnings for the month)
        // Initialize an array representing days of the month with 0 earnings
        const daysInMonth = endOfMonth.getDate();
        const chartDataMap = new Map<number, number>();

        for (let i = 1; i <= daysInMonth; i++) {
            chartDataMap.set(i, 0);
        }

        payments.forEach(payment => {
            const day = new Date(payment.createdAt).getDate();
            const currentAmount = chartDataMap.get(day) || 0;
            chartDataMap.set(day, currentAmount + (payment.amount || 0));
        });

        const earningsChartData = Array.from(chartDataMap.entries()).map(([day, amount]) => ({
            name: day.toString(), // recharts prefers string for X axis usually
            amount: amount
        }));


        return {
            userCount,
            monthlyEarnings,
            earningsChartData
        };

    } catch (error) {
        console.error("Error fetching admin stats:", error);
        return {
            userCount: 0,
            monthlyEarnings: 0,
            earningsChartData: []
        };
    }
}
