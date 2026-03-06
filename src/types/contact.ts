export interface Contact {
  id: string;
  fullName: string;
  email: string;
  address: string;
  company: string;
  jobTitle: string;
  phone: string;
  notes: string;
  isFavorite: boolean;
  groups: string[];
  createdAt: string;
  updatedAt: string;
}

export type ContactInput = Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>;

