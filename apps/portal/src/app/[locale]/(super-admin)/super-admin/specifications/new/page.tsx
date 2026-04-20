import { createProductType } from '../actions';
import { PageHeader } from '@/components/admin/page-header';

const inputCls =
  'w-full rounded border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500';

const fields = [
  { name: 'code', label: 'Code unique *', placeholder: 'Ex: ARGAN-IGP-SOUSS', required: true },
  { name: 'nameFr', label: 'Nom FR *', placeholder: 'Nom en français', required: true },
  { name: 'nameAr', label: 'Nom AR *', placeholder: 'الاسم بالعربية', required: true },
  { name: 'nameZgh', label: 'Nom Amazigh', placeholder: 'ⴰⵙⵎⴰⵡⴰⵍ', required: false },
  { name: 'regionCode', label: 'Code région *', placeholder: 'Ex: SOUSS-MASSA', required: true },
  { name: 'hsCode', label: 'Code HS', placeholder: 'Ex: 1515.30', required: false },
  { name: 'onssaCategory', label: 'Catégorie ONSSA', placeholder: 'Optionnel', required: false },
] as const;

export default function NewSpecPage() {
  return (
    <div className="max-w-xl">
      <PageHeader title="Nouvelle spécification SDOQ" />
      <form action={createProductType} className="flex flex-col gap-4">
        {fields.map(({ name, label, placeholder, required }) => (
          <div key={name}>
            <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
            <input
              name={name}
              required={required}
              className={inputCls}
              placeholder={placeholder}
            />
          </div>
        ))}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Type SDOQ *</label>
          <select name="certificationType" required className={inputCls}>
            <option value="IGP">IGP — Indication Géographique Protégée</option>
            <option value="AOP">AOP — Appellation d&apos;Origine Protégée</option>
            <option value="LA">Label Agricole</option>
          </select>
        </div>
        <div className="pt-2">
          <button
            type="submit"
            className="rounded bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  );
}
