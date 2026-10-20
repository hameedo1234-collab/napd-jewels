import ProductDetailsClient from "./ProductDetailsClient";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const p = await Promise.resolve(params);
  return <ProductDetailsClient id={p.slug} />;
}
