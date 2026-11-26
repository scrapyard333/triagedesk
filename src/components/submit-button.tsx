"use client";

import type { ComponentProps } from "react";
import { useFormStatus } from "react-dom";
import { LoaderCircle } from "lucide-react";

type Props = Omit<ComponentProps<"button">, "type"> & {
  pendingLabel?: string;
};

export function SubmitButton({
  children,
  pendingLabel,
  disabled,
  className,
  ...props
}: Props) {
  const { pending } = useFormStatus();

  return (
    <button
      {...props}
      type="submit"
      disabled={pending || disabled}
      className={`${className ?? ""} disabled:cursor-not-allowed disabled:opacity-60`}
    >
      {pending && pendingLabel ? (
        <>
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          {pendingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}
