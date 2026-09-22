import { CityPage } from '@/components/city/city-page';
import { getCity } from '@/lib/city-data';

const city = getCity('gurugram')!;

export default function GurugramCityPage() {
  return <CityPage city={city} />;
}
