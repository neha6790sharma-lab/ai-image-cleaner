import { CityPage } from '@/components/city/city-page';
import { getCity } from '@/lib/city-data';

const city = getCity('panchkula')!;

export default function PanchkulaCityPage() {
  return <CityPage city={city} />;
}
