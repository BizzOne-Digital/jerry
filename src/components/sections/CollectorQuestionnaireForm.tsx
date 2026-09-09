"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { BUDGET_RANGES, COLLECTIBLE_TYPES, SPORTS } from "@/types";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  orderNumber: z.string().optional(),
  favoriteSports: z.array(z.enum(SPORTS)).min(1, "Select at least one sport"),
  favoriteTeams: z.string().min(1, "Tell us your favorite teams"),
  favoritePlayers: z.string().optional(),
  itemsToCollect: z.array(z.enum(COLLECTIBLE_TYPES)).min(1, "Select at least one item type"),
  collectingGoals: z.string().optional(),
  budgetRange: z.union([z.enum(BUDGET_RANGES), z.literal("")]).optional(),
  additionalNotes: z.string().optional(),
  consent: z.literal(true, { errorMap: () => ({ message: "Consent is required" }) }),
});

type FormData = z.infer<typeof schema>;

function CheckboxGroup({
  label,
  options,
  values,
  onChange,
  error,
}: {
  label: string;
  options: readonly string[];
  values: string[];
  onChange: (values: string[]) => void;
  error?: string;
}) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-arena-cream">{label}</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((option) => {
          const checked = values.includes(option);
          return (
            <label
              key={option}
              className="flex cursor-pointer items-center gap-2 rounded-sm border border-arena-border/40 bg-arena-black/30 px-3 py-2 text-sm text-arena-muted transition hover:border-arena-gold/40"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => {
                  onChange(checked ? values.filter((v) => v !== option) : [...values, option]);
                }}
                className="accent-arena-gold"
              />
              <span>{option}</span>
            </label>
          );
        })}
      </div>
      {error && <p className="mt-1 text-xs text-arena-coral">{error}</p>}
    </div>
  );
}

function CollectorQuestionnaireFormFields() {
  const params = useSearchParams();
  const orderFromUrl = params.get("order") ?? "";
  const emailFromUrl = params.get("email") ?? "";
  const [submitting, setSubmitting] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(Boolean(orderFromUrl));

  const defaultValues = useMemo(
    () => ({
      orderNumber: orderFromUrl,
      email: emailFromUrl,
      favoriteSports: [] as FormData["favoriteSports"],
      itemsToCollect: [] as FormData["itemsToCollect"],
    }),
    [orderFromUrl, emailFromUrl]
  );

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const favoriteSports = watch("favoriteSports") ?? [];
  const itemsToCollect = watch("itemsToCollect") ?? [];

  useEffect(() => {
    if (!orderFromUrl) return;

    async function loadOrder() {
      setLookupLoading(true);
      try {
        const res = await fetch(`/api/questionnaire?order=${encodeURIComponent(orderFromUrl)}`);
        const json = await res.json();
        if (!res.ok) return;
        setValue("orderNumber", json.orderNumber ?? orderFromUrl);
        if (json.name) setValue("name", json.name);
        if (json.email) setValue("email", json.email);
        if (json.phone) setValue("phone", json.phone);
      } catch {
        // Prefill is optional
      } finally {
        setLookupLoading(false);
      }
    }

    void loadOrder();
  }, [orderFromUrl, setValue]);

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/questionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          budgetRange: data.budgetRange || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to submit");
      toast.success("Profile saved! We'll tailor recommendations to your interests.");
      reset({
        ...defaultValues,
        name: data.name,
        email: data.email,
        phone: data.phone,
        orderNumber: data.orderNumber,
      });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="arena-glow space-y-6 rounded-sm bg-arena-surface p-6">
      <p className="text-sm leading-relaxed text-arena-muted">
        Tell us what you collect and what you are chasing. The more we know, the better we can source
        cards, autographs, memorabilia, and affordable game tickets for you.
      </p>
      {lookupLoading && (
        <p className="text-sm text-arena-muted">Loading your order details...</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Name" {...register("name")} error={errors.name?.message} />
        <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Phone" type="tel" {...register("phone")} />
        <Input
          label="Order Number (optional)"
          placeholder="SP-..."
          {...register("orderNumber")}
          error={errors.orderNumber?.message}
        />
      </div>

      <CheckboxGroup
        label="Favorite Sports"
        options={SPORTS}
        values={favoriteSports}
        onChange={(values) => setValue("favoriteSports", values as FormData["favoriteSports"], { shouldValidate: true })}
        error={errors.favoriteSports?.message}
      />

      <Textarea
        label="Favorite Teams"
        rows={3}
        placeholder="e.g. Yankees, Lakers, Cowboys — one per line or comma-separated"
        {...register("favoriteTeams")}
        error={errors.favoriteTeams?.message}
      />

      <Textarea
        label="Favorite Players"
        rows={3}
        placeholder="e.g. Aaron Judge, LeBron James — one per line or comma-separated"
        {...register("favoritePlayers")}
      />

      <CheckboxGroup
        label="What do you collect?"
        options={COLLECTIBLE_TYPES}
        values={itemsToCollect}
        onChange={(values) =>
          setValue("itemsToCollect", values as FormData["itemsToCollect"], { shouldValidate: true })
        }
        error={errors.itemsToCollect?.message}
      />

      <Textarea
        label="Collecting Goals"
        rows={3}
        placeholder="What are you looking to build or complete?"
        {...register("collectingGoals")}
      />

      <Select
        label="Typical Budget Range"
        options={[{ value: "", label: "Select a range (optional)" }, ...BUDGET_RANGES.map((r) => ({ value: r, label: r }))]}
        {...register("budgetRange")}
      />

      <Textarea
        label="Anything Else?"
        rows={3}
        placeholder="Grading preferences, event dates, wishlist items..."
        {...register("additionalNotes")}
      />

      <label className="flex items-start gap-2 text-sm text-arena-muted">
        <input type="checkbox" {...register("consent")} className="mt-1 accent-arena-gold" />
        <span>I consent to Sodapops using this information to personalize offers and curate collectibles for me.</span>
      </label>
      {errors.consent && <p className="text-xs text-arena-coral">{errors.consent.message}</p>}

      <Button type="submit" disabled={submitting || lookupLoading} className="w-full">
        {submitting ? "Saving..." : "Submit Collector Profile"}
      </Button>
    </form>
  );
}

export function CollectorQuestionnaireForm() {
  return (
    <Suspense fallback={<div className="h-[720px] animate-pulse rounded-sm bg-arena-surface" />}>
      <CollectorQuestionnaireFormFields />
    </Suspense>
  );
}
