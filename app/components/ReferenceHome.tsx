import Link from "next/link";
import ReferenceArtwork from "./ReferenceArtwork";

const COLLECTIONS = [
  { name: "Rings", href: "/rings", region: "rings" },
  { name: "Necklaces", href: "/chains", region: "necklaces" },
  { name: "Earrings", href: "/earrings", region: "earrings" },
  { name: "Bracelets", href: "/bracelets", region: "bracelets" },
] as const;

export default function ReferenceHome() {
  return <div className="ed4-page" lang="en" dir="ltr">
    <section className="ed4-hero" aria-labelledby="ed4-title">
      <div className="ed4-portrait"><ReferenceArtwork region="hero" label="NAPD monochrome jewelry editorial portrait" /></div>
      <div className="ed4-copy"><h1 id="ed4-title"><span>SILVER</span><span>LIVES</span><span>BOLDER</span></h1><p>EVERYDAY ICONS<br />FOR A BRIGHTER TOMORROW.</p><Link href="#collection" className="ed4-shop-button">Shop the collection</Link></div>
    </section>
    <nav id="collection" className="ed4-collection-strip" aria-label="Shop by collection">{COLLECTIONS.map(({ name, href, region }) => <Link href={href} key={region} className="ed4-collection-link"><div className="ed4-collection-photo"><ReferenceArtwork region={region} label={`${name} editorial collection artwork`} /></div><span>{name}</span></Link>)}</nav>
  </div>;
}
