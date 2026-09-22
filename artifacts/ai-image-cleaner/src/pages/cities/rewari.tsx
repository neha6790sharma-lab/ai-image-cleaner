import { CityPage } from '@/components/city/city-page';
import { getCity } from '@/lib/city-data';

const city = getCity('rewari')!;

export default function RewariCityPage() {
  return <CityPage city={city} />;
}
