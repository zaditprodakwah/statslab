// ============================================================
// App.jsx — Main Orchestrator
// Manages: dark mode, profile gate, module routing, gamify
// Mobile: BottomNav handles module switching (< sm)
// ============================================================
import { useState, useEffect, useCallback, useRef, Component } from 'react'
import { AlertTriangle } from 'lucide-react'
import { LanguageProvider } from './hooks/useLanguage'
import { useProfile } from './hooks/useProfile'
import { useGamify } from './hooks/useGamify'
import { Header } from './components/layout/Header'
import { Sidebar } from './components/layout/Sidebar'
import { MainLayout } from './components/layout/MainLayout'
import { BottomNav } from './components/layout/BottomNav'
import { WelcomeScreen } from './components/layout/WelcomeScreen'
import { ZiswafModule } from './components/modules/ZiswafModule'
import { TahfizhModule } from './components/modules/TahfizhModule'
import { QurbanModule } from './components/modules/QurbanModule'
import { LiterasiModule } from './components/modules/LiterasiModule'
import { HelpModal } from './components/common/HelpModal'
import { AcademicKnowledgeBase } from './components/common/AcademicKnowledgeBase'
import { PrintButton } from './components/certificate/PrintButton'
import { CertificateView } from './components/certificate/CertificateView'
import { SUSForm } from './components/sus/SUSForm'
import { ResearcherPortal } from './components/researcher/ResearcherPortal'
import { MissionBar } from './components/ui/MissionBar'
import { Toast } from './components/ui/Toast'
import { PRESET_ZISWAF, PRESET_TAHFIZH, PRESET_QURBAN, PRESET_LITERASI } from './data/presetData'

// ── Dark mode init (before first paint) ──────────────────
function initDark() {
  const stored = localStorage.getItem('statslab_dark')
  return stored ? stored === 'true' : window.matchMedia('(prefers-color-scheme: dark)').matches
}

// ── App ───────────────────────────────────────────────────
function AppInner() {
  const [isDark, setIsDark] = useState(initDark)
  const [activeModule, setActiveModule] = useState('ziswaf')
  const [showResearcher, setShowResearcher] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const [isKnowledgeBaseOpen, setIsKnowledgeBaseOpen] = useState(false)
  const { profile, saveProfile, hasProfile } = useProfile()
  const gamify = useGamify()

  // Module data persistence with robust error handling
  const [moduleData, setModuleData] = useState(() => {
    const defaultData = {
      ziswaf: { items: PRESET_ZISWAF, isAmanah: true, tabayyunConfirmed: false, hasSeenBias: false },
      tahfizh: { items: PRESET_TAHFIZH, isAmanah: true, tabayyunConfirmed: false, hasSeenBias: false },
      qurban: { items: PRESET_QURBAN, isAmanah: true, tabayyunConfirmed: false, hasSeenBias: false },
      literasi: { items: PRESET_LITERASI, isAmanah: true, tabayyunConfirmed: false, hasSeenBias: false },
    }
    try {
      const saved = localStorage.getItem('statslab_module_data')
      if (saved) {
        const parsed = JSON.parse(saved)
        // Robust validation to ensure all expected modules and their items exist
        const keys = ['ziswaf', 'tahfizh', 'qurban', 'literasi']
        const isValid = keys.every(k => 
          parsed[k] && 
          Array.isArray(parsed[k].items) && 
          parsed[k].items.length > 0
        )
        if (isValid) return parsed
      }
    } catch (e) {
      console.error('Failed to load module data from localStorage:', e)
    }
    return defaultData
  })

  // Sync module data to localStorage
  useEffect(() => {
    localStorage.setItem('statslab_module_data', JSON.stringify(moduleData))
  }, [moduleData])

  // Generic data/state updater with robust guard
  const updateModuleState = useCallback((id, updates) => {
    setModuleData(prev => {
      if (!prev[id]) return prev
      return {
        ...prev,
        [id]: { ...prev[id], ...updates }
      }
    })
  }, [])

  // ── Gamify Level Triggers ──────────────────────────────
  
  // Level 1 → 2: When any data is changed
  const handleDataChange = useCallback((id, updater) => {
    setModuleData(prev => {
      if (!prev[id]) return prev
      const currentItems = prev[id]?.items || []
      const newItems = typeof updater === 'function' ? updater(currentItems) : updater
      return {
        ...prev,
        [id]: { ...prev[id], items: newItems }
      }
    })
    if (gamify.canUnlock(2)) gamify.unlockLevel(2)
  }, [gamify])

  const handleEdit = useCallback(() => { 
    if (gamify.canUnlock(2)) gamify.unlockLevel(2) 
  }, [gamify])

  // Level 2 → 3: When switching to a non-default module
  const handleModuleChange = useCallback((mod) => {
    setActiveModule(mod)
    const isTabayyunModule = ['tahfizh', 'qurban', 'literasi'].includes(mod)
    if (isTabayyunModule && gamify.canUnlock(3)) {
      gamify.unlockLevel(3)
    }
  }, [gamify])

  // Level 3 → 4: When a statistical card is viewed
  const handleStatView = useCallback(() => { 
    if (gamify.canUnlock(4)) gamify.unlockLevel(4) 
  }, [gamify])

  // Level 4 → 5: When an anomaly is confirmed (Tabayyun)
  const handleTabayyun = useCallback((id) => { 
    updateModuleState(id, { tabayyunConfirmed: true })
    if (gamify.canUnlock(5)) gamify.unlockLevel(5) 
  }, [gamify, updateModuleState])

  // Level 5 → 6: When the Amanah switch is toggled (Integrity test)
  const handleAmanah = useCallback((id, isAmanah) => {
    setModuleData(prev => {
      const current = prev[id]
      if (!current) return prev
      const hasSeenBias = current.hasSeenBias || !isAmanah
      
      // Notify user about the state change
      if (!isAmanah && gamify.notify) {
        gamify.notify(
          'Eksperimen Bias Visual', 
          'Anda sedang melihat grafik yang terpotong (Truncated). Skala Y tidak dimulai dari nol.', 
          'warning',
          'Sekarang AKTIFKAN kembali saklar Skala Amanah di atas untuk mencapai Level 6 (Audit Integritas Sumbu-Y).'
        )
      } else if (isAmanah && !current.hasSeenBias && gamify.notify) {
         gamify.notify(
          'Skala Amanah Aktif', 
          'Grafik dimulai dari nol. Ini adalah standar pelaporan yang jujur.', 
          'info',
          'Coba MATIKAN saklar ini sebentar untuk melihat bagaimana data bisa dimanipulasi secara visual.'
        )
      }

      // Check for Level 6 unlock
      if (hasSeenBias && isAmanah && gamify.canUnlock(6)) {
        gamify.unlockLevel(6)
      }

      return {
        ...prev,
        [id]: { ...current, isAmanah, hasSeenBias }
      }
    })
  }, [gamify])

  // Dark mode sync to <html> class
  useEffect(() => {
    const html = document.documentElement
    if (isDark) html.classList.add('dark')
    else html.classList.remove('dark')
    localStorage.setItem('statslab_dark', String(isDark))
  }, [isDark])
  if (!hasProfile) {
    return (
      <div className={isDark ? 'dark' : ''}>
        <div className="min-h-screen" style={{ background: isDark
          ? 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #0c1a2e 100%)'
          : 'linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 50%, #e0f2fe 100%)'
        }}>
          {/* Minimal dark toggle on onboarding */}
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <button
              onClick={() => setIsDark((d) => !d)}
              className="p-2 rounded-lg bg-white/60 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 transition-all"
              aria-label="Toggle dark mode"
              id="onboard-dark-toggle"
            >
              {isDark ? '☀️' : '🌙'}
            </button>
          </div>
          <WelcomeScreen onSubmit={(data) => {
            if (data.freshStart) {
              gamify.resetProgress()
              localStorage.removeItem('statslab_progress')
              localStorage.removeItem('statslab_module_data')
              localStorage.removeItem('validator_draft_scores')
              localStorage.removeItem('validator_draft_notes')
              setModuleData({
                ziswaf: { items: PRESET_ZISWAF, isAmanah: true, tabayyunConfirmed: false, hasSeenBias: false },
                tahfizh: { items: PRESET_TAHFIZH, isAmanah: true, tabayyunConfirmed: false, hasSeenBias: false },
                qurban: { items: PRESET_QURBAN, isAmanah: true, tabayyunConfirmed: false, hasSeenBias: false },
                literasi: { items: PRESET_LITERASI, isAmanah: true, tabayyunConfirmed: false, hasSeenBias: false },
              })
            }
            saveProfile(data)
          }} />
        </div>
      </div>
    )
  }

  // Certificate content
  const certificateContent = (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
          🏅 Sertifikat Penghargaan
        </h2>
        <PrintButton disabled={!gamify.canPrintCertificate} />
      </div>
      {!gamify.canPrintCertificate && (
        <div className="px-4 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-700 dark:text-amber-300 text-sm">
          🔒 Selesaikan hingga Level 6 untuk mencetak sertifikat!
        </div>
      )}
      <CertificateView profile={profile} gamify={gamify} />
    </div>
  )

  // Main app
  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen">
        <Header
          isDark={isDark}
          onToggleDark={() => setIsDark((d) => !d)}
          onOpenSUS={() => setActiveModule('sus')}
          onOpenHelp={() => setIsHelpOpen(true)}
          onOpenKnowledgeBase={() => setIsKnowledgeBaseOpen(true)}
          onMagicEntry={() => setShowResearcher(true)}
        />

        <MainLayout
          profile={profile}
          gamify={gamify}
          activeModule={activeModule}
          sidebar={
            <Sidebar
              activeModule={activeModule}
              onModuleChange={handleModuleChange}
              profile={profile}
              gamify={gamify}
            />
          }
        >
          <div key={activeModule} className="animate-module-entry">
            <ModuleErrorBoundary key={activeModule}>
              {activeModule === 'ziswaf' && (
                <ZiswafModule
                  data={moduleData.ziswaf.items}
                  isAmanah={moduleData.ziswaf.isAmanah}
                  tabayyunConfirmed={moduleData.ziswaf.tabayyunConfirmed}
                  setData={(items) => handleDataChange('ziswaf', items)}
                  setAmanah={(val) => handleAmanah('ziswaf', val)}
                  setTabayyunConfirmed={() => handleTabayyun('ziswaf')}
                  onEdit={handleEdit}
                  onStatView={handleStatView}
                  gamify={gamify}
                />
              )}
              {activeModule === 'tahfizh' && (
                <TahfizhModule
                  data={moduleData.tahfizh.items}
                  isAmanah={moduleData.tahfizh.isAmanah}
                  tabayyunConfirmed={moduleData.tahfizh.tabayyunConfirmed}
                  setData={(items) => handleDataChange('tahfizh', items)}
                  setAmanah={(val) => handleAmanah('tahfizh', val)}
                  setTabayyunConfirmed={() => handleTabayyun('tahfizh')}
                  onEdit={handleEdit}
                  onStatView={handleStatView}
                  gamify={gamify}
                />
              )}
              {activeModule === 'qurban' && (
                <QurbanModule
                  data={moduleData.qurban.items}
                  isAmanah={moduleData.qurban.isAmanah}
                  tabayyunConfirmed={moduleData.qurban.tabayyunConfirmed}
                  setData={(items) => handleDataChange('qurban', items)}
                  setAmanah={(val) => handleAmanah('qurban', val)}
                  setTabayyunConfirmed={() => handleTabayyun('qurban')}
                  onEdit={handleEdit}
                  onStatView={handleStatView}
                  gamify={gamify}
                />
              )}
              {activeModule === 'literasi' && (
                <LiterasiModule
                  data={moduleData.literasi.items}
                  isAmanah={moduleData.literasi.isAmanah}
                  tabayyunConfirmed={moduleData.literasi.tabayyunConfirmed}
                  setData={(items) => handleDataChange('literasi', items)}
                  setAmanah={(val) => handleAmanah('literasi', val)}
                  setTabayyunConfirmed={() => handleTabayyun('literasi')}
                  onEdit={handleEdit}
                  onStatView={handleStatView}
                  gamify={gamify}
                />
              )}
            </ModuleErrorBoundary>
            {activeModule === 'certificate' && certificateContent}
            {activeModule === 'sus' && (
              <SUSForm
                profile={profile}
                onBack={() => setActiveModule('ziswaf')}
              />
            )}
          </div>
        </MainLayout>

        {/* Mobile bottom navigation — hidden sm+ */}
        <BottomNav
          activeModule={activeModule}
          onModuleChange={handleModuleChange}
        />

        {/* Gamification Mission Guide */}
        <MissionBar gamify={gamify} />

        {/* Gamification Toast — above BottomNav on mobile */}
        <Toast notification={gamify.notification} lang="id" onDismiss={gamify.dismiss} />

        {/* Researcher Portal Overlay */}
        {showResearcher && (
          <ResearcherPortal 
            profile={profile}
            gamify={gamify}
            onExit={() => setShowResearcher(false)} 
          />
        )}

        {/* Documentation Hub */}
        <HelpModal 
          isOpen={isHelpOpen} 
          onClose={() => setIsHelpOpen(false)} 
        />

        {/* Academic Knowledge Base */}
        <AcademicKnowledgeBase
          isOpen={isKnowledgeBaseOpen}
          onClose={() => setIsKnowledgeBaseOpen(false)}
        />
      </div>
    </div>
  )
}

// ── Error Boundaries ─────────────────────────────────────────
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true }
  }
  componentDidCatch(error, errorInfo) {
    console.error('STATSLAB GLOBAL CRASH:', error, errorInfo)
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-6">
            <div className="w-20 h-20 bg-rose-500/20 rounded-3xl flex items-center justify-center mx-auto animate-pulse">
              <AlertTriangle className="w-10 h-10 text-rose-500" />
            </div>
            <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">
              Ops! Terjadi Kesalahan
            </h1>
            <p className="text-slate-400 font-medium">
              Sistem mendeteksi adanya kegagalan runtime. Jangan panik, data kamu mungkin masih aman, namun kita perlu menyegarkan aplikasi.
            </p>
            <button
              onClick={() => {
                localStorage.clear()
                window.location.reload()
              }}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl shadow-xl shadow-emerald-900/40 transition-all active:scale-95"
            >
              RESET & MULAI ULANG (RESCUE)
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

class ModuleErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center glass-card border-2 border-rose-500/20 bg-rose-50/50 dark:bg-rose-900/10">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4 animate-bounce" />
          <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tighter italic">
            Ups! Modul ini macet
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-6">
            Terjadi kegagalan saat merender data. Tenang saja, kamu bisa mereset data modul ini untuk melanjutkan.
          </p>
          <button
            onClick={() => {
              localStorage.removeItem('statslab_module_data')
              window.location.reload()
            }}
            className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl transition-all shadow-lg active:scale-95"
          >
            RESET DATA & REFRESH
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <LanguageProvider>
        <AppInner />
      </LanguageProvider>
    </ErrorBoundary>
  )
}
