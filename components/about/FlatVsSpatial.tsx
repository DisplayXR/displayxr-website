/**
 * Flat plane vs content occupying depth, seen from above: a viewer, a screen,
 * and where the content lives. Structured-light register: hairlines, one
 * accent (the content), no text inside the art beyond two labels.
 */
export function FlatVsSpatial() {
  const ink = "var(--color-text-secondary)";
  const accent = "var(--color-accent)";
  const Eye = ({ x }: { x: number }) => (
    <g stroke={ink} strokeWidth="1.5" fill="none">
      <circle cx={x - 9} cy={250} r="5" />
      <circle cx={x + 9} cy={250} r="5" />
    </g>
  );
  return (
    <svg viewBox="0 0 760 290" role="img" aria-labelledby="fvs-title" className="w-full h-auto">
      <title id="fvs-title">
        On a flat display, content lies on the screen plane. On a spatial
        display, content occupies depth in front of and behind the screen.
      </title>
      {/* left: flat */}
      <g>
        <line x1="40" y1="110" x2="320" y2="110" stroke={ink} strokeWidth="3" />
        <rect x="120" y="104" width="120" height="12" fill={accent} opacity="0.9" rx="2" />
        <Eye x={180} />
        <g stroke={ink} strokeWidth="1" strokeDasharray="3 5" opacity="0.6">
          <line x1="171" y1="246" x2="120" y2="116" />
          <line x1="189" y1="246" x2="240" y2="116" />
        </g>
        <text x="180" y="40" textAnchor="middle" fill={ink} fontSize="15" fontFamily="var(--font-sans)">
          Flat display: on the screen
        </text>
      </g>
      {/* right: spatial */}
      <g>
        <line x1="440" y1="110" x2="720" y2="110" stroke={ink} strokeWidth="3" />
        {/* behind the screen */}
        <rect x="610" y="62" width="70" height="28" fill={accent} opacity="0.45" rx="3" />
        {/* through the plane */}
        <rect x="540" y="88" width="60" height="44" fill={accent} opacity="0.7" rx="3" />
        {/* in front of the screen */}
        <rect x="480" y="150" width="56" height="34" fill={accent} opacity="0.95" rx="3" />
        <Eye x={580} />
        <g stroke={ink} strokeWidth="1" strokeDasharray="3 5" opacity="0.6">
          <line x1="571" y1="246" x2="508" y2="184" />
          <line x1="589" y1="246" x2="645" y2="90" />
        </g>
        <text x="580" y="40" textAnchor="middle" fill={ink} fontSize="15" fontFamily="var(--font-sans)">
          Spatial display: in front of and behind it
        </text>
      </g>
      <text x="40" y="104" fill={ink} fontSize="11" fontFamily="var(--font-mono)" opacity="0.7">screen</text>
      <text x="440" y="104" fill={ink} fontSize="11" fontFamily="var(--font-mono)" opacity="0.7">screen</text>
    </svg>
  );
}
