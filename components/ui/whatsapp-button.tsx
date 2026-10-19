import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappLink } from "@/lib/config/site";

/**
 * WhatsApp enquiry CTA. Renders nothing when no WhatsApp number is configured,
 * so the UI never advertises a broken contact channel. Pass `productContext`
 * to pre-fill a product-specific enquiry message.
 */
export function WhatsAppButton({
  message,
  label = "Enquire on WhatsApp",
  size = "md",
  className = "",
  productName,
  external = true,
}: {
  message?: string;
  label?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  productName?: string;
  external?: boolean;
}) {
  const enquiry =
    message ??
    (productName
      ? `Hello Shams Glass, I'd like to enquire about "${productName}". Could you share more details and a quotation?`
      : "Hello Shams Glass, I'd like to enquire about your glass and aluminium solutions.");
  const href = whatsappLink(enquiry);
  if (!href) return null;

  return (
    <Button
      href={href}
      external={external}
      variant="whatsapp"
      size={size}
      className={className}
      iconLeft={<MessageCircle className="h-4 w-4" aria-hidden />}
    >
      {label}
    </Button>
  );
}
