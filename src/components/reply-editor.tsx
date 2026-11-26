"use client";

import { useState, useTransition } from "react";
import { Check, CircleAlert, Copy, LoaderCircle, Save } from "lucide-react";
import { saveReply } from "@/app/dashboard/tickets/manage";
import { inputClass } from "@/lib/ui";

const MAX_LENGTH = 2000;

export function ReplyEditor({
  ticketId,
  initialReply,
}: {
  ticketId: string;
  initialReply: string;
}) {
  const [text, setText] = useState(initialReply);
  const [savedText, setSavedText] = useState(initialReply);
  const [justSaved, setJustSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pending, startTransition] = useTransition();

  const dirty = text.trim() !== savedText.trim();

  function onChange(value: string) {
    setText(value);
    setJustSaved(false);
    setError(null);
  }

  function onSave() {
    setError(null);
    startTransition(async () => {
      const result = await saveReply(ticketId, text);
      if (result.error) {
        setError(result.error);
      } else {
        setSavedText(text);
        setJustSaved(true);
      }
    });
  }

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Copy is not available in this browser. Select the text and copy it.");
    }
  }

  return (
    <div className="space-y-3">
      <label htmlFor="reply" className="text-sm font-medium">
        Draft reply (edit before you send)
      </label>
      <textarea
        id="reply"
        value={text}
        onChange={(event) => onChange(event.target.value)}
        maxLength={MAX_LENGTH}
        rows={7}
        className={`${inputClass} min-h-40 resize-y py-3 leading-relaxed`}
      />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onSave}
          disabled={!dirty || pending}
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-card transition hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? (
            <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Save className="size-4" aria-hidden="true" />
          )}
          Save reply
        </button>
        <button
          type="button"
          onClick={onCopy}
          className="inline-flex h-10 items-center gap-2 rounded-xl border bg-surface px-4 text-sm font-medium transition hover:bg-surface-2"
        >
          {copied ? (
            <Check className="size-4 text-success" aria-hidden="true" />
          ) : (
            <Copy className="size-4" aria-hidden="true" />
          )}
          {copied ? "Copied" : "Copy"}
        </button>
        <span className="text-xs text-muted" aria-live="polite">
          {dirty ? "Unsaved changes" : justSaved ? "Saved" : ""}
        </span>
        <span className="ml-auto text-xs tabular-nums text-muted">
          {text.length}/{MAX_LENGTH}
        </span>
      </div>

      {error && (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-xl bg-danger/10 px-3 py-2.5 text-sm text-danger"
        >
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
