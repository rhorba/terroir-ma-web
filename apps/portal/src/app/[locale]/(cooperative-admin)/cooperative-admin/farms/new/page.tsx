'use client';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { mapFarm } from '../actions';

const REGIONS = [
  { code: 'TAN', label: 'Tanger-Tétouan-Al Hoceïma' },
  { code: 'ORI', label: 'Oriental' },
  { code: 'FEZ', label: 'Fès-Meknès' },
  { code: 'RAB', label: 'Rabat-Salé-Kénitra' },
  { code: 'BER', label: 'Béni Mellal-Khénifra' },
  { code: 'CAS', label: 'Casablanca-Settat' },
  { code: 'MAR', label: 'Marrakech-Safi' },
  { code: 'DRA', label: 'Drâa-Tafilalet' },
  { code: 'SOU', label: 'Souss-Massa' },
  { code: 'GUE', label: 'Guelmim-Oued Noun' },
  { code: 'LAA', label: 'Laâyoune-Sakia El Hamra' },
  { code: 'DAK', label: 'Dakhla-Oued Ed-Dahab' },
];

export default function MapFarmPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const lat = fd.get('latitude') as string;
    const lng = fd.get('longitude') as string;
    const crops = (fd.get('cropTypes') as string)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    startTransition(async () => {
      await mapFarm({
        name: fd.get('name') as string,
        regionCode: fd.get('regionCode') as string,
        commune: (fd.get('commune') as string) || undefined,
        areaHectares: parseFloat(fd.get('areaHectares') as string),
        cropTypes: crops,
        latitude: lat ? parseFloat(lat) : undefined,
        longitude: lng ? parseFloat(lng) : undefined,
      });
      router.push('/fr/cooperative-admin/farms');
    });
  }

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 text-2xl font-bold">Enregistrer une ferme</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="name"
          placeholder="Nom de la ferme"
          required
          className="rounded border px-3 py-2"
        />
        <select name="regionCode" required className="rounded border px-3 py-2">
          <option value="">— Sélectionner une région —</option>
          {REGIONS.map((r) => (
            <option key={r.code} value={r.code}>
              {r.label}
            </option>
          ))}
        </select>
        <input
          name="commune"
          placeholder="Commune (optionnel)"
          className="rounded border px-3 py-2"
        />
        <input
          name="areaHectares"
          type="number"
          step="0.01"
          min="0"
          placeholder="Surface (hectares)"
          required
          className="rounded border px-3 py-2"
        />
        <input
          name="cropTypes"
          placeholder="Cultures (séparées par virgule, ex: olive, argan)"
          className="rounded border px-3 py-2"
        />
        <div className="flex gap-2">
          <input
            name="latitude"
            type="number"
            step="0.000001"
            placeholder="Latitude (optionnel)"
            className="flex-1 rounded border px-3 py-2"
          />
          <input
            name="longitude"
            type="number"
            step="0.000001"
            placeholder="Longitude (optionnel)"
            className="flex-1 rounded border px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="rounded bg-green-700 px-4 py-2 text-white hover:bg-green-800 disabled:opacity-50"
        >
          {isPending ? 'Enregistrement…' : 'Enregistrer la ferme'}
        </button>
      </form>
    </div>
  );
}
