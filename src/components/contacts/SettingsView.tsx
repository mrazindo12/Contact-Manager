'use client';

import { Button } from '@/components/ui/Button';

interface SettingsViewProps {
    onBack: () => void;
}

export function SettingsView({ onBack }: SettingsViewProps) {
    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black tracking-tight">Settings</h2>
                    <p className="text-muted-foreground mt-1 font-medium">Manage your account and app preferences</p>
                </div>
                <Button variant="secondary" onClick={onBack}>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Contacts
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <aside className="space-y-1">
                    <SettingsNavLink label="General" active />
                    <SettingsNavLink label="Account" />
                    <SettingsNavLink label="Notifications" />
                    <SettingsNavLink label="Theme" />
                    <SettingsNavLink label="Data & Privacy" />
                </aside>

                <div className="lg:col-span-2 space-y-8">
                    <SettingsSection title="Profile Information">
                        <div className="flex items-center gap-6 p-6 bg-secondary/30 rounded-2xl border border-border/50">
                            <div className="w-20 h-20 rounded-full premium-gradient flex items-center justify-center text-white text-2xl font-black shadow-xl">
                                U
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-lg">User</h4>
                                <p className="text-sm text-muted-foreground">personal@account.com</p>
                                <Button size="sm" variant="secondary" className="mt-3">Edit Profile</Button>
                            </div>
                        </div>
                    </SettingsSection>

                    <SettingsSection title="App Theme">
                        <div className="grid grid-cols-2 gap-4">
                            <ThemeOption label="Light" icon={<SunIcon />} />
                            <ThemeOption label="Dark" active icon={<MoonIcon />} />
                        </div>
                    </SettingsSection>

                    <SettingsSection title="Data Management">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-border/50">
                                <div>
                                    <p className="font-bold text-sm">Export Contacts</p>
                                    <p className="text-xs text-muted-foreground">Download all your contacts as CSV or vCard</p>
                                </div>
                                <Button size="sm" variant="secondary">Export</Button>
                            </div>
                            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl border border-border/50">
                                <div>
                                    <p className="font-bold text-sm">Import Contacts</p>
                                    <p className="text-xs text-muted-foreground">Add contacts from a file</p>
                                </div>
                                <Button size="sm" variant="secondary">Import</Button>
                            </div>
                        </div>
                    </SettingsSection>
                </div>
            </div>
        </div>
    );
}

function SettingsNavLink({ label, active }: { label: string; active?: boolean }) {
    return (
        <button className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-colors ${active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground'}`}>
            {label}
        </button>
    );
}

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground px-1">{title}</h3>
            {children}
        </div>
    );
}

function ThemeOption({ label, active, icon }: { label: string; active?: boolean; icon: any }) {
    return (
        <div className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col items-center gap-3 ${active ? 'border-primary bg-primary/5' : 'border-border/50 bg-secondary/30 grayscale hover:grayscale-0 hover:border-border'}`}>
            <div className={`p-3 rounded-xl ${active ? 'bg-primary text-white shadow-lg' : 'bg-card text-muted-foreground'}`}>
                {icon}
            </div>
            <span className="text-sm font-bold">{label}</span>
        </div>
    );
}

const SunIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

const MoonIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
);
