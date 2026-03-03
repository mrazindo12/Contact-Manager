import { Contact, ContactInput } from '@/types/contact';

const STORAGE_KEY = 'contact-manager-contacts';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

function parseContacts(data: unknown): Contact[] {
  if (!Array.isArray(data)) return [];
  return data.filter((item): item is Contact => {
    return (
      typeof item === 'object' &&
      item !== null &&
      typeof item.id === 'string' &&
      typeof item.fullName === 'string' &&
      typeof item.email === 'string'
    );
  });
}

export function getContacts(): Contact[] {
  if (typeof window === 'undefined') return [];

  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return parseContacts(JSON.parse(data));
  } catch {
    console.error('Failed to parse contacts from localStorage');
    return [];
  }
}

export function saveContact(input: ContactInput): Contact {
  const contacts = getContacts();
  const now = new Date().toISOString();

  const newContact: Contact = {
    ...input,
    id: generateId(),
    isFavorite: input.isFavorite ?? false,
    groups: input.groups ?? [],
    createdAt: now,
    updatedAt: now,
  };

  contacts.push(newContact);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  return newContact;
}

export function updateContact(id: string, input: ContactInput): Contact | null {
  const contacts = getContacts();
  const index = contacts.findIndex(c => c.id === id);

  if (index === -1) return null;

  const updatedContact: Contact = {
    ...contacts[index],
    ...input,
    updatedAt: new Date().toISOString(),
  };

  contacts[index] = updatedContact;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  return updatedContact;
}

export function deleteContact(id: string): boolean {
  const contacts = getContacts();
  const filtered = contacts.filter(c => c.id !== id);

  if (filtered.length === contacts.length) return false;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

export function getContactById(id: string): Contact | null {
  const contacts = getContacts();
  return contacts.find(c => c.id === id) || null;
}
