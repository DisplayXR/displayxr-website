/**
 * A static stand-in where a live 3D capture of the app will go once a cleared
 * stereo capture exists. Deliberately plain: no invented screenshot.
 */
export function CapturePlaceholder({ label, tint = "rgba(59,130,246,0.22)" }: { label: string; tint?: string }) {
  return (
    <div
      className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-2xl border border-dashed border-border bg-[#0b0c10]"
      style={{ backgroundImage: `radial-gradient(520px 260px at 50% 45%, ${tint}, rgba(5,5,7,0) 70%)` }}
    >
      <p className="max-w-xs px-6 text-center text-sm text-text-secondary">{label}</p>
    </div>
  );
}
