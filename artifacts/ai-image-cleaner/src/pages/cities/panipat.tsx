import { CityPage } from '@/components/city/city-page';
import { getCity } from '@/lib/city-data';

const city = getCity('panipat')!;

export default function PanipatCityPage() {
  return <CityPage city={city} />;
}
