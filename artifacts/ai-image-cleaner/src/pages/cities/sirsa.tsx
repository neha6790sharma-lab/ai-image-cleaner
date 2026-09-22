import { CityPage } from '@/components/city/city-page';
import { getCity } from '@/lib/city-data';

const city = getCity('sirsa')!;

export default function SirsaCityPage() {
  return <CityPage city={city} />;
}
