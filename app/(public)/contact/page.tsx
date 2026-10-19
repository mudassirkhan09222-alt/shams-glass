import type { Metadata } from "next";
import { Phone, Mail, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { ContactForm } from "@/components/contact/contact-form";
import { BUSINESS, mailLink, telLink } from "@/lib/config/site";
import { Reveal } from "@/components/ui/motion";

export const metadata: Metadata = {
  title: "Contact — Shams Glass",
  description:
    "Contact Shams Glass to discuss your glass and aluminium requirements and request a quotation.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const phone = telLink(BUSINESS.phone);
  const email = mailLink(BUSINESS.email);

  return (
    <>
      <section className="pt-16 md:pt-20 bg-canvas">
        <Container className="py-14 md:py-20 border-b border-hairline">
          <p className="sg-eyebrow">Contact & Quotation</p>
          <h1 className="mt-4 max-w-3xl text-4xl sm:text-5xl font-semibold text-navy tracking-tight leading-tight">
            Let&apos;s Discuss Your Glass &amp; Aluminium Requirements.
          </h1>
          <p className="mt-5 max-w-2xl text-ink-soft text-base sm:text-lg leading-relaxed">
            Looking for the right solution for your project? Contact Shams Glass
            to discuss your requirements and request a quotation.
          </p>
        </Container>
      </section>

      <section className="py-14 md:py-20 bg-white">
        <Container>
          <div className="grid gap-10 lg:gap-16 lg:grid-cols-2">
            {/* Contact details */}
            <Reveal>
              <div>
                <h2 className="text-2xl font-semibold text-navy tracking-tight">
                  Get in touch
                </h2>
                <p className="mt-3 text-ink-soft leading-relaxed">
                  Reach out by WhatsApp, phone or email — or use the form and
                  we&apos;ll get back to you.
                </p>

                <ul className="mt-8 space-y-5">
                  <li className="flex items-start gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-glass text-corporate shrink-0">
                      <Phone className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-ink-muted">Phone</p>
                      {phone ? (
                        <a href={phone} className="text-navy hover:text-corporate transition-colors">{BUSINESS.phone}</a>
                      ) : (
                        <p className="text-ink-muted">Not configured</p>
                      )}
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-glass text-corporate shrink-0">
                      <Mail className="h-5 w-5" aria-hidden />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-ink-muted">Email</p>
                      {email ? (
                        <a href={email} className="text-navy hover:text-corporate transition-colors break-all">{BUSINESS.email}</a>
                      ) : (
                        <p className="text-ink-muted">Not configured</p>
                      )}
                    </div>
                  </li>
                  {BUSINESS.address ? (
                    <li className="flex items-start gap-4">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-glass text-corporate shrink-0">
                        <MapPin className="h-5 w-5" aria-hidden />
                      </span>
                      <div>
                        <p className="text-xs uppercase tracking-[0.16em] text-ink-muted">Address</p>
                        <p className="text-navy">{BUSINESS.address}</p>
                      </div>
                    </li>
                  ) : null}
                </ul>

                <div className="mt-8">
                  <WhatsAppButton label="Chat on WhatsApp" size="md" />
                </div>
              </div>
            </Reveal>

            {/* Form */}
            <Reveal delay={0.1}>
              <div className="rounded-3xl border border-hairline bg-canvas p-6 sm:p-8">
                <h2 className="text-xl font-semibold text-navy">Send an enquiry</h2>
                <p className="mt-1.5 text-sm text-ink-soft">
                  Tell us about your project and we&apos;ll be in touch.
                </p>
                <div className="mt-6">
                  <ContactForm />
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
