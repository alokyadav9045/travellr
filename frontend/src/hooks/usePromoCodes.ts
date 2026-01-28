import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api/axios';
import { useToast } from '@/hooks/useToast';

export interface PromoCode {
  _id: string;
  code: string;
  description?: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  maxDiscount?: number;
  minPurchaseAmount: number;
  usageLimit?: number;
  usagePerUser: number;
  validFrom: string;
  validUntil: string;
  applicableTrips?: string[];
  applicableVendors?: string[];
  applicableCategories?: string[];
  excludedVendors?: string[];
  usedCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PromoValidationResponse {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discount: number;
  finalAmount: number;
}

const promoCodeAPI = {
  // Validate promo code
  validatePromoCode: async (
    code: string,
    amount: number,
    vendorId?: string
  ): Promise<PromoValidationResponse> => {
    const response = await api.post('/promo-codes/validate', {
      code,
      amount,
      vendorId
    });
    return response.data.data;
  },

  // Get all promo codes (admin)
  listPromoCodes: async (page = 1, limit = 20, status?: string) => {
    const response = await api.get('/promo-codes', {
      params: { page, limit, status }
    });
    return response.data.data;
  },

  // Get promo code by ID (admin)
  getPromoCode: async (id: string) => {
    const response = await api.get(`/promo-codes/${id}`);
    return response.data.data;
  },

  // Create promo code (admin)
  createPromoCode: async (data: Partial<PromoCode>) => {
    const response = await api.post('/promo-codes', data);
    return response.data.data;
  },

  // Update promo code (admin)
  updatePromoCode: async (id: string, data: Partial<PromoCode>) => {
    const response = await api.patch(`/promo-codes/${id}`, data);
    return response.data.data;
  },

  // Delete promo code (admin)
  deletePromoCode: async (id: string) => {
    const response = await api.delete(`/promo-codes/${id}`);
    return response.data.data;
  },

  // Get promo code stats (admin)
  getPromoStats: async (id: string) => {
    const response = await api.get(`/promo-codes/${id}/stats`);
    return response.data.data;
  }
};

// Hook to validate promo code
export const useValidatePromoCode = () => {
  const { showError } = useToast();

  return useMutation({
    mutationFn: ({ code, amount, vendorId }: { code: string; amount: number; vendorId?: string }) =>
      promoCodeAPI.validatePromoCode(code, amount, vendorId),
    onError: (error: any) => {
      showError(error.response?.data?.message || 'Could not apply promo code');
    }
  });
};

// Hook to list promo codes (admin)
export const useListPromoCodes = (page = 1, limit = 20, status?: string) => {
  return useQuery({
    queryKey: ['promo-codes', page, limit, status],
    queryFn: () => promoCodeAPI.listPromoCodes(page, limit, status),
    staleTime: 5 * 60 * 1000 // 5 minutes
  });
};

// Hook to get promo code details (admin)
export const useGetPromoCode = (id: string) => {
  return useQuery({
    queryKey: ['promo-code', id],
    queryFn: () => promoCodeAPI.getPromoCode(id),
    enabled: !!id
  });
};

// Hook to create promo code (admin)
export const useCreatePromoCode = () => {
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (data: Partial<PromoCode>) => promoCodeAPI.createPromoCode(data),
    onSuccess: () => {
      showSuccess('Promo code created successfully');
    },
    onError: (error: any) => {
      showError(error.response?.data?.message || 'Failed to create promo code');
    }
  });
};

// Hook to update promo code (admin)
export const useUpdatePromoCode = () => {
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<PromoCode> }) =>
      promoCodeAPI.updatePromoCode(id, data),
    onSuccess: () => {
      showSuccess('Promo code updated successfully');
    },
    onError: (error: any) => {
      showError(error.response?.data?.message || 'Failed to update promo code');
    }
  });
};

// Hook to delete promo code (admin)
export const useDeletePromoCode = () => {
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (id: string) => promoCodeAPI.deletePromoCode(id),
    onSuccess: () => {
      showSuccess('Promo code deleted successfully');
    },
    onError: (error: any) => {
      showError(error.response?.data?.message || 'Failed to delete promo code');
    }
  });
};

export { promoCodeAPI };
