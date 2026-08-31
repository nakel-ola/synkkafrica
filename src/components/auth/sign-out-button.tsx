import { signOutAction } from "@/lib/auth/actions";

export function SignOutButton() {
  return (
    <form action={signOutAction}>
      <button
        type="submit"
        className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900"
      >
        Sign out
      </button>
    </form>
  );
}
