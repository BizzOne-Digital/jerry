"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { INQUIRY_TYPES, type InquiryType } from "@/types";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email required"),
  phone: z.string().optional(),
  inquiryType: z.enum(INQUIRY_TYPES),
  message: z.string().min(10, "Message must be at least 10 characters"),
  consent: z.literal(true, { errorMap: () => ({ message: "Consent is required" }) }),
});

type FormData = z.infer<typeof schema>;

function parseInquiryType(value: string | null): InquiryType {
  if (!value) return "Other";
  const match = INQUIRY_TYPES.find((type) => type.toLowerCase() === value.toLowerCase());
  return match ?? "Other";
}

function ContactFormFields() {
  const params = useSearchParams();
  const defaultInquiry = useMemo(() => parseInquiryType(params.get("inquiry")), [params]);
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { inquiryType: defaultInquiry },
  });

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to send");
      toast.success("Message sent! We'll be in touch soon.");
      reset({ inquiryType: defaultInquiry });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="arena-glow space-y-4 rounded-sm bg-arena-surface p-6">
      <Input label="Name" {...register("name")} error={errors.name?.message} />
      <Input label="Email" type="email" {...register("email")} error={errors.email?.message} />
      <Input label="Phone" type="tel" {...register("phone")} />
      <Select
        label="Inquiry Type"
        options={INQUIRY_TYPES.map((t) => ({ value: t, label: t }))}
        {...register("inquiryType")}
        error={errors.inquiryType?.message}
      />
      <Textarea label="Message" rows={5} {...register("message")} error={errors.message?.message} />
      <label className="flex items-start gap-2 text-sm text-arena-muted">
        <input type="checkbox" {...register("consent")} className="mt-1" />
        <span>I consent to being contacted about my inquiry.</span>
      </label>
      {errors.consent && <p className="text-xs text-arena-coral">{errors.consent.message}</p>}
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}

export function ContactForm() {
  return (
    <Suspense fallback={<div className="h-[520px] animate-pulse rounded-sm bg-arena-surface" />}>
      <ContactFormFields />
    </Suspense>
  );
}
