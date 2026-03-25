'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useAVSStore, TOOLS, TOOL_DETAILS, PARAMS, CAMERA_BODIES, LENSES, LESSONS, formatPrompt, kelvinToColor, kelvinToDesc, type PromptState } from '@/store/avs-store'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Home as HomeIcon, Layers, BarChart3, GraduationCap, Zap, Sun, ChevronRight, Check, Menu, Camera, User, Film, Video, Sparkles, Mountain, Palette, Lightbulb, Lock } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Observer } from 'gsap/Observer'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, Observer)
}

// Toast component
function Toast() {
  const { toastMessage, toastShow, hideToast } = useAVSStore()

  useEffect(() => {
    if (toastShow) {
      const timer = setTimeout(() => hideToast(), 2000)
      return () => clearTimeout(timer)
    }
  }, [toastShow, hideToast])

  return (
    <div 
      className={`fixed bottom-[82px] left-1/2 -translate-x-1/2 z-[1000] transition-all duration-300 ${
        toastShow ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="bg-[#FFE500] text-[#0A0A0A] px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-wider whitespace-nowrap max-w-[90vw]">
        {toastMessage}
      </div>
    </div>
  )
}

// Helper function to show toast
function showToast(message: string) {
  useAVSStore.getState().showToast(message)
}

// Chip component
function Chip({ 
  label, 
  selected, 
  onClick, 
  variant = 'default' 
}: { 
  label: string
  selected?: boolean
  onClick?: () => void
  variant?: 'default' | 'red' 
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-[11px] font-mono uppercase tracking-wider transition-all active:scale-95 ${
        selected 
          ? variant === 'red'
            ? 'border-2 border-[#FF2222] text-[#FF2222] bg-[#FF2222]/10 font-bold'
            : 'border-2 border-[#FFE500] text-[#FFE500] bg-[#FFE500]/10 font-bold'
          : 'border border-[#333] text-[#5A5A5A] hover:border-[#444]'
      }`}
    >
      {label}
    </button>
  )
}

// Tool Chip
function ToolChip({ 
  tool, 
  selected, 
  onClick 
}: { 
  tool: typeof TOOLS[0]
  selected: boolean
  onClick: () => void 
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 px-3 py-2 text-[10px] font-mono uppercase tracking-wider transition-all active:scale-95 ${
        selected 
          ? 'bg-[#FFE500] text-[#0A0A0A] border border-[#FFE500] font-bold'
          : 'bg-[#1A1A1A] border border-[#2A2A2A] text-[#5A5A5A] hover:border-[#3A3A3A]'
      }`}
    >
      {tool.name}
      <span className={`ml-1 text-[7px] px-1 py-0.5 font-bold ${tool.free ? 'bg-[#00FF88] text-black' : 'bg-[#FF2222] text-white'}`}>
        {tool.free ? 'FREE' : 'PAID'}
      </span>
    </button>
  )
}

// Strength meter
function StrengthMeter({ state }: { state: PromptState }) {
  let score = 0
  if (state.subject) score++
  if (state.style) score++
  if (state.lighting) score++
  if (state.camera) score++
  if (state.mood && state.colorGrade) score++

  const labels = ['', 'STARTED', 'GETTING THERE', 'GOOD', 'STRONG', '🔥 EXCELLENT']

  return (
    <div className="flex items-center gap-1.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <div 
          key={i} 
          className={`w-7 h-1.5 transition-all duration-300 ${
            i <= score 
              ? score === 5 ? 'bg-[#00FF88]' : 'bg-[#FFE500]'
              : 'bg-[#2A2A2A]'
          }`} 
        />
      ))}
      <span className="ml-2 font-mono text-[9px] text-[#5A5A5A] uppercase tracking-wider">
        {labels[score] || '—'}
      </span>
    </div>
  )
}

// Header
function Header() {
  const { toggleInverted, setSaveModalOpen } = useAVSStore()
  const headerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!headerRef.current) return
    
    gsap.from(headerRef.current, {
      y: -60,
      opacity: 0,
      duration: 0.6,
      ease: 'power3.out',
    })
  }, [])

  return (
    <header ref={headerRef} className="h-[52px] flex items-center justify-between px-4 bg-[#FFE500] flex-shrink-0 relative z-10">
      <div className="font-['Barlow_Condensed'] text-[32px] font-black tracking-wider text-[#0A0A0A] flex items-center gap-2.5">
        AVS
        <span className="bg-[#0A0A0A] text-[#FFE500] text-[9px] font-mono font-bold px-1.5 py-0.5 tracking-wider">
          2026
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <button 
          onClick={toggleInverted}
          className="w-[34px] h-[34px] bg-[#0A0A0A] flex items-center justify-center text-[#FFE500] transition-transform active:scale-90"
        >
          <Sun className="w-4 h-4" />
        </button>
        <button 
          onClick={() => setSaveModalOpen(true)}
          className="w-[34px] h-[34px] bg-[#0A0A0A] flex items-center justify-center text-[#FFE500] transition-transform active:scale-90"
        >
          <Menu className="w-4 h-4" />
        </button>
      </div>
    </header>
  )
}

// Tab Bar with animation
function TabBar() {
  const { activeTab, setActiveTab } = useAVSStore()
  const tabBarRef = useRef<HTMLElement>(null)
  const prevTab = useRef(activeTab)

  useEffect(() => {
    if (!tabBarRef.current) return
    
    gsap.from(tabBarRef.current, {
      y: 70,
      opacity: 0,
      duration: 0.5,
      delay: 0.3,
      ease: 'power3.out',
    })
  }, [])

  // Animate tab change
  useEffect(() => {
    if (prevTab.current !== activeTab) {
      const tabs = ['home', 'build', 'compare', 'learn', 'generate']
      const prevIndex = tabs.indexOf(prevTab.current)
      const newIndex = tabs.indexOf(activeTab)
      const direction = newIndex > prevIndex ? 1 : -1

      const indicator = tabBarRef.current?.querySelector('.tab-indicator')
      if (indicator) {
        gsap.to(indicator, {
          x: newIndex * 100 + '%',
          duration: 0.3,
          ease: 'power2.out',
        })
      }
      
      prevTab.current = activeTab
    }
  }, [activeTab])

  const tabs = [
    { id: 'home', label: 'Home', icon: HomeIcon },
    { id: 'build', label: 'Build', icon: Layers },
    { id: 'compare', label: 'Compare', icon: BarChart3 },
    { id: 'learn', label: 'Learn', icon: GraduationCap },
    { id: 'generate', label: 'Generate', icon: Zap },
  ] as const

  return (
    <nav ref={tabBarRef} className="h-[68px] flex items-stretch bg-[#0A0A0A] border-t-2 border-[#FFE500] flex-shrink-0 relative z-50 overflow-hidden">
      <div className="tab-indicator absolute top-0 left-0 w-[20%] h-full bg-[#FFE500] pointer-events-none" style={{ transform: 'translateX(0)' }} />
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex-1 flex flex-col items-center justify-center gap-1 transition-colors relative z-10 ${
            activeTab === tab.id 
              ? 'text-[#0A0A0A]' 
              : 'text-[#5A5A5A] hover:text-[#7A7A7A]'
          }`}
        >
          <tab.icon className="w-[18px] h-[18px]" />
          <span className="text-[8px] font-mono font-bold uppercase tracking-wider">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}

// Animated section wrapper
function AnimatedSection({ 
  children, 
  isActive,
  id,
}: { 
  children: React.ReactNode
  isActive: boolean
  id: string
}) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const prevActive = useRef(isActive)

  useEffect(() => {
    if (!sectionRef.current) return

    if (isActive && !prevActive.current) {
      // Animate in
      gsap.fromTo(sectionRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      )
    } else if (!isActive && prevActive.current) {
      // Animate out
      gsap.to(sectionRef.current, {
        opacity: 0,
        y: -10,
        duration: 0.2,
        ease: 'power2.in',
      })
    }
    
    prevActive.current = isActive
  }, [isActive])

  return (
    <div 
      ref={sectionRef}
      className={`absolute inset-0 transition-opacity ${isActive ? 'pointer-events-auto' : 'pointer-events-none opacity-0'}`}
      style={{ touchAction: isActive ? 'pan-y' : 'none' }}
    >
      {children}
    </div>
  )
}

// Home Screen
function HomeScreen() {
  const { promptState, setActiveTab, savedPrompts, loadPrompt } = useAVSStore()
  const prompt = formatPrompt(promptState)
  const heroRef = useRef<HTMLDivElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)
  const savedRef = useRef<HTMLDivElement>(null)

  // Animate hero on mount
  useEffect(() => {
    if (!heroRef.current || typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } })
      
      tl.from('.hero-tag', { opacity: 0, y: -20, duration: 0.5 })
        .from('.hero-title', { opacity: 0, y: 30, duration: 0.6, ease: 'power3.out' }, '-=0.3')
        .from('.hero-sub', { opacity: 0, y: 20, duration: 0.5 }, '-=0.3')
        .from('.marquee', { opacity: 0, duration: 0.4 }, '-=0.2')
    }, heroRef)

    return () => ctx.revert()
  }, [])

  // Animate grid cards
  useEffect(() => {
    if (!gridRef.current || typeof window === 'undefined') return

    const ctx = gsap.context(() => {
      gsap.from('.qs-card', {
        opacity: 0,
        y: 30,
        duration: 0.4,
        stagger: 0.08,
        ease: 'power2.out',
      })
    }, gridRef)

    return () => ctx.revert()
  }, [])

  // Animate saved prompts
  useEffect(() => {
    if (!savedRef.current || typeof window === 'undefined') return

    const pills = savedRef.current.querySelectorAll('.saved-pill')
    if (pills.length === 0) return

    const ctx = gsap.context(() => {
      gsap.from(pills, {
        opacity: 0,
        x: -15,
        duration: 0.3,
        stagger: 0.05,
        ease: 'power2.out',
      })
    }, savedRef)

    return () => ctx.revert()
  }, [savedPrompts.length])

  const quickStart = (type: string) => {
    const presets: Record<string, Partial<PromptState>> = {
      photo: { subject: 'landscape', style: 'photorealistic', lighting: 'golden hour', camera: '85mm f/1.8', colorGrade: 'warm', mood: 'calm', targetTool: 'flux_dev' },
      portrait: { subject: 'person', style: 'cinematic', lighting: 'rembrandt', camera: '85mm f/1.8', colorGrade: 'ACES filmic', mood: 'mysterious', cameraBody: 'ARRI ALEXA 65', lens: 'Zeiss Master Prime', targetTool: 'flux_dev' },
      cinematic: { subject: 'landscape', style: 'cinematic', lighting: 'golden hour', camera: '35mm f/1.8', colorGrade: 'ACES filmic', mood: 'epic', cameraBody: 'ARRI ALEXA 65', lens: 'Zeiss Master Prime', targetTool: 'midjourney' },
      video: { subject: 'person', style: 'cinematic', lighting: 'neon', camera: '35mm f/1.8', colorGrade: 'cool', mood: 'mysterious', targetTool: 'wan_video' },
    }
    const store = useAVSStore.getState()
    store.setPromptState(presets[type] || {})
    setActiveTab('build')
  }

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
      {/* Hero */}
      <div ref={heroRef} className="bg-[#FFE500] px-4 pt-5.5 pb-4 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-repeat-x" style={{
          backgroundImage: 'repeating-linear-gradient(90deg, #0A0A0A 0px, #0A0A0A 12px, #FFE500 12px, #FFE500 24px)'
        }} />
        <div className="hero-tag font-mono text-[9px] tracking-widest uppercase text-[#0A0A0A]/60 mb-1 flex items-center gap-2">
          <span>▶</span> AI Visual Synthesis — 12 Tools
        </div>
        <h1 className="hero-title font-['Barlow_Condensed'] text-[64px] font-black leading-[0.88] tracking-tight text-[#0A0A0A] mb-2.5">
          BUILD<br/><em className="italic">PROMPTS.</em>
        </h1>
        <p className="hero-sub text-[12px] text-[#0A0A0A]/70 leading-relaxed font-mono max-w-[260px]">
          No blank inputs. Every tap produces output. Copy. Paste. Create.
        </p>
      </div>

      {/* Marquee */}
      <div className="marquee overflow-hidden bg-[#FFE500] py-1.5 whitespace-nowrap">
        <div className="inline-block animate-marquee font-['Barlow_Condensed'] text-[13px] font-black tracking-wider uppercase text-[#0A0A0A]">
          {TOOLS.map(t => t.name).join(' ✦ ')} ✦ {TOOLS.map(t => t.name).join(' ✦ ')} ✦
        </div>
      </div>

      {/* Quick Start Grid */}
      <div ref={gridRef} className="mt-4 grid grid-cols-2 gap-0">
        {[
          { num: '01', title: 'Photo Realism', desc: 'FLUX · Natural language', type: 'photo', featured: true, icon: Mountain, accent: '#FFE500' },
          { num: '02', title: 'Portrait', desc: 'ARRI + Rembrandt lighting', type: 'portrait', featured: false, icon: User, accent: '#00FF88' },
          { num: '03', title: 'Cinematic', desc: 'Midjourney flags & style', type: 'cinematic', featured: false, icon: Film, accent: '#FF2222' },
          { num: '04', title: 'Video', desc: 'Wan Video motion prompts', type: 'video', featured: false, icon: Video, accent: '#00BFFF' },
        ].map((item, index) => {
          // Featured card spans both columns, others are positioned in grid
          // After featured card: index 1 = left col, index 2 = right col, index 3 = left col (new row)
          const isLeftColumn = index === 1 || index === 3
          
          return (
            <button
              key={item.num}
              onClick={() => quickStart(item.type)}
              className={`qs-card text-left transition-all hover:scale-[1.02] active:scale-[0.98] relative overflow-hidden group cursor-pointer ${
                item.featured 
                  ? 'col-span-2 bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] border-b-2 border-[#FFE500] p-5 md:p-6' 
                  : `bg-gradient-to-br from-[#1A1A1A] to-[#111111] border-b border-[#2A2A2A] p-5 md:p-6 ${isLeftColumn ? 'border-r border-[#2A2A2A]' : ''}`
              }`}
            >
            {/* Background accent */}
            <div 
              className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 opacity-10 group-hover:opacity-20 transition-opacity"
              style={{ background: `radial-gradient(circle at top right, ${item.accent}, transparent 70%)` }}
            />
            
            {/* Hover overlay */}
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: `linear-gradient(135deg, ${item.accent}05, transparent 50%)` }}
            />
            
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-3">
                <div className="font-['Barlow_Condensed'] text-[32px] md:text-[48px] font-black leading-none" style={{ color: item.accent }}>{item.num}</div>
                <item.icon className="w-5 h-5 md:w-6 md:h-6 opacity-40 group-hover:opacity-80 transition-opacity" style={{ color: item.accent }} />
              </div>
              
              <div className="font-['Barlow_Condensed'] text-[18px] md:text-[22px] font-bold tracking-wide uppercase text-[#F5F5F5] mb-1 group-hover:text-white transition-colors">
                {item.title}
              </div>
              
              <div className="font-mono text-[10px] md:text-[11px] text-[#8A8A8A] uppercase tracking-wider group-hover:text-[#ABABAB] transition-colors">
                {item.desc}
              </div>
              
              <div className="mt-4 flex items-center gap-2 text-[11px] md:text-[12px] font-mono font-medium uppercase tracking-wider" style={{ color: item.accent }}>
                <span className="w-2 h-2 rounded-full" style={{ background: item.accent }} />
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">Start Building</span>
                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 -ml-1" />
              </div>
            </div>
            
            {item.featured && (
              <div className="absolute bottom-4 right-4 md:bottom-5 md:right-5 flex items-center gap-2 bg-[#FFE500] px-3 py-1.5">
                <Sparkles className="w-4 h-4 text-[#0A0A0A]" />
                <span className="text-[10px] font-mono font-bold uppercase text-[#0A0A0A]">RECOMMENDED</span>
              </div>
            )}
          </button>
          )
        })}
      </div>

      {/* Saved Prompts */}
      <div ref={savedRef} className="mt-5">
        <div className="px-4 mb-2.5 flex items-center gap-2.5">
          <span className="font-mono text-[9px] tracking-widest uppercase text-[#5A5A5A]">Saved Prompts</span>
          <div className="flex-1 h-px bg-[#2A2A2A]" />
        </div>
        <div className="flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
          {savedPrompts.length === 0 ? (
            <div className="text-center py-7 w-full">
              <div className="text-[28px] mb-2.5 text-[#5A5A5A]">◈</div>
              <div className="font-mono text-[10px] leading-relaxed uppercase tracking-wider text-[#5A5A5A]">
                No saves yet.<br/>Build + save something.
              </div>
            </div>
          ) : (
            savedPrompts.map((p) => (
              <button
                key={p.id}
                onClick={() => { loadPrompt(p.id); setActiveTab('build'); }}
                className="saved-pill flex-shrink-0 max-w-[180px] bg-[#111111] border border-[#2A2A2A] p-2.5 text-left transition-all active:border-[#FFE500]"
              >
                <div className="text-[12px] font-semibold truncate mb-0.5">{p.name}</div>
                <div className="font-mono text-[9px] text-[#5A5A5A] uppercase tracking-wider">{p.toolName}</div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Last Output */}
      <div className="mt-5 px-4 pb-8">
        <div className="flex items-center gap-2.5 mb-2.5">
          <span className="font-mono text-[9px] tracking-widest uppercase text-[#5A5A5A]">Last Output</span>
          <div className="flex-1 h-px bg-[#2A2A2A]" />
        </div>
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] p-3.5 font-mono text-[10px] leading-relaxed text-[#5A5A5A] min-h-[72px] break-words">
          {prompt}
        </div>
      </div>
    </div>
  )
}

// Build Screen
function BuildScreen() {
  const { promptState, setPromptState } = useAVSStore()
  const prompt = formatPrompt(promptState)
  const outputRef = useRef<HTMLDivElement>(null)
  const chipsRef = useRef<HTMLDivElement>(null)

  // Animate chips on mount
  useEffect(() => {
    if (!chipsRef.current) return

    const ctx = gsap.context(() => {
      gsap.from('.param-row', {
        opacity: 0,
        x: -20,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power2.out',
      })
    }, chipsRef)

    return () => ctx.revert()
  }, [])

  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt)
    showToast('✓ COPIED')
  }

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
      {/* Sticky Output */}
      <div ref={outputRef} className="sticky top-0 z-10 bg-[#0A0A0A] px-4 py-3.5 border-b-2 border-[#FFE500]">
        <div className="flex justify-between items-center mb-2">
          <StrengthMeter state={promptState} />
          <span className="font-mono text-[9px] text-[#5A5A5A] uppercase tracking-wider">{prompt.length} chars</span>
        </div>
        <div className="bg-[#1A1A1A] border-2 border-[#FFE500] p-3.5 font-mono text-[11px] leading-relaxed text-[#F5F5F5] min-h-[72px] break-words">
          {prompt}
        </div>
        <div className="flex gap-1.5 mt-2.5">
          <Button onClick={copyPrompt} className="flex-1 bg-[#FFE500] text-[#0A0A0A] font-['Barlow_Condensed'] text-[18px] font-black tracking-wider uppercase h-auto py-3 hover:bg-[#E6CE00]">COPY</Button>
          <Button variant="outline" onClick={() => useAVSStore.getState().setSaveModalOpen(true)} className="flex-1 border border-[#333] bg-transparent text-[#F5F5F5] font-['Barlow_Condensed'] text-[13px] font-black tracking-wider uppercase h-auto py-3 hover:border-[#FFE500] hover:text-[#FFE500]">SAVE</Button>
          <Button variant="outline" className="flex-1 border border-[#333] bg-transparent text-[#F5F5F5] font-['Barlow_Condensed'] text-[13px] font-black tracking-wider uppercase h-auto py-3 hover:border-[#FFE500] hover:text-[#FFE500]">SHARE</Button>
        </div>
      </div>

      {/* Tool Selector */}
      <div className="px-4 pt-4 pb-2.5">
        <div className="flex items-center gap-2.5 mb-2.5">
          <span className="font-mono text-[9px] tracking-widest uppercase text-[#5A5A5A]">Target Tool</span>
          <div className="flex-1 h-px bg-[#2A2A2A]" />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
          {TOOLS.map((tool) => (
            <ToolChip
              key={tool.id}
              tool={tool}
              selected={promptState.targetTool === tool.id}
              onClick={() => setPromptState({ targetTool: tool.id })}
            />
          ))}
        </div>
      </div>

      {/* Parameters Card */}
      <div ref={chipsRef} className="mx-4 bg-[#111111] border border-[#2A2A2A]">
        {/* Subject */}
        <div className="param-row p-3.5 border-b border-[#1F1F1F]">
          <div className="flex justify-between items-center mb-2.5">
            <span className="font-mono text-[9px] tracking-widest uppercase text-[#5A5A5A]">Subject</span>
            <span className="font-mono text-[9px] text-[#FFE500] font-bold uppercase">{promptState.subject}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PARAMS.subject.opts.map((opt) => (
              <Chip
                key={opt}
                label={opt}
                selected={promptState.subject === opt}
                onClick={() => setPromptState({ subject: opt })}
              />
            ))}
          </div>
          <Textarea
            value={promptState.subjectDetail}
            onChange={(e) => setPromptState({ subjectDetail: e.target.value })}
            placeholder="Add detail (optional)"
            className="mt-2 bg-[#0A0A0A] border border-[#333] text-[11px] font-mono text-[#F5F5F5] placeholder:text-[#5A5A5A] resize-none focus:border-[#FFE500]"
            rows={1}
          />
        </div>

        {/* Style */}
        <div className="param-row p-3.5 border-b border-[#1F1F1F]">
          <div className="flex justify-between items-center mb-2.5">
            <span className="font-mono text-[9px] tracking-widest uppercase text-[#5A5A5A]">Style</span>
            <span className="font-mono text-[9px] text-[#FFE500] font-bold uppercase">{promptState.style}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PARAMS.style.opts.map((opt) => (
              <Chip
                key={opt}
                label={opt}
                selected={promptState.style === opt}
                onClick={() => setPromptState({ style: opt })}
              />
            ))}
          </div>
        </div>

        {/* Lighting */}
        <div className="param-row p-3.5 border-b border-[#1F1F1F]">
          <div className="flex justify-between items-center mb-2.5">
            <span className="font-mono text-[9px] tracking-widest uppercase text-[#5A5A5A]">Lighting</span>
            <span className="font-mono text-[9px] text-[#FFE500] font-bold uppercase">{promptState.lighting}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PARAMS.lighting.opts.map((opt) => (
              <Chip
                key={opt}
                label={opt}
                selected={promptState.lighting === opt}
                onClick={() => setPromptState({ lighting: opt })}
              />
            ))}
          </div>
        </div>

        {/* Camera */}
        <div className="param-row p-3.5 border-b border-[#1F1F1F]">
          <div className="flex justify-between items-center mb-2.5">
            <span className="font-mono text-[9px] tracking-widest uppercase text-[#5A5A5A]">Camera</span>
            <span className="font-mono text-[9px] text-[#FFE500] font-bold uppercase">{promptState.camera}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PARAMS.camera.opts.map((opt) => (
              <Chip
                key={opt}
                label={opt}
                selected={promptState.camera === opt}
                onClick={() => setPromptState({ camera: opt })}
              />
            ))}
          </div>
        </div>

        {/* Color Grade */}
        <div className="param-row p-3.5 border-b border-[#1F1F1F]">
          <div className="flex justify-between items-center mb-2.5">
            <span className="font-mono text-[9px] tracking-widest uppercase text-[#5A5A5A]">Color Grade</span>
            <span className="font-mono text-[9px] text-[#FFE500] font-bold uppercase">{promptState.colorGrade}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PARAMS.color.opts.map((opt) => (
              <Chip
                key={opt}
                label={opt}
                selected={promptState.colorGrade === opt}
                onClick={() => setPromptState({ colorGrade: opt })}
              />
            ))}
          </div>
        </div>

        {/* Mood */}
        <div className="param-row p-3.5 border-b border-[#1F1F1F]">
          <div className="flex justify-between items-center mb-2.5">
            <span className="font-mono text-[9px] tracking-widest uppercase text-[#5A5A5A]">Mood</span>
            <span className="font-mono text-[9px] text-[#FFE500] font-bold uppercase">{promptState.mood}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PARAMS.mood.opts.map((opt) => (
              <Chip
                key={opt}
                label={opt}
                selected={promptState.mood === opt}
                onClick={() => setPromptState({ mood: opt })}
              />
            ))}
          </div>
        </div>

        {/* Aspect Ratio */}
        <div className="param-row p-3.5">
          <div className="flex justify-between items-center mb-2.5">
            <span className="font-mono text-[9px] tracking-widest uppercase text-[#5A5A5A]">Aspect Ratio</span>
            <span className="font-mono text-[9px] text-[#FFE500] font-bold uppercase">{promptState.ar}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {PARAMS.ar.opts.map((opt) => (
              <Chip
                key={opt}
                label={opt}
                selected={promptState.ar === opt}
                onClick={() => setPromptState({ ar: opt })}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Physics Layer */}
      <div className="mt-5 bg-[#111111] border-t-2 border-[#FFE500] border-b border-[#2A2A2A] px-4 py-2.5 font-['Barlow_Condensed'] text-[18px] font-black tracking-wider uppercase text-[#FFE500]">
        ⚡ PHYSICS LAYER
      </div>

      {/* Kelvin Slider */}
      <div className="px-4 py-3.5">
        <div className="flex justify-between items-end mb-2.5">
          <div>
            <div className="font-mono text-[9px] tracking-widest uppercase text-[#5A5A5A] mb-1">Color Temp</div>
            <div className="font-['Barlow_Condensed'] text-[44px] font-black leading-none text-[#FFE500]">
              {promptState.kelvin}<span className="text-[18px] font-mono text-[#5A5A5A]">K</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-[9px] tracking-wider uppercase text-[#5A5A5A] mb-1.5">{kelvinToDesc(promptState.kelvin)}</div>
            <div 
              className="w-14 h-6 border border-[#333]"
              style={{ background: kelvinToColor(promptState.kelvin) }}
            />
          </div>
        </div>
        <Slider
          value={[promptState.kelvin]}
          onValueChange={([v]) => setPromptState({ kelvin: v })}
          min={1000}
          max={10000}
          step={100}
          className="mt-2"
        />
      </div>

      {/* Camera Body */}
      <div className="px-4 mb-5">
        <div className="font-mono text-[9px] tracking-widest uppercase text-[#5A5A5A] mb-2.5">Camera Body</div>
        <div className="flex flex-wrap gap-1.5">
          <Chip
            label="— none —"
            selected={!promptState.cameraBody}
            onClick={() => setPromptState({ cameraBody: '' })}
          />
          {CAMERA_BODIES.map((opt) => (
            <Chip
              key={opt}
              label={opt}
              selected={promptState.cameraBody === opt}
              onClick={() => setPromptState({ cameraBody: opt })}
            />
          ))}
        </div>
      </div>

      {/* Lens */}
      <div className="px-4 pb-8">
        <div className="font-mono text-[9px] tracking-widest uppercase text-[#5A5A5A] mb-2.5">Lens</div>
        <div className="flex flex-wrap gap-1.5">
          <Chip
            label="— none —"
            selected={!promptState.lens}
            onClick={() => setPromptState({ lens: '' })}
          />
          {LENSES.map((opt) => (
            <Chip
              key={opt}
              label={opt}
              selected={promptState.lens === opt}
              onClick={() => setPromptState({ lens: opt })}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Compare Screen
function CompareScreen() {
  const { openTool, setOpenTool, currentFilter, setCurrentFilter, setPromptState, setActiveTab } = useAVSStore()
  const listRef = useRef<HTMLDivElement>(null)

  const filteredTools = TOOLS.filter((t) => {
    if (currentFilter === 'free') return t.free
    if (currentFilter === 'image') return t.type === 'image'
    if (currentFilter === 'video') return t.type === 'video'
    return true
  })

  // Animate tool cards on filter change
  useEffect(() => {
    if (!listRef.current) return

    const ctx = gsap.context(() => {
      gsap.from('.tool-card', {
        opacity: 0,
        y: 30,
        duration: 0.4,
        stagger: 0.08,
        ease: 'power2.out',
      })
    }, listRef)

    return () => ctx.revert()
  }, [currentFilter])

  const selectTool = (id: string) => {
    setPromptState({ targetTool: id })
    setActiveTab('build')
  }

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
      {/* Header */}
      <div className="bg-[#FFE500] px-4 py-4 pb-3">
        <div className="font-['Barlow_Condensed'] text-[40px] font-black text-[#0A0A0A] leading-[0.9] uppercase">COMPARE<br/>TOOLS</div>
        <div className="font-mono text-[9px] text-[#0A0A0A]/50 mt-1.5 uppercase tracking-wider">Find the right AI for your workflow</div>
      </div>

      {/* Filters */}
      <div className="px-4 py-3 border-b border-[#1F1F1F]">
        <div className="flex gap-1.5">
          {(['all', 'free', 'image', 'video'] as const).map((f) => (
            <Chip
              key={f}
              label={f.toUpperCase()}
              selected={currentFilter === f}
              onClick={() => setCurrentFilter(f)}
            />
          ))}
        </div>
      </div>

      {/* Tool Cards */}
      <div ref={listRef}>
        {filteredTools.map((tool) => {
          const details = TOOL_DETAILS[tool.id]
          const isOpen = openTool === tool.id
          const scoreColor = tool.score >= 9 ? '#00FF88' : tool.score >= 8.5 ? '#FFE500' : '#FF2222'

          return (
            <div key={tool.id} className="tool-card bg-[#111111] border-b border-[#1F1F1F]">
              <button
                onClick={() => setOpenTool(isOpen ? null : tool.id)}
                className="w-full flex items-center justify-between p-3.5 text-left active:bg-[#1A1A1A]"
              >
                <div>
                  <div className="font-['Barlow_Condensed'] text-[22px] font-black tracking-wide uppercase">{tool.name}</div>
                  <div className="flex gap-0.5 mt-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className={`w-3.5 h-0.5 ${i <= details.difficulty ? 'bg-[#FFE500]' : 'bg-[#2A2A2A]'}`} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-['Barlow_Condensed'] text-[20px] font-black" style={{ color: scoreColor }}>{tool.score}</span>
                  <ChevronRight className={`w-5 h-5 text-[#FFE500] transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
                </div>
              </button>
              {isOpen && (
                <div className="px-4 pb-4 border-t border-[#1F1F1F]">
                  <div className="flex justify-between items-center py-2 border-b border-[#1A1A1A] text-[12px]">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#5A5A5A]">Best for</span>
                    <span className="font-mono text-[10px] text-[#F5F5F5] text-right max-w-[55%]">{details.best}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[#1A1A1A] text-[12px]">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#5A5A5A]">Syntax</span>
                    <span className="font-mono text-[10px] text-[#F5F5F5] text-right max-w-[55%]">{details.syntax}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-[#1A1A1A] text-[12px]">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#5A5A5A]">Strength</span>
                    <span className="font-mono text-[10px] text-[#F5F5F5] text-right max-w-[55%]">{details.strength}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 text-[12px]">
                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#5A5A5A]">Free tier</span>
                    <span className="font-mono text-[10px] font-bold" style={{ color: tool.free ? '#00FF88' : '#FF2222' }}>
                      {tool.free ? 'YES' : 'NO'}
                    </span>
                  </div>
                  <Button
                    onClick={() => selectTool(tool.id)}
                    className="w-full mt-3 bg-[#FFE500] text-[#0A0A0A] font-['Barlow_Condensed'] text-[16px] font-black tracking-wider uppercase h-auto py-3 hover:bg-[#E6CE00]"
                  >
                    USE {tool.name.toUpperCase()} →
                  </Button>
                </div>
              )}
            </div>
          )
        })}
      </div>
      
      <div className="h-8" />
    </div>
  )
}

// Learn Screen
function LearnScreen() {
  const { openLesson, setOpenLesson, lessonProgress, completeLesson, setPromptState, setActiveTab } = useAVSStore()
  const listRef = useRef<HTMLDivElement>(null)

  const done = Object.values(lessonProgress).filter(Boolean).length

  // Animate lessons on mount
  useEffect(() => {
    if (!listRef.current) return

    const ctx = gsap.context(() => {
      gsap.from('.lesson-card', {
        opacity: 0,
        x: -30,
        duration: 0.4,
        stagger: 0.06,
        ease: 'power2.out',
      })
    }, listRef)

    return () => ctx.revert()
  }, [])

  const addToPrompt = (example: string) => {
    setPromptState({ subjectDetail: example })
    setActiveTab('build')
  }

  return (
    <div className="h-full overflow-y-auto overflow-x-hidden overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
      {/* Progress Header */}
      <div className="bg-[#111111] border-b-2 border-[#FFE500] px-4 py-3.5">
        <div className="flex justify-between items-baseline mb-2.5">
          <span className="font-['Barlow_Condensed'] text-[28px] font-black uppercase tracking-wide">LEARNING PATH</span>
          <span className="font-mono text-[11px] text-[#FFE500]">{done}/12</span>
        </div>
        <Progress value={(done / 12) * 100} className="h-1 bg-[#2A2A2A]" />
        <div className="flex justify-between font-mono text-[8px] text-[#5A5A5A] mt-1.5 uppercase tracking-wider">
          <span>Foundation</span>
          <span>Creative</span>
          <span>Technical</span>
          <span>Advanced</span>
        </div>
      </div>

      {/* Lessons */}
      <div ref={listRef}>
        {LESSONS.map((lesson, idx) => {
          const isDone = lessonProgress[lesson.id] === true
          // A lesson is active (highlighted) if:
          // 1. It's not already completed
          // 2. AND either it's the first lesson, OR the previous lesson has been completed
          const prevLessonCompleted = idx === 0 ? true : lessonProgress[LESSONS[idx - 1]?.id] === true
          const isActive = !isDone && prevLessonCompleted
          const isLocked = !isDone && !isActive
          const isOpen = openLesson === lesson.id

          return (
            <div key={lesson.id} className={`lesson-card bg-[#111111] border-b border-[#1F1F1F] transition-all ${isLocked ? 'opacity-40' : ''}`}>
              <button
                onClick={() => !isLocked && setOpenLesson(isOpen ? null : lesson.id)}
                className={`w-full flex items-center gap-3 p-3.5 text-left ${isLocked ? 'cursor-not-allowed' : 'active:bg-[#1A1A1A]'}`}
              >
                <div className={`w-[26px] h-[26px] flex items-center justify-center flex-shrink-0 text-[10px] font-mono font-bold transition-all ${
                  isDone 
                    ? 'bg-[#00FF88] text-black' 
                    : isActive 
                      ? 'bg-[#FFE500] text-[#0A0A0A] animate-pulse' 
                      : isLocked
                        ? 'bg-[#1A1A1A] border border-[#2A2A2A] text-[#5A5A5A]'
                        : 'border border-[#2A2A2A] text-[#5A5A5A]'
                }`}>
                  {isDone ? <Check className="w-4 h-4" /> : isLocked ? <Lock className="w-3 h-3" /> : lesson.id}
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold mb-0.5">{lesson.title}</div>
                  <div className="flex items-center gap-2">
                    <div className="font-mono text-[8px] tracking-wider uppercase" style={{ color: lesson.catColor }}>{lesson.cat}</div>
                    {isLocked && (
                      <span className="text-[7px] font-mono text-[#5A5A5A] uppercase tracking-wider">
                        · Complete previous lesson
                      </span>
                    )}
                    {isActive && (
                      <span className="text-[7px] font-mono text-[#FFE500] uppercase tracking-wider animate-pulse">
                        · Ready to start
                      </span>
                    )}
                  </div>
                </div>
                {!isLocked && (
                  <ChevronRight className={`w-5 h-5 text-[#FFE500] transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} />
                )}
              </button>
              {isOpen && (
                <div className="px-4 pb-3.5 border-t border-[#1F1F1F]">
                  <div className="py-2.5 border-b border-[#1A1A1A]">
                    <div className="font-mono text-[8px] uppercase tracking-wider text-[#FFE500] mb-1.5">What it is</div>
                    <div className="text-[12px] leading-relaxed text-[#ABABAB]">{lesson.what}</div>
                  </div>
                  <div className="py-2.5 border-b border-[#1A1A1A]">
                    <div className="font-mono text-[8px] uppercase tracking-wider text-[#FFE500] mb-1.5">Why it matters</div>
                    <div className="text-[12px] leading-relaxed text-[#ABABAB]">{lesson.why}</div>
                  </div>
                  <div className="py-2.5">
                    <div className="font-mono text-[8px] uppercase tracking-wider text-[#FFE500] mb-1.5">Example</div>
                    <div className="bg-[#0A0A0A] border-l-[3px] border-[#FFE500] p-2.5 font-mono text-[10px] text-[#F5F5F5] leading-relaxed break-words">
                      {lesson.example}
                    </div>
                  </div>
                  <div className="flex gap-1.5 mt-3">
                    <Button
                      onClick={() => addToPrompt(lesson.example)}
                      className="flex-[2] bg-[#FFE500] text-[#0A0A0A] font-['Barlow_Condensed'] text-[14px] font-black tracking-wider uppercase h-auto py-3 hover:bg-[#E6CE00]"
                    >
                      ADD TO PROMPT →
                    </Button>
                    {!isDone && (
                      <Button
                        onClick={() => completeLesson(lesson.id)}
                        variant="outline"
                        className="flex-1 border border-[#333] bg-transparent text-[#F5F5F5] font-['Barlow_Condensed'] font-black tracking-wider uppercase h-auto py-3 hover:border-[#FFE500] hover:text-[#FFE500]"
                      >
                        DONE ✓
                      </Button>
                    )}
                    {isDone && (
                      <div className="flex-1 flex items-center justify-center bg-[#00FF88] text-black font-['Barlow_Condensed'] font-black tracking-wider uppercase">
                        COMPLETE ✓
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
      
      <div className="h-8" />
    </div>
  )
}

// Generate Screen
function GenerateScreen() {
  const { promptState, batchAxis, setBatchAxis, savePrompt } = useAVSStore()
  const [batchResults, setBatchResults] = useState<{ label: string; prompt: string }[]>([])
  const prompt = formatPrompt(promptState)
  const tool = TOOLS.find(t => t.id === promptState.targetTool)
  const outputRef = useRef<HTMLDivElement>(null)

  // Animate output on mount
  useEffect(() => {
    if (!outputRef.current) return

    const ctx = gsap.context(() => {
      gsap.from('.gen-header', { opacity: 0, y: -30, duration: 0.5, ease: 'power2.out' })
      gsap.from('.big-output', { opacity: 0, scale: 0.95, duration: 0.5, delay: 0.2, ease: 'power2.out' })
      gsap.from('.copy-btn', { opacity: 0, y: 20, duration: 0.4, delay: 0.4, ease: 'power2.out' })
    }, outputRef)

    return () => ctx.revert()
  }, [])

  const copyPrompt = () => {
    navigator.clipboard.writeText(prompt)
    showToast('✓ COPIED')
  }

  const sharePrompt = () => {
    const url = `${window.location.origin}${window.location.pathname}?s=${btoa(JSON.stringify(promptState))}`
    navigator.clipboard.writeText(url)
    showToast('🔗 LINK COPIED')
  }

  const exportJSON = () => {
    const data = JSON.stringify({
      state: promptState,
      prompt,
      tool: promptState.targetTool,
      generated: new Date().toISOString()
    }, null, 2)
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' }))
    a.download = 'avs-prompt.json'
    a.click()
    showToast('JSON EXPORTED')
  }

  const runBatch = () => {
    if (!batchAxis) {
      showToast('SELECT A PARAMETER FIRST')
      return
    }

    const axes = {
      mood: { key: 'mood' as const, vals: ['epic', 'calm', 'mysterious', 'joyful', 'dark', 'dreamy'] },
      style: { key: 'style' as const, vals: ['photorealistic', 'cinematic', 'illustration', 'anime', 'oil painting'] },
      lighting: { key: 'lighting' as const, vals: ['golden hour', 'studio', 'neon', 'candlelight', 'rembrandt'] },
      tool: { key: 'targetTool' as const, vals: TOOLS.map(t => t.id) },
    }

    const axis = axes[batchAxis]
    const results = axis.vals.map((val) => {
      const newState = { ...promptState, [axis.key]: val }
      const label = batchAxis === 'tool' ? TOOLS.find(t => t.id === val)?.name : val
      return { label, prompt: formatPrompt(newState) }
    })

    setBatchResults(results)
    showToast(`✓ ${results.length} PROMPTS GENERATED`)
  }

  return (
    <div ref={outputRef} className="h-full overflow-y-auto overflow-x-hidden overscroll-contain" style={{ WebkitOverflowScrolling: 'touch' }}>
      {/* Header */}
      <div className="gen-header bg-[#FFE500] px-4 py-3.5 pb-2.5 relative overflow-hidden">
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-repeat-x" style={{
          backgroundImage: 'repeating-linear-gradient(90deg, #0A0A0A 0px, #0A0A0A 10px, #FFE500 10px, #FFE500 20px)'
        }} />
        <div className="font-['Barlow_Condensed'] text-[48px] font-black leading-[0.9] tracking-wide uppercase text-[#0A0A0A]">FINAL<br/>PROMPT</div>
        <div className="font-mono text-[9px] uppercase tracking-wider text-[#0A0A0A]/50 mt-1.5">Formatted for your target tool</div>
      </div>

      {/* Big Output */}
      <div className="big-output mx-4 mt-3.5 bg-[#111111] border-2 border-[#2A2A2A] p-4 font-mono text-[11px] leading-relaxed text-[#F5F5F5] min-h-[110px] break-words">
        <div className="inline-block bg-[#FFE500] text-[#0A0A0A] text-[8px] font-bold uppercase tracking-wider px-2 py-1 mb-2.5">
          {tool?.name?.toUpperCase()}
        </div>
        <div>{prompt}</div>
      </div>

      {/* Copy Button */}
      <button
        onClick={copyPrompt}
        className="copy-btn mx-4 mt-3 flex items-center justify-center gap-2.5 p-4.5 bg-[#FFE500] text-[#0A0A0A] font-['Barlow_Condensed'] text-[28px] font-black tracking-wider uppercase transition-all active:scale-[0.98] active:bg-[#E6CE00] relative overflow-hidden"
      >
        📋 COPY PROMPT
      </button>

      {/* Action Buttons */}
      <div className="flex gap-1.5 px-4 mt-2.5">
        <Button onClick={sharePrompt} variant="outline" className="flex-1 border border-[#333] bg-transparent text-[#F5F5F5] font-['Barlow_Condensed'] text-[13px] font-black tracking-wider uppercase h-auto py-3 hover:border-[#FFE500] hover:text-[#FFE500]">🔗 SHARE</Button>
        <Button onClick={() => savePrompt(prompt.substring(0, 30) + '...')} variant="outline" className="flex-1 border border-[#333] bg-transparent text-[#F5F5F5] font-['Barlow_Condensed'] text-[13px] font-black tracking-wider uppercase h-auto py-3 hover:border-[#FFE500] hover:text-[#FFE500]">💾 SAVE</Button>
        <Button onClick={exportJSON} variant="outline" className="flex-1 border border-[#333] bg-transparent text-[#F5F5F5] font-['Barlow_Condensed'] text-[13px] font-black tracking-wider uppercase h-auto py-3 hover:border-[#FFE500] hover:text-[#FFE500]">{ } JSON</Button>
      </div>

      {/* Batch Section */}
      <div className="mx-4 mt-3.5 bg-[#111111] border border-[#2A2A2A]">
        <div className="bg-[#1A1A1A] px-3.5 py-2.5 font-['Barlow_Condensed'] text-[16px] font-black tracking-wider uppercase text-[#FFE500] border-b border-[#2A2A2A]">
          ⚡ BATCH GENERATE
        </div>
        <div className="p-3">
          <div className="font-mono text-[9px] tracking-widest uppercase text-[#5A5A5A] mb-2">VARY THIS PARAMETER</div>
          <div className="flex flex-wrap gap-1.5">
            {(['mood', 'style', 'lighting', 'tool'] as const).map((axis) => (
              <Chip
                key={axis}
                label={axis.toUpperCase()}
                selected={batchAxis === axis}
                onClick={() => setBatchAxis(axis)}
              />
            ))}
          </div>
          <Button
            onClick={runBatch}
            className="w-full mt-3 bg-[#FFE500] text-[#0A0A0A] font-['Barlow_Condensed'] text-[16px] font-black tracking-wider uppercase h-auto py-3 hover:bg-[#E6CE00]"
          >
            RUN BATCH →
          </Button>
        </div>
      </div>

      {/* Batch Results */}
      {batchResults.length > 0 && (
        <div className="px-4 mt-3.5">
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="font-mono text-[9px] tracking-widest uppercase text-[#5A5A5A]">BATCH — {batchResults.length} VARIANTS</span>
            <div className="flex-1 h-px bg-[#2A2A2A]" />
          </div>
          {batchResults.map((r, i) => (
            <div 
              key={i} 
              className="batch-result mb-2.5 opacity-0"
              ref={(el) => {
                if (el) {
                  gsap.fromTo(el, 
                    { opacity: 0, y: 20 },
                    { opacity: 1, y: 0, duration: 0.3, delay: i * 0.05, ease: 'power2.out' }
                  )
                }
              }}
            >
              <div className="font-mono text-[9px] uppercase tracking-wider text-[#5A5A5A] mb-1.5 flex items-center gap-2">
                <span className="bg-[#FFE500] text-black px-1.5 py-0.5 font-bold">#{String(i + 1).padStart(2, '0')}</span>
                {r.label.toUpperCase()}
              </div>
              <button
                onClick={() => { navigator.clipboard.writeText(r.prompt); showToast(`COPIED #${i + 1}`) }}
                className="w-full text-left bg-[#1A1A1A] border border-l-[3px] border-[#2A2A2A] border-l-[#FFE500] p-3.5 font-mono text-[10px] text-[#F5F5F5] leading-relaxed break-words hover:border-[#FFE500] transition-colors"
              >
                {r.prompt}
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="h-8" />
    </div>
  )
}

// Save Modal
function SaveModal() {
  const { saveModalOpen, setSaveModalOpen, savePrompt } = useAVSStore()
  const [name, setName] = useState('')

  const handleSave = () => {
    savePrompt(name || 'Untitled')
    setSaveModalOpen(false)
    setName('')
    showToast('✓ SAVED')
  }

  return (
    <Dialog open={saveModalOpen} onOpenChange={setSaveModalOpen}>
      <DialogContent className="bg-[#111111] border-t-[3px] border-[#FFE500] rounded-none max-w-[calc(100%-32px)] p-6 pt-8">
        <DialogHeader>
          <DialogTitle className="font-['Barlow_Condensed'] text-[32px] font-black tracking-wider uppercase text-[#FFE500]">SAVE PROMPT</DialogTitle>
        </DialogHeader>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name this prompt…"
          className="bg-[#0A0A0A] border border-[#333] text-[11px] font-mono text-[#F5F5F5] placeholder:text-[#5A5A5A] focus:border-[#FFE500] mt-3"
        />
        <div className="flex gap-1.5 mt-3.5">
          <Button onClick={handleSave} className="flex-1 bg-[#FFE500] text-[#0A0A0A] font-['Barlow_Condensed'] text-[16px] font-black tracking-wider uppercase h-auto py-3 hover:bg-[#E6CE00]">SAVE</Button>
          <Button onClick={() => setSaveModalOpen(false)} variant="outline" className="flex-1 border border-[#333] bg-transparent text-[#F5F5F5] font-['Barlow_Condensed'] text-[16px] font-black tracking-wider uppercase h-auto py-3 hover:border-[#FFE500] hover:text-[#FFE500]">CANCEL</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Main App
export default function Home() {
  const { activeTab, isInverted } = useAVSStore()
  const containerRef = useRef<HTMLDivElement>(null)
  const mainRef = useRef<HTMLDivElement>(null)

  // Initial entrance animation
  useEffect(() => {
    if (!containerRef.current) return

    gsap.from(containerRef.current, {
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out',
    })
  }, [])

  // Load state from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const s = params.get('s')
    if (s) {
      try {
        const loadedState = JSON.parse(atob(s))
        useAVSStore.getState().setPromptState(loadedState)
        showToast('✓ SHARED PROMPT LOADED')
      } catch {
        // Invalid state
      }
    }
  }, [])

  return (
    <div 
      ref={containerRef}
      className="h-dvh max-w-[430px] mx-auto relative overflow-hidden bg-[#0A0A0A] flex flex-col"
      style={{ filter: isInverted ? 'invert(1)' : 'none' }}
    >
      {/* Scanline texture */}
      <div 
        className="fixed inset-0 pointer-events-none z-[9999] opacity-40"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.12) 2px, rgba(0,0,0,0.12) 4px)'
        }}
      />

      <Header />

      <main ref={mainRef} className="flex-1 overflow-hidden relative">
        <AnimatedSection isActive={activeTab === 'home'} id="home">
          <HomeScreen />
        </AnimatedSection>
        <AnimatedSection isActive={activeTab === 'build'} id="build">
          <BuildScreen />
        </AnimatedSection>
        <AnimatedSection isActive={activeTab === 'compare'} id="compare">
          <CompareScreen />
        </AnimatedSection>
        <AnimatedSection isActive={activeTab === 'learn'} id="learn">
          <LearnScreen />
        </AnimatedSection>
        <AnimatedSection isActive={activeTab === 'generate'} id="generate">
          <GenerateScreen />
        </AnimatedSection>
      </main>

      <TabBar />
      <Toast />
      <SaveModal />
    </div>
  )
}
