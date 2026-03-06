'use client';

import { Contact } from '@/types/contact';
import { Button } from '@/components/ui/Button';

interface GroupsViewProps {
    contacts: Contact[];
    onSelectGroup: (group: string) => void;
}

export function GroupsView({ contacts, onSelectGroup }: GroupsViewProps) {
    const groups = Array.from(new Set(contacts.flatMap(c => c.groups || []))).sort();

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black tracking-tight">Groups & Tags</h2>
                    <p className="text-muted-foreground mt-1 font-medium">Organize your network into categories</p>
                </div>
                <Button variant="premium">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Create New Group
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {groups.map(group => {
                    const count = contacts.filter(c => c.groups.includes(group)).length;
                    const groupContacts = contacts.filter(c => c.groups.includes(group)).slice(0, 3);

                    return (
                        <div
                            key={group}
                            onClick={() => onSelectGroup(group)}
                            className="bg-card border border-border/50 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group cursor-pointer"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <div className="w-12 h-12 rounded-xl premium-gradient flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                                    <TagIcon />
                                </div>
                                <span className="text-xs font-black px-2 py-1 bg-primary/10 text-primary rounded-lg uppercase tracking-tight">
                                    {count} {count === 1 ? 'Contact' : 'Contacts'}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold mb-4">{group}</h3>

                            <div className="flex -space-x-3 mb-6">
                                {groupContacts.map(c => (
                                    <div key={c.id} className="w-8 h-8 rounded-full border-2 border-card bg-secondary/50 flex items-center justify-center text-[10px] font-black overflow-hidden ring-2 ring-background">
                                        {c.fullName[0]}
                                    </div>
                                ))}
                                {count > 3 && (
                                    <div className="w-8 h-8 rounded-full border-2 border-card bg-secondary/50 flex items-center justify-center text-[10px] font-black ring-2 ring-background text-muted-foreground">
                                        +{count - 3}
                                    </div>
                                )}
                            </div>

                            <Button variant="secondary" className="w-full opacity-0 group-hover:opacity-100 transition-opacity">
                                View Contacts
                            </Button>
                        </div>
                    );
                })}

                {groups.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-secondary/10 rounded-3xl border-2 border-dashed border-border/50">
                        <div className="w-16 h-16 bg-secondary/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-muted-foreground">
                            <TagIcon />
                        </div>
                        <h3 className="text-lg font-bold">No groups found</h3>
                        <p className="text-muted-foreground">Assign groups to your contacts to see them here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

const TagIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
    </svg>
);

