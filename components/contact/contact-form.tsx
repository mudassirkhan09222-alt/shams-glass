"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { contactSchema, type ContactInput } from "@/lib/validation/schemas";
import { submitContact } from "@/lib/contact/actions";
import { cn } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", message: "", company: "" },
  });

  const onSubmit = async (data: ContactInput) => {
    setStatus("submitting");
    setServerMessage(null);
    try {
      const result = await submitContact(data);
      if (result.ok) {
        setStatus("success");
        setServerMessage(result.message ?? "Thank you — your enquiry has been sent.");
        reset();
      } else {
        setStatus("error");
        setServerMessage(result.message ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setServerMessage("Something went wrong. Please try again or contact us directly.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      {/* Honeypot — visually hidden, ignored by real users. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company">Company (leave empty)</label>
        <input id="company" type="text" tabIndex={-1} autoComplete="off" {...register("company")} />
      </div>

      <Field label="Your name" htmlFor="name" error={errors.name?.message}>
        <input
          id="name"
          type="text"
          autoComplete="name"
          className={inputClass(errors.name)}
          {...register("name")}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email" htmlFor="email" error={errors.email?.message} optional>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={inputClass(errors.email)}
            {...register("email")}
          />
        </Field>
        <Field label="Phone" htmlFor="phone" error={errors.phone?.message} optional>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            className={inputClass(errors.phone)}
            {...register("phone")}
          />
        </Field>
      </div>

      <Field label="Message" htmlFor="message" error={errors.message?.message}>
        <textarea
          id="message"
          rows={5}
          className={cn(inputClass(errors.message), "min-h-32 resize-y")}
          {...register("message")}
        />
      </Field>

      <p className="text-xs text-ink-muted">
        Provide an email or a phone number so we can reply. We never share your
        details with third parties.
      </p>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-navy px-7 text-sm font-medium text-white hover:bg-navy-700 disabled:opacity-60 transition-colors"
      >
        {status === "submitting" ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : null}
        {status === "submitting" ? "Sending…" : "Send enquiry"}
      </button>

      {status === "success" ? (
        <div className="flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">
          <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden />
          <span>{serverMessage}</span>
        </div>
      ) : null}

      {status === "error" ? (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800" role="alert">
          <AlertCircle className="h-5 w-5 shrink-0" aria-hidden />
          <span>{serverMessage}</span>
        </div>
      ) : null}
    </form>
  );
}

function Field({
  label,
  htmlFor,
  error,
  optional,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-sm font-medium text-navy">
        {label}
        {optional ? (
          <span className="ml-1 text-ink-muted font-normal">(optional)</span>
        ) : null}
      </label>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p className="mt-1.5 text-xs text-red-600">{error}</p>
      ) : null}
    </div>
  );
}

function inputClass(error?: { message?: string } | string) {
  const base =
    "w-full h-11 rounded-xl border bg-canvas px-3.5 text-sm text-ink placeholder:text-ink-muted focus:bg-white focus:outline-none transition-colors";
  return error
    ? `${base} border-red-300 focus:border-red-400`
    : `${base} border-hairline focus:border-corporate`;
}
