const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export type CertificationStatus =
  | 'DRAFT' | 'SUBMITTED' | 'DOCUMENT_REVIEW'
  | 'INSPECTION_SCHEDULED' | 'INSPECTION_IN_PROGRESS' | 'INSPECTION_COMPLETE'
  | 'LAB_TESTING' | 'LAB_RESULTS_RECEIVED' | 'UNDER_REVIEW'
  | 'GRANTED' | 'DENIED' | 'REVOKED' | 'RENEWED';

export type CertificationType = 'IGP' | 'AOP' | 'LA';

export interface VerifyCertification {
  id: string;
  certificationNumber: string | null;
  cooperativeName: string;
  productTypeCode: string;
  certificationType: CertificationType;
  regionCode: string;
  currentStatus: CertificationStatus;
  validFrom: string | null;
  validUntil: string | null;
}

export interface QrVerificationData {
  valid: boolean;
  certification: VerifyCertification | null;
  message: string;
  statusDisplay: string | undefined;
  lang: string;
  rtl: boolean;
}

export async function fetchVerification(
  uuid: string,
  lang: string,
): Promise<QrVerificationData | null> {
  try {
    const res = await fetch(
      `${API_BASE}/api/v1/verify/${encodeURIComponent(uuid)}?lang=${lang}`,
      { cache: 'no-store' },
    );
    if (!res.ok) return null;
    const body = await res.json() as { data?: QrVerificationData };
    return body.data ?? null;
  } catch {
    return null;
  }
}
