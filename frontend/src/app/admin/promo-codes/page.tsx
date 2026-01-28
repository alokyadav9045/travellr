'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Edit2, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useListPromoCodes, useDeletePromoCode } from '@/hooks/usePromoCodes';
import { formatCurrency } from '@/lib/utils/formatters';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';

export default function PromoCodesPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [limit] = useState(20);

  const { data, isLoading, isError } = useListPromoCodes(page, limit, statusFilter || undefined);
  const deleteMutation = useDeletePromoCode();

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const isActive = (promo: any) => {
    const now = new Date();
    return (
      promo.isActive &&
      new Date(promo.validFrom) <= now &&
      new Date(promo.validUntil) >= now
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Promo Codes</h1>
          <p className="text-gray-500">Manage discount and promotional codes</p>
        </div>
        <Link href="/admin/promo-codes/create">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Promo Code
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4 flex-col sm:flex-row">
            <Input
              placeholder="Search by code..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="flex-1"
            />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 border rounded-md bg-white"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Promo Codes</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12" />
              ))}
            </div>
          ) : isError ? (
            <div className="text-center py-8">
              <p className="text-red-600">Failed to load promo codes</p>
            </div>
          ) : data?.promoCodes?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No promo codes found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Value</TableHead>
                      <TableHead>Used</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Valid Until</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.promoCodes?.map((promo: any) => (
                      <TableRow key={promo._id}>
                        <TableCell className="font-medium">{promo.code}</TableCell>
                        <TableCell className="capitalize">
                          {promo.discountType === 'percentage'
                            ? `${promo.discountValue}%`
                            : formatCurrency(promo.discountValue)}
                        </TableCell>
                        <TableCell>
                          {promo.discountType === 'percentage' ? (
                            `${promo.discountValue}%`
                          ) : (
                            formatCurrency(promo.discountValue)
                          )}
                        </TableCell>
                        <TableCell>
                          {promo.usedCount}
                          {promo.usageLimit && ` / ${promo.usageLimit}`}
                        </TableCell>
                        <TableCell>
                          {isActive(promo) ? (
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                              Active
                            </Badge>
                          ) : promo.isActive ? (
                            <Badge variant="outline">Pending</Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">
                          {new Date(promo.validUntil).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Link href={`/admin/promo-codes/${promo._id}`}>
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </Link>
                            <Link href={`/admin/promo-codes/${promo._id}/edit`}>
                              <Button variant="ghost" size="sm">
                                <Edit2 className="w-4 h-4" />
                              </Button>
                            </Link>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-red-600">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogTitle>Delete Promo Code?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete the promo code "{promo.code}"?
                                  This action cannot be undone.
                                </AlertDialogDescription>
                                <div className="flex gap-2 justify-end">
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(promo._id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </div>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {data?.pagination && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                  >
                    Previous
                  </Button>
                  <div className="text-sm text-gray-600">
                    Page {page} of {data.pagination.pages}
                  </div>
                  <Button
                    variant="outline"
                    disabled={page >= data.pagination.pages}
                    onClick={() => setPage(p => p + 1)}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
