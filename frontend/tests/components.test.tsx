/**
 * Component Tests
 * 
 * Testing suite for Travellr booking and UI components.
 * Tests cover promo codes, booking summary, and related functionality.
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import PromoCodeInput from '@/components/booking/PromoCodeInput';
import '@testing-library/jest-dom';

const mockStore = configureMockStore();

describe('PromoCodeInput Component', () => {
  let store: any;

  beforeEach(() => {
    store = mockStore({
      auth: { user: { id: 'userid' } }
    });
  });

  it('should render promo code input field', () => {
    render(
      <Provider store={store}>
        <PromoCodeInput onPromoApplied={() => {}} onPromoRemoved={() => {}} baseAmount={50000} />
      </Provider>
    );

    const input = screen.getByPlaceholderText(/promo code/i);
    expect(input).toBeInTheDocument();
  });

  it('should accept user input', () => {
    render(
      <Provider store={store}>
        <PromoCodeInput onPromoApplied={vi.fn()} onPromoRemoved={vi.fn()} baseAmount={50000} />
      </Provider>
    );

    const input = screen.getByPlaceholderText(/promo code/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'SUMMER20' } });

    expect(input.value).toBe('SUMMER20');
  });

  it('should convert promo code to uppercase', () => {
    render(
      <Provider store={store}>
        <PromoCodeInput onPromoApplied={vi.fn()} onPromoRemoved={vi.fn()} baseAmount={50000} />
      </Provider>
    );

    const input = screen.getByPlaceholderText(/promo code/i) as HTMLInputElement;
    fireEvent.change(input, { target: { value: 'summer20' } });

    expect(input.value).toBe('SUMMER20');
  });

  it('should call onPromoApplied callback', async () => {
    const mockCallback = vi.fn();

    render(
      <Provider store={store}>
        <PromoCodeInput onPromoApplied={mockCallback} onPromoRemoved={vi.fn()} baseAmount={50000} />
      </Provider>
    );

    const applyButton = screen.getByRole('button', { name: /apply/i });
    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(mockCallback).toHaveBeenCalled();
    });
  });
});
