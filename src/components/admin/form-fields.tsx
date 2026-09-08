"use client";

import { useFormContext, type FieldValues, type Path } from "react-hook-form";

interface FormFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  type?: "text" | "email" | "password" | "number" | "url" | "date" | "datetime-local";
  placeholder?: string;
  required?: boolean;
  step?: string;
  min?: number;
  max?: number;
}

export function FormInput<T extends FieldValues>({
  name,
  label,
  type = "text",
  placeholder,
  required,
  step,
  min,
  max,
}: FormFieldProps<T>) {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();
  const error = errors[name]?.message as string | undefined;

  return (
    <div>
      <label className="admin-label" htmlFor={name}>
        {label}
        {required && <span className="text-[var(--admin-accent)]"> *</span>}
      </label>
      <input
        id={name}
        type={type}
        step={step}
        min={min}
        max={max}
        placeholder={placeholder}
        className="admin-input"
        {...register(name, { valueAsNumber: type === "number" })}
      />
      {error && <p className="mt-1 text-xs text-[var(--admin-danger)]">{error}</p>}
    </div>
  );
}

export function FormTextarea<T extends FieldValues>({
  name,
  label,
  placeholder,
  rows = 4,
  required,
}: FormFieldProps<T> & { rows?: number }) {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();
  const error = errors[name]?.message as string | undefined;

  return (
    <div>
      <label className="admin-label" htmlFor={name}>
        {label}
        {required && <span className="text-[var(--admin-accent)]"> *</span>}
      </label>
      <textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        className="admin-input resize-y"
        {...register(name)}
      />
      {error && <p className="mt-1 text-xs text-[var(--admin-danger)]">{error}</p>}
    </div>
  );
}

export function FormSelect<T extends FieldValues>({
  name,
  label,
  options,
  required,
}: FormFieldProps<T> & { options: { value: string; label: string }[] }) {
  const {
    register,
    formState: { errors },
  } = useFormContext<T>();
  const error = errors[name]?.message as string | undefined;

  return (
    <div>
      <label className="admin-label" htmlFor={name}>
        {label}
        {required && <span className="text-[var(--admin-accent)]"> *</span>}
      </label>
      <select id={name} className="admin-input" {...register(name)}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-[var(--admin-danger)]">{error}</p>}
    </div>
  );
}

export function FormCheckbox<T extends FieldValues>({
  name,
  label,
}: {
  name: Path<T>;
  label: string;
}) {
  const { register } = useFormContext<T>();

  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm">
      <input
        type="checkbox"
        className="h-4 w-4 rounded border-[var(--admin-border)] bg-[var(--admin-bg)] accent-[var(--admin-accent)]"
        {...register(name)}
      />
      {label}
    </label>
  );
}
