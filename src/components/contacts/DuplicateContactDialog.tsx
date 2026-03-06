'use client';

import { Contact, ContactInput } from '@/types/contact';
import { DuplicateMatch } from '@/lib/storage';
import { Button } from '@/components/ui/Button';

interface DuplicateContactDialogProps {
    duplicates: DuplicateMatch[];
    newContactData: ContactInput;
    onMerge: (targetContact: Contact) => void;
    onCreateAnyway: () => void;
    onCancel: () => void;
}

export function DuplicateContactDialog({
    duplicates,
    newContactData,
    onMerge,
    onCreateAnyway,
    onCancel,
}: DuplicateContactDialogProps) {
    const firstDuplicate = duplicates[0];

    const matchLabels = firstDuplicate.matchedOn.map((field) => {
        if (field === 'email') return `email (${newContactData.email})`;
        if (field === 'phone') return `phone number (${newContactData.phone})`;
        return field;
    });

    const matchSummary = matchLabels.join(' and ');

    return (
        <div className="space-y-6">
            {/* Warning Banner */}
            <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
                <div className="mt-0.5 w-5 h-5 shrink-0 text-amber-400">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                        />
                    </svg>
                </div>
                <div>
                    <p className="text-sm font-bold text-amber-400">Duplicate Detected</p>
                    <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
                        A contact with the same <span className="font-semibold text-foreground">{matchSummary}</span> already exists.
                    </p>
                </div>
            </div>

            {/* Existing Contact Preview */}
            <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                    Existing Contact
                </p>
                <div className="bg-card border border-border/50 rounded-2xl p-4 space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl premium-gradient flex items-center justify-center text-white font-black text-sm shrink-0">
                            {firstDuplicate.contact.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-bold text-foreground">{firstDuplicate.contact.fullName}</p>
                            {firstDuplicate.contact.jobTitle && firstDuplicate.contact.company && (
                                <p className="text-xs text-muted-foreground">
                                    {firstDuplicate.contact.jobTitle} at {firstDuplicate.contact.company}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-1.5 mt-2 pl-1">
                        {firstDuplicate.contact.email && (
                            <InfoRow icon={<MailIcon />} value={firstDuplicate.contact.email} highlight={firstDuplicate.matchedOn.includes('email')} />
                        )}
                        {firstDuplicate.contact.phone && (
                            <InfoRow icon={<PhoneIcon />} value={firstDuplicate.contact.phone} highlight={firstDuplicate.matchedOn.includes('phone')} />
                        )}
                    </div>
                </div>
            </div>

            {/* Merge Preview */}
            <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                    What Merge Does
                </p>
                <ul className="text-sm text-muted-foreground space-y-1.5 pl-1">
                    <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        New non-empty fields overwrite existing empty fields
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        Notes are appended together
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-primary mt-0.5">✓</span>
                        Groups are combined (no duplicates)
                    </li>
                    <li className="flex items-start gap-2">
                        <span className="text-amber-400 mt-0.5">!</span>
                        Existing contact is updated — no new contact is created
                    </li>
                </ul>
            </div>

            {/* Multiple Duplicates Note */}
            {duplicates.length > 1 && (
                <p className="text-xs text-muted-foreground bg-card border border-border/30 rounded-xl px-3 py-2">
                    {duplicates.length - 1} other existing contact{duplicates.length - 1 > 1 ? 's' : ''} also share this {firstDuplicate.matchedOn.join(' or ')}. Merge will apply to the first match above.
                </p>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-border/10">
                <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={onCancel}
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    variant="secondary"
                    className="flex-1 border border-border/50"
                    onClick={onCreateAnyway}
                >
                    Create Anyway
                </Button>
                <Button
                    type="button"
                    variant="premium"
                    className="flex-1"
                    onClick={() => onMerge(firstDuplicate.contact)}
                >
                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                    Merge Contacts
                </Button>
            </div>
        </div>
    );
}

function InfoRow({ icon, value, highlight }: { icon: React.ReactNode; value: string; highlight: boolean }) {
    return (
        <div className={`flex items-center gap-2 text-sm px-2 py-1.5 rounded-lg transition-colors ${highlight ? 'bg-amber-500/10 text-amber-400' : 'text-muted-foreground'}`}>
            <span className="w-4 h-4 shrink-0">{icon}</span>
            <span className="truncate">{value}</span>
            {highlight && (
                <span className="ml-auto text-xs font-bold px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded-md shrink-0">
                    match
                </span>
            )}
        </div>
    );
}

const MailIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
);

const PhoneIcon = () => (
    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
);

