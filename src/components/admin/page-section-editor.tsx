"use client";

import { useState } from "react";
import { LocalImageField } from "@/components/admin/local-image-field";
import { MultiImageField } from "@/components/admin/multi-image-field";
import type { CtaLink, PageSection } from "@/types";

function formatSectionType(type: string) {
  return type
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function hasKey(section: PageSection, key: keyof PageSection) {
  return section[key] !== undefined && section[key] !== null;
}

interface PageSectionEditorProps {
  sections: PageSection[];
  onChange: (sections: PageSection[]) => void;
}

export function PageSectionEditor({ sections, onChange }: PageSectionEditorProps) {
  const [openId, setOpenId] = useState<string | null>(sections[0]?.id ?? null);

  function updateSection(index: number, patch: Partial<PageSection>) {
    const next = sections.map((section, i) => (i === index ? { ...section, ...patch } : section));
    onChange(next);
  }

  function updateCta(index: number, key: "cta" | "secondaryCta", field: keyof CtaLink, value: string) {
    const section = sections[index];
    const current = section[key] ?? { label: "", href: "" };
    updateSection(index, { [key]: { ...current, [field]: value } });
  }

  function updateItems(index: number, text: string) {
    const items = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    updateSection(index, { items });
  }

  function updateStats(index: number, stats: { label: string; value: string }[]) {
    updateSection(index, { stats });
  }

  if (!sections.length) {
    return <p className="text-sm text-[var(--admin-muted)]">No sections on this page.</p>;
  }

  return (
    <div className="space-y-4">
      {sections
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((section) => {
          const index = sections.findIndex((s) => s.id === section.id);
          const isOpen = openId === section.id;

          return (
            <div key={section.id} className="admin-card overflow-hidden">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-white/5"
                onClick={() => setOpenId(isOpen ? null : section.id)}
              >
                <div>
                  <p className="font-medium text-[var(--admin-text)]">
                    {section.heading || section.eyebrow || section.id}
                  </p>
                  <p className="mt-1 text-xs text-[var(--admin-muted)]">
                    {formatSectionType(section.type)} · {section.id}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded px-2 py-0.5 text-xs ${
                      section.enabled
                        ? "bg-green-500/15 text-green-400"
                        : "bg-white/10 text-[var(--admin-muted)]"
                    }`}
                  >
                    {section.enabled ? "Visible" : "Hidden"}
                  </span>
                  <span className="text-[var(--admin-muted)]">{isOpen ? "▲" : "▼"}</span>
                </div>
              </button>

              {isOpen && (
                <div className="space-y-4 border-t border-[var(--admin-border)] px-5 py-5">
                  <div className="grid gap-4 md:grid-cols-3">
                    <label className="flex items-center gap-2 text-sm text-[var(--admin-text)]">
                      <input
                        type="checkbox"
                        checked={section.enabled}
                        onChange={(e) => updateSection(index, { enabled: e.target.checked })}
                        className="accent-[var(--admin-accent)]"
                      />
                      Show on page
                    </label>
                    <div>
                      <label className="admin-label">Order</label>
                      <input
                        type="number"
                        className="admin-input"
                        value={section.order}
                        onChange={(e) => updateSection(index, { order: Number(e.target.value) || 0 })}
                      />
                    </div>
                    <div>
                      <label className="admin-label">Section Type</label>
                      <input className="admin-input bg-white/5" value={formatSectionType(section.type)} disabled />
                    </div>
                  </div>

                  {(hasKey(section, "eyebrow") || section.type === "hero" || section.type === "product-rail") && (
                    <div>
                      <label className="admin-label">Eyebrow</label>
                      <input
                        className="admin-input"
                        value={section.eyebrow ?? ""}
                        onChange={(e) => updateSection(index, { eyebrow: e.target.value })}
                        placeholder="Small label above heading"
                      />
                    </div>
                  )}

                  {(hasKey(section, "heading") ||
                    hasKey(section, "subheading") ||
                    hasKey(section, "body") ||
                    ["hero", "content", "cta", "contact-cta", "storytelling", "trust"].includes(section.type)) && (
                    <>
                      <div>
                        <label className="admin-label">Heading</label>
                        <input
                          className="admin-input"
                          value={section.heading ?? ""}
                          onChange={(e) => updateSection(index, { heading: e.target.value })}
                        />
                      </div>
                      {(hasKey(section, "subheading") || section.type === "hero") && (
                        <div>
                          <label className="admin-label">Subheading</label>
                          <textarea
                            className="admin-input resize-y"
                            rows={2}
                            value={section.subheading ?? ""}
                            onChange={(e) => updateSection(index, { subheading: e.target.value })}
                          />
                        </div>
                      )}
                      {(hasKey(section, "body") ||
                        ["hero", "content", "cta", "contact-cta", "storytelling", "service-spotlight", "ticket-cta"].includes(
                          section.type,
                        )) && (
                        <div>
                          <label className="admin-label">Body</label>
                          <textarea
                            className="admin-input resize-y"
                            rows={4}
                            value={section.body ?? ""}
                            onChange={(e) => updateSection(index, { body: e.target.value })}
                          />
                        </div>
                      )}
                    </>
                  )}

                  {hasKey(section, "items") && (
                    <div>
                      <label className="admin-label">Items (one per line)</label>
                      <textarea
                        className="admin-input resize-y font-mono text-sm"
                        rows={Math.max(4, (section.items?.length ?? 0) + 1)}
                        value={(section.items ?? []).join("\n")}
                        onChange={(e) => updateItems(index, e.target.value)}
                      />
                    </div>
                  )}

                  {hasKey(section, "stats") && (
                    <div>
                      <label className="admin-label">Stats</label>
                      <div className="space-y-2">
                        {(section.stats ?? []).map((stat, statIndex) => (
                          <div key={statIndex} className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
                            <input
                              className="admin-input"
                              placeholder="Label"
                              value={stat.label}
                              onChange={(e) => {
                                const stats = [...(section.stats ?? [])];
                                stats[statIndex] = { ...stats[statIndex], label: e.target.value };
                                updateStats(index, stats);
                              }}
                            />
                            <input
                              className="admin-input"
                              placeholder="Value"
                              value={stat.value}
                              onChange={(e) => {
                                const stats = [...(section.stats ?? [])];
                                stats[statIndex] = { ...stats[statIndex], value: e.target.value };
                                updateStats(index, stats);
                              }}
                            />
                            <button
                              type="button"
                              className="admin-btn admin-btn-danger text-sm"
                              onClick={() => updateStats(index, (section.stats ?? []).filter((_, i) => i !== statIndex))}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="admin-btn admin-btn-secondary text-sm"
                          onClick={() =>
                            updateStats(index, [...(section.stats ?? []), { label: "", value: "" }])
                          }
                        >
                          Add Stat
                        </button>
                      </div>
                    </div>
                  )}

                  {(hasKey(section, "cta") || hasKey(section, "secondaryCta")) && (
                    <div className="grid gap-4 md:grid-cols-2">
                      {hasKey(section, "cta") && (
                        <div className="space-y-2 rounded-lg border border-[var(--admin-border)] p-4">
                          <p className="text-sm font-medium text-[var(--admin-text)]">Primary Button</p>
                          <input
                            className="admin-input"
                            placeholder="Button label"
                            value={section.cta?.label ?? ""}
                            onChange={(e) => updateCta(index, "cta", "label", e.target.value)}
                          />
                          <input
                            className="admin-input"
                            placeholder="/shop or /contact"
                            value={section.cta?.href ?? ""}
                            onChange={(e) => updateCta(index, "cta", "href", e.target.value)}
                          />
                        </div>
                      )}
                      {hasKey(section, "secondaryCta") && (
                        <div className="space-y-2 rounded-lg border border-[var(--admin-border)] p-4">
                          <p className="text-sm font-medium text-[var(--admin-text)]">Secondary Button</p>
                          <input
                            className="admin-input"
                            placeholder="Button label"
                            value={section.secondaryCta?.label ?? ""}
                            onChange={(e) => updateCta(index, "secondaryCta", "label", e.target.value)}
                          />
                          <input
                            className="admin-input"
                            placeholder="/contact?inquiry=Trade"
                            value={section.secondaryCta?.href ?? ""}
                            onChange={(e) => updateCta(index, "secondaryCta", "href", e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {hasKey(section, "image") && (
                    <LocalImageField
                      label="Section Image"
                      folder="pages"
                      value={section.image?.url ?? null}
                      onChange={(url) =>
                        updateSection(index, {
                          image: url ? { url, alt: section.image?.alt ?? section.heading ?? "" } : undefined,
                        })
                      }
                    />
                  )}

                  {hasKey(section, "backgroundImage") && (
                    <LocalImageField
                      label="Background Image"
                      folder="pages"
                      value={section.backgroundImage?.url ?? null}
                      onChange={(url) =>
                        updateSection(index, {
                          backgroundImage: url
                            ? { url, alt: section.backgroundImage?.alt ?? section.heading ?? "" }
                            : undefined,
                        })
                      }
                    />
                  )}

                  {hasKey(section, "images") && (
                    <MultiImageField
                      label="Gallery Images"
                      folder="pages"
                      values={(section.images ?? []).map((img) => img.url).filter(Boolean)}
                      onChange={(urls) =>
                        updateSection(index, {
                          images: urls.map((url, imageIndex) => ({
                            url,
                            alt: section.images?.[imageIndex]?.alt ?? section.heading ?? "",
                          })),
                        })
                      }
                    />
                  )}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}
