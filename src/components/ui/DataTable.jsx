// ============================================================
// DataTable — Editable table, fires Lvl2 on first edit
// Supports: add row, delete row, inline number editing
// ============================================================
import { useState, useCallback } from 'react'
import { Trash2, PlusCircle } from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'

export function DataTable({ data, setData, columns, onEdit, moduleId }) {
  const { t } = useLanguage()
  const [editedOnce, setEditedOnce] = useState(false)

  const handleChange = useCallback((id, field, rawValue) => {
    const numeric = parseFloat(rawValue)
    const value = isNaN(numeric) ? rawValue : numeric
    setData((prev) => prev.map((row) => row.id === id ? { ...row, [field]: value } : row))
    if (!editedOnce) {
      setEditedOnce(true)
      if (onEdit) onEdit()
    }
  }, [editedOnce, onEdit, setData])

  const handleAddRow = useCallback(() => {
    const newId = Math.max(0, ...data.map((r) => r.id)) + 1
    const newRow = { id: newId }
    columns.forEach((col) => {
      if (col.field !== 'id') {
        newRow[col.field] = col.type === 'number' ? 0 : ''
      }
    })
    setData((prev) => [...prev, newRow])
  }, [data, columns, setData])

  const handleDelete = useCallback((id) => {
    setData((prev) => prev.length > 1 ? prev.filter((r) => r.id !== id) : prev)
  }, [setData])

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
      <table className="w-full text-sm data-table">
        <thead>
          <tr className="bg-emerald-50 dark:bg-emerald-900/30 border-b border-slate-200 dark:border-slate-700">
            {columns.map((col) => (
              <th
                key={col.field}
                className="px-3 py-3 text-center font-semibold text-emerald-800 dark:text-emerald-300 text-xs uppercase tracking-wide"
              >
                {t(`table.${col.labelKey || col.field}`)}
              </th>
            ))}
            <th className="px-3 py-3 text-center text-xs text-slate-400 uppercase tracking-wide w-14">
              ×
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {data.map((row, rowIdx) => (
            <tr
              key={row.id}
              className="hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10 transition-colors duration-150"
            >
              {columns.map((col) => (
                <td key={col.field} className="px-3 py-2 text-center text-slate-700 dark:text-slate-300">
                  {col.field === 'id' ? (
                    <span className="text-slate-400 text-xs">{rowIdx + 1}</span>
                  ) : col.editable === false ? (
                    <span>{row[col.field]}</span>
                  ) : (
                    <input
                      type={col.type === 'number' ? 'number' : 'text'}
                      value={row[col.field] ?? ''}
                      onChange={(e) => handleChange(row.id, col.field, e.target.value)}
                      className="w-full bg-transparent text-center focus:outline-none focus:ring-1 focus:ring-emerald-400 rounded px-1 py-0.5 min-w-0"
                      tabIndex={0}
                      aria-label={`${t(`table.${col.labelKey || col.field}`)} baris ${rowIdx + 1}`}
                      id={`${moduleId}-table-${row.id}-${col.field}`}
                    />
                  )}
                </td>
              ))}
              <td className="px-2 py-2 text-center">
                <button
                  onClick={() => handleDelete(row.id)}
                  className="p-1 text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-rose-400 rounded"
                  tabIndex={0}
                  aria-label={`${t('table.deleteRow')} baris ${rowIdx + 1}`}
                  title={t('table.deleteRow')}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-3 bg-slate-50 dark:bg-slate-900/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <button
          onClick={handleAddRow}
          className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-black transition-all px-3 py-1.5 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-900/30 focus:outline-none focus:ring-2 focus:ring-emerald-400 active:scale-95"
          tabIndex={0}
        >
          <PlusCircle className="w-4 h-4" />
          {t('table.addRow').toUpperCase()}
        </button>
        <span className="text-[10px] font-bold text-slate-400 italic">
          💡 Tips: Klik pada angka untuk mengubah data
        </span>
      </div>
    </div>
  )
}
