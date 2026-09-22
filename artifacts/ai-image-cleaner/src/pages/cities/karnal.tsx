import { CityPage } from '@/components/city/city-page';
import { getCity } from '@/lib/city-data';

const city = getCity('karnal')!;

export default function KarnalCityPage() {
  return <CityPage city={city} />;
}
