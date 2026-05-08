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
import { CertificateView } from './components/certificate/CertificateView'
import { PrintButton } from './components/certificate/PrintButton'
import { SUSForm } from './components/sus/SUSForm'
import { ResearcherPortal } from './components/researcher/ResearcherPortal'
import { HelpModal } from './components/common/HelpModal'

// ── Dark mode init (before first paint) ──────────────────
function initDark() {
  const stored = localStorage.getItem('statslab_dark')
  return stored ? stored === 'true' : window.matchMedia('(prefers-color-scheme: dark)').matches
}

// ── Toast notification ────────────────────────────────────
function Toast({ notification, lang }) {
  if (!notification) return null
  const msgs = {
    2: { id: '🎉 Level 2 terbuka! +10 Poin', en: '🎉 Level 2 Unlocked! +10 Points' },
    3: { id: '🌟 Level 3 terbuka! +20 Poin', en: '🌟 Level 3 Unlocked! +20 Points' },
    4: { id: '📊 Level 4 terbuka! +20 Poin', en: '📊 Level 4 Unlocked! +20 Points' },
    5: { id: '🔍 Level 5 terbuka! +50 Poin & Badge Detektif!', en: '🔍 Level 5 Unlocked! +50 Points & Detective Badge!' },
    6: { id: '🏆 Level 6 terbuka! +50 Poin & Badge Jujur Visual!', en: '🏆 Level 6 Unlocked! +50 Points & Visual Integrity Badge!' },
  }
  const msg = msgs[notification.level]?.[lang] || ''
  return (
    <div
      // Mobile: above bottom nav (bottom-20); Desktop: bottom-6
      className="fixed bottom-20 sm:bottom-6 left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-6 z-50 glass-card px-5 py-3 text-sm font-semibold text-emerald-700 dark:text-emerald-300 animate-bounce-soft shadow-xl max-w-xs text-center sm:text-left"
      role="status"
      aria-live="polite"
    >
      {msg}
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
  const handleTabayyun = useCallback(() => { if (gamify.canUnlock(5)) gamify.unlockLevel(5) }, [gamify])
  const handleAmanah = useCallback(() => { if (gamify.canUnlock(6)) gamify.unlockLevel(6) }, [gamify])

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
              localStorage.removeItem('validator_draft_scores')
              localStorage.removeItem('validator_draft_notes')
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
                onEdit={handleEdit}
                onStatView={handleStatView}
                onTabayyun={handleTabayyun}
                onAmanah={handleAmanah}
              />
            )}
            {activeModule === 'tahfizh' && (
              <TahfizhModule
                onEdit={handleEdit}
                onStatView={handleStatView}
                onAmanah={handleAmanah}
              />
            )}
            {activeModule === 'qurban' && (
              <QurbanModule
                onEdit={handleEdit}
                onStatView={handleStatView}
                onAmanah={handleAmanah}
              />
            )}
            {activeModule === 'literasi' && (
              <LiterasiModule
                onEdit={handleEdit}
                onStatView={handleStatView}
                onAmanah={handleAmanah}
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
