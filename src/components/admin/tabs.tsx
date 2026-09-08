"use client";

interface TabsProps {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}

export function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className="mb-6 flex gap-1 border-b border-[var(--admin-border)]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2.5 text-sm font-medium transition-colors ${
            active === tab.id
              ? "border-b-2 border-[var(--admin-accent)] text-[var(--admin-accent)]"
              : "text-[var(--admin-muted)] hover:text-[var(--admin-text)]"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
