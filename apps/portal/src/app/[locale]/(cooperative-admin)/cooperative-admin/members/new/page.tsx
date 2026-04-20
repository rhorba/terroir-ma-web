'use client';
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { addMember } from '../actions';

const ROLES = ['member', 'president', 'secretary', 'treasurer'] as const;

export default function AddMemberPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      await addMember({
        fullName: fd.get('fullName') as string,
        fullNameAr: (fd.get('fullNameAr') as string) || undefined,
        cin: fd.get('cin') as string,
        phone: fd.get('phone') as string,
        email: (fd.get('email') as string) || undefined,
        role: fd.get('role') as string,
      });
      router.push('/fr/cooperative-admin/members');
    });
  }

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 text-2xl font-bold">Ajouter un membre</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          name="fullName"
          placeholder="Nom complet (fr)"
          required
          className="rounded border px-3 py-2"
        />
        <input
          name="fullNameAr"
          placeholder="الاسم الكامل (ar) — optionnel"
          className="rounded border px-3 py-2"
          dir="rtl"
        />
        <input
          name="cin"
          placeholder="CIN (ex: AB123456)"
          required
          className="rounded border px-3 py-2 font-mono"
        />
        <input
          name="phone"
          placeholder="+212 6XXXXXXXX"
          required
          className="rounded border px-3 py-2"
        />
        <input
          name="email"
          type="email"
          placeholder="Email (optionnel)"
          className="rounded border px-3 py-2"
        />
        <select name="role" className="rounded border px-3 py-2">
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={isPending}
          className="rounded bg-green-700 px-4 py-2 text-white hover:bg-green-800 disabled:opacity-50"
        >
          {isPending ? 'Enregistrement…' : 'Ajouter le membre'}
        </button>
      </form>
    </div>
  );
}
