import { CityPage } from '@/components/city/city-page';
import { getCity } from '@/lib/city-data';

const city = getCity('faridabad')!;

export default function FaridabadCityPage() {
  return <CityPage city={city} />;
}
