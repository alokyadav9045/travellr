'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useValidatePromoCode } from '@/hooks/usePromoCodes';
import { Check, X, Loader2 } from 'lucide-react';
import { formatCurrency } from '@/lib/utils/formatters';

interface PromoCodeInputProps {
  baseAmount: number;
  vendorId?: string;
  onPromoApplied: (code: string, discount: number, finalAmount: number) => void;
  onPromoRemoved: () => void;
}

export default function PromoCodeInput({
  baseAmount,
  vendorId,
  onPromoApplied,
  onPromoRemoved
}: PromoCodeInputProps) {
  const [promoCode, setPromoCode] = useState('');
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const queryClient = useQueryClient();

  const validateMutation = useValidatePromoCode();

  const handleApplyPromoCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!promoCode.trim()) return;

    try {
      const result = await validateMutation.mutateAsync({
        code: promoCode,
        amount: baseAmount,
        vendorId
      });

      setAppliedCode(result.code);
      setAppliedDiscount(result.discount);
      onPromoApplied(result.code, result.discount, result.finalAmount);
      
      // Optionally clear the input
      setPromoCode('');
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  const handleRemovePromoCode = () => {
    setAppliedCode(null);
    setAppliedDiscount(0);
    setPromoCode('');
    onPromoRemoved();
  };

  return (
    <Card className="border-dashed">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Promo Code</CardTitle>
        <CardDescription>Have a discount code? Enter it here</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {appliedCode ? (
          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-600" />
              <span className="font-medium text-green-700">
                {appliedCode} applied
              </span>
            </div>
            <div className="text-right">
              <div className="text-xs text-green-600">Discount</div>
              <div className="font-semibold text-green-700">
                {formatCurrency(appliedDiscount)}
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRemovePromoCode}
              className="text-green-600 hover:text-green-700 hover:bg-green-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <form onSubmit={handleApplyPromoCode} className="flex gap-2">
            <Input
              type="text"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              disabled={validateMutation.isPending}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={
                !promoCode.trim() ||
                validateMutation.isPending ||
                appliedCode !== null
              }
              className="gap-2"
            >
              {validateMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Applying...
                </>
              ) : (
                'Apply'
              )}
            </Button>
          </form>
        )}

        {/* Show discount summary if code is applied */}
        {appliedCode && (
          <div className="space-y-2 pt-2 border-t text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatCurrency(baseAmount)}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Discount ({appliedCode})</span>
              <span>-{formatCurrency(appliedDiscount)}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
