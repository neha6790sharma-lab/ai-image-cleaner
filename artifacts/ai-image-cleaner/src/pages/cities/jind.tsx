import { CityPage } from '@/components/city/city-page';
import { getCity } from '@/lib/city-data';

const city = getCity('jind')!;

export default function JindCityPage() {
  return <CityPage city={city} />;
}
