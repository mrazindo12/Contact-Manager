'use client';

import { useState, useCallback, useEffect } from 'react';
import { Contact, ContactInput } from '@/types/contact';
import { checkDuplicates, mergeContacts, DuplicateMatch } from '@/lib/storage';
import { useContacts, useFilteredContacts } from '@/hooks/useContacts';
import { useToast } from '@/components/ui/Toast';
import { Modal } from '@/components/ui/Modal';
import { ContactCard } from './ContactCard';
import { ContactForm } from './ContactForm';
import { SearchFilterBar } from './SearchFilterBar';
import { EmptyState } from './EmptyState';
import { Button } from '@/components/ui/Button';
import { SettingsView } from './SettingsView';
import { GroupsView } from './GroupsView';
import { DuplicateContactDialog } from './DuplicateContactDialog';

export function ContactsApp() {
  const { contacts, loading, addContact, editContact, removeContact, toggleFavorite, refreshContacts } = useContacts();
  const {
    filteredContacts,
    filters,
    setSearch,
    setSort,
    setView,
    setSelectedGroup,
    resetFilters,
  } = useFilteredContacts(contacts);

  const { showToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Duplicate detection state
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [pendingContactData, setPendingContactData] = useState<ContactInput | null>(null);
  const [duplicateMatches, setDuplicateMatches] = useState<DuplicateMatch[]>([]);

  // Stats
  const totalContacts = contacts.length;
  const recentContacts = contacts.filter(c => {
    const created = new Date(c.createdAt).getTime();
    const now = new Date().getTime();
    return (now - created) < (7 * 24 * 60 * 60 * 1000); // 7 days
  }).length;
  const favoritesCount = contacts.filter(c => c.isFavorite).length;

  useEffect(() => {
    // Sync dark mode
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleAddContact = useCallback(() => {
    setEditingContact(null);
    setModalOpen(true);
  }, []);

  const handleEditContact = useCallback((contact: Contact) => {
    setEditingContact(contact);
    setModalOpen(true);
  }, []);

  const handleSubmit = useCallback((data: ContactInput) => {
    if (editingContact) {
      // When editing, skip duplicate check for the contact being edited
      const dupes = checkDuplicates(data, editingContact.id);
      if (dupes.length > 0) {
        setPendingContactData(data);
        setDuplicateMatches(dupes);
        setDuplicateDialogOpen(true);
        return;
      }
      editContact(editingContact.id, data);
      showToast('Contact updated successfully', 'success');
      setModalOpen(false);
      setEditingContact(null);
    } else {
      const dupes = checkDuplicates(data);
      if (dupes.length > 0) {
        setPendingContactData(data);
        setDuplicateMatches(dupes);
        setDuplicateDialogOpen(true);
        return;
      }
      addContact(data);
      showToast('Contact added successfully', 'success');
      setModalOpen(false);
      setEditingContact(null);
    }
  }, [editingContact, editContact, addContact, showToast]);

  const handleDuplicateMerge = useCallback((targetContact: Contact) => {
    if (!pendingContactData) return;
    const merged = mergeContacts(targetContact.id, pendingContactData);
    if (merged) {
      // Refresh contacts list after merge
      refreshContacts();
      showToast(`Merged with ${targetContact.fullName}`, 'success');
    }
    setDuplicateDialogOpen(false);
    setModalOpen(false);
    setPendingContactData(null);
    setDuplicateMatches([]);
    setEditingContact(null);
  }, [pendingContactData, refreshContacts, showToast]);

  const handleDuplicateCreateAnyway = useCallback(() => {
    if (!pendingContactData) return;
    if (editingContact) {
      editContact(editingContact.id, pendingContactData);
      showToast('Contact updated successfully', 'success');
    } else {
      addContact(pendingContactData);
      showToast('Contact added successfully', 'success');
    }
    setDuplicateDialogOpen(false);
    setModalOpen(false);
    setPendingContactData(null);
    setDuplicateMatches([]);
    setEditingContact(null);
  }, [pendingContactData, editingContact, editContact, addContact, showToast]);

  const handleDuplicateCancel = useCallback(() => {
    setDuplicateDialogOpen(false);
    setPendingContactData(null);
    setDuplicateMatches([]);
    // Keep the form modal open so user can correct their input
  }, []);

  const handleDeleteClick = useCallback((id: string) => {
    setDeleteConfirmId(id);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (deleteConfirmId) {
      removeContact(deleteConfirmId);
      showToast('Contact deleted', 'success');
      setDeleteConfirmId(null);
    }
  }, [deleteConfirmId, removeContact, showToast]);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    setEditingContact(null);
  }, []);

  const hasFilters = Boolean(filters.search);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-2xl border-4 border-primary border-t-transparent animate-spin"></div>
          <p className="text-sm font-medium text-muted-foreground animate-pulse">Loading contacts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-card border-r border-border/50 sticky top-0 h-screen">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center shadow-lg shadow-primary/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight">Contact Manager</span>
          </div>

          <nav className="space-y-1">
            <SidebarItem
              icon={<AllIcon />}
              label="All Contacts"
              active={filters.view === 'all'}
              onClick={resetFilters}
            />
            <SidebarItem
              icon={<StarIcon />}
              label="Favorites"
              count={favoritesCount}
              active={filters.view === 'favorites'}
              onClick={() => setView('favorites')}
            />
            <SidebarItem
              icon={<ClockIcon />}
              label="Recent"
              count={recentContacts}
              active={filters.view === 'recent'}
              onClick={() => setView('recent')}
            />
            <SidebarItem
              icon={<TagIcon />}
              label="Groups"
              active={filters.view === 'groups'}
              onClick={() => setView('groups')}
            />
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-border/50">
          <button
            onClick={() => setView('settings')}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors text-sm font-bold ${filters.view === 'settings'
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="bg-background/80 backdrop-blur-md sticky top-0 z-20 border-b border-border/50 px-8 py-4 flex items-center justify-between">
          <div className="flex-1 max-w-2xl">
            <SearchFilterBar
              search={filters.search}
              sort={filters.sort}
              onSearchChange={setSearch}
              onSortChange={setSort}
              onReset={resetFilters}
              onAddContact={handleAddContact}
              totalCount={contacts.length}
              filteredCount={filteredContacts.length}
            />
          </div>

          <div className="flex items-center gap-4 ml-8">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-3 bg-secondary text-secondary-foreground rounded-xl hover:bg-accent transition-colors shadow-sm"
              aria-label="Toggle theme"
            >
              {isDarkMode ? <SunIcon /> : <MoonIcon />}
            </button>
            <Button variant="premium" className="hidden sm:flex" onClick={handleAddContact}>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Contact
            </Button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          {filters.view === 'settings' ? (
            <SettingsView onBack={resetFilters} />
          ) : filters.view === 'groups' && !filters.selectedGroup ? (
            <GroupsView contacts={contacts} onSelectGroup={setSelectedGroup} />
          ) : (
            <>
              {/* Stats Bar */}
              {filters.view === 'all' && !filters.selectedGroup && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                  <StatCard label="Total Contacts" value={totalContacts.toString()} icon={<UsersIcon />} />
                  <StatCard label="Recently Added" value={recentContacts.toString()} icon={<PlusIcon />} />
                  <StatCard label="Favorites" value={favoritesCount.toString()} icon={<LargeStarIcon />} />
                </div>
              )}

              {/* View Header for filtered views */}
              {(filters.view !== 'all' || filters.selectedGroup) && (
                <div className="mb-8 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-black capitalize">
                      {filters.selectedGroup || filters.view}
                    </h2>
                    <p className="text-sm text-muted-foreground font-medium">
                      Showing {filteredContacts.length} {filteredContacts.length === 1 ? 'contact' : 'contacts'}
                    </p>
                  </div>
                  <Button variant="secondary" size="sm" onClick={resetFilters}>Clear Filters</Button>
                </div>
              )}

              {/* Content */}
              {contacts.length === 0 ? (
                <EmptyState onAddContact={handleAddContact} />
              ) : filteredContacts.length === 0 ? (
                <EmptyState onAddContact={handleAddContact} hasFilters={hasFilters || filters.view !== 'all' || !!filters.selectedGroup} />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {filteredContacts.map(contact => (
                    <ContactCard
                      key={contact.id}
                      contact={contact}
                      onEdit={handleEditContact}
                      onDelete={handleDeleteClick}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Modal
        isOpen={modalOpen}
        onClose={handleModalClose}
        title={editingContact ? 'Edit Contact' : 'Add New Contact'}
        size="md"
      >
        <ContactForm
          contact={editingContact}
          onSubmit={handleSubmit}
          onCancel={handleModalClose}
        />
      </Modal>

      <Modal
        isOpen={!!deleteConfirmId}
        onClose={() => setDeleteConfirmId(null)}
        title="Delete Contact"
        size="sm"
      >
        <div className="space-y-6">
          <div className="p-4 bg-destructive/10 rounded-2xl">
            <p className="text-sm font-medium text-destructive leading-relaxed">
              Are you sure you want to delete this contact? This action cannot be undone and will remove all stored data.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={() => setDeleteConfirmId(null)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={duplicateDialogOpen}
        onClose={handleDuplicateCancel}
        title="Duplicate Contact Found"
        size="md"
      >
        {pendingContactData && duplicateMatches.length > 0 && (
          <DuplicateContactDialog
            duplicates={duplicateMatches}
            newContactData={pendingContactData}
            onMerge={handleDuplicateMerge}
            onCreateAnyway={handleDuplicateCreateAnyway}
            onCancel={handleDuplicateCancel}
          />
        )}
      </Modal>
    </div>
  );
}

// Helper Components
function SidebarItem({ icon, label, count, active, onClick }: { icon: any, label: string, count?: number, active?: boolean, onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${active
        ? 'bg-primary text-white shadow-lg shadow-primary/20'
        : 'text-muted-foreground hover:bg-accent hover:text-foreground'
        }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-semibold">{label}</span>
      </div>
      {count !== undefined && (
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${active ? 'bg-white/20' : 'bg-primary/10 text-primary group-hover:bg-primary/20'}`}>
          {count}
        </span>
      )}
    </button>
  );
}

function StatCard({ label, value, icon }: { label: string, value: string, icon: any }) {
  return (
    <div className="bg-card border border-border/50 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:scale-110 transition-transform duration-300">
          {icon}
        </div>
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{label}</p>
          <p className="text-2xl font-black">{value}</p>
        </div>
      </div>
    </div>
  );
}

// Icons
const AllIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const TagIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const SunIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const MoonIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LargeStarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

