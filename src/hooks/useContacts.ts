'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Contact, ContactInput } from '@/types/contact';
import { getContacts, saveContact, updateContact, deleteContact } from '@/lib/storage';

interface UseContactsReturn {
  contacts: Contact[];
  loading: boolean;
  addContact: (input: ContactInput) => Contact;
  editContact: (id: string, input: ContactInput) => Contact | null;
  removeContact: (id: string) => boolean;
  toggleFavorite: (id: string) => Contact | null;
  refreshContacts: () => void;
}

export function useContacts(): UseContactsReturn {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshContacts = useCallback(() => {
    setLoading(true);
    const data = getContacts();
    setContacts(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refreshContacts();
  }, [refreshContacts]);

  const addContact = useCallback((input: ContactInput): Contact => {
    const newContact = saveContact(input);
    setContacts(prev => [...prev, newContact]);
    return newContact;
  }, []);

  const editContact = useCallback((id: string, input: ContactInput): Contact | null => {
    const updated = updateContact(id, input);
    if (updated) {
      setContacts(prev => prev.map(c => c.id === id ? updated : c));
    }
    return updated;
  }, []);

  const removeContact = useCallback((id: string): boolean => {
    const success = deleteContact(id);
    if (success) {
      setContacts(prev => prev.filter(c => c.id !== id));
    }
    return success;
  }, []);

  const toggleFavorite = useCallback((id: string): Contact | null => {
    const contact = contacts.find(c => c.id === id);
    if (!contact) return null;
    return editContact(id, { ...contact, isFavorite: !contact.isFavorite });
  }, [contacts, editContact]);

  return {
    contacts,
    loading,
    addContact,
    editContact,
    removeContact,
    toggleFavorite,
    refreshContacts,
  };
}

export type SortOption = 'newest' | 'oldest' | 'az' | 'za';

export type ViewType = 'all' | 'favorites' | 'recent' | 'groups' | 'settings';

interface FilterState {
  search: string;
  sort: SortOption;
  view: ViewType;
  selectedGroup: string | null;
}

interface UseFilteredContactsReturn {
  filteredContacts: Contact[];
  filters: FilterState;
  setSearch: (search: string) => void;
  setSort: (sort: SortOption) => void;
  setView: (view: ViewType) => void;
  setSelectedGroup: (group: string | null) => void;
  resetFilters: () => void;
}

export function useFilteredContacts(contacts: Contact[]): UseFilteredContactsReturn {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    sort: 'newest',
    view: 'all',
    selectedGroup: null,
  });

  const filteredContacts = useMemo(() => {
    const searchLower = filters.search.toLowerCase();

    let result = contacts.filter(contact => {
      // View filters
      if (filters.view === 'favorites' && !contact.isFavorite) return false;
      if (filters.view === 'recent') {
        const created = new Date(contact.createdAt).getTime();
        const now = new Date().getTime();
        if ((now - created) > (7 * 24 * 60 * 60 * 1000)) return false;
      }
      if (filters.view === 'groups' && filters.selectedGroup && !contact.groups.includes(filters.selectedGroup)) return false;

      if (filters.search) {
        const searchFields = [
          contact.fullName,
          contact.email,
          contact.company,
          contact.jobTitle,
          contact.phone,
          contact.notes,
        ].map(f => f?.toLowerCase() || '');

        if (!searchFields.some(f => f.includes(searchLower))) {
          return false;
        }
      }
      return true;
    });

    switch (filters.sort) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'az':
        result.sort((a, b) => a.fullName.localeCompare(b.fullName));
        break;
      case 'za':
        result.sort((a, b) => b.fullName.localeCompare(a.fullName));
        break;
    }

    return result;
  }, [contacts, filters]);

  const setSearch = useCallback((search: string) => {
    setFilters(prev => ({ ...prev, search }));
  }, []);

  const setSort = useCallback((sort: SortOption) => {
    setFilters(prev => ({ ...prev, sort }));
  }, []);

  const setView = useCallback((view: ViewType) => {
    setFilters(prev => ({ ...prev, view, selectedGroup: null }));
  }, []);

  const setSelectedGroup = useCallback((group: string | null) => {
    setFilters(prev => ({ ...prev, view: 'groups', selectedGroup: group }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({ search: '', sort: 'newest', view: 'all', selectedGroup: null });
  }, []);

  return {
    filteredContacts,
    filters,
    setSearch,
    setSort,
    setView,
    setSelectedGroup,
    resetFilters,
  };
}
