'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreatePromoCode } from '@/hooks/usePromoCodes';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';

const promoCodeSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters').max(20, 'Code must be max 20 characters'),
  description: z.string().optional(),
  discountType: z.enum(['percentage', 'fixed']),
  discountValue: z.coerce.number().positive('Discount value must be positive'),
  maxDiscount: z.coerce.number().optional(),
  minPurchaseAmount: z.coerce.number().optional(),
  usageLimit: z.coerce.number().optional(),
  usagePerUser: z.coerce.number().optional(),
  validFrom: z.string().datetime(),
  validUntil: z.string().datetime(),
});

type PromoCodeFormData = z.infer<typeof promoCodeSchema>;

export default function CreatePromoCodePage() {
  const router = useRouter();
  const createMutation = useCreatePromoCode();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<PromoCodeFormData>({
    resolver: zodResolver(promoCodeSchema),
    defaultValues: {
      discountType: 'percentage',
      usagePerUser: 1,
      minPurchaseAmount: 0
    }
  });

  const discountType = watch('discountType');

  const onSubmit = async (data: PromoCodeFormData) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        router.push('/admin/promo-codes');
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/promo-codes">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Promo Code</h1>
          <p className="text-gray-500">Add a new promotional or discount code</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Promo Code *
              </label>
              <Input
                {...register('code')}
                placeholder="e.g., SUMMER20"
                className="uppercase"
              />
              {errors.code && (
                <p className="text-red-600 text-sm mt-1">{errors.code.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <Textarea
                {...register('description')}
                placeholder="Describe the promotion (e.g., Summer discount on all trips)"
                rows={3}
              />
            </div>

            {/* Discount Type and Value */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Type *
                </label>
                <select
                  {...register('discountType')}
                  className="w-full px-3 py-2 border rounded-md bg-white"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount Value *
                </label>
                <Input
                  {...register('discountValue')}
                  type="number"
                  placeholder={discountType === 'percentage' ? '20' : '50'}
                  step={discountType === 'percentage' ? '1' : '0.01'}
                />
                {errors.discountValue && (
                  <p className="text-red-600 text-sm mt-1">{errors.discountValue.message}</p>
                )}
              </div>
            </div>

            {/* Max Discount (for percentage) */}
            {discountType === 'percentage' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Discount Cap (Optional)
                </label>
                <Input
                  {...register('maxDiscount')}
                  type="number"
                  placeholder="e.g., 100"
                  step="0.01"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Set a maximum discount amount for percentage-based codes
                </p>
              </div>
            )}

            {/* Minimum Purchase Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Purchase Amount
              </label>
              <Input
                {...register('minPurchaseAmount')}
                type="number"
                placeholder="0"
                step="0.01"
              />
              <p className="text-sm text-gray-500 mt-1">
                Minimum amount required to use this code
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage Limits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Total Usage Limit */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Total Usage Limit
              </label>
              <Input
                {...register('usageLimit')}
                type="number"
                placeholder="Leave empty for unlimited"
              />
              <p className="text-sm text-gray-500 mt-1">
                Total number of times this code can be used
              </p>
            </div>

            {/* Usage Per User */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usage Per User *
              </label>
              <Input
                {...register('usagePerUser')}
                type="number"
                placeholder="1"
              />
              <p className="text-sm text-gray-500 mt-1">
                How many times one user can use this code
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Validity Period</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Valid From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valid From *
              </label>
              <Input
                {...register('validFrom')}
                type="datetime-local"
              />
              {errors.validFrom && (
                <p className="text-red-600 text-sm mt-1">{errors.validFrom.message}</p>
              )}
            </div>

            {/* Valid Until */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Valid Until *
              </label>
              <Input
                {...register('validUntil')}
                type="datetime-local"
              />
              {errors.validUntil && (
                <p className="text-red-600 text-sm mt-1">{errors.validUntil.message}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex gap-4">
          <Link href="/admin/promo-codes" className="flex-1">
            <Button variant="outline" className="w-full">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={createMutation.isPending}
            className="flex-1 gap-2"
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating...
              </>
            ) : (
              'Create Promo Code'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
