'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { api } from '@/lib/api/axios';

interface Vendor {
  _id: string;
  businessName: string;
  user: { name: string; email: string };
  isVerified: boolean;
  phone: string;
  createdAt: string;
}

export default function AdminVendorsPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'verified' | 'pending'>('all');

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, user, router]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      fetchVendors();
    }
  }, [isAuthenticated, user]);

  const fetchVendors = async () => {
    try {
      const response = await api.get('/admin/vendors');
      const vendorsData = response.data.data?.vendors || response.data.vendors || [];
      setVendors(vendorsData);
    } catch (error) {
      console.error('Failed to fetch vendors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (vendorId: string) => {
    try {
      await api.patch(`/admin/vendors/${vendorId}/approve`);
      fetchVendors();
    } catch (error) {
      console.error('Failed to verify vendor:', error);
    }
  };

  const handleReject = async (vendorId: string) => {
    if (!confirm('Are you sure you want to reject this vendor?')) return;

    try {
      await api.patch(`/admin/vendors/${vendorId}/reject`);
      fetchVendors();
    } catch (error) {
      console.error('Failed to reject vendor:', error);
    }
  };

  const filteredVendors = vendors.filter(v => {
    if (filter === 'verified') return v.isVerified;
    if (filter === 'pending') return !v.isVerified;
    return true;
  });

  const stats = {
    total: vendors.length,
    verified: vendors.filter(v => v.isVerified).length,
    pending: vendors.filter(v => !v.isVerified).length
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Vendor Management</h1>
            <p className="text-gray-600 mt-2">{stats.total} total vendors</p>
          </div>
          <Button onClick={() => router.push('/admin/dashboard')}>
            Back to Dashboard
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-6">
            <div className="text-sm text-gray-600">Total Vendors</div>
            <div className="text-3xl font-bold mt-2">{stats.total}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600">Verified</div>
            <div className="text-3xl font-bold mt-2 text-green-600">{stats.verified}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600">Pending Approval</div>
            <div className="text-3xl font-bold mt-2 text-orange-600">{stats.pending}</div>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            All ({stats.total})
          </Button>
          <Button
            variant={filter === 'verified' ? 'default' : 'outline'}
            onClick={() => setFilter('verified')}
          >
            Verified ({stats.verified})
          </Button>
          <Button
            variant={filter === 'pending' ? 'default' : 'outline'}
            onClick={() => setFilter('pending')}
          >
            Pending ({stats.pending})
          </Button>
        </div>

        {/* Vendors List */}
        <div className="space-y-4">
          {filteredVendors.map((vendor) => (
            <Card key={vendor._id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold">{vendor.businessName}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      vendor.isVerified
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {vendor.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>Contact:</strong> {vendor.user.name}</p>
                    <p><strong>Email:</strong> {vendor.user.email}</p>
                    <p><strong>Phone:</strong> {vendor.phone}</p>
                    <p><strong>Joined:</strong> {new Date(vendor.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  {!vendor.isVerified && (
                    <>
                      <Button
                        onClick={() => handleVerify(vendor._id)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => handleReject(vendor._id)}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {vendor.isVerified && (
                    <Button variant="outline">
                      View Profile
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}

          {filteredVendors.length === 0 && (
            <Card className="p-12 text-center">
              <p className="text-gray-600">No vendors found</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
