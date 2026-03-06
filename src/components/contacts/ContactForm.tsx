'use client';

import { useState, useEffect } from 'react';
import { Contact, ContactInput } from '@/types/contact';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface ContactFormProps {
  contact?: Contact | null;
  onSubmit: (data: ContactInput) => void;
  onCancel: () => void;
}

export function ContactForm({ contact, onSubmit, onCancel }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactInput>({
    fullName: '',
    email: '',
    address: '',
    company: '',
    jobTitle: '',
    phone: '',
    notes: '',
    isFavorite: false,
    groups: [],
  });
  const [groupsInput, setGroupsInput] = useState('');

  const [errors, setErrors] = useState<Partial<Record<keyof ContactInput, string>>>({});

  useEffect(() => {
    if (contact) {
      setGroupsInput((contact.groups || []).join(', '));
      setFormData({
        fullName: contact.fullName,
        email: contact.email,
        address: contact.address,
        company: contact.company,
        jobTitle: contact.jobTitle,
        phone: contact.phone,
        notes: contact.notes,
        isFavorite: contact.isFavorite || false,
        groups: contact.groups || [],
      });
    }
  }, [contact]);

  const handleChange = (field: keyof ContactInput) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = e.target.type === 'checkbox' ? (e.target as HTMLInputElement).checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field as keyof ContactInput]) {
      setErrors(prev => ({ ...prev, [field as keyof ContactInput]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ContactInput, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedGroups = groupsInput.split(',').map(s => s.trim()).filter(Boolean);
    const dataToSubmit = { ...formData, groups: parsedGroups };
    if (validate()) {
      onSubmit(dataToSubmit);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input
          id="fullName"
          label="Full Name *"
          value={formData.fullName}
          onChange={handleChange('fullName')}
          error={errors.fullName}
          placeholder="e.g. John Doe"
          required
        />
        <Input
          id="email"
          label="Email Address"
          type="email"
          value={formData.email}
          onChange={handleChange('email')}
          error={errors.email}
          placeholder="e.g. john@nexus.com"
          icon={<MailIcon />}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input
          id="company"
          label="Company / Organization"
          value={formData.company}
          onChange={handleChange('company')}
          placeholder="e.g. Nexus CRM"
          icon={<CompanyIcon />}
        />
        <Input
          id="jobTitle"
          label="Job Title"
          value={formData.jobTitle}
          onChange={handleChange('jobTitle')}
          placeholder="e.g. Senior Designer"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <Input
          id="phone"
          label="Phone Number"
          type="tel"
          value={formData.phone}
          onChange={handleChange('phone')}
          placeholder="+1 (555) 000-0000"
          icon={<PhoneIcon />}
        />
        <Input
          id="address"
          label="Physical Address"
          value={formData.address}
          onChange={handleChange('address')}
          placeholder="e.g. Silicon Valley, CA"
          icon={<MapIcon />}
        />
      </div>

      <Textarea
        id="notes"
        label="Notes"
        value={formData.notes}
        onChange={handleChange('notes')}
        placeholder="Add any additional details about this contact..."
        rows={4}
      />

      <Input
        id="groups"
        label="Groups (comma separated)"
        value={groupsInput}
        onChange={(e) => setGroupsInput(e.target.value)}
        onBlur={() => {
          const parsed = groupsInput.split(',').map(s => s.trim()).filter(Boolean);
          setFormData(prev => ({ ...prev, groups: parsed }));
        }}
        placeholder="e.g. Work, Family, Friends"
        icon={<TagIcon />}
      />

      <div className="flex items-center gap-2 px-1">
        <input
          type="checkbox"
          id="isFavorite"
          checked={formData.isFavorite}
          onChange={handleChange('isFavorite')}
          className="w-5 h-5 rounded border-border bg-card text-primary focus:ring-primary/20 transition-all cursor-pointer"
        />
        <label htmlFor="isFavorite" className="text-sm font-bold text-foreground cursor-pointer select-none">
          Mark as Favorite
        </label>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t border-border/10">
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="premium" type="submit">
          {contact ? 'Save Changes' : 'Create Contact'}
        </Button>
      </div>
    </form>
  );
}

const MailIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const CompanyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const MapIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const TagIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

