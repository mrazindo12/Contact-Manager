'use client';

import { useState, useEffect } from 'react';
import { Select, Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { SortOption } from '@/hooks/useContacts';

interface SearchFilterBarProps {
  search: string;
  sort: SortOption;
  onSearchChange: (value: string) => void;
  onSortChange: (sort: SortOption) => void;
  onReset: () => void;
  onAddContact: () => void;
  totalCount: number;
  filteredCount: number;
}

export function SearchFilterBar({
  search,
  sort,
  onSearchChange,
  onSortChange,
  onReset,
  totalCount,
  filteredCount,
}: SearchFilterBarProps) {
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, 150);
    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  const hasFilters = search;

  const sortOptions = [
    { value: 'newest', label: 'Newest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'az', label: 'A - Z' },
    { value: 'za', label: 'Z - A' },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center gap-4 w-full">
      <div className="flex-1 w-full">
        <Input
          placeholder="Search for contacts by name, email or company..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          icon={<SearchIcon />}
          className="w-full !rounded-2xl border-none shadow-none bg-card/50"
        />
      </div>
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <Select
          options={sortOptions}
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
          className="w-full sm:w-36 !rounded-2xl border-none shadow-none bg-card/50"
          aria-label="Sort contacts"
        />
        {hasFilters && (
          <Button variant="ghost" className="!rounded-2xl" onClick={onReset} aria-label="Clear filters">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        )}
      </div>
    </div>
  );
}

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);
