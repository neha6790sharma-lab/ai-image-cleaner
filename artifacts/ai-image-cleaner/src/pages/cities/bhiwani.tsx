import { CityPage } from '@/components/city/city-page';
import { getCity } from '@/lib/city-data';

const city = getCity('bhiwani')!;

export default function BhiwaniCityPage() {
  return <CityPage city={city} />;
}
