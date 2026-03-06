import { Button } from '@/components/ui/Button';

interface EmptyStateProps {
  onAddContact: () => void;
  hasFilters?: boolean;
}

export function EmptyState({ onAddContact, hasFilters }: EmptyStateProps) {
  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 rounded-2xl bg-secondary flex items-center justify-center mb-6 shadow-sm">
          <svg className="w-10 h-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-foreground">No matches found</h3>
        <p className="mt-2 text-muted-foreground max-w-sm font-medium">
          We couldn't find any contacts matching your current search criteria. Try a different keyword or clear your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-32 text-center animate-in fade-in zoom-in-95 duration-700">
      <div className="w-24 h-24 rounded-3xl premium-gradient flex items-center justify-center mb-8 shadow-2xl shadow-primary/20 relative">
        <div className="absolute inset-0 rounded-3xl animate-ping bg-primary/20 -z-10" />
        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <h3 className="text-3xl font-black text-foreground tracking-tight">Your network is empty</h3>
      <p className="mt-3 text-muted-foreground max-w-md text-lg font-medium leading-relaxed">
        Ready to build your digital Rolodex? Start by adding your first contact to get organized.
      </p>
      <Button
        variant="premium"
        size="lg"
        onClick={onAddContact}
        className="mt-10 shadow-2xl"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        Add Your First Contact
      </Button>
    </div>
  );
}

