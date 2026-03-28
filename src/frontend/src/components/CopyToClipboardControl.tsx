import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface CopyToClipboardControlProps {
  text: string;
  label?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export default function CopyToClipboardControl({
  text,
  label,
  variant = "outline",
  size = "sm",
  className = "",
}: CopyToClipboardControlProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // Modern clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        try {
          document.execCommand("copy");
          setCopied(true);
          toast.success("Copied to clipboard!");
          setTimeout(() => setCopied(false), 2000);
        } catch (_err) {
          toast.error("Failed to copy. Please copy manually.");
        } finally {
          textArea.remove();
        }
      }
    } catch (_err) {
      toast.error("Failed to copy. Please copy manually.");
    }
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleCopy}
      className={className}
      type="button"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          {label && <span className="ml-2">{label}</span>}
        </>
      ) : (
        <>
          <Copy className="h-4 w-4" />
          {label && <span className="ml-2">{label}</span>}
        </>
      )}
    </Button>
  );
}
