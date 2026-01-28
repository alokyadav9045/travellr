'use client';

import React, { useState } from 'react';
import { Calendar, Download, Settings, CheckCircle } from 'lucide-react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface ReportConfig {
  type: 'revenue' | 'booking' | 'vendor' | 'customer' | 'custom';
  startDate: Date;
  endDate: Date;
  recipients: string[];
  scheduled: boolean;
  frequency?: 'daily' | 'weekly' | 'monthly';
}

export default function ReportingPage() {
  const [config, setConfig] = useState<ReportConfig>({
    type: 'revenue',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    endDate: new Date(),
    recipients: [],
    scheduled: false
  });

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const addRecipient = () => {
    if (email && email.includes('@')) {
      setConfig({
        ...config,
        recipients: [...config.recipients, email]
      });
      setEmail('');
    }
  };

  const removeRecipient = (idx: number) => {
    setConfig({
      ...config,
      recipients: config.recipients.filter((_, i) => i !== idx)
    });
  };

  const generateReport = async (format: 'pdf' | 'csv' | 'json') => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/admin/reports/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...config,
          format
        })
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `report_${Date.now()}.${format}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setLoading(false);
    }
  };

  const scheduleReport = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/v1/admin/reports/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...config,
          scheduled: true
        })
      });

      if (response.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Error scheduling report:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Reports & Exports</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Report Configuration */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Generate Report</h2>

            {/* Report Type */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Report Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'revenue', label: 'Revenue Report' },
                  { value: 'booking', label: 'Booking Report' },
                  { value: 'vendor', label: 'Vendor Performance' },
                  { value: 'customer', label: 'Customer Analysis' }
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setConfig({ ...config, type: option.value as any })}
                    className={`p-3 rounded-lg border-2 transition ${
                      config.type === option.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <DatePicker
                  selected={config.startDate}
                  onChange={(date: Date | null) =>
                    setConfig({ ...config, startDate: date || new Date() })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <DatePicker
                  selected={config.endDate}
                  onChange={(date: Date | null) =>
                    setConfig({ ...config, endDate: date || new Date() })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>

            {/* Export Options */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Export Format
              </label>
              <div className="flex gap-3 flex-wrap">
                <button
                  onClick={() => generateReport('pdf')}
                  disabled={loading}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <Download size={18} />
                  PDF
                </button>
                <button
                  onClick={() => generateReport('csv')}
                  disabled={loading}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <Download size={18} />
                  CSV
                </button>
                <button
                  onClick={() => generateReport('json')}
                  disabled={loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
                >
                  <Download size={18} />
                  JSON
                </button>
              </div>
            </div>

            {/* Schedule Report */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Settings size={20} />
                Schedule Report
              </h3>

              <div className="mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.scheduled}
                    onChange={(e) =>
                      setConfig({ ...config, scheduled: e.target.checked })
                    }
                    className="w-4 h-4"
                  />
                  <span className="text-sm text-gray-700">
                    Send scheduled reports
                  </span>
                </label>
              </div>

              {config.scheduled && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequency
                  </label>
                  <select
                    value={config.frequency || 'weekly'}
                    onChange={(e) =>
                      setConfig({
                        ...config,
                        frequency: e.target.value as any
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              )}

              {/* Recipients */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Recipients
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
                    onKeyPress={(e) => e.key === 'Enter' && addRecipient()}
                  />
                  <button
                    onClick={addRecipient}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>

                {config.recipients.length > 0 && (
                  <div className="space-y-2">
                    {config.recipients.map((recipient, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-3 bg-gray-100 rounded"
                      >
                        <span className="text-sm text-gray-700">{recipient}</span>
                        <button
                          onClick={() => removeRecipient(idx)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {config.recipients.length > 0 && config.scheduled && (
                <button
                  onClick={scheduleReport}
                  disabled={loading}
                  className="w-full bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 font-semibold"
                >
                  {loading ? 'Scheduling...' : 'Schedule Report'}
                </button>
              )}

              {success && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700">
                  <CheckCircle size={20} />
                  Report scheduled successfully!
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar - Recent Reports */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Access</h2>
          
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition">
              <p className="font-semibold text-gray-900">Last Month Revenue</p>
              <p className="text-sm text-gray-600">Jan 1 - Jan 31, 2024</p>
            </button>
            <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition">
              <p className="font-semibold text-gray-900">Q4 Performance</p>
              <p className="text-sm text-gray-600">Oct 1 - Dec 31, 2023</p>
            </button>
            <button className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition">
              <p className="font-semibold text-gray-900">Vendor Payouts</p>
              <p className="text-sm text-gray-600">Last 30 days</p>
            </button>
          </div>

          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold text-gray-900 mb-3">Scheduled Reports</h3>
            <div className="text-sm text-gray-600">
              <p>Daily: 2 reports</p>
              <p>Weekly: 1 report</p>
              <p>Monthly: 3 reports</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
