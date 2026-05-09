import { useState, useRef, useEffect } from 'react'
import { 
  Moon, Sun, Globe, ClipboardList, HelpCircle, 
  BookOpen, GraduationCap, ChevronDown, LayoutGrid, 
  Settings, Award, ShieldCheck, Eye, EyeOff
} from 'lucide-react'
import { useLanguage } from '../../hooks/useLanguage'
import { useGamify } from '../../contexts/GamifyContext'
import { useModuleData } from '../../contexts/ModuleDataContext'
import { PremiumIcon } from '../ui/PremiumIcons'

import { ScenarioSwitcher } from '../common/ScenarioSwitcher'

export function Header({ 
  isDark, 
  onToggleDark, 
  onOpenSUS, 
  onOpenHelp, 
  onOpenKnowledgeBase, 
  onMagicEntry,
  onAmanahToggle,
  onScenarioChange
}) {
  const { t, lang, setLang } = useLanguage()
  const gamify = useGamify()
  const { activeModule, setActiveModule, activeState } = useModuleData()
  
  const [activeMenu, setActiveMenu] = useState(null)
  const menuRef = useRef(null)
  
  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Magic Entry Logic
  const clickCount = useRef(0)
  const lastClickTime = useRef(0)
  
  const handleLogoClick = () => {
    const now = Date.now()
    if (now - lastClickTime.current > 2000) {
      clickCount.current = 1
    } else {
      clickCount.current += 1
    }
    lastClickTime.current = now
    if (clickCount.current === 5) {
      clickCount.current = 0
      onMagicEntry?.()
    }
  }

  const toggleMenu = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu)
  }

  const isAmanah = activeState.isAmanah
  const isAmanahLocked = gamify.level < 5

  const MODULE_ITEMS = [
    { id: 'ziswaf',   icon: 'ziswaf',   navKey: 'nav.ziswaf' },
    { id: 'tahfizh',  icon: 'tahfizh',  navKey: 'nav.tahfizh' },
    { id: 'qurban',   icon: 'qurban',   navKey: 'nav.qurban' },
    { id: 'literasi', icon: 'literasi', navKey: 'nav.literasi' },
  ]

  return (
    <header className="glass sticky top-0 z-[100] px-4 sm:px-8 h-16 flex items-center justify-between no-print border-b border-slate-200 dark:border-slate-800/50 backdrop-blur-xl">
      
      {/* ── Brand ── */}
      <div 
        className="flex items-center gap-3 cursor-pointer select-none group"
        onClick={handleLogoClick}
      >
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/30 flex-shrink-0 group-hover:rotate-6 transition-transform">
          <span className="text-white text-sm font-black tracking-tighter italic">SL</span>
        </div>
        <div className="hidden lg:flex flex-col">
          <span className="font-black text-slate-800 dark:text-white text-base tracking-tighter leading-none italic uppercase">
            STATSLAB
          </span>
          <span className="text-slate-500 dark:text-slate-300 text-[9px] font-bold uppercase tracking-widest leading-none mt-0.5">
             Interactive Data Literacy
          </span>
        </div>
      </div>

      {/* ── Desktop Multi-Menu ── */}
      <nav className="hidden md:flex items-center gap-1" ref={menuRef}>
        
        {/* Menu Modul */}
        <div className="relative">
          <button 
            onClick={() => toggleMenu('modul')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tighter italic transition-all ${activeMenu === 'modul' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <LayoutGrid className="w-4 h-4" />
            {t('nav.modules')}
            <ChevronDown className={`w-3 h-3 transition-transform ${activeMenu === 'modul' ? 'rotate-180' : ''}`} />
          </button>
          
          {activeMenu === 'modul' && (
            <div className="absolute top-full left-0 mt-2 w-64 glass-panel-heavy rounded-2xl shadow-2xl border border-emerald-500/20 p-2 animate-pop-in">
              {MODULE_ITEMS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => {
                    setActiveModule(m.id);
                    setActiveMenu(null);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${activeModule === m.id ? 'bg-emerald-50 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300 font-bold' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                >
                  <PremiumIcon id={m.icon} size={18} />
                  <span className="text-[11px] uppercase tracking-tight">{t(m.navKey)}</span>
                  {activeModule === m.id && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Menu Kontrol */}
        <div className="relative">
          <button 
            onClick={() => toggleMenu('kontrol')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tighter italic transition-all ${activeMenu === 'kontrol' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <Settings className="w-4 h-4" />
            Menu Kontrol
            <ChevronDown className={`w-3 h-3 transition-transform ${activeMenu === 'kontrol' ? 'rotate-180' : ''}`} />
          </button>
          
          {activeMenu === 'kontrol' && (
            <div className="absolute top-full left-0 mt-2 w-72 glass-panel-heavy rounded-2xl shadow-2xl border border-blue-500/20 p-4 animate-pop-in space-y-4">
              {/* Skala Amanah Toggle */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className={`w-4 h-4 ${isAmanah ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-300'}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-100">Skala Amanah</span>
                  </div>
                  {isAmanahLocked && <span className="text-[8px] font-black px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-500 dark:text-slate-300">LVL 5 REQ</span>}
                </div>
                <button
                  disabled={isAmanahLocked}
                  onClick={() => onAmanahToggle(activeModule, !isAmanah)}
                  className={`w-full h-10 rounded-xl border-2 flex items-center px-3 gap-3 transition-all ${
                    isAmanahLocked 
                    ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 opacity-50 cursor-not-allowed'
                    : isAmanah
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                    : 'bg-amber-50 dark:bg-amber-900/20 border-amber-500/20 text-amber-700 dark:text-amber-400'
                  }`}
                >
                  {isAmanah ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  <span className="text-[10px] font-black uppercase tracking-tighter">
                    {isAmanahLocked ? 'Fitur Terkunci' : isAmanah ? 'Integritas Aktif' : 'Mode Bias Visual (RESIKO)'}
                  </span>
                </button>
              </div>

              {/* Skenario Toggle */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                <ScenarioSwitcher 
                  currentScenario={activeState.scenario} 
                  onChange={(s) => onScenarioChange(activeModule, s)} 
                />
              </div>

              {/* Dark Mode & Lang (Consolidated) */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2">
                <button onClick={onToggleDark} className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-all">
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span className="text-[9px] font-black uppercase">{isDark ? 'Light' : 'Dark'}</span>
                </button>
                <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                  {['id', 'en'].map((l) => (
                    <button key={l} onClick={() => setLang(l)} className={`flex-1 py-1 text-[9px] font-black rounded-lg transition-all ${lang === l ? 'bg-white dark:bg-slate-700 text-blue-600' : 'text-slate-500 dark:text-slate-300'}`}>
                      {l.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Menu Akademik */}
        <div className="relative">
          <button 
            onClick={() => toggleMenu('akademik')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-tighter italic transition-all ${activeMenu === 'akademik' ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <GraduationCap className="w-4 h-4" />
            Akademik
            <ChevronDown className={`w-3 h-3 transition-transform ${activeMenu === 'akademik' ? 'rotate-180' : ''}`} />
          </button>
          
          {activeMenu === 'akademik' && (
            <div className="absolute top-full right-0 mt-2 w-64 glass-panel-heavy rounded-2xl shadow-2xl border border-amber-500/20 p-2 animate-pop-in">
              <button onClick={() => { onOpenKnowledgeBase(); setActiveMenu(null); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-900/20 text-slate-600 dark:text-slate-300 transition-all">
                <BookOpen className="w-4 h-4 text-amber-500" />
                <span className="text-[11px] uppercase tracking-tight font-bold">Knowledge Base</span>
              </button>
              <button onClick={() => { setActiveModule('certificate'); setActiveMenu(null); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-900/20 text-slate-600 dark:text-slate-300 transition-all">
                <Award className="w-4 h-4 text-indigo-500" />
                <span className="text-[11px] uppercase tracking-tight font-bold">Sertifikat</span>
              </button>
              <button onClick={() => { onOpenSUS(); setActiveMenu(null); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 text-slate-600 dark:text-slate-300 transition-all">
                <ClipboardList className="w-4 h-4 text-rose-500" />
                <span className="text-[11px] uppercase tracking-tight font-bold">Evaluasi SUS</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* ── Mobile Control ── */}
      <div className="flex md:hidden items-center gap-2">
        <button 
          onClick={onOpenHelp}
          className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-500"
        >
          <HelpCircle className="w-5 h-5" />
        </button>
        <button 
          onClick={() => toggleMenu('mobile')}
          className="w-10 h-10 flex items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
        >
          <LayoutGrid className="w-5 h-5" />
        </button>
      </div>

      {/* ── Mobile Action Sheet (Pusat Kontrol) ── */}
      {activeMenu === 'mobile' && (
        <div className="fixed inset-0 z-[200] md:hidden">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setActiveMenu(null)} />
          <div className="absolute bottom-0 left-0 right-0 glass-panel-heavy rounded-t-[3rem] p-8 animate-slide-up shadow-2xl border-t border-white/20">
            <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto mb-8" />
            
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => { setActiveModule('ziswaf'); setActiveMenu(null); }} className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 flex flex-col items-center gap-2">
                <PremiumIcon id="ziswaf" size={24} />
                <span className="text-[10px] font-black uppercase">Ziswaf</span>
              </button>
              <button onClick={() => { setActiveModule('certificate'); setActiveMenu(null); }} className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 flex flex-col items-center gap-2">
                <Award size={24} className="text-indigo-500" />
                <span className="text-[10px] font-black uppercase">Sertifikat</span>
              </button>
              <button onClick={() => { onOpenKnowledgeBase(); setActiveMenu(null); }} className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 flex flex-col items-center gap-2">
                <BookOpen size={24} className="text-amber-500" />
                <span className="text-[10px] font-black uppercase">Library</span>
              </button>
              <button onClick={() => { onOpenSUS(); setActiveMenu(null); }} className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 flex flex-col items-center gap-2">
                <ClipboardList size={24} className="text-rose-500" />
                <span className="text-[10px] font-black uppercase">Evaluasi</span>
              </button>
            </div>

            {/* Mobile Controls */}
            <div className="mt-8 space-y-4">
               <button
                  disabled={isAmanahLocked}
                  onClick={() => { onAmanahToggle(activeModule, !isAmanah); setActiveMenu(null); }}
                  className={`w-full py-4 rounded-2xl border-2 flex items-center justify-center gap-3 transition-all ${isAmanah ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 text-slate-600'}`}
                >
                  {isAmanah ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  <span className="text-xs font-black uppercase tracking-widest">{isAmanah ? 'Skala Amanah: AKTIF' : 'Skala Amanah: MATI'}</span>
                </button>

                <ScenarioSwitcher 
                  currentScenario={activeState.scenario} 
                  onChange={(s) => { onScenarioChange(activeModule, s); setActiveMenu(null); }} 
                />

                <div className="flex gap-4">
                  <button onClick={onToggleDark} className="flex-1 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center gap-2">
                     {isDark ? <Sun size={18} /> : <Moon size={18} />}
                     <span className="text-xs font-black uppercase">{isDark ? 'Light' : 'Dark'}</span>
                  </button>
                  <button onClick={() => setLang(lang === 'id' ? 'en' : 'id')} className="flex-1 py-4 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center gap-2">
                     <Globe size={18} />
                     <span className="text-xs font-black uppercase">{lang.toUpperCase()}</span>
                  </button>
                </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
