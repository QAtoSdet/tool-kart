"use client";

import { useState } from "react";
import { Button, type ButtonProps } from "@/components/ui/Button";

export interface CopyButtonProps
  extends Omit<ButtonProps, "onClick" | "children" | "value"> {
  /** Text to copy to the clipboard. */
  value: string;
  /** Button label in the idle state. */
  label?: string;
  /** Button label shown briefly after a successful copy. */
  copiedLabel?: string;
  /** Optional callback after a successful copy (e.g. to reset sibling UI). */
  onCopied?: () => void;
}

/**
 * Small secondary button that copies `value` to the clipboard and shows a
 * transient "Copied!" confirmation. Composes the shared `Button` so it picks
 * up the design-system variants/sizes automatically. When `value` is empty the
 * button is disabled (nothing useful to copy).
 */
export function CopyButton({
  value,
  label = "Copy",
  copiedLabel = "Copied!",
  onCopied,
  disabled,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      onCopied?.();
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API may be blocked (e.g. insecure context); ignore silently.
    }
  };

  return (
    <Button
      type="button"
      variant="secondary"
      size="sm"
      disabled={disabled || !value}
      onClick={copy}
      aria-live="polite"
      {...props}
    >
      {copied ? copiedLabel : label}
    </Button>
  );
}
