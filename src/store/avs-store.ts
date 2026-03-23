import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// Types
export interface Tool {
  id: string
  name: string
  free: boolean
  type: 'image' | 'video'
  score: number
}

export interface ToolDetails {
  difficulty: number
  best: string
  syntax: string
  strength: string
}

export interface Lesson {
  id: number
  title: string
  cat: string
  catColor: string
  what: string
  why: string
  example: string
}

export interface SavedPrompt {
  id: number
  name: string
  tool: string
  toolName: string
  state: PromptState
  prompt: string
  created: string
}

export interface PromptState {
  subject: string
  subjectDetail: string
  style: string
  lighting: string
  camera: string
  colorGrade: string
  mood: string
  ar: string
  kelvin: number
  cameraBody: string
  lens: string
  targetTool: string
}

// Constants
export const TOOLS: Tool[] = [
  { id: 'dalle_3', name: 'DALL·E 3', free: true, type: 'image', score: 8.5 },
  { id: 'midjourney', name: 'Midjourney', free: false, type: 'image', score: 9.2 },
  { id: 'flux_dev', name: 'FLUX.1', free: false, type: 'image', score: 9.0 },
  { id: 'sdxl', name: 'SDXL', free: true, type: 'image', score: 8.8 },
  { id: 'ideogram', name: 'Ideogram', free: true, type: 'image', score: 8.3 },
  { id: 'seedream', name: 'SeedDream', free: true, type: 'image', score: 8.1 },
  { id: 'grok', name: 'Grok', free: true, type: 'image', score: 7.9 },
  { id: 'gemini', name: 'Gemini', free: true, type: 'image', score: 8.4 },
  { id: 'chatgpt', name: 'ChatGPT', free: true, type: 'image', score: 8.2 },
  { id: 'meta_ai', name: 'Meta AI', free: true, type: 'image', score: 7.8 },
  { id: 'qwen', name: 'Qwen', free: true, type: 'image', score: 7.7 },
  { id: 'wan_video', name: 'Wan Video', free: false, type: 'video', score: 8.6 },
]

export const TOOL_DETAILS: Record<string, ToolDetails> = {
  dalle_3: { difficulty: 2, best: 'Beginners, marketing', syntax: 'Natural language', strength: 'Text rendering' },
  midjourney: { difficulty: 3, best: 'Creative professionals', syntax: 'Natural + flags', strength: 'Artistic style' },
  flux_dev: { difficulty: 3, best: 'Professional photography', syntax: 'Natural language', strength: 'Photorealism' },
  sdxl: { difficulty: 5, best: 'Developers, pipelines', syntax: 'Tag-based', strength: 'Customizable' },
  ideogram: { difficulty: 2, best: 'Design, text-in-image', syntax: 'Natural language', strength: 'Text rendering' },
  seedream: { difficulty: 2, best: 'Anime, illustrations', syntax: 'Tag hybrid', strength: 'Anime style' },
  grok: { difficulty: 1, best: 'Quick generation', syntax: 'Conversational', strength: 'Real-world refs' },
  gemini: { difficulty: 2, best: 'Spatial compositions', syntax: 'Structured', strength: 'Layout control' },
  chatgpt: { difficulty: 2, best: 'Beginners, iteration', syntax: 'Conversational', strength: 'Instruction following' },
  meta_ai: { difficulty: 1, best: 'Quick social media', syntax: 'Compact', strength: 'Speed' },
  qwen: { difficulty: 2, best: 'Multilingual, product', syntax: 'Label-value', strength: 'Commercial' },
  wan_video: { difficulty: 3, best: 'Short video clips', syntax: 'Motion-first', strength: '5–10s clips' },
}

export const PARAMS = {
  subject: { opts: ['person', 'animal', 'landscape', 'food', 'object', 'abstract'] },
  style: { opts: ['photorealistic', 'cinematic', 'illustration', 'anime', 'oil painting', 'watercolor', 'noir'] },
  lighting: { opts: ['golden hour', 'studio', 'neon', 'candlelight', 'overcast', 'backlit', 'rembrandt'] },
  camera: { opts: ['14mm f/5.6', '35mm f/1.8', '50mm f/1.4', '85mm f/1.8', '135mm f/2.0', '200mm f/2.8'] },
  color: { opts: ['warm', 'cool', 'faded film', 'vivid', 'black & white', 'pastel', 'ACES filmic'] },
  mood: { opts: ['epic', 'calm', 'mysterious', 'joyful', 'dark', 'dreamy', 'tense'] },
  ar: { opts: ['1:1', '4:3', '16:9', '9:16', '2:3', '3:2'] },
}

export const CAMERA_BODIES = ['ARRI ALEXA 65', 'ARRI ALEXA Mini LF', 'Sony VENICE 2', 'Hasselblad H6D', 'Leica M11', 'RED V-RAPTOR', 'Phase One IQ4']
export const LENSES = ['Zeiss Master Prime', 'Cooke S7/i', 'Leica Summilux', 'Sigma Art', 'Canon L Series', 'Voigtländer Nokton']

export const LESSONS: Lesson[] = [
  { id: 1, title: 'What is a prompt?', cat: 'FOUNDATION', catColor: '#FFE500', what: 'A prompt is a text description that tells an AI what image to create.', why: 'Specificity is everything. More detail = closer to your vision.', example: 'A golden retriever sitting on a beach at sunset, warm light, eye level.' },
  { id: 2, title: 'Describing your subject', cat: 'FOUNDATION', catColor: '#FFE500', what: 'The subject is the main focus. Be precise.', why: 'Strong subjects give the AI a clear anchor point to build from.', example: 'An elderly Japanese fisherman mending nets on a wooden dock.' },
  { id: 3, title: 'Choosing a visual style', cat: 'CREATIVE', catColor: '#FF2222', what: 'Style controls the overall visual language of the image.', why: 'Same subject + different style = completely different result.', example: 'In the style of Wes Anderson — symmetrical, pastel, quirky.' },
  { id: 4, title: 'Lighting fundamentals', cat: 'CREATIVE', catColor: '#FF2222', what: 'Lighting is the biggest single factor in image quality.', why: 'Rembrandt vs golden hour vs neon = completely different moods.', example: 'Rembrandt lighting, 3:1 key-to-fill ratio, warm 3200K key light.' },
  { id: 5, title: 'Camera basics', cat: 'TECHNICAL', catColor: '#00FF88', what: 'Focal length controls zoom. Aperture controls background blur.', why: '85mm f/1.4 = portrait blur. 14mm f/11 = sharp wide landscape.', example: 'Shot on 85mm at f/1.4, shallow depth of field, subject isolation.' },
  { id: 6, title: 'Color grading', cat: 'TECHNICAL', catColor: '#00FF88', what: 'Color grade = overall tone of the image colors.', why: 'Warm = inviting. Cool = clinical. ACES = cinematic.', example: 'ACES filmic color workflow, slight warm push, desaturated shadows.' },
  { id: 7, title: 'Mood & atmosphere', cat: 'TECHNICAL', catColor: '#00FF88', what: 'Mood words tell the AI the emotional intent.', why: 'They affect pose, light, color — everything.', example: 'Epic cinematic atmosphere, tense pre-storm energy, dramatic.' },
  { id: 8, title: 'Negative prompts', cat: 'TECHNICAL', catColor: '#00FF88', what: 'Tell the AI what NOT to include.', why: 'Removes common AI artifacts: blur, extra limbs, watermarks.', example: '--no blur, noise, watermark, text, deformed, extra fingers.' },
  { id: 9, title: 'Midjourney syntax', cat: 'ADVANCED', catColor: '#FF2222', what: 'Midjourney uses /imagine + flags: --ar, --v 6, --stylize, --no.', why: 'Flags give precise control over output style and quality.', example: '/imagine prompt: scene --v 6 --ar 16:9 --stylize 750 --no blur' },
  { id: 10, title: 'FLUX.1 prompting', cat: 'ADVANCED', catColor: '#FF2222', what: 'FLUX is extremely literal. Renders exactly what you describe.', why: 'More detail = more accurate. Use "avoid X" instead of negatives.', example: 'Avoid motion blur, avoid text, avoid watermarks.' },
  { id: 11, title: 'SDXL weights', cat: 'ADVANCED', catColor: '#FF2222', what: 'SDXL uses (word:1.3) to boost and (word:0.7) to reduce.', why: 'Weights let you fine-tune which elements dominate.', example: '(rembrandt_lighting:1.4), (warm_tones:1.2), (blur:0.3)' },
  { id: 12, title: 'Your first full prompt', cat: 'ADVANCED', catColor: '#FF2222', what: 'A complete prompt: subject + style + lighting + camera + color + mood.', why: 'All 6 layers = 5/5 strength. The AI has everything it needs.', example: 'Use the BUILD tab to generate your first full-strength prompt.' },
]

// Formatter function
export function formatPrompt(s: PromptState): string {
  const cam = s.cameraBody && s.lens ? `${s.cameraBody} with ${s.lens} at ${s.camera}`
    : s.cameraBody ? `${s.cameraBody} at ${s.camera}` : s.camera
  const k = s.kelvin ? `${s.kelvin}K` : '5600K'
  const d = s.subjectDetail ? `, ${s.subjectDetail}` : ''

  switch (s.targetTool) {
    case 'midjourney':
      return `/imagine prompt: ${s.subject}${d}, ${s.style} style, ${s.lighting} lighting, ${cam}, ${s.mood} atmosphere, ${s.colorGrade} color grade, ${k} color temperature --v 6 --ar ${s.ar} --stylize 750 --no blur, watermark, text, deformed`
    case 'flux_dev':
      return `${s.style} photograph of ${s.subject}${d}. ${s.lighting} lighting at ${k}. ${cam}. ${s.colorGrade} color grade. ${s.mood} atmosphere. ${s.ar} aspect ratio. Photorealistic, ultra-detailed, cinematic quality.`
    case 'sdxl':
      return `POSITIVE:\n${s.subject}${d}, (${s.style}:1.2), ${s.lighting} lighting, ${cam}, (${s.colorGrade}:1.1), (${s.mood}:0.9), ${k}, masterpiece, best quality, 8K\n\nNEGATIVE:\nblur, noise, watermark, text, deformed, low quality\n\nPARAMS:\nSteps: 28 | CFG: 7 | DPM++ 2M Karras | Size: ${s.ar}`
    case 'ideogram':
      return `${s.style} depiction of ${s.subject}${d}. Lighting: ${s.lighting}, ${k}. Camera: ${cam}. Color: ${s.colorGrade}. Mood: ${s.mood}. Aspect: ${s.ar}. High detail, professional quality.`
    case 'seedream':
      return `${s.style}, ${s.subject}${d}, ${s.lighting} lighting, ${cam}, ${s.colorGrade}, ${s.mood} mood, ${k}, aspect ${s.ar}, cinematic, highly detailed, 8K`
    case 'grok':
      return `Create an image: ${s.subject}${d}. Style: ${s.style}. Lighting: ${s.lighting}. Camera: ${cam}. Color: ${s.colorGrade}. Mood: ${s.mood}. Color temp: ${k}. Aspect ratio: ${s.ar}.`
    case 'gemini':
      return `Generate a ${s.style} quality image. Subject: ${s.subject}${d}. Lighting: ${s.lighting} at ${k}. Camera: ${cam}. Color: ${s.colorGrade}. Mood: ${s.mood}. Aspect ratio: ${s.ar}.`
    case 'chatgpt':
      return `I NEED to test how the tool works with extremely specific prompts. DO NOT add any detail, just use it AS-IS: A ${s.style} image of ${s.subject}${d}. ${s.lighting} lighting at ${k}. ${cam}. ${s.colorGrade} colors. ${s.mood} mood. ${s.ar} aspect ratio.`
    case 'meta_ai':
      return `${s.subject}${d}. ${s.style} style. ${s.lighting} light. ${cam}. ${s.colorGrade} tones. ${s.mood}. ${k}. ${s.ar}.`
    case 'qwen':
      return `Generate image. Style: ${s.style}. Subject: ${s.subject}${d}. Lighting: ${s.lighting}, ${k}. Camera: ${cam}. Color: ${s.colorGrade}. Mood: ${s.mood}. Aspect: ${s.ar}. Quality: professional, sharp.`
    case 'wan_video':
      return `Camera slowly dolls in on ${s.subject}${d}. ${s.lighting} lighting, ${k} warmth. ${s.style} visual style. ${s.colorGrade} color grade. ${s.mood} atmosphere. ${s.ar} aspect ratio. Smooth cinematic motion. Duration: 5 seconds. No camera shake.`
    default:
      return `A ${s.style} image of ${s.subject}${d}. ${s.lighting} lighting at ${k}. ${cam}. ${s.colorGrade}. ${s.mood}. ${s.ar}.`
  }
}

// Kelvin helpers
export function kelvinToColor(k: number): string {
  if (k < 2000) return '#ff7000'
  if (k < 3000) return '#ffb347'
  if (k < 4000) return '#ffd27f'
  if (k < 5000) return '#ffe5b0'
  if (k < 6000) return '#fff5e0'
  if (k < 7000) return '#f0f8ff'
  if (k < 8500) return '#d0e8ff'
  return '#b8d8ff'
}

export function kelvinToDesc(k: number): string {
  if (k < 1500) return 'CANDLELIGHT'
  if (k < 2500) return 'TUNGSTEN'
  if (k < 3500) return 'STUDIO WARM'
  if (k < 4500) return 'FLUORESCENT'
  if (k < 6000) return 'DAYLIGHT'
  if (k < 7000) return 'OVERCAST'
  if (k < 9000) return 'OPEN SHADE'
  return 'BLUE SKY'
}

// Store interface
interface AVSState {
  // Current tab
  activeTab: 'home' | 'build' | 'compare' | 'learn' | 'generate'
  setActiveTab: (tab: 'home' | 'build' | 'compare' | 'learn' | 'generate') => void

  // Prompt state
  promptState: PromptState
  setPromptState: (state: Partial<PromptState>) => void
  resetPromptState: () => void

  // Saved prompts
  savedPrompts: SavedPrompt[]
  savePrompt: (name: string) => void
  loadPrompt: (id: number) => void
  deletePrompt: (id: number) => void

  // Lesson progress
  lessonProgress: Record<number, boolean>
  completeLesson: (id: number) => void

  // UI state
  openTool: string | null
  setOpenTool: (id: string | null) => void
  openLesson: number | null
  setOpenLesson: (id: number | null) => void
  currentFilter: 'all' | 'free' | 'image' | 'video'
  setCurrentFilter: (filter: 'all' | 'free' | 'image' | 'video') => void
  batchAxis: 'mood' | 'style' | 'lighting' | 'tool' | null
  setBatchAxis: (axis: 'mood' | 'style' | 'lighting' | 'tool' | null) => void
  isInverted: boolean
  toggleInverted: () => void
  saveModalOpen: boolean
  setSaveModalOpen: (open: boolean) => void

  // Toast state
  toastMessage: string
  toastShow: boolean
  showToast: (message: string) => void
  hideToast: () => void
}

const defaultPromptState: PromptState = {
  subject: 'landscape',
  subjectDetail: '',
  style: 'photorealistic',
  lighting: 'golden hour',
  camera: '85mm f/1.8',
  colorGrade: 'warm',
  mood: 'calm',
  ar: '16:9',
  kelvin: 5600,
  cameraBody: '',
  lens: '',
  targetTool: 'dalle_3',
}

export const useAVSStore = create<AVSState>()(
  persist(
    (set, get) => ({
      // Tab
      activeTab: 'home',
      setActiveTab: (tab) => set({ activeTab: tab }),

      // Prompt state
      promptState: { ...defaultPromptState },
      setPromptState: (newState) => set((state) => ({
        promptState: { ...state.promptState, ...newState }
      })),
      resetPromptState: () => set({ promptState: { ...defaultPromptState } }),

      // Saved prompts
      savedPrompts: [],
      savePrompt: (name) => {
        const state = get()
        const tool = TOOLS.find(t => t.id === state.promptState.targetTool)
        const entry: SavedPrompt = {
          id: Date.now(),
          name: name || 'Untitled',
          tool: state.promptState.targetTool,
          toolName: tool?.name || '',
          state: { ...state.promptState },
          prompt: formatPrompt(state.promptState),
          created: new Date().toISOString(),
        }
        set((s) => ({
          savedPrompts: [entry, ...s.savedPrompts].slice(0, 20)
        }))
      },
      loadPrompt: (id) => {
        const saved = get().savedPrompts.find(p => p.id === id)
        if (saved) {
          set({ promptState: { ...saved.state } })
        }
      },
      deletePrompt: (id) => set((s) => ({
        savedPrompts: s.savedPrompts.filter(p => p.id !== id)
      })),

      // Lesson progress
      lessonProgress: {},
      completeLesson: (id) => set((s) => ({
        lessonProgress: { ...s.lessonProgress, [id]: true }
      })),

      // UI state
      openTool: null,
      setOpenTool: (id) => set({ openTool: id }),
      openLesson: null,
      setOpenLesson: (id) => set({ openLesson: id }),
      currentFilter: 'all',
      setCurrentFilter: (filter) => set({ currentFilter: filter }),
      batchAxis: null,
      setBatchAxis: (axis) => set({ batchAxis: axis }),
      isInverted: false,
      toggleInverted: () => set((s) => ({ isInverted: !s.isInverted })),
      saveModalOpen: false,
      setSaveModalOpen: (open) => set({ saveModalOpen: open }),

      // Toast state
      toastMessage: '',
      toastShow: false,
      showToast: (message) => set({ toastMessage: message, toastShow: true }),
      hideToast: () => set({ toastShow: false }),
    }),
    {
      name: 'avs-storage',
      partialize: (state) => ({
        savedPrompts: state.savedPrompts,
        lessonProgress: state.lessonProgress,
        promptState: state.promptState,
      }),
    }
  )
)
