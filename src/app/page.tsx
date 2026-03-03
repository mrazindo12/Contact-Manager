'use client';

import { ToastProvider } from '@/components/ui/Toast';
import { ContactsApp } from '@/components/contacts/ContactsApp';

export default function Home() {
  return (
    <ToastProvider>
      <ContactsApp />
    </ToastProvider>
  );
}
