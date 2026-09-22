import { CityPage } from '@/components/city/city-page';
import { getCity } from '@/lib/city-data';

const city = getCity('yamunanagar')!;

export default function YamunanagarCityPage() {
  return <CityPage city={city} />;
}
