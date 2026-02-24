import StoreDetailsClient from './store-details-client';

export default async function StoreDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <StoreDetailsClient id={id} />;
}
