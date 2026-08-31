"use server";

import { redirect } from "next/navigation";

import { signIn, signOut } from "@/auth";
import { requestOtp } from "@/lib/api/backend";

// Sign-out helper. We deliberately do NOT use next-auth's `redirectTo`: that
// makes Auth.js build an *absolute* Location from AUTH_URL, or from the request
// origin when AUTH_URL is unset — and behind a proxy that origin resolves to
// http://localhost:3000, which is how a signed-out user ends up staring at
// "localhost refused to connect". Clearing the session and issuing our own
// relative redirect lets the browser resolve it against whatever origin the
// user is actually on, so this works in dev, previews and production without
// any per-environment configuration.
async function endSession() {
  await signOut({ redirect: false });
}

export async function signOutAction() {
  await endSession();
  redirect("/");
}

// Module-specific sign-out: return the vendor/admin to their own login screen
// rather than the customer home.
export async function signOutVendorAction() {
  await endSession();
  redirect("/vendor/login");
}

export async function signOutAdminAction() {
  await endSession();
  redirect("/admin/login");
}

export async function signInWithGoogleAction() {
  await signIn("google", { redirectTo: "/" });
}

export async function signInWithAppleAction() {
  await signIn("apple", { redirectTo: "/" });
}

// Step 1 of passwordless login: ask the backend to email a 6-digit code.
// Always resolves (the backend never enumerates accounts); returns a flag so
// the UI can advance to the code-entry step.
export async function requestOtpAction(
  email: string,
): Promise<{ ok: boolean; error?: string }> {
  const trimmed = email.trim().toLowerCase();
  if (!trimmed || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmed)) {
    return { ok: false, error: "Enter a valid email address." };
  }
  try {
    await requestOtp(trimmed);
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not send a code. Try again." };
  }
}
