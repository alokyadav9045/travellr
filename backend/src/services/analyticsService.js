const Booking = require('../models/Booking');
const Trip = require('../models/Trip');
const User = require('../models/User');
const Vendor = require('../models/Vendor');
const logger = require('../utils/logger');

class AnalyticsService {
  /**
   * Get platform-wide analytics for admin dashboard
   */
  async getPlatformAnalytics(startDate, endDate) {
    try {
      const dateFilter = {};
      if (startDate && endDate) {
        dateFilter.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      const [
        userStats,
        vendorStats,
        bookingStats,
        revenueStats,
        tripStats,
        topDestinations,
        revenueByMonth,
      ] = await Promise.all([
        this.getUserStats(dateFilter),
        this.getVendorStats(dateFilter),
        this.getBookingStats(dateFilter),
        this.getRevenueStats(dateFilter),
        this.getTripStats(dateFilter),
        this.getTopDestinations(dateFilter),
        this.getRevenueByMonth(),
      ]);

      return {
        users: userStats,
        vendors: vendorStats,
        bookings: bookingStats,
        revenue: revenueStats,
        trips: tripStats,
        topDestinations,
        revenueByMonth,
        generatedAt: new Date(),
      };
    } catch (error) {
      logger.error('Platform analytics error:', error);
      throw error;
    }
  }

  /**
   * User statistics
   */
  async getUserStats(dateFilter = {}) {
    const [total, newUsers, activeUsers] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ role: 'customer', ...dateFilter }),
      User.countDocuments({
        role: 'customer',
        lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      }),
    ]);

    return {
      total,
      new: newUsers,
      active: activeUsers,
      change: 0, // Calculate percentage change if needed
    };
  }

  /**
   * Vendor statistics
   */
  async getVendorStats(dateFilter = {}) {
    const [total, pending, approved, newVendors] = await Promise.all([
      Vendor.countDocuments(),
      Vendor.countDocuments({ verificationStatus: 'pending' }),
      Vendor.countDocuments({ verificationStatus: 'approved' }),
      Vendor.countDocuments(dateFilter),
    ]);

    // Top performing vendors
    const topVendors = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'completed'] } } },
      {
        $group: {
          _id: '$vendor',
          totalBookings: { $sum: 1 },
          totalRevenue: { $sum: '$pricing.totalAmount' },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'vendors',
          localField: '_id',
          foreignField: '_id',
          as: 'vendor',
        },
      },
      { $unwind: '$vendor' },
      {
        $project: {
          businessName: '$vendor.businessName',
          totalBookings: 1,
          totalRevenue: 1,
          avgRating: '$vendor.stats.avgRating',
        },
      },
    ]);

    return {
      total,
      pending,
      approved,
      active: approved,
      new: newVendors,
      topVendors,
      change: 0,
    };
  }

  /**
   * Booking statistics
   */
  async getBookingStats(dateFilter = {}) {
    const statusCounts = await Booking.aggregate([
      { $match: dateFilter.createdAt ? dateFilter : {} },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const statusMap = {};
    statusCounts.forEach(s => {
      statusMap[s._id] = s.count;
    });

    const total = Object.values(statusMap).reduce((a, b) => a + b, 0);
    const conversionRate = total > 0 
      ? ((statusMap.confirmed || 0) + (statusMap.completed || 0)) / total * 100 
      : 0;

    // Booking trends
    const bookingTrends = await Booking.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          count: { $sum: 1 },
          revenue: { $sum: '$pricing.totalAmount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
      { $limit: 30 },
    ]);

    return {
      total,
      byStatus: statusMap,
      conversionRate: conversionRate.toFixed(2),
      trends: bookingTrends,
      change: 0,
    };
  }

  /**
   * Revenue statistics
   */
  async getRevenueStats(dateFilter = {}) {
    const revenueData = await Booking.aggregate([
      {
        $match: {
          status: { $in: ['confirmed', 'completed'] },
          'payment.status': 'paid',
          ...(dateFilter.createdAt ? dateFilter : {}),
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$pricing.totalAmount' },
          totalCommission: { $sum: '$commission.amount' },
          totalVendorPayouts: { $sum: '$commission.vendorPayout' },
          avgBookingValue: { $avg: '$pricing.totalAmount' },
          bookingCount: { $sum: 1 },
        },
      },
    ]);

    const revenue = revenueData[0] || {
      totalRevenue: 0,
      totalCommission: 0,
      totalVendorPayouts: 0,
      avgBookingValue: 0,
      bookingCount: 0,
    };

    return {
      total: revenue.totalRevenue,
      ...revenue,
      change: 0,
    };
  }

  /**
   * Trip statistics
   */
  async getTripStats(dateFilter = {}) {
    const [total, published, draft] = await Promise.all([
      Trip.countDocuments(),
      Trip.countDocuments({ status: 'published' }),
      Trip.countDocuments({ status: 'draft' }),
    ]);

    return {
      total,
      published,
      draft,
      active: published,
    };
  }

  /**
   * Top destinations by bookings
   */
  async getTopDestinations(dateFilter = {}) {
    return Booking.aggregate([
      {
        $match: {
          status: { $in: ['confirmed', 'completed'] },
          ...(dateFilter.createdAt ? dateFilter : {}),
        },
      },
      {
        $group: {
          _id: '$tripSnapshot.location.city',
          country: { $first: '$tripSnapshot.location.country' },
          bookings: { $sum: 1 },
          revenue: { $sum: '$pricing.totalAmount' },
          guests: { $sum: '$totalGuests' },
        },
      },
      { $sort: { bookings: -1 } },
      { $limit: 10 },
    ]);
  }

  /**
   * Revenue by month (last 12 months)
   */
  async getRevenueByMonth() {
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    return Booking.aggregate([
      {
        $match: {
          status: { $in: ['confirmed', 'completed'] },
          'payment.status': 'paid',
          createdAt: { $gte: twelveMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          revenue: { $sum: '$pricing.totalAmount' },
          commission: { $sum: '$commission.amount' },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);
  }

  /**
   * Get vendor-specific analytics
   */
  async getVendorAnalytics(vendorId, startDate, endDate) {
    try {
      const dateFilter = { vendor: vendorId };
      if (startDate && endDate) {
        dateFilter.createdAt = {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        };
      }

      const [
        overview,
        revenueByTrip,
        bookingTrends,
      ] = await Promise.all([
        this.getVendorOverview(vendorId, dateFilter),
        this.getVendorRevenueByTrip(vendorId, dateFilter),
        this.getVendorBookingTrends(vendorId),
      ]);

      return {
        overview,
        revenueByTrip,
        bookingTrends,
        generatedAt: new Date(),
      };
    } catch (error) {
      logger.error('Vendor analytics error:', error);
      throw error;
    }
  }

  /**
   * Vendor overview stats
   */
  async getVendorOverview(vendorId, dateFilter) {
    const bookings = await Booking.aggregate([
      { $match: dateFilter },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          confirmedBookings: {
            $sum: { $cond: [{ $in: ['$status', ['confirmed', 'completed']] }, 1, 0] },
          },
          totalRevenue: {
            $sum: {
              $cond: [
                { $in: ['$status', ['confirmed', 'completed']] },
                '$pricing.totalAmount',
                0,
              ],
            },
          },
          totalEarnings: {
            $sum: {
              $cond: [
                { $in: ['$status', ['confirmed', 'completed']] },
                '$commission.vendorPayout',
                0,
              ],
            },
          },
          totalGuests: { $sum: '$totalGuests' },
          avgBookingValue: { $avg: '$pricing.totalAmount' },
        },
      },
    ]);

    const trips = await Trip.countDocuments({ 
      vendor: vendorId, 
      status: 'published' 
    });

    return {
      ...(bookings[0] || {
        totalBookings: 0,
        confirmedBookings: 0,
        totalRevenue: 0,
        totalEarnings: 0,
        totalGuests: 0,
        avgBookingValue: 0,
      }),
      activeTrips: trips,
    };
  }

  /**
   * Revenue breakdown by trip
   */
  async getVendorRevenueByTrip(vendorId, dateFilter) {
    return Booking.aggregate([
      {
        $match: {
          ...dateFilter,
          status: { $in: ['confirmed', 'completed'] },
        },
      },
      {
        $group: {
          _id: '$trip',
          tripTitle: { $first: '$tripSnapshot.title' },
          bookings: { $sum: 1 },
          revenue: { $sum: '$pricing.totalAmount' },
          earnings: { $sum: '$commission.vendorPayout' },
          guests: { $sum: '$totalGuests' },
        },
      },
      { $sort: { revenue: -1 } },
      { $limit: 10 },
    ]);
  }

  /**
   * Vendor booking trends (last 30 days)
   */
  async getVendorBookingTrends(vendorId) {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    return Booking.aggregate([
      {
        $match: {
          vendor: vendorId,
          createdAt: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
          },
          bookings: { $sum: 1 },
          revenue: { $sum: '$pricing.totalAmount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } },
    ]);
  }
}

module.exports = new AnalyticsService();
