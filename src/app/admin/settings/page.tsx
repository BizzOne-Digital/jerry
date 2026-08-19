"use client";

import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/page-header";
import { FormInput, FormTextarea, FormCheckbox, FormSelect } from "@/components/admin/form-fields";
import { Tabs } from "@/components/admin/tabs";

const settingsSchema = z.object({
  companyName: z.string().optional(),
  tagline: z.string().optional(),
  announcementText: z.string().optional(),
  defaultSeoTitle: z.string().optional(),
  defaultSeoDescription: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  phoneLink: z.string().optional(),
  address: z.string().optional(),
  businessHours: z.string().optional(),
  instagram: z.string().optional(),
  facebook: z.string().optional(),
  x: z.string().optional(),
  tiktok: z.string().optional(),
  youtube: z.string().optional(),
  currency: z.string().optional(),
  manualInvoiceInstructions: z.string().optional(),
  shippingNotes: z.string().optional(),
  returnNotes: z.string().optional(),
  footerDescription: z.string().optional(),
  newsletterCopy: z.string().optional(),
  copyright: z.string().optional(),
  enableIntro: z.boolean().optional(),
  introOncePerSession: z.boolean().optional(),
  normalIntensity: z.enum(["low", "normal", "high"]).optional(),
  reducedIntensity: z.enum(["low", "normal", "high"]).optional(),
});

type SettingsForm = z.infer<typeof settingsSchema>;

export default function AdminSettingsPage() {
  const [tab, setTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const methods = useForm<SettingsForm>({ resolver: zodResolver(settingsSchema) });

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      if (!res.ok) {
        toast.error("Failed to load settings");
        return;
      }
      methods.reset({
        companyName: data.general?.companyName,
        tagline: data.general?.tagline,
        announcementText: data.general?.announcementText,
        defaultSeoTitle: data.general?.defaultSeoTitle,
        defaultSeoDescription: data.general?.defaultSeoDescription,
        email: data.contact?.email,
        phone: data.contact?.phone,
        phoneLink: data.contact?.phoneLink,
        address: data.contact?.address,
        businessHours: data.contact?.businessHours,
        instagram: data.social?.instagram,
        facebook: data.social?.facebook,
        x: data.social?.x,
        tiktok: data.social?.tiktok,
        youtube: data.social?.youtube,
        currency: data.commerce?.currency,
        manualInvoiceInstructions: data.commerce?.manualInvoiceInstructions,
        shippingNotes: data.commerce?.shippingNotes,
        returnNotes: data.commerce?.returnNotes,
        footerDescription: data.footer?.description,
        newsletterCopy: data.footer?.newsletterCopy,
        copyright: data.footer?.copyright,
        enableIntro: data.motion?.enableIntro,
        introOncePerSession: data.motion?.introOncePerSession,
        normalIntensity: data.motion?.normalIntensity,
        reducedIntensity: data.motion?.reducedIntensity,
      });
      setLoading(false);
    }
    void load();
  }, [methods]);

  async function onSubmit(values: SettingsForm) {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          general: {
            companyName: values.companyName,
            tagline: values.tagline,
            announcementText: values.announcementText,
            defaultSeoTitle: values.defaultSeoTitle,
            defaultSeoDescription: values.defaultSeoDescription,
          },
          contact: {
            email: values.email,
            phone: values.phone,
            phoneLink: values.phoneLink,
            address: values.address,
            businessHours: values.businessHours,
          },
          social: {
            instagram: values.instagram,
            facebook: values.facebook,
            x: values.x,
            tiktok: values.tiktok,
            youtube: values.youtube,
          },
          commerce: {
            currency: values.currency,
            manualInvoiceInstructions: values.manualInvoiceInstructions,
            shippingNotes: values.shippingNotes,
            returnNotes: values.returnNotes,
          },
          footer: {
            description: values.footerDescription,
            newsletterCopy: values.newsletterCopy,
            copyright: values.copyright,
          },
          motion: {
            enableIntro: values.enableIntro,
            introOncePerSession: values.introOncePerSession,
            normalIntensity: values.normalIntensity,
            reducedIntensity: values.reducedIntensity,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Save failed");
        return;
      }
      toast.success("Settings saved");
    } catch {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-[var(--admin-muted)]">Loading...</p>;

  const intensityOptions = [
    { value: "low", label: "Low" },
    { value: "normal", label: "Normal" },
    { value: "high", label: "High" },
  ];

  return (
    <div>
      <PageHeader title="Settings" description="Site-wide configuration" />

      <Tabs
        tabs={[
          { id: "general", label: "General" },
          { id: "contact", label: "Contact" },
          { id: "social", label: "Social" },
          { id: "commerce", label: "Commerce" },
          { id: "footer", label: "Footer" },
          { id: "motion", label: "Motion" },
        ]}
        active={tab}
        onChange={setTab}
      />

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
          {tab === "general" && (
            <div className="admin-card grid gap-4 p-6 md:grid-cols-2">
              <FormInput name="companyName" label="Company Name" />
              <FormInput name="tagline" label="Tagline" />
              <div className="md:col-span-2">
                <FormTextarea name="announcementText" label="Announcement Banner" rows={2} />
              </div>
              <FormInput name="defaultSeoTitle" label="Default SEO Title" />
              <FormTextarea name="defaultSeoDescription" label="Default SEO Description" rows={2} />
            </div>
          )}

          {tab === "contact" && (
            <div className="admin-card grid gap-4 p-6 md:grid-cols-2">
              <FormInput name="email" label="Email" type="email" />
              <FormInput name="phone" label="Phone" />
              <FormInput name="phoneLink" label="Phone Link (tel:)" />
              <FormTextarea name="address" label="Address" rows={2} />
              <div className="md:col-span-2">
                <FormTextarea name="businessHours" label="Business Hours" rows={2} />
              </div>
            </div>
          )}

          {tab === "social" && (
            <div className="admin-card grid gap-4 p-6 md:grid-cols-2">
              <FormInput name="instagram" label="Instagram URL" type="url" />
              <FormInput name="facebook" label="Facebook URL" type="url" />
              <FormInput name="x" label="X (Twitter) URL" type="url" />
              <FormInput name="tiktok" label="TikTok URL" type="url" />
              <FormInput name="youtube" label="YouTube URL" type="url" />
            </div>
          )}

          {tab === "commerce" && (
            <div className="admin-card grid gap-4 p-6">
              <FormInput name="currency" label="Currency" />
              <FormTextarea name="manualInvoiceInstructions" label="Manual Invoice Instructions" rows={3} />
              <FormTextarea name="shippingNotes" label="Shipping Notes" rows={3} />
              <FormTextarea name="returnNotes" label="Return Notes" rows={3} />
            </div>
          )}

          {tab === "footer" && (
            <div className="admin-card grid gap-4 p-6">
              <FormTextarea name="footerDescription" label="Footer Description" rows={3} />
              <FormTextarea name="newsletterCopy" label="Newsletter Copy" rows={2} />
              <FormInput name="copyright" label="Copyright Text" />
            </div>
          )}

          {tab === "motion" && (
            <div className="admin-card grid gap-4 p-6 md:grid-cols-2">
              <FormCheckbox name="enableIntro" label="Enable Intro Animation" />
              <FormCheckbox name="introOncePerSession" label="Intro Once Per Session" />
              <FormSelect name="normalIntensity" label="Normal Motion Intensity" options={intensityOptions} />
              <FormSelect name="reducedIntensity" label="Reduced Motion Intensity" options={intensityOptions} />
            </div>
          )}

          <button type="submit" disabled={saving} className="admin-btn admin-btn-primary">
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </form>
      </FormProvider>
    </div>
  );
}
