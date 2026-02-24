'use client';

import { useParams } from 'next/navigation';
import StoreDetailsClient from './store-details-client';

export default function StoreDetailsPage() {
  const params = useParams();
  return <StoreDetailsClient id={params.id as string} />;
}
