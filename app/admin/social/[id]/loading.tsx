// Shown at once when a queue card is clicked: the post page reads its newest
// version from Blob storage, which can take a few seconds, and without this the
// click looked like it did nothing.
export default function Loading() {
  return (
    <main className="mx-auto max-w-[1100px] px-6 py-12">
      <p className="text-text-secondary" role="status">Loading the post…</p>
    </main>
  );
}
