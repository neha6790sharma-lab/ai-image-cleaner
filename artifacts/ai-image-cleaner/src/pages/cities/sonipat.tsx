import { CityPage } from '@/components/city/city-page';
import { getCity } from '@/lib/city-data';

const city = getCity('sonipat')!;

export default function SonipatCityPage() {
  return <CityPage city={city} />;
}
