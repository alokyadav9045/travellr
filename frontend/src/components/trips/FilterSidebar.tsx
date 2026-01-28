'use client';

import React, { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}

interface FilterSection {
  id: string;
  title: string;
  type: 'checkbox' | 'range' | 'select' | 'radio';
  options?: Array<{ value: string; label: string; count?: number }>;
  range?: { min: number; max: number; step?: number };
  value?: any;
}

interface FilterSidebarProps {
  filters: FilterSection[];
  activeFilters: Record<string, any>;
  onFilterChange: (filterId: string, value: any) => void;
  onClearFilters: () => void;
  isOpen?: boolean;
  onClose?: () => void;
}

export default function FilterSidebar({
  filters,
  activeFilters,
  onFilterChange,
  onClearFilters,
  isOpen = true,
  onClose
}: FilterSidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(filters.map(f => f.id))
  );

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  const activeFilterCount = Object.values(activeFilters).filter(value => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== null && value !== undefined && value !== '';
  }).length;

  const FilterCheckbox = ({ filter }: { filter: FilterSection }) => (
    <div className="space-y-2">
      {filter.options?.map((option) => (
        <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={(activeFilters[filter.id] || []).includes(option.value)}
            onChange={(e) => {
              const currentValues = activeFilters[filter.id] || [];
              const newValues = e.target.checked
                ? [...currentValues, option.value]
                : currentValues.filter((v: string) => v !== option.value);
              onFilterChange(filter.id, newValues);
            }}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 flex-1">{option.label}</span>
          {option.count && (
            <span className="text-xs text-gray-500">({option.count})</span>
          )}
        </label>
      ))}
    </div>
  );

  const FilterRange = ({ filter }: { filter: FilterSection }) => {
    const value = activeFilters[filter.id] || [filter.range?.min || 0, filter.range?.max || 1000];
    
    return (
      <div className="space-y-3">
        <div className="flex justify-between text-sm text-gray-600">
          <span>{formatPrice(value[0])}</span>
          <span>{formatPrice(value[1])}</span>
        </div>
        <div className="space-y-2">
          <input
            type="range"
            min={filter.range?.min || 0}
            max={filter.range?.max || 1000}
            step={filter.range?.step || 50}
            value={value[0]}
            onChange={(e) => {
              const newValue = [parseInt(e.target.value), value[1]];
              onFilterChange(filter.id, newValue);
            }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
          <input
            type="range"
            min={filter.range?.min || 0}
            max={filter.range?.max || 1000}
            step={filter.range?.step || 50}
            value={value[1]}
            onChange={(e) => {
              const newValue = [value[0], parseInt(e.target.value)];
              onFilterChange(filter.id, newValue);
            }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>
    );
  };

  const FilterSelect = ({ filter }: { filter: FilterSection }) => (
    <select
      value={activeFilters[filter.id] || ''}
      onChange={(e) => onFilterChange(filter.id, e.target.value)}
      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      <option value="">All</option>
      {filter.options?.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );

  const FilterRadio = ({ filter }: { filter: FilterSection }) => (
    <div className="space-y-2">
      {filter.options?.map((option) => (
        <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
          <input
            type="radio"
            name={filter.id}
            value={option.value}
            checked={activeFilters[filter.id] === option.value}
            onChange={() => onFilterChange(filter.id, option.value)}
            className="text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm text-gray-700 flex-1">{option.label}</span>
          {option.count && (
            <span className="text-xs text-gray-500">({option.count})</span>
          )}
        </label>
      ))}
    </div>
  );

  if (!isOpen) {
    return (
      <button
        onClick={onClose}
        className="fixed top-4 left-4 z-50 bg-white rounded-lg shadow-md p-3 border lg:hidden"
      >
        <Filter className="w-5 h-5" />
      </button>
    );
  }

  return (
    <>
      {/* Mobile Overlay */}
      <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      
      {/* Sidebar */}
      <div className={cn(
        'bg-white border-r border-gray-200 overflow-y-auto',
        'lg:static lg:w-80 lg:h-auto',
        'fixed left-0 top-0 bottom-0 w-80 z-50 lg:z-auto'
      )}>
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              {activeFilterCount > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                  {activeFilterCount}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {activeFilterCount > 0 && (
                <button
                  onClick={onClearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear all
                </button>
              )}
              <button onClick={onClose} className="lg:hidden">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Sections */}
        <div className="p-6 space-y-6">
          {filters.map((filter) => (
            <div key={filter.id} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0">
              <button
                onClick={() => toggleSection(filter.id)}
                className="flex items-center justify-between w-full text-left"
              >
                <h3 className="text-sm font-medium text-gray-900">{filter.title}</h3>
                {expandedSections.has(filter.id) ? (
                  <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
              </button>
              
              {expandedSections.has(filter.id) && (
                <div className="mt-4">
                  {filter.type === 'checkbox' && <FilterCheckbox filter={filter} />}
                  {filter.type === 'range' && <FilterRange filter={filter} />}
                  {filter.type === 'select' && <FilterSelect filter={filter} />}
                  {filter.type === 'radio' && <FilterRadio filter={filter} />}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}