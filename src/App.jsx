// ============================================================
// App.jsx — Main Orchestrator
// Manages: dark mode, profile gate, module routing, gamify
// Mobile: BottomNav handles module switching (< sm)
// ============================================================
import { useState, useEffect, useCallback, useRef } from 'react'
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
import { PrintButton } from './components/certificate/PrintButton'
import { CertificateView } from './components/certificate/CertificateView'
import { SUSForm } from './components/sus/SUSForm'
import { ResearcherPortal } from './components/researcher/ResearcherPortal'
import { PRESET_ZISWAF, PRESET_TAHFIZH, PRESET_QURBAN, PRESET_LITERASI } from './data/presetData'

// ── Dark mode init (before first paint) ──────────────────
function initDark() {
  const stored = localStorage.getItem('statslab_dark')
  return stored ? stored === 'true' : window.matchMedia('(prefers-color-scheme: dark)').matches
}

// ── Toast notification ────────────────────────────────────
function Toast({ notification, lang }) {
  if (!notification) return null
  const msgs = {
    2: { id: '🎉 Level 2 Terbuka! +10 Poin. Tips: Jelajahi modul lain di sidebar!', en: '🎉 Level 2 Unlocked! +10 Points. Tips: Explore other modules!' },
    3: { id: '🌟 Level 3 Terbuka! +20 Poin. Tips: Perhatikan angka Statistik di bawah!', en: '🌟 Level 3 Unlocked! +20 Points. Tips: Check the Stats cards below!' },
    4: { id: '📊 Level 4 Terbuka! +20 Poin. Tips: Cari anomali data (selisih Mean/Median)!', en: '📊 Level 4 Unlocked! +20 Points. Tips: Find data anomalies!' },
    5: { id: '🔍 Level 5 Terbuka! +50 Poin & Badge Detektif! Tips: Gunakan Skala Amanah!', en: '🔍 Level 5 Unlocked! +50 Points & Detective Badge! Tips: Use Amanah Scale!' },
    6: { id: '🏆 Level 6 Terbuka! +50 Poin & Badge Jujur Visual! Tips: Ambil Sertifikat Anda!', en: '🏆 Level 6 Unlocked! +50 Points & Visual Integrity Badge! Tips: Get your Certificate!' },
  }
  const item = msgs[notification.level]?.[lang] || ''
  
  return (
    <div
      className="fixed top-24 left-1/2 -translate-x-1/2 z-[60] animate-slide-down"
      role="status"
      aria-live="polite"
    >
      <div className="bg-white dark:bg-slate-900 border-2 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)] rounded-2xl px-6 py-4 flex items-center gap-4 min-w-[320px] max-w-lg">
        <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0 animate-pulse">
          <span className="text-2xl">✨</span>
        </div>
        <div className="flex-1">
          <p className="text-slate-900 dark:text-white font-black text-sm leading-tight uppercase tracking-tight">
            {item.split('. ')[0]}
          </p>
          <p className="text-emerald-600 dark:text-emerald-400 text-xs font-bold mt-1">
            {item.split('. ')[1]}
          </p>
        </div>
      </div>
    </div>
  )
}

// ── App ───────────────────────────────────────────────────
function AppInner() {
  const [isDark, setIsDark] = useState(initDark)
  const [activeModule, setActiveModule] = useState('ziswaf')
  const [showResearcher, setShowResearcher] = useState(false)
  const [isHelpOpen, setIsHelpOpen] = useState(false)
  const { profile, saveProfile, hasProfile } = useProfile()
  const gamify = useGamify()

  // Module data persistence
  const [moduleData, setModuleData] = useState(() => {
    const saved = localStorage.getItem('statslab_module_data')
    if (saved) return JSON.parse(saved)
    return {
      ziswaf: { items: PRESET_ZISWAF, isAmanah: true, tabayyunConfirmed: false, hasSeenBias: false },
      tahfizh: { items: PRESET_TAHFIZH, isAmanah: true, tabayyunConfirmed: false, hasSeenBias: false },
      qurban: { items: PRESET_QURBAN, isAmanah: true, tabayyunConfirmed: false, hasSeenBias: false },
      literasi: { items: PRESET_LITERASI, isAmanah: true, tabayyunConfirmed: false, hasSeenBias: false },
    }
  })

  // Sync module data to localStorage
  useEffect(() => {
    localStorage.setItem('statslab_module_data', JSON.stringify(moduleData))
  }, [moduleData])

  // Generic data/state updater
  const updateModuleState = useCallback((id, updates) => {
    setModuleData(prev => ({
      ...prev,
      [id]: { ...prev[id], ...updates }
    }))
  }, [])

  const handleDataChange = useCallback((id, updater) => {
    setModuleData(prev => {
      const currentItems = prev[id].items
      const newItems = typeof updater === 'function' ? updater(currentItems) : updater
      return {
        ...prev,
        [id]: { ...prev[id], items: newItems }
      }
    })
    if (gamify.canUnlock(2)) gamify.unlockLevel(2)
  }, [gamify])

  // Lvl3 unlock on module navigation (tracks first non-ziswaf visit)
  const handleModuleChange = useCallback((mod) => {
    setActiveModule(mod)
    if (mod !== 'ziswaf' && mod !== 'certificate' && mod !== 'sus') {
      if (gamify.canUnlock(3)) gamify.unlockLevel(3)
    }
  }, [gamify])

  // Dark mode sync to <html> class
  useEffect(() => {
    const html = document.documentElement
    if (isDark) html.classList.add('dark')
    else html.classList.remove('dark')
    localStorage.setItem('statslab_dark', String(isDark))
  }, [isDark])

  // Handlers for gamify unlock triggers
  const handleEdit = useCallback(() => { if (gamify.canUnlock(2)) gamify.unlockLevel(2) }, [gamify])
  const handleStatView = useCallback(() => { if (gamify.canUnlock(4)) gamify.unlockLevel(4) }, [gamify])
  
  const handleTabayyun = useCallback((id) => { 
    updateModuleState(id, { tabayyunConfirmed: true })
    if (gamify.canUnlock(5)) gamify.unlockLevel(5) 
  }, [gamify, updateModuleState])

  const handleAmanah = useCallback((id, isAmanah) => {
    const current = moduleData[id]
    const hasSeenBias = current.hasSeenBias || !isAmanah
    updateModuleState(id, { isAmanah, hasSeenBias })
    
    // Level 6 unlock: if they've toggled back and forth (seen bias and now back to amanah)
    if (hasSeenBias && isAmanah) {
      if (gamify.canUnlock(6)) gamify.unlockLevel(6)
    }
  }, [gamify, moduleData, updateModuleState])

  // Gate: Show onboarding if no profile
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

        {/* Gamification Toast — above BottomNav on mobile */}
        <Toast notification={gamify.notification} lang="id" />

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
      </div>
    </div>
  )
}

export default function App() {
  return (
    <LanguageProvider>
      <AppInner />
    </LanguageProvider>
  )
}
