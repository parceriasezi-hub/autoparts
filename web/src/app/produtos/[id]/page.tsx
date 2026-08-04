import { PRODUCTS } from '@/data/partsData';
import ProductDetailClient from '@/components/ProductDetailClient';

export async function generateStaticParams() {
  return PRODUCTS.map((product) => ({
    id: product.id,
  }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  return <ProductDetailClient productId={resolvedParams.id} />;
}
