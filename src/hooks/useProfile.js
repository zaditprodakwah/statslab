// ============================================================
// useProfile — Student Identity Manager
// Storage key: 'statslab_profile'
// Fields: nama, kelas, sekolah, guru
// ============================================================
import { useState, useCallback } from 'react'

const STORAGE_KEY = 'statslab_profile'

function loadProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function useProfile() {
  const [profile, setProfileState] = useState(loadProfile)

  const saveProfile = useCallback((data) => {
    const cleaned = {
      nama: data.nama?.trim() || '',
      kelas: data.kelas?.trim() || '',
      sekolah: data.sekolah?.trim() || '',
      guru: data.guru?.trim() || '',
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cleaned))
    setProfileState(cleaned)
  }, [])

  const hasProfile = Boolean(
    profile?.nama && profile?.kelas && profile?.sekolah && profile?.guru
  )

  return { profile, saveProfile, hasProfile }
}
