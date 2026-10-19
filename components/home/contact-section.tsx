import Link from "next/link";
import { ArrowRight, Phone, Mail, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { Reveal } from "@/components/ui/motion";
import {
  BUSINESS,
  mailLink,
  telLink,
} from "@/lib/config/site";

export function ContactSection() {
  const phone = telLink(BUSINESS.phone);
  const email = mailLink(BUSINESS.email);

  return (
    <section id="contact" className="py-20 md:py-28 bg-canvas scroll-mt-20">
      <Container>
        <div className="relative overflow-hidden rounded-3xl sg-navy-gradient text-white">
          <div className="sg-sheen absolute inset-0 opacity-50" aria-hidden />
          <div className="relative grid gap-10 p-8 sm:p-12 lg:p-16 lg:grid-cols-2 lg:items-center">
            <div>
              <Reveal as="span">
                <span className="sg-eyebrow !text-glass">Contact & Quotation</span>
              </Reveal>
              <Reveal as="h2" delay={0.08} className="mt-3">
                <span className="block text-3xl sm:text-4xl font-semibold tracking-tight leading-tight">
                  Let&apos;s Discuss Your Glass &amp; Aluminium Requirements.
                </span>
              </Reveal>
              <Reveal as="p" delay={0.14} className="mt-5 text-white/80 text-base sm:text-lg leading-relaxed max-w-lg">
                Looking for the right solution for your project? Contact Shams
                Glass to discuss your requirements and request a quotation.
              </Reveal>

              <Reveal delay={0.2} className="mt-8 flex flex-wrap gap-4">
                <Button
                  href="/contact"
                  variant="light"
                  size="lg"
                  iconRight={<ArrowRight className="h-4 w-4" aria-hidden />}
                >
                  Send an Enquiry
                </Button>
                <WhatsAppButton
                  label="Chat on WhatsApp"
                  size="lg"
                  className="bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/15 text-white"
                />
              </Reveal>
            </div>

            <Reveal delay={0.1}>
              <dl className="grid gap-5 rounded-2xl bg-white/5 border border-white/10 p-6 sm:p-8 backdrop-blur-sm">
                {phone ? (
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                      <Phone className="h-5 w-5 text-glass" aria-hidden />
                    </span>
                    <div>
                      <dt className="text-xs uppercase tracking-[0.16em] text-glass/80">Phone</dt>
                      <dd className="mt-1 text-white">
                        <a href={phone} className="hover:text-glass transition-colors">
                          {BUSINESS.phone}
                        </a>
                      </dd>
                    </div>
                  </div>
                ) : null}
                {email ? (
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                      <Mail className="h-5 w-5 text-glass" aria-hidden />
                    </span>
                    <div>
                      <dt className="text-xs uppercase tracking-[0.16em] text-glass/80">Email</dt>
                      <dd className="mt-1 text-white break-all">
                        <a href={email} className="hover:text-glass transition-colors">
                          {BUSINESS.email}
                        </a>
                      </dd>
                    </div>
                  </div>
                ) : null}
                {BUSINESS.address ? (
                  <div className="flex items-start gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                      <MapPin className="h-5 w-5 text-glass" aria-hidden />
                    </span>
                    <div>
                      <dt className="text-xs uppercase tracking-[0.16em] text-glass/80">Address</dt>
                      <dd className="mt-1 text-white">{BUSINESS.address}</dd>
                    </div>
                  </div>
                ) : null}
                {!phone && !email && !BUSINESS.address ? (
                  <p className="text-sm text-white/70">
                    Contact details will appear here once configured. Visit{" "}
                    <Link href="/contact" className="text-glass underline underline-offset-4">
                      the contact page
                    </Link>{" "}
                    to send an enquiry.
                  </p>
                ) : null}
              </dl>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
