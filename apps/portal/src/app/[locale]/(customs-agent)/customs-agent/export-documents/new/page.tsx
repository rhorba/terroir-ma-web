import { PageHeader } from '@/components/admin/page-header';
import { GenerateExportDocForm } from './generate-form';
import Link from 'next/link';

export default function GenerateExportDocPage() {
  return (
    <div>
      <div className="mb-4">
        <Link href="../export-documents" className="text-sm text-slate-700 hover:underline">
          ← Retour à la liste
        </Link>
      </div>
      <PageHeader
        title="Générer un document d'exportation"
        subtitle="Créer la documentation ONSSA pour une certification accordée"
      />
      <div className="mt-6">
        <GenerateExportDocForm />
      </div>
    </div>
  );
}
