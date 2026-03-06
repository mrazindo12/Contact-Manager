import { Contact } from '@/types/contact';

interface ContactCardProps {
  contact: Contact;
  onEdit: (contact: Contact) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

const AVATAR_GRADIENTS = [
  'from-blue-500 to-indigo-600',
  'from-emerald-400 to-teal-600',
  'from-orange-400 to-red-600',
  'from-pink-500 to-rose-600',
  'from-violet-500 to-purple-600',
  'from-cyan-400 to-blue-600',
];

export function ContactCard({ contact, onEdit, onDelete, onToggleFavorite }: ContactCardProps) {
  const initials = contact.fullName
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  // Pick a gradient based on name to keep it consistent
  const gradientIndex = contact.fullName.length % AVATAR_GRADIENTS.length;
  const gradient = AVATAR_GRADIENTS[gradientIndex];

  return (
    <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group relative overflow-hidden">
      {/* Background glow effect on hover */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors duration-500" />

      <div className="flex items-start justify-between relative">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-black text-lg shadow-lg group-hover:scale-110 transition-transform duration-500`}>
              {initials}
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(contact.id);
              }}
              className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center border-2 border-background transition-all hover:scale-110 ${contact.isFavorite ? 'bg-amber-400 text-white' : 'bg-card text-muted-foreground'}`}
            >
              <svg className="w-3 h-3" fill={contact.isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.382-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
            </button>
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-foreground text-lg truncate leading-tight">{contact.fullName}</h3>
            {contact.jobTitle && (
              <p className="text-sm font-medium text-muted-foreground truncate">{contact.jobTitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onEdit(contact)}
            className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
            aria-label="Edit contact"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(contact.id)}
            className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
            aria-label="Delete contact"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      {contact.groups && contact.groups.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {contact.groups.map(group => (
            <span key={group} className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded-md uppercase tracking-wider">
              {group}
            </span>
          ))}
        </div>
      )}

      <div className="mt-8 space-y-3 relative">
        {contact.email && (
          <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <div className="p-2 bg-secondary rounded-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="truncate">{contact.email}</span>
          </div>
        )}
        {contact.phone && (
          <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <div className="p-2 bg-secondary rounded-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </div>
            <span className="truncate">{contact.phone}</span>
          </div>
        )}
        {contact.company && (
          <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground">
            <div className="p-2 bg-secondary rounded-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <span className="truncate font-bold text-primary/80">{contact.company}</span>
          </div>
        )}
      </div>

      {contact.notes && (
        <div className="mt-6 pt-6 border-t border-border/30">
          <p className="text-xs font-medium text-muted-foreground line-clamp-2 leading-relaxed italic">
            "{contact.notes}"
          </p>
        </div>
      )}
    </div>
  );
}

