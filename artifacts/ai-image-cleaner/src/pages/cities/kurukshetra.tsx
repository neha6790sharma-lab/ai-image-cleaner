import { CityPage } from '@/components/city/city-page';
import { getCity } from '@/lib/city-data';

const city = getCity('kurukshetra')!;

export default function KurukshetraCityPage() {
  return <CityPage city={city} />;
}
