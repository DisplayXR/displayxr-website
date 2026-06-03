import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";
import { GitHubIcon } from "@/components/ui/GitHubIcon";

// Public gate page. Already-authorized users skip straight to the dashboard.
export default async function SignInPage() {
  const session = await auth();
  if (session?.user?.login) redirect("/admin");

  return (
    <div className="mx-auto max-w-md px-6 py-24 md:py-32">
      <div className="bg-surface border border-border rounded-lg p-8 text-center">
        <h1 className="text-2xl font-display tracking-tight text-text-primary mb-2">
          DisplayXR Admin
        </h1>
        <p className="text-text-secondary text-sm leading-relaxed mb-8">
          Sign in with GitHub. Access is restricted to approved maintainers.
        </p>
        <form
          action={async () => {
            "use server";
            await signIn("github", { redirectTo: "/admin" });
          }}
        >
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            <GitHubIcon className="h-4 w-4" />
            Continue with GitHub
          </button>
        </form>
      </div>
    </div>
  );
}
