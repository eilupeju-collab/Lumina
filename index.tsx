
import React, { useState, useEffect, useRef, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { 
  Gamepad2, 
  BookHeart, 
  Palette, 
  Smile, 
  ArrowLeft, 
  RefreshCcw, 
  CheckCircle2, 
  Wind, 
  Brain,
  Pencil,
  Music,
  Send,
  Loader2,
  Settings,
  Save,
  Eraser,
  FolderOpen,
  Laugh,
  PaintBucket,
  Volume2,
  VolumeX,
  Undo,
  Redo,
  LayoutTemplate,
  Feather,
  SprayCan,
  Grid3x3,
  Eye,
  EyeOff,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Quote,
  Bookmark,
  ImageIcon,
  Sparkles,
  Download,
  Upload,
  Layers,
  Wand2,
  Mic,
  MicOff,
  Moon,
  CloudRain,
  Waves,
  Clock,
  Sun,
  Zap,
  Coffee,
  Binary,
  MessageSquarePlus,
  SortAsc,
  CircleDashed,
  Grid2x2,
  Split,
  BrainCircuit,
  Type as TypeIcon,
  Puzzle,
  MousePointer2,
  Dna,
  Shuffle,
  Heart,
  ListMusic,
  HelpCircle,
  Ruler,
  Maximize,
  User,
  Mail,
  Lock,
  LogOut,
  LogIn,
  Camera,
  X,
  Trash2,
  Plus,
  Move,
  Grip,
  Calculator,
  Circle,
  Search,
  Calendar,
  Rocket,
  Ghost,
  Trophy,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Globe,
  Flame,
  Trees,
  Star,
  WindArrowDown,
  Target,
  History,
  Compass,
  ScrollText,
  Lightbulb,
  Leaf,
  Bird,
  Briefcase,
  Utensils,
  Monitor,
  HeartHandshake,
  Gift,
  Coffee as CoffeeIcon,
  Flower,
  ClipboardList,
  Pipette,
  Image as ImageIconAlt,
  History as HistoryIcon,
  FolderPlus,
  Library,
  ChevronRightCircle,
  Check,
  Music2,
  Volume1,
  Headphones,
  UserPlus,
  Volume,
  Waves as WavesIcon,
  Info,
  Layers as LayersIcon,
  Settings2,
  KeyRound,
  Hexagon,
  FileDown,
  FileUp,
  FolderSearch,
  ShieldCheck,
  Disc,
  ExternalLink,
  AlertTriangle,
  HeartPulse,
  Activity,
  SkipForward,
  SkipBack,
  Grid,
  PlusCircle,
  Music4,
  Square,
  Circle as CircleIcon,
  Type as LucideType,
  AudioLines,
  DiscAlbum,
  Palette as PaletteIcon,
  PlusSquare,
  FileJson,
  PencilLine,
  History as HistoryLucide,
  Triangle,
  Camera as CameraIcon
} from "lucide-react";

// --- Configuration & Helpers ---

const AI_MODEL = "gemini-3-flash-preview";
const TTS_MODEL = "gemini-2.5-flash-preview-tts";
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Audio Helpers for TTS ---
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const speakText = async (text: string) => {
  if (!text) return;
  try {
    const response = await ai.models.generateContent({
      model: TTS_MODEL,
      contents: [{ parts: [{ text: `Say naturally, slowly and warmly: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } },
        },
      },
    });
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioBuffer = await decodeAudioData(decodeBase64(base64Audio), audioCtx, 24000, 1);
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      source.start();
    }
  } catch (e) {
    console.error("TTS Error:", e);
    // Fallback to basic browser synth if AI fails
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  }
};

const handleAIError = (e: any): boolean => {
  const errorStr = JSON.stringify(e).toLowerCase();
  return errorStr.includes("429") || errorStr.includes("resource_exhausted") || errorStr.includes("quota") || errorStr.includes("limit");
};

const TRANSLATIONS: Record<string, any> = {
  en: {
    app_name: "Lumina", hi: "Hi", feeling: "Feeling", instant_relief: "Instant Relief",
    instant_relief_desc: "Quick distraction based on your mood", games_tools: "Games & Tools",
    games_tools_desc: "Arcade games & Mindful tools", journal: "Journal", journal_desc: "Express your thoughts",
    creative_space: "Creative Space", creative_space_desc: "Draw, music & imagine", kindness: "Kindness Hub",
    kindness_desc: "Kindness & Gratitude", inspiration: "Inspiration", inspiration_desc: "Daily quotes & wisdom",
    profile_settings: "Profile & Settings", save_changes: "Save Changes", sign_out: "Sign Out",
    language: "Language", back_home: "Back Home", start_now: "Start Now",
    loading_suggestion: "Finding the best distraction for you...", need_inspiration: "Need inspiration? Tap the button below.",
    writing_prompt: "Writing Prompt", save_entry: "Save Entry", add_act: "Add Act of Kindness",
    daily_quotes: "Daily Inspiration", start: "Start", pause: "Pause", reset: "Reset", try_again: "Try Again",
    another_one: "Another One",
    game_over: "GAME OVER", display_name: "Display Name", current_mood: "Current Mood",
    round: "Round", height: "Height", popped: "Popped", best: "Best", score: "Score",
    add_date: "Add Date", add_time: "Add Time", writing_hint: "Start writing or speaking...",
    save_list: "Save List", acts_hint: "What kind act did you do?",
    custom_theme: "Type a theme or use voice...", generated_art: "Generated Art",
    generate_art: "Generate Art", edit_in_art: "Edit in Art Canvas", clear_all: "Clear All",
    relax_cat: "Relax", focus_cat: "Focus", distract_cat: "Distract",
    whack_thought: "Whack-A-Thought", zen_sand: "Zen Sand Garden", color_match: "Color Match",
    guided_imagery: "Guided Imagery", sound_mixer: "Soundscapes", affirmations: "Affirmations",
    forest: "Forest", fire: "Fire", ocean: "Ocean", rain: "Rain", white_noise: "Zen",
    target: "Target", match: "Match", think_positive: "Think Positive", get_affirmation: "Get Affirmation",
    imagine: "Imagine", imagine_desc: "Describe a peaceful place...",
    new_prompt: "New Prompt",
    past_entries: "History", no_entries: "No journal entries yet.", delete_entry: "Delete", entry_saved: "Entry saved!",
    daily_mission: "Daily Mission", zen_stories: "Zen Stories", quote_tab: "Quotes", 
    mission_desc: "A small positive step for today", mandala: "Mandala Creator", grateful_tree: "Grateful Tree",
    theme_label: "Focus Theme", theme_placeholder: "e.g. Nature, Resilience, Peace", listen: "Listen",
    ai_art_btn: "AI Art", spin_btn: "Spin the Wheel", search_joke: "Search for a joke topic...", search_btn: "Search",
    reset_btn: "Reset", kindness_challenges: "Today's Challenges", accept_challenge: "Accept",
    kindness_log: "My Acts Log", get_more_challenges: "New Ideas", challenge_completed: "Completed!",
    gratitude_list: "Gratitude List", gratitude_hint: "What are you thankful for today?", gratitude_prompt_btn: "Get Prompt",
    kindness_tab: "Kindness", gratitude_tab_btn: "Gratitude", upload_image: "Import Background",
    smoothing: "Stabilize", progress_saved: "Progress saved!", add_palette: "Add to Swatches",
    clear_bg: "Clear Background", eyedropper: "Gotero", recent_colors: "Swatches",
    save_palette_lib: "Name and Save current set as a Palette", palette_library: "Your Palettes", unnamed_palette: "Unnamed Palette",
    undo: "Undo", redo: "Redo", save_options: "Save Options", add_color_swatch: "Add current color to Swatches",
    save_current_set: "Save current Swatches as permanent Palette",
    ai_playlist: "AI Playlist Curator", playlist_hint: "e.g. Morning Focus, Rainy Night, Joyful Energy...", generate_playlist: "Generate My Playlist",
    gen_playlist_loading: "Curation in progress...", songs_found: "Your Unique Playlist",
    quick_vibe: "Quick Vibes:", play_all: "Play All", stop_all: "Stop All",
    music_therapy: "Music Therapy", music_therapy_desc: "Scientifically curated based on the Iso-principle",
    ai_music: "AI Music", music_prompt: "Describe the vibe (e.g. 'Cozy Rainy Night')", generate_tune: "Generate Tune",
    playing_tune: "Playing your tune...", bg_music_label: "Background Music", none: "None", zen_drone: "Zen Drone",
    morning_mist: "Morning Mist", ocean_waves: "Ocean Waves", ai_custom: "AI Custom Melody", volume: "Volume",
    account: "Account", login: "Login", sign_up: "Sign Up", master_volume: "Volumen Maestro", sounds_tab: "Sonidos", instructions_title: "How to use",
    layers: "Layers", add_layer: "New Layer", delete_layer: "Delete Layer", blend_mode: "Blend Mode",
    layer_opacity: "Opacity",
    email_label: "Email", password_label: "Password", name_label: "Name",
    login_cta: "Already have an account?", signup_cta: "Don't have an account?",
    welcome_back: "Welcome Back", join_us: "Join Lumina",
    polygon: "Polygon", sides: "Sides", 
    download: "Download PNG", clear_canvas: "Clear All", save_project: "Save Project", load_project: "My Gallery",
    confirm_clear: "Are you sure you want to clear your entire canvas? All layers will be reset.",
    save_success: "Drawing saved to gallery!",
    sketch_tab: "Sketch",
    brush_size: "Brush Size",
    brush_tip: "Tip Shape",
    brush_tool: "Brush",
    fill_tool: "Fill Bucket",
    explore_themes: "Explore Themes",
    why_it_works: "Why this works:",
    now_playing: "Now Playing",
    guides: "Guides",
    grid_size: "Grid Size",
    perspective: "Perspective",
    my_library: "My Library",
    add_track: "Add Track",
    track_title: "Song Title",
    track_artist: "Artist",
    track_added: "Track added to library",
    curator_tab: "AI Curator",
    library_tab: "My Playlist",
    quota_error: "AI is currently resting (Rate limit reached). Using classic content instead.",
    enter_text: "Enter text to add:",
    bg_music: "Background Music",
    zen_piano: "Zen Piano",
    soft_synth: "Soft Synth",
    space_ambient: "Space Ambient",
    ai_melody_hint: "e.g. Playful forest, sad rainy night...",
    palette_manager: "Palette Manager",
    palettes_lib: "Palette Library",
    export_json: "Export Library",
    import_json: "Import Library",
    save_palette: "Save Current",
    palette_name_prompt: "Enter a name for this palette:",
    import_success: "Palettes imported successfully!",
    import_error: "Invalid palette file.",
    guide_settings: "Guide Settings",
    guide_grid: "Graph Paper",
    guide_none: "No Guides",
    guide_opacity: "Guide Opacity",
    guide_vanishing: "Vanishing Point",
    guide_thirds: "Rule of Thirds",
    guide_golden: "Golden Ratio",
    guide_rulers: "Show Rulers",
    explore_tab: "Explore", search_tab: "Search", write_tab: "My Wisdom", lens_tab: "Lens",
    search_placeholder: "What are you looking for?",
    write_wisdom_hint: "Write down a thought or quote that inspires you...",
    save_wisdom: "Save to My Wisdom",
    lens_loading: "Scanning your world for wisdom...",
    lens_result: "Mindful Reflection",
    instructions: {
      BREATHING: "Follow the expanding circle. Inhale as it grows, hold at the peak, and exhale as it shrinks.",
      SNAKE: "Use the arrow buttons to guide the snake. Eat red food to grow, but don't hit the walls or yourself!",
      BREAKOUT: "Move the paddle left and right to bounce the ball. Break all the blocks to win.",
      DODGE: "Steer your rocket left and right to avoid the incoming space debris.",
      COMEDY: "Select a humor style or search for a topic. Click 'Another One' to keep the laughs coming.",
      MEMORY: "Tap cards to flip them. Find all matching pairs to win the game.",
      POP: "Tap the rising bubbles to pop them. Great for quick stress relief and focus.",
      STACK: "Tap anywhere to place the moving block. Try to stack them as high as you can!",
      ECHO: "Watch the sequence of colors and sounds, then repeat it exactly as shown.",
      THOUGHTS: "Identify the stressful thoughts and tap them away before they crowd your mind.",
      SAND: "Slowly trace paths in the sand. Use it for mindfulness and to center your focus.",
      MATCH: "Look at the large target color and select the matching one from the options below.",
      IMAGERY: "Close your eyes (optional) and read the scenario. Imagine yourself in that peaceful place.",
      SOUNDS: "Turn on your favorite ambient sounds. Adjust the individual sliders to create your perfect mix.",
      AFFIRMATIONS: "Take a moment to read the affirmation. Believe in the words and let them empower you.",
      MANDALA: "Draw on the canvas. Your strokes will be mirrored to create complex, beautiful mandalas.",
      GRATEFUL_TREE: "Add things you're thankful for. Watch your gratitude leaves populate the tree.",
      TIMER: "Use this 25-minute Pomodoro timer to focus on one single task without distractions.",
      WHEEL: "Unsure what to do? Spin the wheel for a suggested mindful activity.",
      SKETCH: "Use the brush tool to paint freely. You can switch to the Fill Bucket to color enclosed areas instantly. Use Guides to help with structure.",
      SOUND_MIXER: "Create your own relaxing atmosphere by mixing different ambient sounds. Adjust each volume to find your perfect zen mix.",
      AI_PLAYLIST: "Describe the vibe you want for your day, and Lumina will curate a 5-song playlist of real tracks for you to explore."
    }
  },
  es: { 
    app_name: "Lumina", hi: "Hola", feeling: "Sintiéndome", instant_relief: "Alivio Instantáneo", instant_relief_desc: "Distracción rápida", games_tools: "Juegos", journal: "Diario", kindness: "Hub de Amabilidad", inspiration: "Inspiración", explore_themes: "Explorar Temas", daily_mission: "Misión Diaria", zen_stories: "Historias Zen", quote_tab: "Frases", new_prompt: "Nueva sugerencia", grateful_tree: "Árbol de Gratitud", mandala: "Creador Mandala", theme_label: "Tema de Enfoque", theme_placeholder: "ej. Naturaleza, Resiliencia", listen: "Escuchar", ai_art_btn: "Arte IA", spin_btn: "Girar la Rueda", search_joke: "Busca un tema de chiste...", search_btn: "Buscar", reset_btn: "Reiniciar", another_one: "Otro", kindness_challenges: "Retos de Hoy", accept_challenge: "Aceptar", kindness_log: "Mis Actos", get_more_challenges: "Más Ideas", challenge_completed: "¡Completado!", gratitude_list: "Lista de Gratitud", gratitude_hint: "¿Por qué estás agradecido hoy?", gratitude_prompt_btn: "Sugerencia", kindness_tab: "Amabilidad", gratitude_tab_btn: "Gratitude", upload_image: "Importar Fondo", smoothing: "Estabilizar", progress_saved: "¡Progreso guardado!", add_palette: "Añadir a Muestras", clear_bg: "Borrar Fondo", eyedropper: "Gotero", recent_colors: "Recientemente Usado", save_palette_lib: "Guardar conjunto como paleta", palette_library: "Tus Paletas", unnamed_palette: "Paleta sin nombre", undo: "Deshacer", redo: "Redacer", save_options: "Opciones de Guardado", add_color_swatch: "Añadir color actual a Muestras", save_current_set: "Guardar Muestras como paleta permanente", ai_music: "Música IA", music_prompt: "Describe el ambiente (ej. 'Noche lluviosa acogedora')", generate_tune: "Generar Melodía", playing_tune: "Reproduciendo tu melodía...", bg_music_label: "Música de Fondo", none: "Ninguna", zen_drone: "Dron Zen", morning_mist: "Niebla Matinal", ocean_waves: "Olas del Mar", ai_custom: "Melodía IA Personalizada", volume: "Volumen", lens_tab: "Lente", lens_loading: "Escaneando el mundo...", lens_result: "Reflexión Mindful",
    account: "Cuenta", login: "Entrar", sign_up: "Registrarse", master_volume: "Volumen Maestro", sounds_tab: "Sonidos", instructions_title: "Instrucciones",
    layers: "Capas", add_layer: "Nueva Capa", delete_layer: "Borrar Capa", blend_mode: "Modo Fusión",
    layer_opacity: "Opacidad",
    palette_manager: "Gestor de Paletas",
    palettes_lib: "Biblioteca de Paletas",
    export_json: "Exportar Biblioteca",
    import_json: "Importar Biblioteca",
    save_palette: "Guardar Actual",
    palette_name_prompt: "Nombre de la paleta:",
    import_success: "¡Paletas importadas!",
    import_error: "Archivo de paleta inválido.",
    guide_settings: "Ajustes de Guías",
    guide_grid: "Papel Milimetrado",
    guide_none: "Sin Guías",
    guide_opacity: "Opacidad de Guía",
    guide_vanishing: "Punto de Fuga",
    guide_thirds: "Regla de Tercios",
    guide_golden: "Proporción Áurea",
    guide_rulers: "Mostrar Reglas",
    explore_tab: "Explorar", search_tab: "Buscar", write_tab: "Mi Sabiduría",
    search_placeholder: "¿Qué estás buscando?",
    write_wisdom_hint: "Escribe un pensamiento o frase que te inspire...",
    save_wisdom: "Guardar en Mi Sabiduría",
    instructions: {
      BREATHING: "Sigue el círculo. Inhala cuando crezca y exhala cuando se encoja.",
      SNAKE: "Uسا las flechas para guiar la serpiente. Come para crecer, no choques con las paredes.",
      BREAKOUT: "Mueve la paleta para rebotar la bola y romper todos los bloques.",
      DODGE: "Esquiva los obstáculos espatiales moviendo tu cohete a los lados.",
      COMEDY: "Elige un estilo de humor o busca un tema para reír un poco.",
      MEMORY: "Encuentra todas las parejas de cartas iguales.",
      POP: "Explota las burbuzas para aliviar el estrés rápidamente.",
      STACK: "Toca para colocar el bloque. Intenta apilarlos lo más alto posible.",
      ECHO: "Watch the sequence of colors and sounds, then repeat it exactly as shown.",
      THOUGHTS: "Toca los pensamientos negativos para despejar tu mente.",
      SAND: "Dibuja lentamente en la arena para centrar tu atención.",
      MATCH: "Selecciona el color que coincida con el objetivo central.",
      IMAGERY: "Lee y visualiza el escenario pacífico para relajarte.",
      SOUNDS: "Mezcla sonidos de la naturaleza para crear tu ambiente ideal.",
      AFFIRMATIONS: "Lee y cree en estas afirmaciones positivas.",
      MANDALA: "Dibuja patrones simétricos y hermosos desde el centro.",
      GRATEFUL_TREE: "Escribe cosas por las que estés agradecido para ver crecer tu árbol.",
      TIMER: "Usa este temporizador para concentrarte en una sola tarea.",
      WHEEL: "Gira la rueda para obtener una actividad mindful aleatoria.",
      SKETCH: "Usa la herramienta de pincel para pintar libremente. Usa el cubo para rellenar áreas.",
      SOUND_MIXER: "Crea tu propia atmósfera relajante mezclando sonidos ambientales.",
      AI_PLAYLIST: "Describe el ambiente que deseas para tu día y Lumina curará una lista de 5 canciones para ti."
    }
  }
};

const MOODS = [
  { label: "Calm", emoji: "😌" },
  { label: "Anxious", emoji: "😰" },
  { label: "Sad", emoji: "😢" },
  { label: "Angry", emoji: "😠" },
  { label: "Happy", emoji: "😊" },
  { label: "Tired", emoji: "😴" },
  { label: "Focused", emoji: "🧐" },
  { label: "Stressed", emoji: "😫" }
];

const PRESET_ART_COLORS = [
  "#f43f5e", "#f59e0b", "#fbbf24", "#10b981", "#2dd4bf", "#0ea5e9", "#6366f1", "#8b5cf6", "#d8b4fe", "#475569", "#1e293b", "#ffffff"
];

const INSPIRATION_THEMES = [
  { id: "Peace", icon: Wind, color: "bg-sky-50 text-sky-600 border-sky-100" },
  { id: "Strength", icon: ShieldCheck, color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
  { id: "Gratitude", icon: HeartHandshake, color: "bg-rose-50 text-rose-600 border-rose-100" },
  { id: "Focus", icon: Target, color: "bg-cyan-50 text-cyan-600 border-cyan-100" },
  { id: "Kindness", icon: Sparkles, color: "bg-amber-50 text-amber-600 border-amber-100" },
  { id: "Patience", icon: Timer, color: "bg-slate-50 text-slate-600 border-slate-100" },
  { id: "Nature", icon: Trees, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
  { id: "Joy", icon: Smile, color: "bg-yellow-50 text-yellow-600 border-yellow-100" },
  { id: "Courage", icon: Flame, color: "bg-orange-50 text-orange-600 border-orange-100" },
  { id: "Harmony", icon: Music, color: "bg-blue-50 text-blue-600 border-blue-100" }
];

const FALLBACK_PLAYLISTS: Record<string, SongSuggestion[]> = {
  default: [
    { title: "Weightless", artist: "Marconi Union", year: "2011" },
    { title: "Claire de Lune", artist: "Claude Debussy", year: "1905" },
    { title: "Spiegel im Spiegel", artist: "Arvo Pärt", year: "1978" },
    { title: "Music for Airports", artist: "Brian Eno", year: "1978" },
    { title: "Riverside", artist: "Agnes Obel", year: "2010" }
  ],
  therapy: [
    { title: "Comfortably Numb", artist: "Pink Floyd", year: "1979", therapyInfo: "The immersive sonic texture helps ground overwhelming emotions." },
    { title: "Gymnopédie No. 1", artist: "Erik Satie", year: "1888", therapyInfo: "Slow, predictable rhythms encourage physiological slowing and relaxation." },
    { title: "Morning Has Broken", artist: "Cat Stevens", year: "1971", therapyInfo: "Positive lyrical imagery and gentle acoustic sounds build hope." },
    { title: "Aqueous Transmission", artist: "Incubus", year: "2001", therapyInfo: "Nature-inspired instruments create a sense of vastness and perspective." },
    { title: "Everything in Its Right Place", artist: "Radiohead", year: "2000", therapyInfo: "Repetitive structures provide a safe mental container for focus." }
  ]
};

let globalAudioCtx: AudioContext | null = null;
const activeNodes: Record<string, { osc: OscillatorNode | AudioBufferSourceNode, gain: GainNode }> = {};

const noteToFreq = (note: string) => {
    const notes: Record<string, number> = { 'C': 0, 'C#': 1, 'D': 2, 'D#': 3, 'E': 4, 'F': 5, 'F#': 6, 'G': 7, 'G#': 8, 'A': 9, 'A#': 10, 'B': 11 };
    const octave = parseInt(note.slice(-1));
    const key = note.slice(0, -1).toUpperCase();
    const semitones = notes[key] + (notes[key] !== undefined ? (octave - 4) * 12 : 0);
    return 440 * Math.pow(2, semitones / 12);
};

const playSound = (type: string, volume: number = 0.5) => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    if (volume <= 0.001) return; 
    if (!globalAudioCtx) globalAudioCtx = new AudioContext();
    if (globalAudioCtx.state === 'suspended') globalAudioCtx.resume();
    const ctx = globalAudioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    
    if (type === 'brush') {
      const bufferSize = ctx.sampleRate * 0.05;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * 0.5;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);
      source.connect(filter);
      filter.connect(gain); gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.08 * volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      source.start(now);
      return;
    }

    osc.connect(gain); gain.connect(ctx.destination);
    if (type === 'pop') { osc.type = 'sine'; osc.frequency.setValueAtTime(300 + Math.random() * 200, now); osc.frequency.exponentialRampToValueAtTime(800, now + 0.05); gain.gain.setValueAtTime(0.1 * volume, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05); osc.start(now); osc.stop(now + 0.05);
    } else if (type === 'success') { osc.type = 'triangle'; osc.frequency.setValueAtTime(440, now); osc.frequency.linearRampToValueAtTime(880, now + 0.2); gain.gain.setValueAtTime(0.1 * volume, now); gain.gain.linearRampToValueAtTime(0, now + 0.3); osc.start(now); osc.stop(now + 0.3);
    } else if (type === 'click') { osc.type = 'sine'; osc.frequency.setValueAtTime(800, now); osc.frequency.exponentialRampToValueAtTime(400, now + 0.1); gain.gain.setValueAtTime(0.05 * volume, now); gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1); osc.start(now); osc.stop(now + 0.1); }
    else if (type === 'fail') { osc.type = 'sawtooth'; osc.frequency.setValueAtTime(220, now); osc.frequency.linearRampToValueAtTime(110, now + 0.3); gain.gain.setValueAtTime(0.1 * volume, now); gain.gain.linearRampToValueAtTime(0, now + 0.3); osc.start(now); osc.stop(now + 0.3); }
    else if (type === 'trash') { osc.type = 'sine'; osc.frequency.setValueAtTime(100, now); gain.gain.setValueAtTime(0.1 * volume, now); gain.gain.linearRampToValueAtTime(0, now + 0.2); osc.start(now); osc.stop(now + 0.2); }
  } catch (e) {}
};

const createNoiseBuffer = (ctx: AudioContext, color: 'white' | 'brown' | 'pink') => {
  const bufferSize = 2 * ctx.sampleRate, buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate), output = buffer.getChannelData(0);
  if (color === 'white') { for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 2 - 1; } 
  else if (color === 'brown') { let lastOut = 0; for (let i = 0; i < bufferSize; i++) { const white = Math.random() * 2 - 1; output[i] = (lastOut + (0.02 * white)) / 1.02; lastOut = output[i]; output[i] *= 3.5; } } 
  return buffer;
};

const toggleAmbient = (id: string, active: boolean, vol: number = 0.5) => {
  if (!globalAudioCtx) globalAudioCtx = new AudioContext();
  const ctx = globalAudioCtx; if (ctx.state === 'suspended') ctx.resume();
  if (active) {
    if (activeNodes[id]) return;
    const gain = ctx.createGain(); gain.gain.setValueAtTime(vol * 0.2, ctx.currentTime); gain.connect(ctx.destination);
    let source: AudioBufferSourceNode | OscillatorNode;
    if (id === 'rain') { source = ctx.createBufferSource(); source.buffer = createNoiseBuffer(ctx, 'pink'); source.loop = true; } 
    else if (id === 'ocean') { source = ctx.createBufferSource(); source.buffer = createNoiseBuffer(ctx, 'brown'); source.loop = true; const lfo = ctx.createOscillator(); lfo.frequency.value = 0.2; const lfoGain = ctx.createGain(); lfoGain.gain.value = 0.1; lfo.connect(lfoGain); lfoGain.connect(gain.gain); lfo.start(); } 
    else if (id === 'white_noise') { source = ctx.createOscillator(); (source as OscillatorNode).type = 'sine'; (source as OscillatorNode).frequency.value = 110; source.start(); }
    else if (id === 'fire') { 
      const s = ctx.createBufferSource(); 
      s.buffer = createNoiseBuffer(ctx, 'white'); 
      s.loop = true; 
      const filter = ctx.createBiquadFilter(); 
      filter.type = 'lowpass'; 
      filter.frequency.value = 400; 
      s.connect(filter); 
      filter.connect(gain); 
      source = s; 
    }
    else { return; }
    if (id !== 'fire') source.connect(gain);
    if (source instanceof AudioBufferSourceNode) source.start(); 
    activeNodes[id] = { osc: source, gain };
  } else if (activeNodes[id]) { 
    try { activeNodes[id].osc.stop(); } catch(e){}
    activeNodes[id].osc.disconnect(); activeNodes[id].gain.disconnect(); delete activeNodes[id]; 
  }
};

const updateAmbientVolume = (id: string, vol: number) => {
  if (activeNodes[id]) {
    activeNodes[id].gain.gain.setTargetAtTime(vol * 0.2, globalAudioCtx?.currentTime || 0, 0.1);
  }
};

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

const floodFill = (ctx: CanvasRenderingContext2D, startX: number, startY: number, fillColor: {r: number, g: number, b: number}) => {
  const canvas = ctx.canvas;
  const width = canvas.width;
  const height = canvas.height;
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  const x = Math.round(startX);
  const y = Math.round(startY);
  
  const startPos = (y * width + x) * 4;
  const startR = data[startPos];
  const startG = data[startPos + 1];
  const startB = data[startPos + 2];
  const startA = data[startPos + 3];

  if (startR === fillColor.r && startG === fillColor.g && startB === fillColor.b && startA === 255) return;

  const stack: [number, number][] = [[x, y]];
  while (stack.length > 0) {
    const [currX, currY] = stack.pop()!;
    let yIdx = currY;
    let pos = (yIdx * width + currX) * 4;

    while (yIdx >= 0 && data[pos] === startR && data[pos+1] === startG && data[pos+2] === startB && data[pos+3] === startA) {
      yIdx--;
      pos -= width * 4;
    }
    yIdx++;
    pos += width * 4;

    let reachLeft = false;
    let reachRight = false;

    while (yIdx < height && data[pos] === startR && data[pos+1] === startG && data[pos+2] === startB && data[pos+3] === startA) {
      data[pos] = fillColor.r;
      data[pos+1] = fillColor.g;
      data[pos+2] = fillColor.b;
      data[pos+3] = 255;

      if (currX > 0) {
        const leftPos = pos - 4;
        if (data[leftPos] === startR && data[leftPos+1] === startG && data[leftPos+2] === startB && data[leftPos+3] === startA) {
          if (!reachLeft) {
            stack.push([currX - 1, yIdx]);
            reachLeft = true;
          }
        } else {
          reachLeft = false;
        }
      }

      if (currX < width - 1) {
        const rightPos = pos + 4;
        if (data[rightPos] === startR && data[rightPos+1] === startG && data[rightPos+2] === startB && data[rightPos+3] === startA) {
          if (!reachRight) {
            stack.push([currX + 1, yIdx]);
            reachRight = true;
          }
        } else {
          reachRight = false;
        }
      }

      yIdx++;
      pos += width * 4;
    }
  }
  ctx.putImageData(imageData, 0, 0);
};

// --- Types ---
type ViewState = "HOME" | "GAMES" | "JOURNAL" | "CREATIVE" | "GRATITUDE" | "PROFILE" | "QUOTES";
type GameType = "NONE" | "BREATHING" | "SNAKE" | "BREAKOUT" | "DODGE" | "COMEDY" | "MEMORY" | "POP" | "STACK" | "ECHO" | "THOUGHTS" | "SAND" | "MATCH" | "IMAGERY" | "SOUNDS" | "AFFIRMATIONS" | "MANDALA" | "GRATEFUL_TREE" | "TIMER" | "WHEEL";
interface UserProfile { username: string; mood: string; language: string; email?: string; }
interface JournalEntry { id: string; date: string; text: string; prompt?: string; image?: string; }
interface KindnessChallenge { id: string; text: string; icon: any; category: string; }
interface SongSuggestion { title: string; artist: string; year: string; therapyInfo?: string; }
interface PersonalWisdom { id: string; text: string; date: string; }

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  blendMode: string;
  thumbnail?: string;
}

interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
}

interface HistoryState {
  layerId: string;
  data: ImageData;
}

// --- UI Components ---
const Header = ({ title, goBack, rightAction }: any) => (
  <div className="flex items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-10 shrink-0">
    <div className="flex items-center overflow-hidden">
        {goBack && <button onClick={goBack} className="mr-4 p-2 rounded-full hover:bg-slate-100 shrink-0"><ArrowLeft className="w-6 h-6 text-slate-600" /></button>}
        <h1 className="text-xl font-bold text-slate-800 truncate">{title}</h1>
    </div>
    {rightAction && <div className="shrink-0">{rightAction}</div>}
  </div>
);

const Card = ({ title, icon: Icon, onClick, description, colorClass }: any) => (
  <button onClick={onClick} className={`w-full p-6 rounded-2xl shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 text-left ${colorClass} fade-in`}>
    <div className="flex items-center justify-between mb-2"><h2 className="text-lg font-bold text-slate-800">{title}</h2><Icon className="w-8 h-8 opacity-70" /></div>
    <p className="text-sm opacity-80 font-medium">{description}</p>
  </button>
);

const InstructionsModal = ({ isOpen, onClose, text, lang }: any) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black/60 z-[3000] flex items-end justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-md rounded-[2.5rem] p-8 pb-10 shadow-2xl animate-in slide-in-from-bottom duration-300">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                            <Info size={20} />
                        </div>
                        <h3 className="text-lg font-black uppercase tracking-tighter text-slate-800">{lang.instructions_title}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-slate-100"><X size={20}/></button>
                </div>
                <p className="text-slate-600 font-bold leading-relaxed mb-8">{text}</p>
                <button 
                    onClick={onClose}
                    className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all"
                >
                    Got it!
                </button>
            </div>
        </div>
    );
};

// --- Drawing Canvas ---
const DrawingCanvas = ({ lang }: any) => {
  const guideCanvasRef = useRef<HTMLCanvasElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);
  const layerCanvasRefs = useRef<Record<string, HTMLCanvasElement | null>>({});
  
  const [color, setColor] = useState("#6366f1");
  const [swatchColors, setSwatchColors] = useState<string[]>(PRESET_ART_COLORS);
  const [paletteLibrary, setPaletteLibrary] = useState<ColorPalette[]>([]);
  const [showLibrary, setShowLibrary] = useState(false);
  
  const [brushSize, setBrushSize] = useState(10);
  const [brushTip, setBrushTip] = useState<'round' | 'square' | 'triangle' | 'calligraphy'>('round');
  const [tool, setTool] = useState<'brush' | 'fill'>('brush');
  const [globalBlendMode, setGlobalBlendMode] = useState<GlobalCompositeOperation>('source-over');
  const [showBlendInfo, setShowBlendInfo] = useState(false);
  
  // Undo/Redo state
  const [undoStack, setUndoStack] = useState<HistoryState[]>([]);
  const [redoStack, setRedoStack] = useState<HistoryState[]>([]);
  const startImageData = useRef<ImageData | null>(null);

  // Layer state
  const [layers, setLayers] = useState<Layer[]>([
    { id: '1', name: 'Background', visible: true, opacity: 1, blendMode: 'normal' }
  ]);
  const [activeLayerId, setActiveLayerId] = useState<string>('1');
  const [showLayersPanel, setShowLayersPanel] = useState(false);

  // Guides state
  const [showGuides, setShowGuides] = useState(false);
  const [guideType, setGuideType] = useState<'grid' | 'perspective' | 'thirds' | 'golden'>('grid');
  const [guideOpacity, setGuideOpacity] = useState(0.2);
  const [guideScale, setGuideScale] = useState(40);
  const [vanishingPoint, setVanishingPoint] = useState({ x: 0.5, y: 0.5 }); 
  const [showRulers, setShowRulers] = useState(false);
  const [showGuideSettings, setShowGuideSettings] = useState(false);

  const [isDrawing, setIsDrawing] = useState(false);
  const lastPos = useRef<{ x: number, y: number } | null>(null);

  const BLEND_MODES = [
    { value: 'normal', label: 'Normal', desc: 'New strokes are drawn on top of existing layers.' },
    { value: 'multiply', label: 'Multiply', desc: 'Darkens the layer by multiplying background and stroke colors.' },
    { value: 'screen', label: 'Screen', desc: 'Lightens the layer by screening background and stroke colors.' },
    { value: 'overlay', label: 'Overlay', desc: 'Combines Multiply and Screen. Balanced contrasts.' },
    { value: 'darken', label: 'Darken', desc: 'Keeps the darker parts of either stroke or background.' },
    { value: 'lighten', label: 'Lighten', desc: 'Keeps the lighter parts of either stroke or background.' },
  ];

  useEffect(() => {
    const saved = localStorage.getItem("lumina_palettes");
    if (saved) setPaletteLibrary(JSON.parse(saved));
  }, []);

  const undo = useCallback(() => {
    setUndoStack(currentUndoStack => {
      if (currentUndoStack.length === 0) return currentUndoStack;
      const [lastState, ...remainingUndo] = currentUndoStack;
      const canvas = layerCanvasRefs.current[lastState.layerId];
      if (canvas) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
          setRedoStack(prev => [{ layerId: lastState.layerId, data: currentState }, ...prev].slice(0, 30));
          ctx.putImageData(lastState.data, 0, 0);
          playSound('click', 0.2);
        }
      }
      return remainingUndo;
    });
  }, []);

  const redo = useCallback(() => {
    setRedoStack(currentRedoStack => {
      if (currentRedoStack.length === 0) return currentRedoStack;
      const [nextState, ...remainingRedo] = currentRedoStack;
      const canvas = layerCanvasRefs.current[nextState.layerId];
      if (canvas) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          const currentState = ctx.getImageData(0, 0, canvas.width, canvas.height);
          setUndoStack(prev => [{ layerId: nextState.layerId, data: currentState }, ...prev].slice(0, 30));
          ctx.putImageData(nextState.data, 0, 0);
          playSound('click', 0.2);
        }
      }
      return remainingRedo;
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'z'))) {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  // Update Guides Canvas
  useEffect(() => {
    const canvas = guideCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.clearRect(0, 0, w, h);
    
    if (showRulers) {
      ctx.fillStyle = "#f8fafc";
      ctx.fillRect(0, 0, w, 20);
      ctx.fillRect(0, 0, 20, h);
      
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 1;
      ctx.font = "8px sans-serif";
      ctx.fillStyle = "#64748b";
      
      for (let x = 0; x <= w; x += 50) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 10); ctx.stroke();
        if (x % 100 === 0 && x > 0) ctx.fillText(x.toString(), x + 2, 18);
      }
      for (let y = 0; y <= h; y += 50) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(10, y); ctx.stroke();
        if (y % 100 === 0 && y > 0) {
          ctx.save(); ctx.translate(18, y + 2); ctx.rotate(-Math.PI/2); ctx.fillText(y.toString(), 0, 0); ctx.restore();
        }
      }
    }

    if (!showGuides) return;

    ctx.strokeStyle = `rgba(100, 116, 139, ${guideOpacity})`;
    ctx.lineWidth = 1;

    if (guideType === 'grid') {
      for (let x = 0; x <= w; x += guideScale) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
      }
      for (let y = 0; y <= h; y += guideScale) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
      }
    } else if (guideType === 'perspective') {
      const vX = w * vanishingPoint.x;
      const vY = h * vanishingPoint.y;
      const step = (Math.PI * 2) / guideScale;
      for (let i = 0; i < Math.PI * 2; i += step) {
        ctx.beginPath();
        ctx.moveTo(vX, vY);
        ctx.lineTo(vX + Math.cos(i) * 2000, vY + Math.sin(i) * 2000);
        ctx.stroke();
      }
      ctx.strokeStyle = `rgba(59, 130, 246, ${guideOpacity * 1.5})`;
      ctx.beginPath(); ctx.moveTo(0, vY); ctx.lineTo(w, vY); ctx.stroke();
    } else if (guideType === 'thirds') {
        const tW = w / 3; const tH = h / 3;
        ctx.beginPath(); ctx.moveTo(tW, 0); ctx.lineTo(tW, h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(tW * 2, 0); ctx.lineTo(tW * 2, h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, tH); ctx.lineTo(w, tH); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, tH * 2); ctx.lineTo(w, tH * 2); ctx.stroke();
    } else if (guideType === 'golden') {
        const phi = 1.618;
        const gX = w / (1 + phi); const gY = h / (1 + phi);
        ctx.beginPath(); ctx.moveTo(gX, 0); ctx.lineTo(gX, h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(w - gX, 0); ctx.lineTo(w - gX, h); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, gY); ctx.lineTo(w, gY); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, h - gY); ctx.lineTo(w, h - gY); ctx.stroke();
    }
  }, [showGuides, guideType, guideOpacity, guideScale, showRulers, vanishingPoint]);

  const savePalette = () => {
    const name = prompt(lang.palette_name_prompt);
    if (!name) return;
    const newPalette: ColorPalette = {
      id: Date.now().toString(),
      name,
      colors: [...swatchColors]
    };
    const updated = [newPalette, ...paletteLibrary];
    setPaletteLibrary(updated);
    localStorage.setItem("lumina_palettes", JSON.stringify(updated));
    playSound('success');
  };

  const deletePalette = (id: string) => {
    const updated = paletteLibrary.filter(p => p.id !== id);
    setPaletteLibrary(updated);
    localStorage.setItem("lumina_palettes", JSON.stringify(updated));
    playSound('trash');
  };

  const loadPalette = (p: ColorPalette) => {
    setSwatchColors(p.colors);
    setShowLibrary(false);
    playSound('click');
  };

  const addColorToSwatch = (c: string) => {
    if (swatchColors.includes(c)) return;
    setSwatchColors([...swatchColors, c]);
    playSound('click');
  };

  const addLayer = () => {
    const newId = Date.now().toString();
    const newLayer: Layer = {
      id: newId,
      name: `Layer ${layers.length + 1}`,
      visible: true,
      opacity: 1,
      blendMode: 'normal'
    };
    setLayers([...layers, newLayer]);
    setActiveLayerId(newId);
    playSound('success');
  };

  const deleteLayer = (id: string) => {
    if (layers.length <= 1) return;
    const updated = layers.filter(l => l.id !== id);
    setLayers(updated);
    if (activeLayerId === id) setActiveLayerId(updated[updated.length - 1].id);
    playSound('trash');
  };

  const updateLayer = (id: string, updates: Partial<Layer>) => {
    setLayers(layers.map(l => l.id === id ? { ...l, ...updates } : l));
  };

  const getPos = (e: any, targetCanvas: HTMLCanvasElement) => {
    const rect = targetCanvas.getBoundingClientRect();
    const x = (e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0)) - rect.left;
    const y = (e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0)) - rect.top;
    return { 
      x: x * (targetCanvas.width / rect.width), 
      y: y * (targetCanvas.height / rect.height) 
    };
  };

  const drawPoint = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.fillStyle = color;
    ctx.globalCompositeOperation = globalBlendMode;
    const s = brushSize;
    if (brushTip === 'round') {
      ctx.beginPath(); ctx.arc(x, y, s / 2, 0, Math.PI * 2); ctx.fill();
    } else if (brushTip === 'square') {
      ctx.fillRect(x - s / 2, y - s / 2, s, s);
    } else if (brushTip === 'triangle') {
      ctx.beginPath(); ctx.moveTo(x, y - s / 2); ctx.lineTo(x + s / 2, y + s / 2); ctx.lineTo(x - s / 2, y + s / 2); ctx.closePath(); ctx.fill();
    } else if (brushTip === 'calligraphy') {
      ctx.save(); ctx.translate(x, y); ctx.rotate(Math.PI / 4); ctx.fillRect(-s / 6, -s, s / 3, s * 2); ctx.restore();
    }
  };

  const handleStart = (e: any) => {
    const canvas = layerCanvasRefs.current[activeLayerId];
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    
    startImageData.current = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const pos = getPos(e, canvas);
    if (tool === 'fill') {
      setUndoStack(prev => [{ layerId: activeLayerId, data: startImageData.current! }, ...prev].slice(0, 30));
      setRedoStack([]);
      floodFill(ctx, pos.x, pos.y, hexToRgb(color));
      playSound('success', 0.2); 
      startImageData.current = null;
      return;
    }
    setIsDrawing(true); lastPos.current = pos;
    drawPoint(ctx, lastPos.current.x, lastPos.current.y);
  };

  const draw = (e: any) => {
    if (!isDrawing || tool !== 'brush') return;
    const canvas = layerCanvasRefs.current[activeLayerId];
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;
    
    const currentPos = getPos(e, canvas);
    if (lastPos.current) {
      const dist = Math.sqrt(Math.pow(currentPos.x - lastPos.current.x, 2) + Math.pow(currentPos.y - lastPos.current.y, 2));
      const angle = Math.atan2(currentPos.y - lastPos.current.y, currentPos.x - lastPos.current.x);
      const steps = Math.max(1, dist / (brushSize / 4));
      for (let i = 0; i < steps; i++) {
        const x = lastPos.current.x + Math.cos(angle) * (i / steps) * dist;
        const y = lastPos.current.y + Math.sin(angle) * (i / steps) * dist;
        drawPoint(ctx, x, y);
      }
    } else {
      drawPoint(ctx, currentPos.x, currentPos.y);
    }
    lastPos.current = currentPos;
    if (Math.random() > 0.9) playSound('brush', 0.1);
  };

  const handleEnd = () => { 
    if (isDrawing && startImageData.current) {
      setUndoStack(prev => [{ layerId: activeLayerId, data: startImageData.current! }, ...prev].slice(0, 30));
      setRedoStack([]);
    }
    setIsDrawing(false); 
    lastPos.current = null; 
    startImageData.current = null;
  };

  return (
    <div className="h-full flex flex-col bg-slate-100 overflow-hidden relative">
      <div className="p-4 bg-white border-b flex flex-col gap-4 shrink-0 shadow-sm z-50">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 overflow-x-auto no-scrollbar max-w-[150px]">
            {swatchColors.map((c, i) => (
              <button key={i} onClick={() => { setColor(c); playSound('click', 0.2); }} className={`w-6 h-6 rounded-full border-2 shrink-0 transition-transform ${color === c ? 'border-slate-800 scale-125' : 'border-transparent hover:scale-110'}`} style={{ backgroundColor: c }} />
            ))}
          </div>
          <div className="flex gap-1 items-center">
            <button onClick={undo} disabled={undoStack.length === 0} className={`p-2 rounded-xl transition-all ${undoStack.length > 0 ? 'text-indigo-600 hover:bg-indigo-50' : 'text-slate-300 pointer-events-none'}`} title={lang.undo}><Undo size={18}/></button>
            <button onClick={redo} disabled={redoStack.length === 0} className={`p-2 rounded-xl transition-all ${redoStack.length > 0 ? 'text-indigo-600 hover:bg-indigo-50' : 'text-slate-300 pointer-events-none'}`} title={lang.redo}><Redo size={18}/></button>
            <div className="w-px h-4 bg-slate-100 mx-1" />
            <button onClick={() => colorInputRef.current?.click()} className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-xl" title={lang.add_color_swatch}><Pipette size={18}/></button>
            <input type="color" ref={colorInputRef} className="hidden" value={color} onChange={(e) => { setColor(e.target.value); addColorToSwatch(e.target.value); }} />
            <button onClick={() => setShowLibrary(!showLibrary)} className={`p-2 rounded-xl transition-all ${showLibrary ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`} title={lang.palette_manager}><Library size={18}/></button>
            <button onClick={() => setShowLayersPanel(!showLayersPanel)} className={`p-2 rounded-xl transition-all ${showLayersPanel ? 'bg-amber-500 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`} title={lang.layers}><LayersIcon size={18}/></button>
            <button onClick={() => setShowGuideSettings(!showGuideSettings)} className={`p-2 rounded-xl transition-all ${showGuides || showRulers ? 'bg-teal-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`} title={lang.guides}><Grid3x3 size={18}/></button>
            <button onClick={() => { 
                const snapshots: HistoryState[] = layers.map(l => ({
                    layerId: l.id,
                    data: layerCanvasRefs.current[l.id]!.getContext('2d', { willReadFrequently: true })!.getImageData(0,0,800,1200)
                }));
                setUndoStack(prev => [...snapshots, ...prev].slice(0, 30));
                setRedoStack([]);
                layers.forEach(l => {
                    const ctx = layerCanvasRefs.current[l.id]?.getContext('2d', { willReadFrequently: true });
                    ctx?.clearRect(0,0,800,1200);
                });
                playSound('trash'); 
            }} className="p-2 text-slate-400 hover:text-rose-500" title="Clear All"><Trash2 size={18}/></button>
          </div>
        </div>

        {showLibrary && (
          <div className="bg-white border rounded-3xl p-4 shadow-xl space-y-4 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{lang.palettes_lib}</h4>
              <button onClick={savePalette} className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 text-white rounded-xl text-[9px] font-black uppercase shadow-lg hover:scale-105 active:scale-95 transition-all"><Plus size={14}/> {lang.save_palette}</button>
            </div>
            <div className="grid grid-cols-1 gap-2 max-h-[150px] overflow-y-auto no-scrollbar">
              {paletteLibrary.map(p => (
                <div key={p.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-2xl border border-transparent hover:border-indigo-200 group transition-all">
                  <button onClick={() => loadPalette(p)} className="flex-1 flex items-center gap-3 text-left">
                    <div className="flex -space-x-1">{p.colors.slice(0, 4).map((c, i) => (<div key={i} className="w-3 h-3 rounded-full border border-white" style={{ backgroundColor: c }} />))}</div>
                    <span className="text-[10px] font-bold text-slate-700">{p.name}</span>
                  </button>
                  <button onClick={() => deletePalette(p.id)} className="p-1 text-slate-200 hover:text-rose-500"><Trash2 size={14}/></button>
                </div>
              ))}
              {paletteLibrary.length === 0 && <p className="text-[10px] font-bold text-slate-300 italic text-center py-4">No saved palettes yet.</p>}
            </div>
          </div>
        )}

        {showLayersPanel && (
           <div className="bg-white border rounded-3xl p-5 shadow-xl space-y-5 animate-in fade-in slide-in-from-top-2 max-h-[350px] overflow-y-auto no-scrollbar">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{lang.layers}</h4>
                <button onClick={addLayer} className="flex items-center gap-2 px-3 py-1.5 bg-amber-500 text-white rounded-xl text-[9px] font-black uppercase shadow-lg hover:scale-105 transition-all"><Plus size={14}/> {lang.add_layer}</button>
              </div>
              <div className="space-y-3">
                 {[...layers].reverse().map(l => (
                   <div key={l.id} onClick={() => { setActiveLayerId(l.id); playSound('click'); }} className={`p-3 rounded-2xl border-2 transition-all cursor-pointer ${activeLayerId === l.id ? 'bg-amber-50 border-amber-500' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3 overflow-hidden">
                          <button onClick={(e) => { e.stopPropagation(); updateLayer(l.id, { visible: !l.visible }); }} className={`p-1 ${l.visible ? 'text-amber-500' : 'text-slate-300'}`}>
                            {l.visible ? <Eye size={16}/> : <EyeOff size={16}/>}
                          </button>
                          <span className={`text-[10px] font-black uppercase tracking-tight truncate ${activeLayerId === l.id ? 'text-amber-800' : 'text-slate-500'}`}>{l.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button onClick={(e) => { e.stopPropagation(); deleteLayer(l.id); }} className="p-1 text-slate-300 hover:text-rose-500"><Trash2 size={14}/></button>
                        </div>
                      </div>
                      {activeLayerId === l.id && (
                        <div className="space-y-3 pt-2 border-t border-amber-100/50 animate-in fade-in">
                          <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center text-[8px] font-black uppercase text-amber-600">
                              <span>{lang.layer_opacity}</span>
                              <span>{Math.round(l.opacity * 100)}%</span>
                            </div>
                            <input type="range" min="0" max="1" step="0.05" value={l.opacity} onClick={e => e.stopPropagation()} onChange={e => updateLayer(l.id, { opacity: parseFloat(e.target.value) })} className="w-full h-1 bg-amber-100 accent-amber-500 appearance-none rounded" />
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-[8px] font-black uppercase text-amber-600">{lang.blend_mode}</span>
                            <select value={l.blendMode} onClick={e => e.stopPropagation()} onChange={e => updateLayer(l.id, { blendMode: e.target.value })} className="w-full bg-white border border-amber-100 rounded-lg px-2 py-1 text-[9px] font-bold text-amber-800 outline-none">
                              {BLEND_MODES.map(m => (<option key={m.value} value={m.value}>{m.label}</option>))}
                            </select>
                          </div>
                        </div>
                      )}
                   </div>
                 ))}
              </div>
           </div>
        )}

        {showGuideSettings && (
           <div className="bg-white border rounded-3xl p-5 shadow-xl space-y-5 animate-in fade-in slide-in-from-top-2 overflow-y-auto max-h-[300px] no-scrollbar">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">{lang.guide_settings}</h4>
                <button onClick={() => setShowGuideSettings(false)} className="p-1"><X size={14}/></button>
              </div>
              <div className="flex flex-col gap-4">
                 <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => { setShowGuides(!showGuides); playSound('click'); }} className={`py-2 rounded-xl border-2 transition-all font-black uppercase text-[9px] ${showGuides ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'bg-white border-slate-100 text-slate-400'}`}>
                        {showGuides ? 'Guides On' : 'Guides Off'}
                    </button>
                    <button onClick={() => { setShowRulers(!showRulers); playSound('click'); }} className={`py-2 rounded-xl border-2 transition-all font-black uppercase text-[9px] ${showRulers ? 'bg-teal-50 border-teal-600 text-teal-700' : 'bg-white border-slate-100 text-slate-400'}`}>
                        {lang.guide_rulers}
                    </button>
                 </div>
                 
                 <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase text-slate-400">{lang.theme_label}</label>
                    <select value={guideType} onChange={e => setGuideType(e.target.value as any)} className="w-full bg-slate-50 rounded-xl px-3 py-2 text-[9px] font-black uppercase text-slate-600 outline-none border border-slate-100">
                        <option value="grid">{lang.guide_grid}</option>
                        <option value="perspective">{lang.perspective}</option>
                        <option value="thirds">{lang.guide_thirds}</option>
                        <option value="golden">{lang.guide_golden}</option>
                    </select>
                 </div>

                 {guideType === 'perspective' && (
                    <div className="space-y-2">
                        <label className="text-[8px] font-black uppercase text-slate-400">{lang.guide_vanishing}</label>
                        <div className="grid grid-cols-2 gap-4">
                           <input type="range" min="0" max="1" step="0.01" value={vanishingPoint.x} onChange={e => setVanishingPoint({...vanishingPoint, x: parseFloat(e.target.value)})} className="h-1 bg-slate-100 accent-blue-600 appearance-none rounded" />
                           <input type="range" min="0" max="1" step="0.01" value={vanishingPoint.y} onChange={e => setVanishingPoint({...vanishingPoint, y: parseFloat(e.target.value)})} className="h-1 bg-slate-100 accent-blue-600 appearance-none rounded" />
                        </div>
                    </div>
                 )}

                 <div className="space-y-4">
                    <div className="space-y-1">
                        <div className="flex justify-between text-[8px] font-black uppercase text-slate-400"><span>{lang.grid_size} / Density</span><span>{guideScale}</span></div>
                        <input type="range" min="10" max="100" value={guideScale} onChange={e => setGuideScale(parseInt(e.target.value))} className="w-full h-1 bg-slate-100 accent-indigo-600 appearance-none rounded" />
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-[8px] font-black uppercase text-slate-400"><span>{lang.guide_opacity}</span><span>{Math.round(guideOpacity * 100)}%</span></div>
                        <input type="range" min="0" max="1" step="0.05" value={guideOpacity} onChange={e => setGuideOpacity(parseFloat(e.target.value))} className="w-full h-1 bg-slate-100 accent-indigo-600 appearance-none rounded" />
                    </div>
                 </div>
              </div>
           </div>
        )}

        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 justify-between bg-slate-50 p-2 rounded-2xl border border-slate-100">
                <div className="flex gap-1 bg-white p-1 rounded-xl shadow-inner">
                    <button onClick={() => { setTool('brush'); playSound('click'); }} className={`p-2 rounded-lg transition-all ${tool === 'brush' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}><Pencil size={18} /></button>
                    <button onClick={() => { setTool('fill'); playSound('click'); }} className={`p-2 rounded-lg transition-all ${tool === 'fill' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-50'}`}><PaintBucket size={18} /></button>
                </div>
                <div className="flex-1 flex items-center gap-2">
                    <select value={globalBlendMode} onChange={(e) => setGlobalBlendMode(e.target.value as any)} className="flex-1 bg-white border border-slate-200 rounded-xl px-2 py-1.5 text-[10px] font-black uppercase text-slate-600 outline-none cursor-pointer">
                        {BLEND_MODES.map(m => (<option key={m.value} value={m.value as GlobalCompositeOperation}>{m.label}</option>))}
                    </select>
                    <button onClick={() => setShowBlendInfo(!showBlendInfo)} className={`p-2 rounded-xl ${showBlendInfo ? 'bg-indigo-100 text-indigo-600' : 'bg-white text-slate-400'}`}><Info size={16} /></button>
                </div>
            </div>

            {showBlendInfo && (
                <div className="bg-indigo-900 text-white p-4 rounded-2xl shadow-xl space-y-3 animate-in fade-in max-h-[150px] overflow-y-auto no-scrollbar">
                    {BLEND_MODES.map(m => (<div key={m.value} className="space-y-1"><p className="text-[9px] font-black uppercase text-indigo-200">{m.label}</p><p className="text-[9px] font-medium opacity-80">{m.desc}</p></div>))}
                </div>
            )}

            <div className="flex items-center gap-4 justify-between bg-slate-50 p-2 rounded-2xl border border-slate-100">
                {tool === 'brush' && (
                    <div className="flex gap-1.5 bg-white p-1 rounded-xl shadow-inner">
                        <button onClick={() => setBrushTip('round')} className={`p-2 rounded-lg ${brushTip === 'round' ? 'bg-teal-600 text-white' : 'text-slate-400'}`}><CircleIcon size={14} /></button>
                        <button onClick={() => setBrushTip('square')} className={`p-2 rounded-lg ${brushTip === 'square' ? 'bg-teal-600 text-white' : 'text-slate-400'}`}><Square size={14} /></button>
                        <button onClick={() => setBrushTip('triangle')} className={`p-2 rounded-lg ${brushTip === 'triangle' ? 'bg-teal-600 text-white' : 'text-slate-400'}`}><Triangle size={14} /></button>
                        <button onClick={() => setBrushTip('calligraphy')} className={`p-2 rounded-lg ${brushTip === 'calligraphy' ? 'bg-teal-600 text-white' : 'text-slate-400'}`}><PencilLine size={14} /></button>
                    </div>
                )}
                <div className="flex-1 flex items-center gap-3 px-2">
                    <span className="text-[10px] font-black uppercase text-slate-400 shrink-0">{lang.brush_size}</span>
                    <input type="range" min="1" max="50" value={brushSize} onChange={e => setBrushSize(parseInt(e.target.value))} className="flex-1 h-1 bg-slate-200 accent-teal-600 appearance-none rounded-lg cursor-pointer" />
                </div>
            </div>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-hidden relative">
        <canvas ref={guideCanvasRef} width={800} height={1200} className="absolute inset-4 w-[calc(100%-2rem)] h-[calc(100%-2rem)] bg-white rounded-3xl pointer-events-none z-0" />
        <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-inner bg-white">
            {layers.map((l, i) => (
                <canvas 
                    key={l.id}
                    ref={(el) => (layerCanvasRefs.current[l.id] = el)}
                    width={800} height={1200}
                    className={`absolute inset-0 w-full h-full cursor-crosshair touch-none ${!l.visible ? 'pointer-events-none' : ''}`}
                    style={{ 
                        opacity: l.opacity, 
                        mixBlendMode: l.blendMode as any,
                        zIndex: i + 1,
                        pointerEvents: activeLayerId === l.id ? 'auto' : 'none',
                        visibility: l.visible ? 'visible' : 'hidden'
                    }}
                    onMouseDown={handleStart} onMouseUp={handleEnd} onMouseMove={draw} onMouseLeave={handleEnd}
                    onTouchStart={handleStart} onTouchEnd={handleEnd} onTouchMove={draw}
                />
            ))}
        </div>
      </div>
    </div>
  );
};

// --- Comedy Corner Component ---
const ComedyCorner = ({ user }: any) => {
  const [joke, setJoke] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState("Puns");
  const [searchTopic, setSearchTopic] = useState("");
  const lang = TRANSLATIONS[user.language || 'en'];

  const THEMES = [
    { name: "Puns", icon: Zap, color: "bg-amber-100 text-amber-700" },
    { name: "Dad Jokes", icon: Smile, color: "bg-blue-100 text-blue-700" },
    { name: "Tech Humor", icon: Monitor, color: "bg-indigo-100 text-indigo-700" },
    { name: "Animal Jokes", icon: Bird, color: "bg-emerald-100 text-emerald-700" },
    { name: "Mindful Jokes", icon: Sparkles, color: "bg-purple-100 text-purple-700" },
    { name: "One-Liners", icon: MessageSquarePlus, color: "bg-rose-100 text-rose-700" },
    { name: "Foodie Fun", icon: Utensils, color: "bg-orange-100 text-orange-700" },
    { name: "Science Humor", icon: BrainCircuit, color: "bg-cyan-100 text-cyan-700" },
    { name: "Space Smiles", icon: Rocket, color: "bg-slate-100 text-slate-700" },
    { name: "Office Life", icon: Briefcase, color: "bg-gray-100 text-gray-700" },
    { name: "Nature Giggles", icon: Trees, color: "bg-green-100 text-green-700" },
    { name: "Bookish Wit", icon: BookHeart, color: "bg-red-100 text-red-700" },
    { name: "Music Puns", icon: Music2, color: "bg-pink-100 text-pink-700" },
    { name: "History Fun", icon: ScrollText, color: "bg-yellow-100 text-yellow-700" },
    { name: "Art Jokes", icon: PaletteIcon, color: "bg-teal-100 text-teal-700" },
    { name: "Travel Laughs", icon: Globe, color: "bg-sky-100 text-sky-700" }
  ];

  const fetchJoke = async (themeOverride?: string) => {
    const activeTheme = themeOverride || selectedTheme;
    setLoading(true);
    try {
      let prompt = `Tell me a short, lighthearted ${activeTheme} joke or pun in ${user.language} for someone feeling ${user.mood}.`;
      if (searchTopic.trim()) {
        prompt = `Tell me a short, funny ${activeTheme} joke specifically about "${searchTopic}" in ${user.language} for someone feeling ${user.mood}.`;
      }
      const r = await ai.models.generateContent({ model: AI_MODEL, contents: prompt });
      setJoke(r.text || "");
      playSound('success', 0.2);
    } catch (e) {
      setJoke("Why don't scientists trust atoms? Because they make up everything!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJoke(); }, []);

  return (
    <div className="h-full flex flex-col bg-amber-50">
      <div className="p-6 space-y-6 overflow-y-auto no-scrollbar pb-24">
        <div className="bg-white p-2 rounded-3xl shadow-sm border border-amber-100 flex gap-2">
          <input value={searchTopic} onChange={e => setSearchTopic(e.target.value)} placeholder={lang.search_joke || "Search for a joke topic..."} className="flex-1 px-4 py-2 bg-transparent outline-none text-sm font-bold text-slate-700" onKeyDown={e => e.key === 'Enter' && fetchJoke()} />
          <button onClick={() => fetchJoke()} className="p-3 bg-amber-500 text-white rounded-2 shadow-md active:scale-90 transition-all"><Search size={20} /></button>
        </div>
        <div className="space-y-3">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{lang.explore_themes || "Humor Styles"}</p>
          <div className="flex flex-wrap gap-2">
            {THEMES.map(t => (
              <button key={t.name} onClick={() => { setSelectedTheme(t.name); fetchJoke(t.name); playSound('click'); }} className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-[10px] font-black uppercase transition-all border ${selectedTheme === t.name ? 'bg-amber-600 text-white border-amber-600 shadow-lg scale-105' : 'bg-white text-amber-700 border-amber-100 hover:border-amber-300'}`}>
                <t.icon size={14} />{t.name}
              </button>
            ))}
          </div>
        </div>
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-amber-100 relative min-h-[300px] flex flex-col items-center justify-center text-center">
          <div className="absolute -top-4 -right-4 w-12 h-12 bg-amber-500 text-white rounded-2xl shadow-lg flex items-center justify-center rotate-12"><Laugh size={24} /></div>
          {loading ? (
            <div className="flex flex-col items-center gap-4 animate-pulse"><Loader2 className="animate-spin text-amber-500" size={48} /><p className="text-[10px] font-black text-amber-300 uppercase tracking-widest">Writing comedy...</p></div>
          ) : (
            <div className="fade-in text-center w-full">
              <p className="text-xl font-bold text-slate-800 leading-relaxed italic mb-10">"{joke}"</p>
              <div className="flex gap-3 w-full">
                <button onClick={() => { fetchJoke(); playSound('click'); }} className="flex-1 py-4 bg-amber-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"><RefreshCcw size={16} />{lang.another_one || "Another One"}</button>
                <button onClick={() => { setSearchTopic(""); setSelectedTheme("Puns"); fetchJoke("Puns"); playSound('click'); }} className="p-4 bg-amber-50 text-amber-500 rounded-2xl hover:bg-amber-100 transition-all active:scale-95" title={lang.reset_btn || "Reset"}><RotateCcw size={18} /></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// --- Playlist Generator Component ---
const PlaylistGenerator = ({ lang, user }: any) => {
    const [curatorTab, setCuratorTab] = useState<'CURATOR' | 'LIBRARY'>('CURATOR');
    const [vibe, setVibe] = useState("");
    const [playlist, setPlaylist] = useState<SongSuggestion[]>([]);
    const [userPlaylist, setUserPlaylist] = useState<SongSuggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [lastPlayedIndex, setLastPlayedIndex] = useState<number | null>(null);
    const [isTherapyMode, setIsTherapyMode] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showAddTrack, setShowAddTrack] = useState(false);
    const [newTrack, setNewTrack] = useState({ title: "", artist: "" });

    const QUICK_VIBES = [
      { label: "Deep Chill", icon: Moon, color: "bg-white" },
      { label: "Music Therapy", icon: HeartPulse, color: "bg-rose-50 border-rose-200 text-rose-600" },
      { label: "Focus Work", icon: Target, color: "bg-white" },
      { label: "High Energy", icon: Flame, color: "bg-white" },
      { label: "Rainy Day", icon: CloudRain, color: "bg-white" }
    ];

    useEffect(() => {
        const stored = localStorage.getItem("lumina_user_playlist");
        if (stored) setUserPlaylist(JSON.parse(stored));
    }, []);

    useEffect(() => {
        let interval: any;
        if (isPlaying) {
            interval = setInterval(() => {
                setProgress(p => { if (p >= 100) return 0; return p + 0.5; });
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    const activeList = curatorTab === 'CURATOR' ? playlist : userPlaylist;

    const generate = async (vibeOverride?: string) => {
        const activeVibe = vibeOverride || vibe || "Something uplifting";
        const therapy = activeVibe === "Music Therapy";
        setIsTherapyMode(therapy); setLoading(true); setLastPlayedIndex(null); setIsPlaying(false); setProgress(0);
        try {
            let prompt = `Based on the vibe "${activeVibe}" and user current mood "${user.mood}", suggest 5 real, popular songs (title, artist, year) that would be uplifting and fitting. Provide response as JSON array of objects with title, artist, year keys. Language: ${user.language}`;
            if (therapy) {
                prompt = `You are a music therapist. Curate a 5-song playlist for ${user.mood} in ${user.language}. Use Iso-principle. Return JSON array: [{title, artist, year, therapyInfo}]`;
            }
            const response = await ai.models.generateContent({
                model: AI_MODEL, contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: { title: { type: Type.STRING }, artist: { type: Type.STRING }, year: { type: Type.STRING }, therapyInfo: { type: Type.STRING } },
                            required: ["title", "artist", "year"]
                        }
                    }
                }
            });
            const data = JSON.parse(response.text || "[]");
            setPlaylist(data); playSound('success');
        } catch (e) {
            if (handleAIError(e)) {
              setPlaylist(therapy ? FALLBACK_PLAYLISTS.therapy : FALLBACK_PLAYLISTS.default);
            }
        } finally { setLoading(false); }
    };

    const handleAddTrack = () => {
        if (!newTrack.title.trim() || !newTrack.artist.trim()) return;
        const updated = [...userPlaylist, { ...newTrack, year: new Date().getFullYear().toString() }];
        setUserPlaylist(updated); localStorage.setItem("lumina_user_playlist", JSON.stringify(updated));
        setNewTrack({ title: "", artist: "" }); setShowAddTrack(false); playSound('success');
    };

    const removeTrack = (index: number) => {
        const updated = userPlaylist.filter((_, i) => i !== index);
        setUserPlaylist(updated); localStorage.setItem("lumina_user_playlist", JSON.stringify(updated));
        if (lastPlayedIndex === index) { setLastPlayedIndex(null); setIsPlaying(false); }
        playSound('trash');
    };

    const handleQuickVibe = (v: string) => { setVibe(v); generate(v); playSound('click'); };
    const handlePlaySong = (index: number) => { setLastPlayedIndex(index); setIsPlaying(true); setProgress(0); playSound('success', 0.2); };
    const handleStopMusic = () => { setIsPlaying(false); setLastPlayedIndex(null); setProgress(0); playSound('click'); };

    const handleSkip = (dir: 'next' | 'prev') => {
      if (activeList.length === 0) return;
      const current = lastPlayedIndex ?? -1;
      let next = dir === 'next' ? current + 1 : current - 1;
      if (next >= activeList.length) next = 0;
      if (next < 0) next = activeList.length - 1;
      handlePlaySong(next);
    };

    const playAll = () => { if (activeList.length === 0) return; handlePlaySong(0); playSound('success'); };

    const getSongItemColor = (i: number) => {
      if (lastPlayedIndex === i) {
        return isTherapyMode ? 'bg-rose-500' : 'bg-indigo-600';
      }
      if (curatorTab === 'LIBRARY') {
        return 'bg-gradient-to-br from-teal-400 to-emerald-400';
      }
      return isTherapyMode ? 'bg-gradient-to-br from-rose-400 to-amber-300' : 'bg-gradient-to-br from-indigo-500 to-purple-500';
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 overflow-hidden relative">
            <div className="bg-white border-b flex px-6 shrink-0">
                <button onClick={() => { setCuratorTab('CURATOR'); setLastPlayedIndex(null); setIsPlaying(false); playSound('click'); }} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] border-b-2 transition-all ${curatorTab === 'CURATOR' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-400'}`}>{lang.curator_tab}</button>
                <button onClick={() => { setCuratorTab('LIBRARY'); setLastPlayedIndex(null); setIsPlaying(false); playSound('click'); }} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] border-b-2 transition-all ${curatorTab === 'LIBRARY' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-400'}`}>{lang.library_tab}</button>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 pb-32">
                {curatorTab === 'CURATOR' ? (
                  <div className="space-y-8 fade-in">
                      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                          <div className="flex items-center gap-2 mb-6">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isTherapyMode ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>
                              {isTherapyMode ? <HeartPulse size={20} /> : <ListMusic size={20} />}
                            </div>
                            <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">{isTherapyMode ? lang.music_therapy : lang.ai_playlist}</h3>
                          </div>
                          <div className="space-y-6">
                            <div className="relative group">
                                <input value={vibe} onChange={e => setVibe(e.target.value)} placeholder={lang.playlist_hint} className="w-full p-5 bg-slate-50 rounded-[1.5rem] font-bold text-sm outline-none border-2 border-transparent focus:border-indigo-100 transition-all" onKeyDown={e => e.key === 'Enter' && generate()} />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">{vibe && <button onClick={() => setVibe("")} className="p-1 text-slate-300"><X size={16}/></button>}</div>
                            </div>
                            <div className="space-y-3">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{lang.quick_vibe}</p>
                              <div className="flex flex-wrap gap-2">
                                {QUICK_VIBES.map((v, i) => (<button key={i} onClick={() => handleQuickVibe(v.label)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all border ${vibe === v.label ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : `${v.color} border-slate-100 hover:border-indigo-200`}`}><v.icon size={12} />{v.label}</button>))}
                              </div>
                            </div>
                            <button onClick={() => generate()} disabled={loading} className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3 ${isTherapyMode ? 'bg-rose-500 text-white shadow-rose-100' : 'bg-indigo-600 text-white shadow-indigo-100'}`}>{loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}{lang.generate_playlist}</button>
                          </div>
                      </div>
                  </div>
                ) : (
                  <div className="space-y-8 fade-in">
                      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2"><div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center"><Library size={20} /></div><h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">{lang.my_library}</h3></div>
                            <button onClick={() => setShowAddTrack(!showAddTrack)} className={`p-2 rounded-xl ${showAddTrack ? 'bg-rose-50 text-rose-500' : 'bg-teal-50 text-teal-600'}`}>{showAddTrack ? <X size={20} /> : <Plus size={20} />}</button>
                        </div>
                        {showAddTrack && (
                            <div className="space-y-4 mb-2 slide-in-from-top-4">
                                <input value={newTrack.title} onChange={e => setNewTrack(prev => ({...prev, title: e.target.value}))} placeholder={lang.track_title} className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none" />
                                <input value={newTrack.artist} onChange={e => setNewTrack(prev => ({...prev, artist: e.target.value}))} placeholder={lang.track_artist} className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none" />
                                <button onClick={handleAddTrack} className="w-full py-4 bg-teal-600 text-white rounded-2xl font-black uppercase text-[10px] shadow-lg active:scale-95">{lang.add_track}</button>
                            </div>
                        )}
                      </div>
                  </div>
                )}
                {loading ? <div className="flex flex-col items-center justify-center py-20"><Disc size={64} className="text-indigo-200 animate-spin-slow" /><p className="text-indigo-400 font-black uppercase text-[10px] tracking-[0.3em] mt-4">{lang.gen_playlist_loading}</p></div> : activeList.length > 0 && (
                    <div className="mt-8 space-y-4 fade-in">
                        <div className="flex items-center justify-between mb-4 ml-1">
                          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{lang.songs_found}</h3>
                          <div className="flex gap-2">
                            <button onClick={playAll} className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase shadow-lg transition-all flex items-center gap-2 ${curatorTab === 'LIBRARY' ? 'bg-teal-600 text-white' : (isTherapyMode ? 'bg-rose-500 text-white' : 'bg-indigo-600 text-white')}`}><Play size={10} fill="currentColor" /> {lang.play_all}</button>
                            <button onClick={handleStopMusic} className="px-4 py-1.5 rounded-full text-[9px] font-black uppercase shadow-lg bg-slate-100 text-slate-500 hover:text-rose-500 flex items-center gap-2"><Square size={10} fill="currentColor" /> {lang.stop_all}</button>
                          </div>
                        </div>
                        {activeList.map((song, i) => (
                            <div key={i} className={`w-full bg-white p-5 rounded-[2.5rem] shadow-sm border transition-all flex flex-col gap-4 ${lastPlayedIndex === i ? 'border-indigo-200 ring-2 ring-indigo-50 shadow-md' : 'border-slate-100 hover:shadow-xl'}`}>
                                <div className="flex items-center gap-5">
                                    <button onClick={() => handlePlaySong(i)} className={`relative w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-white shadow-lg overflow-hidden shrink-0 ${getSongItemColor(i)}`}>
                                        {lastPlayedIndex === i ? <Volume2 size={32} className="animate-pulse" /> : <Play size={28} fill="white" />}
                                    </button>
                                    <div className="flex-1 min-w-0" onClick={() => handlePlaySong(i)}>
                                        <h4 className={`font-black leading-tight truncate text-base ${lastPlayedIndex === i ? 'text-indigo-600' : 'text-slate-800'}`}>{song.title}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1 truncate">{song.artist} • {song.year}</p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button onClick={() => handlePlaySong(i)} className={`w-10 h-10 rounded-full flex items-center justify-center ${lastPlayedIndex === i ? 'bg-rose-100 text-rose-600' : 'bg-slate-50 text-slate-300'}`}>{lastPlayedIndex === i ? <Volume2 size={18} /> : <Play size={18} fill="currentColor" className="ml-0.5" />}</button>
                                        {curatorTab === 'LIBRARY' && (<button onClick={() => removeTrack(i)} className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 text-slate-300 hover:text-rose-500"><Trash2 size={16} /></button>)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {activeList.length > 0 && lastPlayedIndex !== null && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-slate-100 z-50 animate-in slide-in-from-bottom">
                <div className="w-full bg-slate-100 h-1 rounded-full mb-3 overflow-hidden"><div className={`h-full transition-all duration-300 ${curatorTab === 'LIBRARY' ? 'bg-teal-600' : 'bg-indigo-600'}`} style={{ width: `${progress}%` }} /></div>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg shrink-0 ${curatorTab === 'LIBRARY' ? 'bg-teal-600' : (isTherapyMode ? 'bg-rose-500' : 'bg-indigo-600')}`}><div className="flex items-end gap-0.5 h-6">{[1, 2, 3, 4].map(i => (<div key={i} className={`w-1 bg-white rounded-full ${isPlaying ? 'animate-bounce' : 'h-1'}`} style={{ height: isPlaying ? `${Math.random() * 80 + 20}%` : '4px', animationDelay: `${i * 0.1}s` }} />))}</div></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-800 truncate leading-tight">{activeList[lastPlayedIndex].title}</p>
                    <p className="text-[9px] font-bold text-slate-500 truncate uppercase tracking-tighter">{activeList[lastPlayedIndex].artist}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => handleSkip('prev')} className="p-2 text-slate-400 hover:text-indigo-600"><SkipBack size={18} fill="currentColor" /></button>
                    <button onClick={() => { setIsPlaying(!isPlaying); playSound('click'); }} className={`p-3 rounded-full text-white shadow-lg ${curatorTab === 'LIBRARY' ? 'bg-teal-600' : (isTherapyMode ? 'bg-rose-500' : 'bg-indigo-600')}`}>{isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" className="ml-0.5" />}</button>
                    <button onClick={handleStopMusic} className="p-3 text-slate-300 hover:text-rose-500"><Square size={18} fill="currentColor" /></button>
                    <button onClick={() => handleSkip('next')} className="p-2 text-slate-400 hover:text-indigo-600"><SkipForward size={18} fill="currentColor" /></button>
                  </div>
                </div>
              </div>
            )}
        </div>
    );
};

const BackgroundMusicPlayer = ({ user, lang }: any) => {
    const [selected, setSelected] = useState<string>('none');
    const [volume, setVolume] = useState(0.4);
    const [customPrompt, setCustomPrompt] = useState("");
    const [generating, setGenerating] = useState(false);
    const [aiMelody, setAiMelody] = useState<{notes: string[], durations: number[]} | null>(null);
    const stopRef = useRef<() => void>(() => {});

    const playProcedural = (type: string) => {
        stopRef.current(); if (type === 'none') return;
        if (!globalAudioCtx) globalAudioCtx = new AudioContext();
        const ctx = globalAudioCtx; if (ctx.state === 'suspended') ctx.resume();
        const masterGain = ctx.createGain(); masterGain.gain.setValueAtTime(volume, ctx.currentTime); masterGain.connect(ctx.destination);
        let isActive = true;
        if (type === 'zen_piano') {
            const notes = ['C4', 'E4', 'G4', 'B4', 'D5', 'G4']; let i = 0;
            const playNext = () => {
                if (!isActive) return;
                const osc = ctx.createOscillator(); const g = ctx.createGain(); osc.type = 'triangle'; osc.frequency.setValueAtTime(noteToFreq(notes[i % notes.length]), ctx.currentTime);
                g.gain.setValueAtTime(0, ctx.currentTime); g.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.1); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);
                osc.connect(g); g.connect(masterGain); osc.start(); osc.stop(ctx.currentTime + 2.1); i++;
                setTimeout(playNext, 1500 + Math.random() * 1000);
            };
            playNext();
        } else if (type === 'soft_synth') {
            const lfo = ctx.createOscillator(); lfo.frequency.value = 0.1; const lfoGain = ctx.createGain(); lfoGain.gain.value = 50; lfo.start();
            const osc = ctx.createOscillator(); osc.type = 'sine'; osc.frequency.value = 220; lfo.connect(lfoGain); lfoGain.connect(osc.frequency); osc.connect(masterGain); osc.start();
        } else if (type === 'space_ambient') {
            const createPad = (freq: number) => { const osc = ctx.createOscillator(); const g = ctx.createGain(); osc.type = 'sine'; osc.frequency.value = freq; g.gain.value = 0.05; osc.connect(g); g.connect(masterGain); osc.start(); return { osc, g }; };
            [110, 165, 220].forEach(f => createPad(f));
        } else if (type === 'ai_custom' && aiMelody) {
            let i = 0;
            const playNext = () => {
                if (!isActive) return;
                const note = aiMelody.notes[i % aiMelody.notes.length]; const dur = aiMelody.durations[i % aiMelody.durations.length];
                const osc = ctx.createOscillator(); const g = ctx.createGain(); osc.type = 'sine'; osc.frequency.setValueAtTime(noteToFreq(note), ctx.currentTime);
                g.gain.setValueAtTime(0, ctx.currentTime); g.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05); g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
                osc.connect(g); g.connect(masterGain); osc.start(); osc.stop(ctx.currentTime + dur + 0.1); i++;
                setTimeout(playNext, dur * 1000);
            };
            playNext();
        }
        stopRef.current = () => { isActive = false; masterGain.gain.setTargetAtTime(0, ctx.currentTime, 0.5); setTimeout(() => { try { masterGain.disconnect(); } catch(e) {} }, 1000); };
    };

    const handleGenerate = async () => {
        if (!customPrompt.trim()) return; setGenerating(true);
        try {
            const r = await ai.models.generateContent({
                model: AI_MODEL, contents: `Generate a calming melody for "${customPrompt}". Return JSON: { "notes": ["C4", ...], "durations": [1.0, ...] }`,
                config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { notes: { type: Type.ARRAY, items: { type: Type.STRING } }, durations: { type: Type.ARRAY, items: { type: Type.NUMBER } } }, required: ["notes", "durations"] } }
            });
            const data = JSON.parse(r.text || "{}"); setAiMelody(data); setSelected('ai_custom'); playProcedural('ai_custom');
        } catch(e) { console.error(e); } finally { setGenerating(false); }
    };

    useEffect(() => { return () => stopRef.current(); }, []);

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3"><AudioLines className="text-indigo-600" /><h3 className="text-xs font-black uppercase tracking-widest">{lang.bg_music}</h3></div>
                <div className="flex items-center gap-3 bg-slate-100 p-2 rounded-xl"><Volume1 size={14} className="text-slate-400" /><input type="range" min="0" max="1" step="0.05" value={volume} onChange={e => setVolume(parseFloat(e.target.value))} className="w-20 h-1 bg-slate-200 accent-indigo-600" /></div>
            </div>
            <div className="grid grid-cols-2 gap-3">
                {[ { id: 'none', label: lang.none, icon: VolumeX }, { id: 'zen_piano', label: lang.zen_piano, icon: Music }, { id: 'soft_synth', label: lang.soft_synth, icon: Wind }, { id: 'space_ambient', label: lang.space_ambient, icon: Moon } ].map(opt => (
                    <button key={opt.id} onClick={() => { setSelected(opt.id); playProcedural(opt.id); playSound('click'); }} className={`p-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${selected === opt.id ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'bg-white border-slate-100 text-slate-400'}`}><opt.icon size={20} /><span className="text-[10px] font-black uppercase">{opt.label}</span></button>
                ))}
            </div>
            <div className="pt-4 border-t border-slate-100">
                <div className="flex gap-2">
                    <input value={customPrompt} onChange={e => setCustomPrompt(e.target.value)} placeholder={lang.ai_melody_hint} className="flex-1 bg-slate-50 rounded-xl p-3 text-xs font-bold outline-none" />
                    <button onClick={handleGenerate} disabled={generating || !customPrompt.trim()} className="bg-indigo-600 text-white p-3 rounded-xl shadow-lg active:scale-90 disabled:opacity-50 transition-all">{generating ? <Loader2 size={18} className="animate-spin" /> : <RefreshCcw size={18} />}</button>
                </div>
            </div>
        </div>
    );
};

const BubblePop = ({ lang }: any) => {
    const [bubbles, setBubbles] = useState<any[]>([]);
    const [score, setScore] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const spawnBubble = () => {
        if (!containerRef.current) return;
        const size = 40 + Math.random() * 40;
        setBubbles(prev => [...prev, { id: Date.now() + Math.random(), x: Math.random() * (containerRef.current!.offsetWidth - size), y: containerRef.current!.offsetHeight, size, speed: 1 + Math.random() * 3, color: `hsla(${Math.random() * 360}, 70%, 70%, 0.5)` }]);
    };
    useEffect(() => { const s = setInterval(spawnBubble, 800); const m = setInterval(() => { setBubbles(prev => prev.map(b => ({ ...b, y: b.y - b.speed })).filter(b => b.y + b.size > 0)); }, 16); return () => { clearInterval(s); clearInterval(m); }; }, []);
    const pop = (id: number) => { setBubbles(prev => prev.filter(b => b.id !== id)); setScore(s => s + 1); playSound('pop'); };
    return (
        <div ref={containerRef} className="h-full bg-sky-50 relative overflow-hidden">
            <div className="absolute top-4 left-4 z-10 font-black text-sky-800 uppercase tracking-widest bg-white/50 px-4 py-2 rounded-full border border-white/50">{lang.score}: {score}</div>
            {bubbles.map(b => (<button key={b.id} onClick={() => pop(b.id)} className="absolute rounded-full border-2 border-white/80 shadow-inner backdrop-blur-[2px] animate-in zoom-in duration-300" style={{ left: b.x, top: b.y, width: b.size, height: b.size, backgroundColor: b.color }} />))}
        </div>
    );
};

const TowerStack = ({ lang }: any) => {
    const [blocks, setBlocks] = useState<any[]>([]);
    const [currentX, setCurrentX] = useState(0);
    const [dir, setDir] = useState(1);
    const [isGameOver, setIsGameOver] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const blockWidth = 60; const blockHeight = 20;
    useEffect(() => {
        if (isGameOver) return;
        const interval = setInterval(() => {
            setCurrentX(x => { const limit = (containerRef.current?.offsetWidth || 300) - blockWidth; if (x >= limit) { setDir(-1); return limit - 1; } if (x <= 0) { setDir(1); return 1; } return x + (dir * 5); });
        }, 30);
        return () => clearInterval(interval);
    }, [dir, isGameOver]);
    const place = () => {
        if (isGameOver) return;
        const lastBlock = blocks[blocks.length - 1];
        if (lastBlock && Math.abs(currentX - lastBlock.x) > blockWidth) { setIsGameOver(true); playSound('fail'); return; }
        setBlocks(prev => [...prev, { x: currentX, y: (containerRef.current?.offsetHeight || 400) - (prev.length + 1) * blockHeight, id: Date.now() }]);
        playSound('click');
    };
    return (
        <div ref={containerRef} onClick={place} className="h-full bg-slate-900 relative overflow-hidden cursor-pointer">
            <div className="absolute top-4 left-4 z-10 font-black text-white uppercase tracking-widest">{lang.height}: {blocks.length}</div>
            {blocks.map(b => (<div key={b.id} className="absolute bg-indigo-500 border border-indigo-400 rounded-sm shadow-lg" style={{ left: b.x, top: b.y, width: blockWidth, height: blockHeight }} />))}
            {!isGameOver && (<div className="absolute bg-amber-400 border border-amber-300 rounded-sm animate-pulse" style={{ left: currentX, top: (containerRef.current?.offsetHeight || 400) - (blocks.length + 1) * blockHeight, width: blockWidth, height: blockHeight }} />)}
            {isGameOver && (<div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white z-20"><p className="text-4xl font-black mb-8 tracking-tighter">{lang.game_over}</p><button onClick={(e) => { e.stopPropagation(); setBlocks([]); setIsGameOver(false); }} className="px-10 py-4 bg-indigo-600 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl">{lang.try_again}</button></div>)}
        </div>
    );
};

const EchoGame = ({ lang }: any) => {
    const [sequence, setSequence] = useState<number[]>([]);
    const [playerSeq, setPlayerSeq] = useState<number[]>([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activePad, setActivePad] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const pads = [ { color: 'bg-rose-500', note: 'C4' }, { color: 'bg-emerald-500', note: 'E4' }, { color: 'bg-blue-500', note: 'G4' }, { color: 'bg-amber-500', note: 'B4' } ];
    const playPad = (i: number) => { setActivePad(i); playSound('click', 1); setTimeout(() => setActivePad(null), 300); };
    const start = () => { setScore(0); nextRound([Math.floor(Math.random() * 4)]); };
    const nextRound = (newSeq: number[]) => { setSequence(newSeq); setPlayerSeq([]); setIsPlaying(true); setTimeout(() => playSequence(newSeq), 1000); };
    const playSequence = async (seq: number[]) => { for (const i of seq) { playPad(i); await new Promise(r => setTimeout(r, 600)); } setIsPlaying(false); };
    const handlePad = (i: number) => {
        if (isPlaying) return; playPad(i); const nextPlayerSeq = [...playerSeq, i]; setPlayerSeq(nextPlayerSeq);
        if (sequence[nextPlayerSeq.length - 1] !== i) { playSound('fail'); setSequence([]); return; }
        if (nextPlayerSeq.length === sequence.length) { setScore(s => s + 1); playSound('success'); setTimeout(() => nextRound([...sequence, Math.floor(Math.random() * 4)]), 1000); }
    };
    return (
        <div className="h-full flex flex-col items-center justify-center bg-slate-50 p-8 relative">
            <div className="mb-12 font-black text-slate-800 text-2xl uppercase tracking-widest">{lang.score}: {score}</div>
            <div className="grid grid-cols-2 gap-6">
                {pads.map((p, i) => (<button key={i} onClick={() => handlePad(i)} className={`w-32 h-32 rounded-3xl transition-all duration-200 border-8 border-white ${p.color} ${activePad === i ? 'scale-110 brightness-125 shadow-2xl' : 'shadow-lg hover:scale-105 active:scale-95'}`} />))}
            </div>
            {sequence.length === 0 && (<button onClick={start} className="mt-16 w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl">{lang.start}</button>)}
        </div>
    );
};

const DodgeGame = ({ lang }: any) => {
    const [rocketPos, setRocketPos] = useState(50);
    const [obstacles, setObstacles] = useState<any[]>([]);
    const [score, setScore] = useState(0);
    const [isGameOver, setIsGameOver] = useState(false);
    useEffect(() => {
        if (isGameOver) return;
        const interval = setInterval(() => {
            setObstacles(prev => {
                const next = prev.map(o => ({ ...o, y: o.y + 3 })).filter(o => o.y < 100);
                if (Math.random() > 0.95) next.push({ id: Date.now(), x: Math.random() * 90, y: -10 });
                return next;
            });
            setScore(s => s + 1);
        }, 30);
        return () => clearInterval(interval);
    }, [isGameOver]);
    useEffect(() => {
        obstacles.forEach(o => { if (o.y > 70 && o.y < 90 && Math.abs(o.x - rocketPos) < 8) { setIsGameOver(true); playSound('fail'); } });
    }, [obstacles, rocketPos]);
    return (
        <div className="h-full bg-indigo-950 relative overflow-hidden">
            <div className="absolute top-4 right-4 z-10 font-black text-indigo-200 tabular-nums">{score}</div>
            <div className="absolute text-4xl transform -translate-x-1/2 transition-all duration-75" style={{ left: `${rocketPos}%`, top: '80%' }}>🚀</div>
            {obstacles.map(o => (<div key={o.id} className="absolute text-2xl" style={{ left: `${o.x}%`, top: `${o.y}%` }}>☄️</div>))}
            <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-20 px-8">
                <button onClick={() => setRocketPos(p => Math.max(10, p - 10))} className="p-6 bg-white/10 rounded-full text-white active:bg-white/30"><ChevronLeft size={32}/></button>
                <button onClick={() => setRocketPos(p => Math.min(90, p + 10))} className="p-6 bg-white/10 rounded-full text-white active:bg-white/30"><ChevronRight size={32}/></button>
            </div>
            {isGameOver && (<div className="absolute inset-0 bg-indigo-900/90 flex flex-col items-center justify-center text-white z-20"><Trophy className="mb-4 text-amber-400" size={64} /><p className="text-4xl font-black mb-2 uppercase tracking-tighter">{lang.game_over}</p><p className="text-xl font-bold opacity-50 mb-10">{lang.score}: {score}</p><button onClick={() => { setObstacles([]); setScore(0); setIsGameOver(false); }} className="px-10 py-5 bg-white text-indigo-900 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl">{lang.try_again}</button></div>)}
        </div>
    );
};

const AffirmationsTool = ({ lang, user }: any) => {
    const [affirmation, setAffirmation] = useState("");
    const [loading, setLoading] = useState(false);
    const getNewAffirmation = async () => {
        setLoading(true);
        try {
            const r = await ai.models.generateContent({ model: AI_MODEL, contents: `Give a powerful affirmation for someone feeling ${user.mood} in ${user.language}.` });
            setAffirmation(r.text || "");
        } catch (e) { setAffirmation("I am strong, I am capable, and I am enough."); } finally { setLoading(false); }
    };
    useEffect(() => { getNewAffirmation(); }, []);
    return (
        <div className="h-full flex flex-col items-center justify-center bg-rose-50 p-10 text-center">
            <HeartPulse size={80} className="text-rose-400 mb-12 animate-pulse" />
            <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-rose-100 mb-12 relative"><Quote className="absolute -top-6 -left-6 text-rose-100" size={64} />{loading ? <Loader2 className="animate-spin text-rose-300 mx-auto" size={40} /> : (<p className="text-2xl font-black text-rose-900 leading-tight italic">"{affirmation}"</p>)}</div>
            <button onClick={getNewAffirmation} className="w-full py-5 bg-rose-500 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">{lang.get_affirmation}</button>
        </div>
    );
};

const GuidedImagery = ({ lang, user }: any) => {
    const [scenario, setScenario] = useState("");
    const [loading, setLoading] = useState(false);
    const getScenario = async () => {
        setLoading(true);
        try {
            const r = await ai.models.generateContent({ model: AI_MODEL, contents: `Write a short guided visualization paragraph for ${user.mood} in ${user.language}.` });
            setScenario(r.text || "");
        } catch (e) { setScenario("Imagine yourself walking through a lush, green forest. The air is cool and fresh. You feel at peace."); } finally { setLoading(false); }
    };
    useEffect(() => { getScenario(); }, []);
    return (
        <div className="h-full flex flex-col bg-emerald-50 overflow-y-auto no-scrollbar p-10">
            <div className="flex-1 flex flex-col items-center justify-center space-y-10"><Trees size={100} className="text-emerald-300" /><div className="bg-white/90 backdrop-blur p-12 rounded-[3rem] shadow-2xl border border-emerald-100 space-y-8"><h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400 text-center">{lang.imagine}</h3>{loading ? <Loader2 className="animate-spin mx-auto text-emerald-100" /> : (<p className="text-lg font-bold text-emerald-900 leading-relaxed text-center italic">"{scenario}"</p>)}</div></div>
            <button onClick={getScenario} className="w-full py-5 bg-emerald-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl mt-12 active:scale-95">{lang.new_prompt}</button>
        </div>
    );
};

const BreathingExercise = ({ lang }: any) => {
    const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
    const [size, setSize] = useState(1);
    useEffect(() => {
        let isRunning = true;
        const run = async () => {
            while (isRunning) {
                setPhase('Inhale');
                for (let i = 0; i <= 100 && isRunning; i++) { setSize(1 + i/100); await new Promise(r => setTimeout(r, 40)); }
                if (isRunning) {
                  setPhase('Hold');
                  await new Promise(r => setTimeout(r, 2000));
                }
                if (isRunning) {
                  setPhase('Exhale');
                  for (let i = 100; i >= 0 && isRunning; i--) { setSize(1 + i/100); await new Promise(r => setTimeout(r, 40)); }
                }
                if (isRunning) {
                  await new Promise(r => setTimeout(r, 1000));
                }
            }
        };
        run();
        return () => { isRunning = false; };
    }, []);
    return (
        <div className="h-full flex flex-col items-center justify-center bg-sky-50 p-10">
            <div className="relative w-64 h-64 flex items-center justify-center">
                <div className="absolute inset-0 bg-sky-200 rounded-full opacity-30 animate-pulse" style={{ transform: `scale(${size * 1.2})` }} />
                <div className="w-32 h-32 bg-sky-500 rounded-full shadow-2xl transition-transform duration-500 flex items-center justify-center" style={{ transform: `scale(${size})` }}>
                    <Wind className="text-white" size={48} />
                </div>
            </div>
            <p className="mt-16 text-3xl font-black text-sky-800 uppercase tracking-widest">{phase}</p>
        </div>
    );
};

const FocusTimer = ({ lang }: any) => {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    useEffect(() => {
        let timer: any;
        if (isActive && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
        } else if (timeLeft === 0) {
            playSound('success');
            setIsActive(false);
        }
        return () => clearInterval(timer);
    }, [isActive, timeLeft]);
    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };
    return (
        <div className="h-full flex flex-col items-center justify-center bg-red-50 p-10">
            <div className="w-64 h-64 rounded-full border-8 border-white bg-red-500 shadow-2xl flex items-center justify-center mb-12">
                <span className="text-5xl font-black text-white tabular-nums">{formatTime(timeLeft)}</span>
            </div>
            <div className="flex gap-4 w-full max-w-xs">
                <button onClick={() => setIsActive(!isActive)} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">
                    {isActive ? lang.pause : lang.start}
                </button>
                <button onClick={() => { setIsActive(false); setTimeLeft(25 * 60); }} className="p-4 bg-white text-red-500 rounded-2xl shadow-lg active:scale-95 transition-all"><RotateCcw size={20} /></button>
            </div>
        </div>
    );
};

const WheelGame = ({ lang }: any) => {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const options = [ { text: "Deep Breathing", color: "#4f46e5" }, { text: "Positive Thought", color: "#ec4899" }, { text: "Stretch", color: "#10b981" }, { text: "Short Walk", color: "#f59e0b" }, { text: "Drink Water", color: "#06b6d4" }, { text: "Write Gratitude", color: "#8b5cf6" }, { text: "Quick Drawing", color: "#f43f5e" }, { text: "Listen to Music", color: "#eab308" } ];
  const spin = () => {
    if (spinning) return; setSpinning(true); setResult(null); playSound('click');
    setTimeout(() => { const winningIndex = Math.floor(Math.random() * options.length); setResult(options[winningIndex].text); setSpinning(false); playSound('success'); }, 2000);
  };
  return (
    <div className="h-full flex flex-col items-center justify-center bg-slate-50 p-6 overflow-hidden">
        <div className="relative mb-16"><div className={`w-72 h-72 rounded-full border-[12px] border-white shadow-2xl flex items-center justify-center relative transition-all duration-[2000ms] ease-out-back ${spinning ? 'rotate-[1440deg]' : 'rotate-0'}`} style={{ background: `conic-gradient(${options.map((o, i) => `${o.color} ${i * (360 / options.length)}deg ${(i + 1) * (360 / options.length)}deg`).join(', ')})` }}><div className="absolute inset-0 flex items-center justify-center"><div className="w-16 h-16 bg-white rounded-full shadow-xl z-20 flex items-center justify-center"><Star size={24} className="text-indigo-600 animate-spin-slow" /></div></div></div><div className="absolute -top-6 left-1/2 -translate-x-1/2 w-8 h-12 bg-rose-600 rounded-full z-30 shadow-lg border-4 border-white flex items-center justify-center"><ChevronDown size={24} className="text-white" /></div></div>
        <div className="text-center space-y-6 max-w-xs mb-12">{spinning ? (<div className="space-y-2 animate-pulse"><p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Spinning Fortune...</p><p className="text-2xl font-black text-slate-300">???</p></div>) : result ? (<div className="space-y-2 fade-in"><p className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Your Activity:</p><p className="text-3xl font-black text-slate-800 tracking-tighter">{result}</p></div>) : (<div className="space-y-2 opacity-30"><p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">Wheel of Mindful</p><p className="text-2xl font-black text-slate-800">Spin to decide!</p></div>)}</div>
        <button onClick={spin} disabled={spinning} className="w-full max-w-xs py-5 bg-indigo-600 text-white rounded-[2.5rem] font-black uppercase tracking-widest text-xs shadow-2xl active:scale-95 disabled:opacity-50 transition-all">{lang.spin_btn}</button>
    </div>
  );
};

const MandalaCreator = ({ lang }: any) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [color, setColor] = useState("#10b981");
    const [isDrawing, setIsDrawing] = useState(false);
    const sections = 8;
    const draw = (e: any) => {
        if (!isDrawing || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d')!;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY);
        const x = clientX - rect.left - rect.width / 2;
        const y = clientY - rect.top - rect.height / 2;
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        const angle = (Math.PI * 2) / sections;
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        for (let i = 0; i < sections; i++) {
            ctx.rotate(angle);
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 1, y + 1);
            ctx.stroke();
            ctx.save();
            ctx.scale(1, -1);
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 1, y + 1);
            ctx.stroke();
            ctx.restore();
        }
        ctx.restore();
    };
    return (
        <div className="h-full flex flex-col bg-emerald-50">
            <div className="p-4 bg-white border-b flex justify-between items-center shrink-0">
                <div className="flex gap-2">
                    {['#10b981', '#3b82f6', '#f43f5e', '#f59e0b', '#8b5cf6'].map(c => (
                        <button key={c} onClick={() => setColor(c)} className={`w-6 h-6 rounded-full border-2 ${color === c ? 'border-slate-800' : 'border-transparent'}`} style={{ backgroundColor: c }} />
                    ))}
                </div>
                <button onClick={() => canvasRef.current?.getContext('2d')?.clearRect(0,0,800,800)} className="text-slate-400 hover:text-rose-500"><Trash2 size={18}/></button>
            </div>
            <canvas 
                ref={canvasRef} width={800} height={800} 
                className="flex-1 w-full h-full bg-white cursor-crosshair touch-none"
                onMouseDown={() => setIsDrawing(true)} onMouseUp={() => setIsDrawing(false)} onMouseMove={draw}
                onTouchStart={() => setIsDrawing(true)} onTouchEnd={() => setIsDrawing(false)} onTouchMove={draw}
            />
        </div>
    );
};

const GratefulTree = ({ lang }: any) => {
    const [items, setItems] = useState<string[]>([]);
    const [text, setText] = useState("");
    const add = () => { if (!text.trim()) return; setItems([...items, text.trim()]); setText(""); playSound('success'); };
    return (
        <div className="h-full flex flex-col bg-emerald-50 p-6 overflow-y-auto no-scrollbar">
            <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-emerald-100 mb-8 shrink-0">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-6">{lang.gratitude_hint}</h3>
                <div className="flex gap-2">
                    <input value={text} onChange={e => setText(e.target.value)} placeholder="..." className="flex-1 bg-slate-50 rounded-2xl px-4 py-3 text-sm font-bold outline-none" onKeyDown={e => e.key === 'Enter' && add()} />
                    <button onClick={add} className="p-4 bg-emerald-600 text-white rounded-2xl shadow-lg active:scale-95"><Plus size={20}/></button>
                </div>
            </div>
            <div className="flex-1 flex flex-wrap gap-3 items-center justify-center content-start">
                {items.map((it, i) => (
                    <div key={i} className="px-6 py-3 bg-white text-emerald-700 rounded-full border-2 border-emerald-100 font-bold text-sm shadow-sm animate-in zoom-in">{it}</div>
                ))}
            </div>
        </div>
    );
};

const WhackAThought = ({ lang }: any) => {
    const [thoughts, setThoughts] = useState<any[]>([]);
    const [score, setScore] = useState(0);
    const THOUGHTS_POOL = ["Stress", "Anxiety", "Fear", "Doubt", "Worry", "Negative Talk", "Pressure", "Regret"];
    useEffect(() => {
        const interval = setInterval(() => {
            setThoughts(prev => {
                if (prev.length < 5) {
                    return [...prev, { id: Date.now() + Math.random(), text: THOUGHTS_POOL[Math.floor(Math.random() * THOUGHTS_POOL.length)], x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 }];
                }
                return prev;
            });
        }, 1500);
        return () => clearInterval(interval);
    }, []);
    const whack = (id: number) => { setThoughts(prev => prev.filter(t => t.id !== id)); setScore(s => s + 1); playSound('pop'); };
    return (
        <div className="h-full bg-slate-900 relative overflow-hidden">
            <div className="absolute top-4 left-4 z-10 font-black text-white/50 uppercase tracking-widest">{lang.score}: {score}</div>
            {thoughts.map(t => (
                <button key={t.id} onClick={() => whack(t.id)} className="absolute px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white font-black uppercase text-[10px] tracking-widest backdrop-blur-md animate-in zoom-in duration-300" style={{ left: `${t.x}%`, top: `${t.y}%`, transform: 'translate(-50%, -50%)' }}>{t.text}</button>
            ))}
        </div>
    );
};

const ZenSand = ({ lang }: any) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const draw = (e: any) => {
        if (!isDrawing || !canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d')!;
        const rect = canvas.getBoundingClientRect();
        const clientX = e.clientX || (e.touches && e.touches[0] && e.touches[0].clientX);
        const clientY = e.clientY || (e.touches && e.touches[0] && e.touches[0].clientY);
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        ctx.strokeStyle = "rgba(0,0,0,0.1)";
        ctx.lineWidth = 15;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x+1, y+1);
        ctx.stroke();
    };
    return (
        <div className="h-full bg-amber-100 p-4">
            <canvas 
                ref={canvasRef} width={800} height={1200}
                className="w-full h-full bg-[#f3e5ab] rounded-3xl shadow-inner cursor-crosshair touch-none"
                onMouseDown={() => setIsDrawing(true)} onMouseUp={() => setIsDrawing(false)} onMouseMove={draw}
                onTouchStart={() => setIsDrawing(true)} onTouchEnd={() => setIsDrawing(false)} onTouchMove={draw}
            />
        </div>
    );
};

const ColorMatch = ({ lang }: any) => {
    const [target, setTarget] = useState("");
    const [options, setOptions] = useState<string[]>([]);
    const [score, setScore] = useState(0);
    const generate = () => {
        const colors = ["#f43f5e", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#06b6d4"];
        const t = colors[Math.floor(Math.random() * colors.length)];
        setTarget(t);
        setOptions([...colors].sort(() => Math.random() - 0.5));
    };
    useEffect(() => { generate(); }, []);
    const pick = (c: string) => {
        if (c === target) { setScore(s => s + 1); playSound('success'); generate(); }
        else { playSound('fail'); }
    };
    return (
        <div className="h-full flex flex-col items-center justify-center bg-cyan-50 p-10 space-y-12">
            <div className="text-center space-y-4">
                <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">{lang.target}</p>
                <div className="w-32 h-32 rounded-[2.5rem] shadow-2xl border-8 border-white mx-auto" style={{ backgroundColor: target }} />
            </div>
            <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
                {options.map((c, i) => (
                    <button key={i} onClick={() => pick(c)} className="aspect-square rounded-2xl border-4 border-white shadow-lg active:scale-90 transition-all" style={{ backgroundColor: c }} />
                ))}
            </div>
            <p className="text-2xl font-black text-cyan-800 tabular-nums">{lang.score}: {score}</p>
        </div>
    );
};

const MemoryGame = ({ lang }: any) => {
  const icons = [Heart, Star, CloudRain, Sun, Zap, Moon, Trees, Bird];
  const [cards, setCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [solved, setSolved] = useState<number[]>([]);
  const init = () => { const deck = [...icons, ...icons].sort(() => Math.random() - 0.5).map((Icon, i) => ({ id: i + Math.random(), Icon })); setCards(deck); setFlipped([]); setSolved([]); };
  useEffect(() => { init(); }, []);
  const flip = (id: number) => {
    if (flipped.length === 2 || flipped.includes(id) || solved.includes(id)) return;
    const newFlipped = [...flipped, id]; setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      const card1 = cards.find(c => c.id === newFlipped[0]); const card2 = cards.find(c => c.id === newFlipped[1]);
      if (card1?.Icon === card2?.Icon) { setSolved(prev => [...prev, ...newFlipped]); setFlipped([]); playSound('success'); } else { setTimeout(() => setFlipped([]), 1000); }
    }
    playSound('click');
  };
  return (
    <div className="h-full flex flex-col bg-slate-50 p-6 overflow-y-auto no-scrollbar relative">
      <div className="grid grid-cols-4 gap-3 max-w-sm mx-auto">{cards.map((card) => (<button key={card.id} onClick={() => flip(card.id)} className={`aspect-square rounded-2xl transition-all duration-300 transform flex items-center justify-center ${flipped.includes(card.id) || solved.includes(card.id) ? 'bg-white shadow-md' : 'bg-indigo-600 shadow-lg'}`}>{(flipped.includes(card.id) || solved.includes(card.id)) && <card.Icon className="w-8 h-8 text-indigo-600" />}</button>))}</div>
      {solved.length === cards.length && cards.length > 0 && (<button onClick={init} className="mt-8 w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl">{lang.try_again}</button>)}
    </div>
  );
};

const VisionLens = ({ lang, user }: any) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [insight, setInsight] = useState("");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then(setStream)
      .catch(err => console.error("Camera error:", err));
    return () => stream?.getTracks().forEach(track => track.stop());
  }, []);

  const captureAndAnalyze = async () => {
    if (!videoRef.current || !canvasRef.current || analyzing) return;
    setAnalyzing(true);
    setInsight("");
    playSound('click');

    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0);
    const base64 = canvas.toDataURL('image/jpeg').split(',')[1];

    try {
      const response = await ai.models.generateContent({
        model: AI_MODEL,
        contents: [
          { parts: [
            { text: `Observe this environment or object. Provide one short, profound, and mindful insight or reflection to help the user feel grounded and inspired. User current mood: ${user.mood}. Language: ${user.language}.` },
            { inlineData: { mimeType: 'image/jpeg', data: base64 } }
          ]}
        ]
      });
      const text = response.text || "The beauty of the present moment is everywhere if we look closely.";
      setInsight(text);
      speakText(text);
    } catch (e) {
      setInsight("The universe speaks in whispers of color and light.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 text-white relative overflow-hidden">
      <div className="flex-1 relative">
        <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
        <canvas ref={canvasRef} className="hidden" />
        
        {analyzing && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-6 z-20">
            <Loader2 className="animate-spin text-white" size={48} />
            <p className="font-black uppercase tracking-[0.3em] text-xs text-center px-10">{lang.lens_loading}</p>
          </div>
        )}

        {insight && !analyzing && (
          <div className="absolute bottom-32 left-6 right-6 bg-white/10 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/20 shadow-2xl animate-in slide-in-from-bottom duration-500 z-30">
            <div className="flex justify-between items-start mb-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-300">{lang.lens_result}</h4>
              <button onClick={() => speakText(insight)} className="p-2 bg-white/10 rounded-full hover:bg-white/20"><Volume2 size={16}/></button>
            </div>
            <p className="text-lg font-bold leading-relaxed italic">"{insight}"</p>
            <button onClick={() => setInsight("")} className="absolute top-4 right-4 p-2 opacity-50"><X size={16} /></button>
          </div>
        )}
      </div>

      <div className="p-8 flex justify-center bg-black/40 backdrop-blur-md shrink-0">
        <button 
          onClick={captureAndAnalyze} 
          disabled={analyzing} 
          className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center active:scale-90 transition-all hover:bg-white/10 group"
        >
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-xl group-hover:scale-95 transition-transform">
            <CameraIcon size={32} />
          </div>
        </button>
      </div>
    </div>
  );
};

// --- View Components ---

const InstantReliefOverlay = ({ user, onClose, onNavigate }: any) => {
    const lang = TRANSLATIONS[user.language || 'en'];
    const [suggestion, setSuggestion] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getSuggestion = async () => {
            try {
                const response = await ai.models.generateContent({
                    model: AI_MODEL,
                    contents: `Suggest one specific quick distraction or mindful exercise for someone feeling ${user.mood}. Return JSON: { "activity": "Activity Name", "description": "Short description", "gameId": "BREATHING|POP|STACK|ECHO|THOUGHTS|SAND|MATCH|MEMORY|MANDALA|GRATEFUL_TREE|TIMER|WHEEL|SOUNDS|COMEDY|DODGE|AFFIRMATIONS|IMAGERY" }`,
                    config: { responseMimeType: "application/json" }
                });
                const data = JSON.parse(response.text || "{}");
                setSuggestion(data);
            } catch (e) { setSuggestion({ activity: "Deep Breathing", description: "A simple 1-minute exercise.", gameId: "BREATHING" }); } finally { setLoading(false); }
        };
        getSuggestion();
    }, []);

    return (
        <div className="fixed inset-0 bg-indigo-900/90 backdrop-blur-xl z-[5000] flex flex-col p-8 items-center justify-center text-center">
            <button onClick={onClose} className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"><X size={32}/></button>
            {loading ? (
                <div className="space-y-6 animate-pulse"><div className="w-24 h-24 bg-white/10 rounded-full mx-auto flex items-center justify-center"><Loader2 className="animate-spin text-white" size={40} /></div><p className="text-white font-black uppercase tracking-[0.3em] text-xs">{lang.loading_suggestion}</p></div>
            ) : (
                <div className="space-y-12 max-w-xs fade-in">
                    <div className="space-y-4"><h2 className="text-4xl font-black text-white tracking-tighter">{suggestion.activity}</h2><p className="text-indigo-200 font-medium leading-relaxed">{suggestion.description}</p></div>
                    <button onClick={() => { onNavigate("GAMES", suggestion.gameId); onClose(); playSound('success'); }} className="w-full py-5 bg-white text-indigo-900 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all">{lang.start_now}</button>
                </div>
            )}
        </div>
    );
};

const GamesHub = ({ onBack, user, activeGame, setActiveGame, soundState, onUpdateSound }: any) => {
  const lang = TRANSLATIONS[user.language || 'en'];
  const games: { id: GameType, title: string, icon: any, color: string }[] = [
    { id: "BREATHING", title: "Breathing", icon: Wind, color: "bg-sky-50 text-sky-600" },
    { id: "POP", title: "Bubble Pop", icon: CircleDashed, color: "bg-indigo-50 text-indigo-600" },
    { id: "STACK", title: "Tower Stack", icon: Layers, color: "bg-teal-50 text-teal-600" },
    { id: "MEMORY", title: "Memory Match", icon: Puzzle, color: "bg-purple-50 text-purple-600" },
    { id: "ECHO", title: "Echo Seq", icon: Binary, color: "bg-pink-50 text-pink-600" },
    { id: "DODGE", title: "Space Dodge", icon: Rocket, color: "bg-indigo-900 text-indigo-100" },
    { id: "COMEDY", title: "Comedy Corner", icon: Laugh, color: "bg-yellow-50 text-yellow-600" },
    { id: "WHEEL", title: "Spin Wheel", icon: RotateCcw, color: "bg-orange-50 text-orange-600" },
    { id: "TIMER", title: "Focus Timer", icon: Timer, color: "bg-red-50 text-red-600" },
    { id: "MANDALA", title: "Mandala Art", icon: Sparkles, color: "bg-emerald-50 text-emerald-600" },
    { id: "GRATEFUL_TREE", title: "Grateful Tree", icon: Trees, color: "bg-green-50 text-green-600" },
    { id: "THOUGHTS", title: "Clear Mind", icon: Brain, color: "bg-slate-50 text-slate-600" },
    { id: "SAND", title: "Zen Sand", icon: Grid3x3, color: "bg-amber-50 text-amber-600" },
    { id: "MATCH", title: "Color Match", icon: Palette, color: "bg-cyan-50 text-cyan-600" },
    { id: "AFFIRMATIONS", title: "Affirmations", icon: HeartPulse, color: "bg-rose-50 text-rose-600" },
    { id: "IMAGERY", title: "Imagery", icon: Compass, color: "bg-blue-50 text-blue-600" }
  ];
  if (activeGame !== "NONE") {
    let Content; switch(activeGame) {
      case "BREATHING": Content = BreathingExercise; break; case "MEMORY": Content = MemoryGame; break;
      case "TIMER": Content = FocusTimer; break; case "WHEEL": Content = WheelGame; break;
      case "MANDALA": Content = MandalaCreator; break; case "GRATEFUL_TREE": Content = GratefulTree; break;
      case "THOUGHTS": Content = WhackAThought; break; case "SAND": Content = ZenSand; break;
      case "MATCH": Content = ColorMatch; break; case "COMEDY": Content = ComedyCorner; break;
      case "POP": Content = BubblePop; break; case "STACK": Content = TowerStack; break;
      case "ECHO": Content = EchoGame; break; case "DODGE": Content = DodgeGame; break;
      case "AFFIRMATIONS": Content = AffirmationsTool; break; case "IMAGERY": Content = GuidedImagery; break;
      default: Content = () => <div className="p-8 text-center text-slate-400 font-bold">Coming Soon...</div>;
    }
    return (
      <div className="h-full flex flex-col bg-white overflow-hidden">
        <Header title={games.find(g => g.id === activeGame)?.title || "Mindful Activity"} goBack={() => setActiveGame("NONE")} rightAction={<button onClick={() => playSound('click')} className="p-2 text-slate-400"><HelpCircle size={20}/></button>} />
        <div className="flex-1 overflow-hidden"><Content lang={lang} user={user} /></div>
      </div>
    );
  }
  return (
    <div className="h-full flex flex-col bg-slate-50">
      <Header title={lang.games_tools} goBack={onBack} />
      <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 gap-4 pb-24 no-scrollbar">
        {games.map(g => (<button key={g.id} onClick={() => { setActiveGame(g.id); playSound('click'); }} className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border border-white shadow-sm transition-all hover:shadow-md hover:-translate-y-1 active:scale-95 ${g.color}`}><g.icon size={32} className="mb-4 opacity-80" /><span className="text-[10px] font-black uppercase tracking-widest text-center">{g.title}</span></button>))}
      </div>
    </div>
  );
};

const JournalViewComponent = ({ onBack, user }: any) => {
  const lang = TRANSLATIONS[user.language || 'en'];
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [text, setText] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  useEffect(() => { const stored = localStorage.getItem("lumina_journal"); if (stored) setEntries(JSON.parse(stored)); getNewPrompt(); }, []);
  const getNewPrompt = async () => { setLoading(true); try { const response = await ai.models.generateContent({ model: AI_MODEL, contents: `Give a mindful journal prompt for feeling ${user.mood} in ${user.language}.` }); setPrompt(response.text || "What's on your mind?"); } catch (e) { setPrompt("What's on your mind today?"); } finally { setLoading(false); } };
  const saveEntry = () => { if (!text.trim()) return; const newEntry = { id: Date.now().toString(), date: new Date().toLocaleString(), text, prompt }; setEntries([newEntry, ...entries]); localStorage.setItem("lumina_journal", JSON.stringify([newEntry, ...entries])); setText(""); playSound('success'); };
  const startSpeech = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition; if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition(); recognition.lang = user.language === 'es' ? 'es-ES' : 'en-US';
    recognition.onstart = () => { setIsRecording(true); playSound('click'); }; recognition.onend = () => setIsRecording(false);
    recognition.onresult = (event: any) => { setText(prev => prev + (prev ? " " : "") + event.results[0][0].transcript); }; recognition.start();
  };
  return (
    <div className="h-full flex flex-col bg-rose-50 overflow-hidden">
      <Header title={lang.journal} goBack={onBack} />
      <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-32">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-rose-100 space-y-6">
          <div className="flex items-center justify-between"><h3 className="text-[10px] font-black uppercase tracking-widest text-rose-400">{lang.writing_prompt}</h3><button onClick={getNewPrompt} className="p-2 text-rose-300"><RefreshCcw size={16}/></button></div>
          <p className="font-bold text-slate-800 italic leading-relaxed">{loading ? "..." : prompt}</p>
          <div className="relative">
            <textarea value={text} onChange={e => setText(e.target.value)} placeholder={lang.writing_hint} className="w-full min-h-[150px] p-5 bg-slate-50 rounded-[1.5rem] outline-none focus:ring-4 focus:ring-rose-50 text-sm font-medium" />
            <button onClick={startSpeech} className={`absolute bottom-4 right-4 p-3 rounded-2xl shadow-lg ${isRecording ? 'bg-rose-500 text-white animate-pulse' : 'bg-white text-rose-500'}`}>{isRecording ? <MicOff size={20}/> : <Mic size={20}/>}</button>
          </div>
          <button onClick={saveEntry} className="w-full py-5 bg-rose-500 text-white rounded-[2rem] font-black uppercase text-xs shadow-xl active:scale-95 transition-all">{lang.save_entry}</button>
        </div>
        <div className="space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{lang.past_entries}</h3>
          {entries.map(e => (<div key={e.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 group"><div className="flex justify-between items-center mb-2"><span className="text-[10px] font-black text-rose-400 uppercase tracking-tighter">{e.date}</span><button onClick={() => { setEntries(entries.filter(i => i.id !== e.id)); localStorage.setItem("lumina_journal", JSON.stringify(entries.filter(i => i.id !== e.id))); playSound('trash'); }} className="text-slate-200 hover:text-rose-500"><Trash2 size={16}/></button></div><p className="text-sm font-medium text-slate-700 whitespace-pre-wrap">{e.text}</p></div>))}
        </div>
      </div>
    </div>
  );
};

const CreativeView = ({ onBack, user, soundState, onUpdateSound }: any) => {
    const lang = TRANSLATIONS[user.language || 'en'];
    const [subTab, setSubTab] = useState<'SKETCH' | 'MUSIC'>('SKETCH');
    return (
        <div className="h-full flex flex-col bg-slate-50 overflow-hidden">
            <div className="bg-white border-b flex px-6 shrink-0 z-40">
                <button onClick={() => setSubTab('SKETCH')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${subTab === 'SKETCH' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-400'}`}>{lang.sketch_tab}</button>
                <button onClick={() => setSubTab('MUSIC')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${subTab === 'MUSIC' ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-400'}`}>{lang.ai_music}</button>
                <button onClick={onBack} className="p-4 text-slate-400"><X size={20}/></button>
            </div>
            <div className="flex-1 overflow-hidden">{subTab === 'SKETCH' ? <DrawingCanvas lang={lang} /> : (<div className="h-full flex flex-col"><PlaylistGenerator lang={lang} user={user} /><div className="bg-white border-t"><BackgroundMusicPlayer user={user} lang={lang} /></div></div>)}</div>
        </div>
    );
};

const GratitudeHubView = ({ onBack, user }: any) => {
    const lang = TRANSLATIONS[user.language || 'en'];
    const [tab, setTab] = useState<'KINDNESS' | 'TREE'>('KINDNESS');
    return (
        <div className="h-full flex flex-col bg-amber-50 overflow-hidden">
            <div className="bg-white border-b flex px-6 shrink-0 z-40">
                <button onClick={() => setTab('KINDNESS')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${tab === 'KINDNESS' ? 'border-amber-600 text-amber-700' : 'border-transparent text-slate-400'}`}>{lang.kindness_tab}</button>
                <button onClick={() => setTab('TREE')} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${tab === 'TREE' ? 'border-amber-600 text-amber-700' : 'border-transparent text-slate-400'}`}>{lang.grateful_tree}</button>
                <button onClick={onBack} className="p-4 text-slate-400"><X size={20}/></button>
            </div>
            <div className="flex-1 overflow-hidden">{tab === 'TREE' ? <GratefulTree lang={lang} /> : (<div className="p-6 h-full overflow-y-auto no-scrollbar pb-24"><div className="bg-white p-8 rounded-[3rem] shadow-sm border border-amber-100"><h3 className="text-[11px] font-black uppercase tracking-widest text-amber-600 mb-6">{lang.kindness_challenges}</h3><div className="space-y-4">{[ { text: "Send a supportive text", icon: Send }, { text: "Compliment a stranger", icon: MessageSquarePlus }, { text: "Help with a small task", icon: HeartHandshake } ].map((c, i) => (<div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl"><div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center"><c.icon size={20}/></div><p className="flex-1 text-sm font-bold text-slate-700">{c.text}</p><button onClick={() => playSound('success')} className="p-2 bg-white text-emerald-500 rounded-full shadow-sm active:scale-90"><Check size={20}/></button></div>))}</div></div></div>)}</div>
        </div>
    );
};

const InspirationView = ({ onBack, user }: any) => {
    const lang = TRANSLATIONS[user.language || 'en'];
    const [subTab, setSubTab] = useState<'EXPLORE' | 'SEARCH' | 'LENS' | 'WRITE'>('EXPLORE');
    const [activeTheme, setActiveTheme] = useState("Peace");
    const [quote, setQuote] = useState(""); 
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState(""); 
    const [myQuotes, setMyQuotes] = useState<PersonalWisdom[]>([]);
    const [newWisdom, setNewWisdom] = useState("");

    useEffect(() => { 
      const stored = localStorage.getItem("lumina_personal_wisdom"); 
      if (stored) setMyQuotes(JSON.parse(stored)); 
      if (subTab === 'EXPLORE') getQuote(activeTheme); 
    }, [subTab]);

    const getQuote = async (theme = activeTheme) => { 
      setLoading(true); 
      try { 
        const response = await ai.models.generateContent({ 
          model: AI_MODEL, 
          contents: `Give an inspiring and profound quote about ${theme} for someone feeling ${user.mood} in ${user.language}. Keep it under 25 words.` 
        }); 
        setQuote(response.text || ""); 
      } catch (e) { 
        setQuote("Be the change you wish to see in the world."); 
      } finally { 
        setLoading(false); 
      } 
    };

    const handleSearch = async () => { 
      if (!searchQuery.trim()) return; 
      setLoading(true); 
      try { 
        const r = await ai.models.generateContent({ 
          model: AI_MODEL, 
          contents: `Give an inspiring quote about "${searchQuery}" in ${user.language}.` 
        }); 
        setQuote(r.text || ""); 
        playSound('success'); 
      } catch (e) { 
        setQuote("Wisdom is found in the search for truth."); 
      } finally { 
        setLoading(false); 
      } 
    };

    const saveWisdom = () => { 
      if (!newWisdom.trim()) return; 
      const entry = { id: Date.now().toString(), text: newWisdom.trim(), date: new Date().toLocaleDateString() }; 
      setMyQuotes([entry, ...myQuotes]); 
      localStorage.setItem("lumina_personal_wisdom", JSON.stringify([entry, ...myQuotes])); 
      setNewWisdom(""); 
      playSound('success'); 
    };

    return (
        <div className="h-full flex flex-col bg-sky-50 overflow-hidden relative">
            <div className="bg-white border-b flex px-4 shrink-0 z-40 overflow-x-auto no-scrollbar">
                <button onClick={() => setSubTab('EXPLORE')} className={`flex-1 py-4 px-2 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${subTab === 'EXPLORE' ? 'border-sky-600 text-sky-700' : 'border-transparent text-slate-400'}`}>{lang.explore_tab}</button>
                <button onClick={() => setSubTab('SEARCH')} className={`flex-1 py-4 px-2 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${subTab === 'SEARCH' ? 'border-sky-600 text-sky-700' : 'border-transparent text-slate-400'}`}>{lang.search_tab}</button>
                <button onClick={() => setSubTab('LENS')} className={`flex-1 py-4 px-2 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${subTab === 'LENS' ? 'border-sky-600 text-sky-700' : 'border-transparent text-slate-400'}`}>{lang.lens_tab}</button>
                <button onClick={() => setSubTab('WRITE')} className={`flex-1 py-4 px-2 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${subTab === 'WRITE' ? 'border-sky-600 text-sky-700' : 'border-transparent text-slate-400'}`}>{lang.write_tab}</button>
                <button onClick={onBack} className="p-4 text-slate-400 shrink-0"><X size={20}/></button>
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar relative">
                {subTab === 'EXPLORE' && (
                  <div className="p-6 space-y-6 pb-32">
                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{lang.explore_themes}</p>
                      <div className="flex flex-wrap gap-2">
                        {INSPIRATION_THEMES.map(t => (
                          <button 
                            key={t.id} 
                            onClick={() => { setActiveTheme(t.id); getQuote(t.id); playSound('click'); }} 
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase transition-all border ${activeTheme === t.id ? 'bg-sky-600 text-white border-sky-600 shadow-lg scale-105' : 'bg-white text-sky-700 border-sky-100 hover:border-sky-300'}`}
                          >
                            <t.icon size={14} />{t.id}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-sky-100 relative min-h-[300px] flex flex-col items-center justify-center text-center">
                      <Quote className="text-sky-50 absolute top-8 left-8" size={80} />
                      {loading ? (
                        <div className="flex flex-col items-center gap-4"><Loader2 size={40} className="animate-spin text-sky-400" /><p className="text-[10px] font-black text-sky-300 uppercase tracking-widest">Searching Wisdom...</p></div>
                      ) : (
                        <div className="fade-in space-y-8 w-full">
                          <p className="text-2xl font-black text-slate-800 leading-tight italic">"{quote}"</p>
                          <div className="flex gap-3 justify-center">
                            <button onClick={() => speakText(quote)} className="p-4 bg-sky-50 text-sky-600 rounded-2xl hover:bg-sky-100 shadow-md active:scale-90 transition-all"><Volume2 size={24}/></button>
                            <button onClick={() => getQuote()} className="flex-1 py-5 bg-sky-500 text-white rounded-[2rem] font-black uppercase text-xs shadow-xl active:scale-95 transition-all">{lang.another_one}</button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {subTab === 'SEARCH' && (
                  <div className="p-6 space-y-8 fade-in pb-32">
                    <div className="bg-white p-2 rounded-3xl flex items-center gap-2 shadow-lg">
                      <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSearch()} placeholder={lang.search_placeholder} className="flex-1 px-4 py-2 bg-transparent outline-none font-bold text-sm" />
                      <button onClick={handleSearch} className="p-3 bg-sky-600 text-white rounded-2xl"><Search size={20}/></button>
                    </div>
                    <div className="bg-white p-10 rounded-[3rem] shadow-2xl flex flex-col items-center justify-center text-center relative min-h-[300px]">
                      {loading ? (
                        <Loader2 size={40} className="animate-spin text-sky-400" />
                      ) : quote ? (
                        <div className="space-y-8 w-full">
                          <p className="text-2xl font-black text-slate-800 italic">"{quote}"</p>
                          <button onClick={() => speakText(quote)} className="p-4 bg-sky-50 text-sky-600 rounded-2xl hover:bg-sky-100 shadow-md mx-auto active:scale-90 transition-all"><Volume2 size={24}/></button>
                        </div>
                      ) : (
                        <Search size={60} className="opacity-10" />
                      )}
                    </div>
                  </div>
                )}
                {subTab === 'LENS' && <VisionLens lang={lang} user={user} />}
                {subTab === 'WRITE' && (
                  <div className="p-6 space-y-8 fade-in pb-32">
                    <div className="bg-white p-8 rounded-[3rem] shadow-sm border space-y-6">
                      <textarea value={newWisdom} onChange={e => setNewWisdom(e.target.value)} placeholder={lang.write_wisdom_hint} className="w-full min-h-[120px] p-5 bg-slate-50 rounded-2xl outline-none font-bold text-sm border-none" />
                      <button onClick={saveWisdom} disabled={!newWisdom.trim()} className="w-full py-5 bg-sky-600 text-white rounded-[2rem] font-black uppercase text-xs shadow-xl active:scale-95 disabled:opacity-50 transition-all">{lang.save_wisdom}</button>
                    </div>
                    {myQuotes.map(q => (
                      <div key={q.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 group">
                        <div className="flex justify-between items-start mb-3">
                          <span className="text-[8px] font-black text-sky-400 uppercase">{q.date}</span>
                          <div className="flex gap-2">
                            <button onClick={() => speakText(q.text)} className="p-1 text-slate-300 hover:text-sky-600"><Volume2 size={16}/></button>
                            <button onClick={() => { setMyQuotes(myQuotes.filter(i => i.id !== q.id)); localStorage.setItem("lumina_personal_wisdom", JSON.stringify(myQuotes.filter(i => i.id !== q.id))); playSound('trash'); }} className="p-1 text-slate-200 hover:text-rose-500"><Trash2 size={16}/></button>
                          </div>
                        </div>
                        <p className="text-sm font-bold text-slate-700 italic">"{q.text}"</p>
                      </div>
                    ))}
                  </div>
                )}
            </div>
        </div>
    );
};

const ProfileView = ({ onBack, currentProfile, onUpdate }: any) => {
    const [profile, setProfile] = useState(currentProfile); const lang = TRANSLATIONS[profile.language || 'en'];
    return (
        <div className="h-full flex flex-col bg-white overflow-hidden"><Header title={lang.profile_settings} goBack={onBack} /><div className="flex-1 overflow-y-auto p-8 space-y-10 no-scrollbar pb-32"><div className="flex flex-col items-center gap-4"><div className="w-24 h-24 rounded-[2rem] bg-indigo-100 flex items-center justify-center text-indigo-600 text-4xl font-black shadow-inner">{profile.username[0].toUpperCase()}</div><h2 className="text-xl font-black tracking-tighter text-slate-800">{profile.username}</h2></div><div className="space-y-6"><div className="flex items-center gap-2 ml-1"><KeyRound size={16} className="text-indigo-400" /><h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Lumina Account</h3></div><div className="bg-slate-50 p-6 rounded-[2.5rem] space-y-5"><p className="text-xs font-bold text-slate-500">Sign in to sync your journey.</p><div className="flex flex-col gap-3"><button onClick={() => alert('Login coming soon!')} className="w-full py-4 bg-white border-2 border-indigo-100 text-indigo-600 rounded-2xl font-black uppercase text-[10px]">Login</button><button onClick={() => alert('Sign up coming soon!')} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px]">Sign Up</button></div></div></div><div className="space-y-6"><div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Display Name</label><input value={profile.username} onChange={e => setProfile({...profile, username: e.target.value})} className="w-full p-4 bg-slate-50 rounded-2xl border-none font-bold outline-none" /></div><div className="space-y-2"><label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Language</label><div className="grid grid-cols-2 gap-2">{['en', 'es', 'fr', 'zh'].map(l => (<button key={l} onClick={() => setProfile({...profile, language: l})} className={`py-3 rounded-xl font-black uppercase text-[10px] border-2 transition-all ${profile.language === l ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'bg-white border-slate-100 text-slate-400'}`}>{l}</button>))}</div></div></div><div className="space-y-4"><button onClick={() => onUpdate(profile)} className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase text-xs shadow-xl active:scale-95 transition-all">{lang.save_changes}</button></div></div></div>
    );
};

const App = () => {
  const [view, setView] = useState<ViewState>("HOME");
  const [user, setUser] = useState<UserProfile>({ username: "Guest", mood: "😌 Calm", language: "en" });
  const [activeGame, setActiveGame] = useState<GameType>("NONE");
  const [showInstantRelief, setShowInstantRelief] = useState(false);
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [soundState, setSoundState] = useState({ active: {} as Record<string, boolean>, volumes: { rain: 0.5, ocean: 0.5, white_noise: 0.5, fire: 0.5 } as Record<string, number>, masterVolume: 0.8 });
  useEffect(() => { const s = localStorage.getItem("lumina_user"); if(s) setUser(JSON.parse(s)); }, []);
  const updateUser = (u: UserProfile) => { setUser(u); localStorage.setItem("lumina_user", JSON.stringify(u)); };
  const lang = TRANSLATIONS[user.language || 'en'] || TRANSLATIONS.en;
  const handleNavigateFromOverlay = (v: ViewState, g?: GameType) => { setView(v); if (g) setActiveGame(g); setShowInstantRelief(false); };
  return (
    <div className="h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden max-w-md mx-auto shadow-2xl relative">
      {view === "HOME" && (
        <div className="h-full flex flex-col p-6 fade-in overflow-y-auto no-scrollbar shrink-0">
          <div className="flex justify-between items-center mb-8"><div><h1 className="text-3xl font-bold text-slate-800 tracking-tighter">{lang.hi}, {user.username}</h1><button onClick={() => setShowMoodSelector(!showMoodSelector)} className="text-slate-500 text-sm font-medium">{lang.feeling} {user.mood} ▼</button></div><button onClick={() => setView("PROFILE")} className="p-2 bg-white rounded-full shadow-sm"><div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">{user.username[0]?.toUpperCase()}</div></button></div>
          {showMoodSelector && (<div className="grid grid-cols-4 gap-2 mb-6 bg-white p-4 rounded-3xl shadow-xl border border-slate-50">{MOODS.map(m => (<button key={m.label} onClick={() => { updateUser({...user, mood: m.emoji + " " + m.label}); setShowMoodSelector(false); }} className="flex flex-col items-center hover:scale-110 p-2 hover:bg-slate-50 rounded-2xl"><span className="text-2xl">{m.emoji}</span><span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{m.label}</span></button>))}</div>)}
          <button onClick={() => setShowInstantRelief(true)} className="w-full bg-indigo-600 text-white p-5 rounded-3xl shadow-xl mb-8 flex items-center justify-between group active:scale-95 transition-all"><div className="flex items-center gap-4"><Sparkles className="w-7 h-7 group-hover:rotate-12 transition-transform" /><div className="text-left"><h3 className="font-black uppercase tracking-widest text-sm">{lang.instant_relief}</h3><p className="text-[10px] opacity-70 font-bold uppercase tracking-tighter">{lang.instant_relief_desc}</p></div></div><ArrowLeft className="rotate-180" /></button>
          <div className="grid grid-cols-1 gap-4 pb-24">
             <Card title={lang.games_tools} icon={Gamepad2} description={lang.games_tools_desc} onClick={() => setView("GAMES")} colorClass="bg-indigo-50 text-indigo-900" />
             <Card title={lang.inspiration} icon={Compass} description={lang.inspiration_desc} onClick={() => setView("QUOTES")} colorClass="bg-sky-50 text-sky-900" />
             <Card title={lang.journal} icon={BookHeart} description={lang.journal_desc} onClick={() => setView("JOURNAL")} colorClass="bg-rose-50 text-rose-900" />
             <Card title={lang.creative_space} icon={Palette} description={lang.creative_space_desc} onClick={() => setView("CREATIVE")} colorClass="bg-teal-50 text-teal-900" />
             <Card title={lang.kindness} icon={Heart} description={lang.kindness_desc} onClick={() => setView("GRATITUDE")} colorClass="bg-amber-50 text-amber-900" />
          </div>
        </div>
      )}
      {showInstantRelief && <InstantReliefOverlay user={user} onClose={() => setShowInstantRelief(false)} onNavigate={handleNavigateFromOverlay} />}
      {view === "GAMES" && <GamesHub onBack={() => { setView("HOME"); setActiveGame("NONE"); }} user={user} activeGame={activeGame} setActiveGame={setActiveGame} soundState={soundState} onUpdateSound={setSoundState} />}
      {view === "JOURNAL" && <JournalViewComponent onBack={() => setView("HOME")} user={user} />}
      {view === "CREATIVE" && <CreativeView onBack={() => setView("HOME")} user={user} soundState={soundState} onUpdateSound={setSoundState} />}
      {view === "GRATITUDE" && <GratitudeHubView onBack={() => setView("HOME")} user={user} />}
      {view === "QUOTES" && <InspirationView onBack={() => setView("HOME")} user={user} />}
      {view === "PROFILE" && <ProfileView onBack={() => setView("HOME")} currentProfile={user} onUpdate={(u:any) => { updateUser(u); setView("HOME"); }} />}
    </div>
  );
};

const root = createRoot(document.getElementById("root")!); root.render(<App />);
