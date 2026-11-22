import { redirect } from "next/navigation";
import { auth, isAllowed } from "@/lib/auth";
import { SocialNav } from "../ui";

export const metadata = { title: "How the social board works · Admin", robots: { index: false, follow: false } };

const STEPS = [
  { n: "1", title: "The planner builds a post", text: "In the KB, the planner picks clips, renders the 16:9 and 9:16 versions, writes a caption per channel and runs the copy, rights and label checks. It uploads the package here. Leia posts never come here; they go to Leia marketing." },
  { n: "2", title: "You review it", text: "Each post shows its video, the clips it uses, the check results, a caption per channel with a character count, and the publish time in Pacific. Edit anything; every change is kept in the post's history." },
  { n: "3", title: "Approve, one post at a time", text: "Approve and schedule sends that one post to Buffer for every channel marked “via Buffer”, at the time shown. There is no bulk approve and nothing is sent without a click here. A failed check blocks approval." },
  { n: "4", title: "By-hand channels", text: "Reddit, Hacker News and Discord are posted by a person: copy the text, post it, then paste the link and Mark posted." },
  { n: "5", title: "It goes out", text: "When a scheduled post's time has passed, the board asks Buffer what happened and moves it to Posted, with links, once every channel is out." },
];

export default async function HowItWorks() {
  const session = await auth();
  if (!isAllowed(session?.user?.login)) redirect("/admin/signin");
  return (
    <main className="mx-auto max-w-[1100px] px-6 py-12">
      <SocialNav active="how" />
      <h1 className="mb-8 text-3xl font-semibold text-text-primary">How it works</h1>
      <ol className="grid gap-4 md:grid-cols-2">
        {STEPS.map((s) => (
          <li key={s.n} className="rounded-xl border border-border bg-surface p-5">
            <div className="mb-2 font-mono text-sm text-accent">{s.n}</div>
            <h2 className="mb-1 font-medium text-text-primary">{s.title}</h2>
            <p className="text-sm leading-relaxed text-text-secondary">{s.text}</p>
          </li>
        ))}
      </ol>
      <section className="mt-10 rounded-xl border border-border p-5 text-sm text-text-secondary">
        <h2 className="mb-2 font-medium text-text-primary">Setup</h2>
        <ul className="list-disc space-y-1 pl-5">
          <li><span className="font-mono text-xs">BUFFER_API_KEY</span>: from publish.buffer.com/settings/api, added in Vercel as a Sensitive variable. Server only.</li>
          <li><span className="font-mono text-xs">SOCIAL_PLANNER_TOKEN</span>: a random string of 32+ characters, shared with the planner. It can upload packages and media, nothing else.</li>
          <li><span className="font-mono text-xs">BLOB_READ_WRITE_TOKEN</span>: the site&apos;s Blob store. Never given to the planner.</li>
          <li>Optional <span className="font-mono text-xs">BUFFER_CHANNELS</span>: JSON mapping board channels to Buffer channel ids, if Buffer holds more than one account per network.</li>
        </ul>
      </section>
    </main>
  );
}
