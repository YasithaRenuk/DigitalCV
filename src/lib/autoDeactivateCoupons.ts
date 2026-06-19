import Coupon from '@/models/Coupon';

/**
 * Auto-deactivates any coupon that is currently marked as active
 * but falls outside its valid date range (endDate passed or startDate not yet reached).
 *
 * Call this after `connectDB()` in any API route that reads or validates coupons.
 */
export async function autoDeactivateExpiredCoupons(): Promise<void> {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

  await Coupon.updateMany(
    {
      isActive: true,
      $or: [
        { endDate: { $lt: startOfToday } },  // endDate has passed
        { startDate: { $gt: endOfToday } },   // startDate hasn't been reached yet
      ],
    },
    { $set: { isActive: false } }
  );
}
