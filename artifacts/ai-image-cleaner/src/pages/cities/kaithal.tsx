import { CityPage } from '@/components/city/city-page';
import { getCity } from '@/lib/city-data';

const city = getCity('kaithal')!;

export default function KaithalCityPage() {
  return <CityPage city={city} />;
}
