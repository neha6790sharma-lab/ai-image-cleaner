import { CityPage } from '@/components/city/city-page';
import { getCity } from '@/lib/city-data';

const city = getCity('hisar')!;

export default function HisarCityPage() {
  return <CityPage city={city} />;
}
