const REGIONS = {
  hero: [795, 610, 395, 255],
  rings: [795, 870, 175, 113],
  necklaces: [975, 870, 172, 113],
  earrings: [1152, 870, 170, 113],
  bracelets: [1326, 870, 175, 113],
} as const;

/** Clips the approved original artwork in-browser without regenerating it. */
export default function ReferenceArtwork({ region, label }: { region: keyof typeof REGIONS; label: string }) {
  return <svg viewBox={REGIONS[region].join(" ")} preserveAspectRatio="xMidYMid slice" role="img" aria-label={label} className="ed4-artwork"><image href="/editorial-reference.png" width="1536" height="1024" /></svg>;
}
