import { CityPage } from '@/components/city/city-page';
import { getCity } from '@/lib/city-data';

const city = getCity('ambala')!;

export default function AmbalaCityPage() {
  return <CityPage city={city} />;
}
