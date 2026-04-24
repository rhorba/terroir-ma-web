'use client';

import { useState, useTransition } from 'react';

type FormState = {
  certificationId: string;
  destinationCountry: string;
  hsCode: string;
  quantityKg: string;
  consigneeName: string;
  consigneeCountry: string;
};

const INITIAL: FormState = {
  certificationId: '',
  destinationCountry: '',
  hsCode: '',
  quantityKg: '',
  consigneeName: '',
  consigneeCountry: '',
};

const FIELDS: { id: keyof FormState; label: string; placeholder: string }[] = [
  { id: 'certificationId',   label: 'ID Certification',             placeholder: 'UUID de la certification' },
  { id: 'destinationCountry', label: 'Pays destination (ISO 2)',    placeholder: 'FR' },
  { id: 'hsCode',            label: 'Code HS',                      placeholder: '0804.10' },
  { id: 'quantityKg',        label: 'Quantité (kg)',                 placeholder: '1000' },
  { id: 'consigneeName',     label: 'Nom consignataire',             placeholder: 'Importateur SAS' },
  { id: 'consigneeCountry',  label: 'Pays consignataire (ISO 2)',    placeholder: 'FR' },
];

export function GenerateExportDocForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [error, setError] = useState<string | null>(null);
  const [createdId, setCreatedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function set(field: keyof FormState) {
    return (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch('/api/generate-export-doc', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            certificationId: form.certificationId,
            destinationCountry: form.destinationCountry.toUpperCase().slice(0, 2),
            hsCode: form.hsCode,
            quantityKg: parseFloat(form.quantityKg),
            consigneeName: form.consigneeName,
            consigneeCountry: form.consigneeCountry.toUpperCase().slice(0, 2),
          }),
        });
        if (!res.ok) throw new Error(await res.text());
        const doc = (await res.json()) as { id: string };
        setCreatedId(doc.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erreur inattendue');
      }
    });
  }

  if (createdId) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6">
        <p className="font-semibold text-green-800">Document généré avec succès.</p>
        <a
          href={`../export-documents/${createdId}`}
          className="mt-2 inline-block text-sm text-green-700 hover:underline"
        >
          Voir le document →
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border bg-white p-6 shadow-sm">
      {error && (
        <p className="rounded bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {FIELDS.map(({ id, label, placeholder }) => (
          <div key={id}>
            <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
              {label}
            </label>
            <input
              id={id}
              type={id === 'quantityKg' ? 'number' : 'text'}
              value={form[id]}
              onChange={set(id)}
              required
              placeholder={placeholder}
              min={id === 'quantityKg' ? 0 : undefined}
              step={id === 'quantityKg' ? '0.01' : undefined}
              className="w-full rounded border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
            />
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 disabled:opacity-50"
      >
        {isPending ? 'Génération…' : 'Générer le document'}
      </button>
    </form>
  );
}
