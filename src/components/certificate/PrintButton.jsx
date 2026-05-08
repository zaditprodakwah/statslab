// ============================================================
// PrintButton — Triggers window.print() for certificate
// Uses @media print CSS in index.css
// ============================================================
import { Printer } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'

export function PrintButton({ disabled }) {
  const { t } = useLanguage()

  return (
    <button
      onClick={() => window.print()}
      disabled={disabled}
      className={`btn-primary flex items-center gap-2 no-print ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      tabIndex={0}
      id="print-certificate-btn"
      aria-label={t('certificate.printBtn')}
    >
      <Printer className="w-4 h-4" />
      {t('certificate.printBtn')}
    </button>
  )
}
