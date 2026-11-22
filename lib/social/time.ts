// Publish times are stored in UTC and shown and edited in Pacific time.
export const PT = "America/Los_Angeles";

function parts(d: Date, tz: string) {
  const f = new Intl.DateTimeFormat("en-US", {
    timeZone: tz, hourCycle: "h23",
    year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit",
  });
  const o: Record<string, number> = {};
  for (const p of f.formatToParts(d)) if (p.type !== "literal") o[p.type] = Number(p.value);
  return o;
}

// "2026-12-05T09:00" (wall clock in Pacific) → ISO UTC.
export function pacificLocalToIso(local: string): string | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(local);
  if (!m) return null;
  const [, y, mo, d, h, mi] = m.map(Number);
  // Guess the instant as if the wall clock were UTC, then correct by the zone's
  // offset at that instant (twice, so a DST boundary settles).
  let t = Date.UTC(y, mo - 1, d, h, mi);
  for (let i = 0; i < 2; i++) {
    const p = parts(new Date(t), PT);
    const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
    t += Date.UTC(y, mo - 1, d, h, mi) - asUtc;
  }
  return new Date(t).toISOString();
}

// ISO → "2026-12-05T09:00" for <input type="datetime-local">, in Pacific.
export function isoToPacificLocal(iso: string): string {
  const p = parts(new Date(iso), PT);
  const z = (n: number) => String(n).padStart(2, "0");
  return `${p.year}-${z(p.month)}-${z(p.day)}T${z(p.hour)}:${z(p.minute)}`;
}

export function formatPacific(iso: string, opts: Intl.DateTimeFormatOptions = {}): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: PT, weekday: "short", month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
    ...opts,
  }).format(new Date(iso)) + " PT";
}

// Monday 00:00 Pacific of the week containing `iso`, as a Pacific date string.
export function weekKey(iso: string): string {
  const p = parts(new Date(iso), PT);
  const day = new Date(Date.UTC(p.year, p.month - 1, p.day));
  const dow = (day.getUTCDay() + 6) % 7; // Monday = 0
  day.setUTCDate(day.getUTCDate() - dow);
  return day.toISOString().slice(0, 10);
}
