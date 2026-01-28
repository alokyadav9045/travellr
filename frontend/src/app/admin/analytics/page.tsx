'use client';

import React, { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { Calendar, Download, Filter } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface AnalyticsMetrics {
  revenue: {
    totalRevenue: number;
    totalBookings: number;
    avgOrderValue: number;
  };
  userGrowth: Array<{
    _id: { year: number; month: number; day: number };
    newUsers: number;
  }>;
  bookingTrends: Array<{
    _id: { year: number; month: number; day: number };
    count: number;
    revenue: number;
  }>;
  topTrips: Array<{
    _id: string;
    title: string;
    totalBookings: number;
    revenue: number;
  }>;
  promoEffectiveness: Array<{
    _id: string;
    usageCount: number;
    totalDiscount: number;
    revenue: number;
  }>;
}

export default function AnalyticsDashboard() {
  const [metrics, setMetrics] = useState<AnalyticsMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    fetchAnalytics();
  }, [startDate, endDate]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/v1/admin/analytics?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) throw new Error('Failed to fetch analytics');
      const data = await response.json();
      setMetrics(data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format: 'json' | 'csv' | 'pdf') => {
    try {
      const response = await fetch(
        `/api/v1/admin/analytics/export?format=${format}&startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `analytics-${Date.now()}.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export error:', error);
    }
  };

  if (loading) {
    return <div className="p-8 text-center">Loading analytics...</div>;
  }

  if (!metrics) {
    return <div className="p-8 text-center">No data available</div>;
  }

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="p-8 bg-gray-50">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Analytics Dashboard</h1>

        {/* Date Range Selector */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="flex gap-4 items-end flex-wrap">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <DatePicker
                selected={startDate}
                onChange={(date: Date | null) => setStartDate(date || new Date())}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <DatePicker
                selected={endDate}
                onChange={(date: Date | null) => setEndDate(date || new Date())}
                className="px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <button
              onClick={fetchAnalytics}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Filter size={18} />
              Apply Filter
            </button>

            <div className="flex gap-2 ml-auto">
              <button
                onClick={() => handleExport('json')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Download size={18} />
                JSON
              </button>
              <button
                onClick={() => handleExport('csv')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Download size={18} />
                CSV
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Download size={18} />
                PDF
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Revenue</h3>
            <p className="text-3xl font-bold text-gray-900">
              ₹{metrics.revenue.totalRevenue.toLocaleString()}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Total Bookings</h3>
            <p className="text-3xl font-bold text-gray-900">
              {metrics.revenue.totalBookings}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm font-medium mb-2">Average Order Value</h3>
            <p className="text-3xl font-bold text-gray-900">
              ₹{Math.round(metrics.revenue.avgOrderValue).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Booking Trends */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={metrics.bookingTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#8884d8"
                name="Bookings"
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#82ca9d"
                name="Revenue"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* User Growth */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-4">User Growth</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={metrics.userGrowth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="_id" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="newUsers" fill="#8884d8" name="New Users" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Promo Code Effectiveness */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Promo Code Performance</h2>
          <div className="space-y-2">
            {metrics.promoEffectiveness.slice(0, 5).map((promo, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-semibold text-gray-900">{promo._id}</p>
                  <p className="text-sm text-gray-600">
                    Used {promo.usageCount} times
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ₹{promo.totalDiscount.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">
                    Revenue: ₹{promo.revenue.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Trips */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Top Performing Trips</h2>
          <div className="space-y-2">
            {metrics.topTrips.slice(0, 5).map((trip, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-semibold text-gray-900">{trip.title}</p>
                  <p className="text-sm text-gray-600">
                    {trip.totalBookings} bookings
                  </p>
                </div>
                <p className="font-semibold text-gray-900">
                  ₹{trip.revenue.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
