"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

import { useTranslation } from "@/hooks/use-translation";
import { requestErasure } from "@/lib/api/users";

export function DeleteAccountButton({ token }: { token: string | null }) {
  const t = useTranslation();
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function confirmDelete() {
    if (!token) return;
    setDeleting(true);
    setError(null);
    try {
      await requestErasure(token);
      // Account PII is gone — end the session and return home. `redirect: false`
      // keeps next-auth from handing back an absolute URL built from the server's
      // own origin (localhost behind a proxy); we navigate relatively instead.
      await signOut({ redirect: false });
      window.location.href = "/";
    } catch (err) {
      setDeleting(false);
      setError(
        err instanceof Error ? err.message : "Couldn't delete your account.",
      );
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={!token}
        className="inline-flex items-center gap-2 rounded-[10px] border border-[#DD2222] bg-white px-5 py-2.5 text-sm font-medium font-satoshi text-[#DD2222] transition-colors hover:bg-[#FFF1EB] disabled:opacity-50"
      >
        <Trash2 className="h-4 w-4" strokeWidth={1.75} />
        {t("account.deleteAccount")}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-[#DD2222]">
                <AlertTriangle className="h-5 w-5" />
              </span>
              <h2 className="text-lg font-bold font-montserrat text-foreground">
                Delete your account?
              </h2>
            </div>

            <p className="mt-3 text-sm font-satoshi text-foreground/70">
              This permanently erases your personal data — profile, saved
              travellers, and booking details. Records we&apos;re legally
              required to keep are anonymised. This cannot be undone.
            </p>

            {error ? (
              <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                {error}
              </p>
            ) : null}

            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={deleting}
                className="rounded-[10px] border border-[#C9C9C9] px-4 py-2.5 text-sm font-semibold font-satoshi text-foreground transition-colors hover:bg-black/[0.03] disabled:opacity-60"
              >
                Keep my account
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleting}
                className="inline-flex items-center gap-2 rounded-[10px] bg-[#DD2222] px-4 py-2.5 text-sm font-semibold font-satoshi text-white transition-opacity hover:opacity-90 disabled:opacity-60"
              >
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {deleting ? "Deleting…" : "Delete permanently"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
