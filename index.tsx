import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { GoogleGenAI, Type, Schema } from "@google/genai";
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
  Image as ImageIcon,
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
  ChevronRight
} from "lucide-react";

// --- Configuration & Helpers ---

const AI_MODEL = "gemini-2.5-flash";
const IMAGEN_MODEL = "imagen-3.0-generate-001";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const COLORS = {
  primary: "bg-teal-600",
  primaryHover: "hover:bg-teal-700",
  secondary: "bg-indigo-100",
  text: "text-slate-800",
  accent: "text-teal-600",
  bg: "bg-slate-50"
};

const TEMPLATES = [
  {
    name: "Mandala",
    src: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`<svg width="800" height="800" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
      <circle cx="250" cy="250" r="200" fill="none" stroke="#CBD5E1" stroke-width="4"/>
      <circle cx="250" cy="250" r="160" fill="none" stroke="#CBD5E1" stroke-width="4"/>
      <circle cx="250" cy="250" r="120" fill="none" stroke="#CBD5E1" stroke-width="4"/>
      <circle cx="250" cy="250" r="80" fill="none" stroke="#CBD5E1" stroke-width="4"/>
      <circle cx="250" cy="250" r="40" fill="none" stroke="#CBD5E1" stroke-width="4"/>
      <path d="M250 50 L250 450 M50 250 L450 250" stroke="#CBD5E1" stroke-width="4"/>
      <path d="M108 108 L392 392 M392 108 L108 392" stroke="#CBD5E1" stroke-width="4"/>
    </svg>`)
  },
  {
    name: "Nature",
    src: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`<svg width="800" height="800" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
      <path d="M50 400 L150 200 L250 400" fill="none" stroke="#CBD5E1" stroke-width="4"/>
      <path d="M200 400 L350 150 L500 400" fill="none" stroke="#CBD5E1" stroke-width="4"/>
      <circle cx="400" cy="100" r="40" fill="none" stroke="#CBD5E1" stroke-width="4"/>
      <path d="M0 400 L500 400" stroke="#CBD5E1" stroke-width="4"/>
    </svg>`)
  },
  {
    name: "Geometric",
    src: "data:image/svg+xml;charset=utf-8," + encodeURIComponent(`<svg width="800" height="800" viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">
      <rect x="50" y="50" width="400" height="400" fill="none" stroke="#CBD5E1" stroke-width="4"/>
      <path d="M50 50 L450 450 M450 50 L50 450" stroke="#CBD5E1" stroke-width="4"/>
      <rect x="150" y="150" width="200" height="200" fill="none" stroke="#CBD5E1" stroke-width="4"/>
      <circle cx="250" cy="250" r="100" fill="none" stroke="#CBD5E1" stroke-width="4"/>
    </svg>`)
  }
];

const BRUSH_PRESETS = [
  { name: "Fine Liner", size: 2, opacity: 1, type: 'normal' as const },
  { name: "Thick Marker", size: 15, opacity: 1, type: 'normal' as const },
  { name: "Soft Watercolor", size: 25, opacity: 0.2, type: 'watercolor' as const },
  { name: "Rough Chalk", size: 12, opacity: 0.8, type: 'chalk' as const },
  { name: "Pixel Pen", size: 4, opacity: 1, type: 'pixel' as const },
  { name: "Oil Paint", size: 18, opacity: 1, type: 'oil' as const },
  { name: "Charcoal Sketch", size: 10, opacity: 0.7, type: 'charcoal' as const },
  { name: "Stippling", size: 6, opacity: 1, type: 'stipple' as const }
];

const BLEND_MODES: { name: string, mode: GlobalCompositeOperation }[] = [
    { name: "Normal", mode: "source-over" },
    { name: "Multiply", mode: "multiply" },
    { name: "Screen", mode: "screen" },
    { name: "Overlay", mode: "overlay" },
    { name: "Darken", mode: "darken" },
    { name: "Lighten", mode: "lighten" },
    { name: "Color Dodge", mode: "color-dodge" },
    { name: "Color Burn", mode: "color-burn" },
    { name: "Hard Light", mode: "hard-light" },
    { name: "Soft Light", mode: "soft-light" },
    { name: "Difference", mode: "difference" },
    { name: "Exclusion", mode: "exclusion" },
    { name: "Hue", mode: "hue" },
    { name: "Saturation", mode: "saturation" },
    { name: "Color", mode: "color" },
    { name: "Luminosity", mode: "luminosity" },
    { name: "Lighter", mode: "lighter" }
];

const FILTERS = [
  { name: "Grayscale", id: "grayscale" },
  { name: "Sepia", id: "sepia" },
  { name: "Invert", id: "invert" },
  { name: "Posterize", id: "posterize" }
];

const GUIDES = [
    { name: "None", id: "NONE" },
    { name: "Grid", id: "GRID" },
    { name: "Isometric Grid", id: "ISOMETRIC" },
    { name: "Rule of Thirds", id: "RULE_THIRDS" },
    { name: "Golden Ratio", id: "GOLDEN_RATIO" },
    { name: "Fibonacci Spiral", id: "FIBONACCI" },
    { name: "Symmetry X (Vert)", id: "SYMMETRY_X" },
    { name: "Symmetry Y (Horz)", id: "SYMMETRY_Y" },
    { name: "Quad Mirror", id: "SYMMETRY_QUAD" },
    { name: "Radial (6)", id: "RADIAL_6" },
    { name: "Radial (8)", id: "RADIAL" },
    { name: "Radial (12)", id: "RADIAL_12" },
    { name: "Perspective 1-Pt", id: "PERSPECTIVE_1" },
    { name: "Perspective 2-Pt", id: "PERSPECTIVE_2" }
];

const TEXTURES = [
    { name: "None", id: "NONE" },
    { name: "Canvas", id: "CANVAS" },
    { name: "Noise", id: "NOISE" }
];

const IMAGE_STYLES = [
  "Vibrant", "Pastel", "Monochromatic", "Sepia", "Cinematic", "Cyberpunk", "Watercolor", "Minimalist", "Oil Painting", "Sketch"
];

const MOODS = [
  { label: "Calm", emoji: "😌" },
  { label: "Energetic", emoji: "⚡" },
  { label: "Tired", emoji: "😴" },
  { label: "Anxious", emoji: "😰" },
  { label: "Happy", emoji: "😄" },
  { label: "Focus", emoji: "🧘" },
  { label: "Neutral", emoji: "😐" },
  { label: "Sad", emoji: "😔" }
];

const TUTORIAL_STEPS = [
  { title: "Welcome to Art Space", desc: "This is your creative sanctuary. Let's take a quick tour of how to use the canvas." },
  { title: "Drawing Tools", desc: "Use the Pencil to draw, Eraser to correct, and Paint Bucket to fill areas. Tap the Color Circle to pick any color you like!" },
  { title: "Brush Control", desc: "Adjust the 'Size' and 'Opacity' sliders to create fine lines or broad, transparent strokes." },
  { title: "Advanced Features", desc: "Explore the menus for special Brush Presets (like Watercolor), Blending Modes, Artistic Filters, and Drawing Guides." },
  { title: "Manage Your Art", desc: "Use the file icons to Undo mistakes, Save your work, Upload images to trace, or Download your masterpiece." }
];

// --- Sound Helper ---

let globalAudioCtx: AudioContext | null = null;

const playSound = (type: 'draw' | 'color' | 'clear' | 'click' | 'success' | 'fail' | 'pop', volume: number = 0.5) => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    if (volume <= 0.01) return; 

    if (!globalAudioCtx) {
        globalAudioCtx = new AudioContext();
    }
    if (globalAudioCtx.state === 'suspended') {
        globalAudioCtx.resume();
    }
    
    const ctx = globalAudioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    const now = ctx.currentTime;
    
    if (type === 'draw') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
      gain.gain.setValueAtTime(0.08 * volume, now); 
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
    } else if (type === 'color') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
      gain.gain.setValueAtTime(0.12 * volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'clear') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.25);
      gain.gain.setValueAtTime(0.12 * volume, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);
      gain.gain.setValueAtTime(0.1 * volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'success') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.linearRampToValueAtTime(880, now + 0.2);
      gain.gain.setValueAtTime(0.1 * volume, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'fail') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.linearRampToValueAtTime(100, now + 0.2);
      gain.gain.setValueAtTime(0.1 * volume, now);
      gain.gain.linearRampToValueAtTime(0, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
    } else if (type === 'pop') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300 + Math.random() * 200, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
      gain.gain.setValueAtTime(0.1 * volume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    }
  } catch (e) {}
};

// --- Types ---

type ViewState = "HOME" | "GAMES" | "JOURNAL" | "CREATIVE" | "GRATITUDE" | "PROFILE" | "QUOTES";
type GameType = "NONE" | "BREATHING" | "SNAKE" | "BREAKOUT" | "DODGE" | "COMEDY" | "TIMER" | "WHEEL" | "MEMORY" | "POP" | "STACK" | "ECHO";

interface UserProfile {
  id?: string;
  username: string;
  mood: string;
  email?: string;
  password?: string;
}

interface Song {
  title: string;
  artist: string;
}

// --- Components ---

const Header = ({ title, goBack, rightAction }: { title: string, goBack?: () => void, rightAction?: React.ReactNode }) => (
  <div className="flex items-center justify-between p-4 bg-white shadow-sm sticky top-0 z-10">
    <div className="flex items-center">
        {goBack && (
        <button onClick={goBack} className="mr-4 p-2 rounded-full hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-6 h-6 text-slate-600" />
        </button>
        )}
        <h1 className="text-xl font-bold text-slate-800">{title}</h1>
    </div>
    {rightAction && <div>{rightAction}</div>}
  </div>
);

const Card = ({ title, icon: Icon, onClick, description, colorClass }: any) => (
  <button 
    onClick={onClick}
    className={`w-full p-6 rounded-2xl shadow-sm hover:shadow-md transition-all transform hover:-translate-y-1 text-left ${colorClass} fade-in`}
  >
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-lg font-bold text-slate-800">{title}</h2>
      <Icon className="w-8 h-8 opacity-70" />
    </div>
    <p className="text-sm opacity-80 font-medium">{description}</p>
  </button>
);

// --- Profile Section ---
const ProfileView = ({ onBack, currentProfile, onUpdate, onLogin, onSignup, onLogout }: { 
  onBack: () => void, 
  currentProfile: UserProfile, 
  onUpdate: (p: UserProfile) => void,
  onLogin: (e: string, p: string) => boolean,
  onSignup: (n: string, e: string, p: string) => void,
  onLogout: () => void
}) => {
  const isGuest = !currentProfile.id;
  const [mode, setMode] = useState<'EDIT' | 'LOGIN' | 'SIGNUP'>(isGuest ? 'LOGIN' : 'EDIT');
  
  // Login/Signup States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  // Edit States
  const [editName, setEditName] = useState(currentProfile.username);
  const [editMood, setEditMood] = useState(currentProfile.mood);

  useEffect(() => {
    setEditName(currentProfile.username);
    setEditMood(currentProfile.mood);
  }, [currentProfile]);

  const handleLoginSubmit = () => {
      if(onLogin(email, password)) {
          setError("");
          onBack();
      } else {
          setError("Invalid email or password");
      }
  };

  const handleSignupSubmit = () => {
      if(!name || !email || !password) {
          setError("All fields are required");
          return;
      }
      onSignup(name, email, password);
      onBack();
  };

  const handleSaveProfile = () => {
      onUpdate({ ...currentProfile, username: editName, mood: editMood });
      onBack();
  };

  return (
      <div className="h-screen flex flex-col bg-slate-50 fade-in">
          <Header title={mode === 'EDIT' ? "Profile & Settings" : (mode === 'LOGIN' ? "Sign In" : "Create Account")} goBack={onBack} />
          <div className="p-6 flex-1 overflow-y-auto">
              {mode === 'EDIT' ? (
                  <div className="space-y-8 max-w-md mx-auto">
                       <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                           <div className="w-16 h-16 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-2xl">
                               {currentProfile.username[0]?.toUpperCase()}
                           </div>
                           <div className="flex-1 min-w-0">
                               <h2 className="font-bold text-lg text-slate-800 truncate">{currentProfile.username}</h2>
                               <p className="text-slate-500 text-sm truncate">{currentProfile.email || "Guest User"}</p>
                           </div>
                       </div>

                       <div>
                           <label className="block text-sm font-bold text-slate-700 mb-2">Display Name</label>
                           <div className="relative">
                               <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                               <input 
                                   value={editName}
                                   onChange={(e) => setEditName(e.target.value)}
                                   className="w-full pl-12 p-4 rounded-xl border border-slate-200 focus:border-teal-500 outline-none bg-white"
                                   placeholder="Your name"
                               />
                           </div>
                       </div>

                       <div>
                           <label className="block text-sm font-bold text-slate-700 mb-2">Current Mood</label>
                           <div className="grid grid-cols-4 gap-2">
                              {MOODS.map(m => (
                                <button
                                  key={m.label}
                                  onClick={() => setEditMood(m.emoji + " " + m.label)}
                                  className={`flex flex-col items-center justify-center p-3 rounded-xl transition-all border-2 ${editMood === (m.emoji + " " + m.label) ? "bg-teal-50 border-teal-600 scale-105" : "bg-white border-slate-200 hover:border-teal-300"}`}
                                >
                                  <span className="text-2xl mb-1">{m.emoji}</span>
                                  <span className={`text-[10px] font-bold ${editMood === (m.emoji + " " + m.label) ? "text-teal-800" : "text-slate-600"}`}>{m.label}</span>
                                </button>
                              ))}
                           </div>
                       </div>
                       
                       <button onClick={handleSaveProfile} className="w-full py-4 bg-slate-800 text-white rounded-xl font-bold shadow-lg hover:bg-slate-900 flex items-center justify-center gap-2 transition-transform active:scale-95">
                           <Save className="w-5 h-5" /> Save Changes
                       </button>

                       {!isGuest ? (
                           <button onClick={onLogout} className="w-full py-4 bg-red-50 text-red-600 border border-red-100 rounded-xl font-bold hover:bg-red-100 flex items-center justify-center gap-2 mt-4">
                               <LogOut className="w-5 h-5" /> Sign Out
                           </button>
                       ) : (
                           <div className="bg-indigo-50 p-6 rounded-2xl text-center mt-8 border border-indigo-100">
                               <p className="text-indigo-900 font-bold mb-3">Save your progress across devices?</p>
                               <button onClick={() => setMode('SIGNUP')} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-colors">
                                  Create Account
                               </button>
                               <button onClick={() => setMode('LOGIN')} className="mt-3 text-indigo-600 font-bold text-sm hover:underline">
                                  Already have an account? Sign In
                               </button>
                           </div>
                       )}
                  </div>
              ) : (
                  <div className="space-y-6 max-w-md mx-auto pt-4">
                      {mode === 'SIGNUP' && (
                          <div>
                              <label className="block text-sm font-bold text-slate-700 mb-2">Name</label>
                              <div className="relative">
                                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                  <input 
                                      value={name} onChange={e => setName(e.target.value)}
                                      className="w-full pl-12 p-4 rounded-xl border border-slate-200 focus:border-teal-500 outline-none bg-white"
                                      placeholder="Your Name"
                                  />
                              </div>
                          </div>
                      )}
                      
                      <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                          <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                              <input 
                                  type="email"
                                  value={email} onChange={e => setEmail(e.target.value)}
                                  className="w-full pl-12 p-4 rounded-xl border border-slate-200 focus:border-teal-500 outline-none bg-white"
                                  placeholder="hello@example.com"
                              />
                          </div>
                      </div>

                      <div>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                          <div className="relative">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                              <input 
                                  type="password"
                                  value={password} onChange={e => setPassword(e.target.value)}
                                  className="w-full pl-12 p-4 rounded-xl border border-slate-200 focus:border-teal-500 outline-none bg-white"
                                  placeholder="••••••••"
                              />
                          </div>
                      </div>

                      {error && <p className="text-red-500 text-sm font-bold text-center bg-red-50 p-2 rounded-lg">{error}</p>}

                      <button 
                        onClick={mode === 'LOGIN' ? handleLoginSubmit : handleSignupSubmit} 
                        className="w-full py-4 bg-teal-600 text-white rounded-xl font-bold shadow-lg hover:bg-teal-700 transition-transform active:scale-95"
                      >
                          {mode === 'LOGIN' ? "Sign In" : "Create Account"}
                      </button>
                      
                      <div className="flex items-center justify-center gap-2 mt-4">
                          <span className="text-slate-500 font-medium text-sm">{mode === 'LOGIN' ? "New here?" : "Already have an account?"}</span>
                          <button 
                            onClick={() => { setMode(mode === 'LOGIN' ? 'SIGNUP' : 'LOGIN'); setError(""); }} 
                            className="text-teal-600 font-bold hover:underline text-sm"
                          >
                             {mode === 'LOGIN' ? "Sign Up" : "Sign In"}
                          </button>
                      </div>

                      {mode !== 'EDIT' && isGuest && (
                          <button onClick={() => setMode('EDIT')} className="w-full text-center text-slate-400 font-bold text-sm hover:text-slate-600 mt-4">
                              Continue as Guest
                          </button>
                      )}
                  </div>
              )}
          </div>
      </div>
  );
};

// --- Guide Modal ---
const GuideModal = ({ onClose }: { onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 fade-in backdrop-blur-sm" onClick={onClose}>
    <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full max-h-[85vh] flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300" onClick={e => e.stopPropagation()}>
      <div className="p-6 bg-indigo-50 border-b border-indigo-100 flex justify-between items-center shrink-0">
        <h2 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
          <BookHeart className="w-6 h-6" /> Game Guide
        </h2>
        <button onClick={onClose} className="p-2 hover:bg-indigo-100 rounded-full transition-colors">
          <X className="w-5 h-5 text-indigo-400" />
        </button>
      </div>
      
      <div className="p-6 overflow-y-auto space-y-6">
        <section>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Purpose</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            These tools are designed to interrupt harmful rumination loops by engaging your focus with simple, satisfying tasks.
          </p>
        </section>

        <section>
          <h3 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-3">How to Play</h3>
          <div className="space-y-4">
             <div className="flex gap-3">
                <div className="p-2 bg-emerald-100 rounded-lg h-fit shrink-0"><Ghost className="w-4 h-4 text-emerald-700"/></div>
                <div>
                    <p className="font-bold text-slate-800 text-sm">Zen Snake</p>
                    <p className="text-xs text-slate-600 mb-1">Use the arrow buttons to guide the snake.</p>
                    <p className="text-[10px] text-slate-400 bg-slate-50 p-1 rounded border border-slate-100 inline-block">Goal: Eat food to grow without hitting walls.</p>
                </div>
             </div>
             <div className="flex gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg h-fit shrink-0"><LayoutTemplate className="w-4 h-4 text-indigo-700"/></div>
                <div>
                    <p className="font-bold text-slate-800 text-sm">Mindful Breaker</p>
                    <p className="text-xs text-slate-600 mb-1">Drag the paddle horizontally.</p>
                    <p className="text-[10px] text-slate-400 bg-slate-50 p-1 rounded border border-slate-100 inline-block">Goal: Bounce the ball to break all bricks.</p>
                </div>
             </div>
             <div className="flex gap-3">
                <div className="p-2 bg-slate-800 rounded-lg h-fit shrink-0"><Rocket className="w-4 h-4 text-cyan-400"/></div>
                <div>
                    <p className="font-bold text-slate-800 text-sm">Cosmic Dodge</p>
                    <p className="text-xs text-slate-600 mb-1">Slide your finger left or right.</p>
                    <p className="text-[10px] text-slate-400 bg-slate-50 p-1 rounded border border-slate-100 inline-block">Goal: Dodge incoming meteors.</p>
                </div>
             </div>
             <div className="flex gap-3">
                <div className="p-2 bg-fuchsia-100 rounded-lg h-fit shrink-0"><Zap className="w-4 h-4 text-fuchsia-700"/></div>
                <div>
                    <p className="font-bold text-slate-800 text-sm">Pattern Echo</p>
                    <p className="text-xs text-slate-600 mb-1">Tap buttons to repeat the sequence.</p>
                    <p className="text-[10px] text-slate-400 bg-slate-50 p-1 rounded border border-slate-100 inline-block">Goal: Memorize longer patterns.</p>
                </div>
             </div>
             <div className="flex gap-3">
                <div className="p-2 bg-cyan-100 rounded-lg h-fit shrink-0"><Layers className="w-4 h-4 text-cyan-700"/></div>
                <div>
                    <p className="font-bold text-slate-800 text-sm">Tower Stack</p>
                    <p className="text-xs text-slate-600 mb-1">Tap anywhere to drop the block.</p>
                    <p className="text-[10px] text-slate-400 bg-slate-50 p-1 rounded border border-slate-100 inline-block">Goal: Align blocks perfectly to build high.</p>
                </div>
             </div>
             <div className="flex gap-3">
                <div className="p-2 bg-purple-100 rounded-lg h-fit shrink-0"><Grid2x2 className="w-4 h-4 text-purple-700"/></div>
                <div>
                    <p className="font-bold text-slate-800 text-sm">Mindful Memory</p>
                    <p className="text-xs text-slate-600 mb-1">Tap cards to flip them over.</p>
                    <p className="text-[10px] text-slate-400 bg-slate-50 p-1 rounded border border-slate-100 inline-block">Goal: Find all matching pairs.</p>
                </div>
             </div>
             <div className="flex gap-3">
                <div className="p-2 bg-blue-100 rounded-lg h-fit shrink-0"><Circle className="w-4 h-4 text-blue-700"/></div>
                <div>
                    <p className="font-bold text-slate-800 text-sm">Bubble Pop</p>
                    <p className="text-xs text-slate-600 mb-1">Tap bubbles as they float up.</p>
                    <p className="text-[10px] text-slate-400 bg-slate-50 p-1 rounded border border-slate-100 inline-block">Goal: Simple stress relief.</p>
                </div>
             </div>
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3">Mindfulness Tools</h3>
          <div className="space-y-3">
             <div className="flex gap-3">
                <div className="p-2 bg-blue-100 rounded-lg h-fit shrink-0"><Wind className="w-4 h-4 text-blue-700"/></div>
                <div>
                    <p className="font-bold text-slate-800 text-sm">Breathing</p>
                    <p className="text-xs text-slate-500">Regulates the nervous system to calm anxiety.</p>
                </div>
             </div>
             <div className="flex gap-3">
                <div className="p-2 bg-red-100 rounded-lg h-fit shrink-0"><Timer className="w-4 h-4 text-red-700"/></div>
                <div>
                    <p className="font-bold text-slate-800 text-sm">Focus Timer</p>
                    <p className="text-xs text-slate-500">Timed meditation sessions.</p>
                </div>
             </div>
             <div className="flex gap-3">
                <div className="p-2 bg-amber-100 rounded-lg h-fit shrink-0"><Laugh className="w-4 h-4 text-amber-700"/></div>
                <div>
                    <p className="font-bold text-slate-800 text-sm">Comedy</p>
                    <p className="text-xs text-slate-500">Triggers endorphins to counter low mood.</p>
                </div>
             </div>
             <div className="flex gap-3">
                <div className="p-2 bg-orange-100 rounded-lg h-fit shrink-0"><CircleDashed className="w-4 h-4 text-orange-700"/></div>
                <div>
                    <p className="font-bold text-slate-800 text-sm">Wellness Wheel</p>
                    <p className="text-xs text-slate-500">Reduces decision fatigue for self-care.</p>
                </div>
             </div>
          </div>
        </section>

        <section>
          <h3 className="text-xs font-bold text-purple-600 uppercase tracking-wider mb-3">Creative & Reflection</h3>
          <div className="space-y-3">
             <div className="flex gap-3">
                <div className="p-2 bg-rose-100 rounded-lg h-fit shrink-0"><BookHeart className="w-4 h-4 text-rose-700"/></div>
                <div>
                    <p className="font-bold text-slate-800 text-sm">Journal</p>
                    <p className="text-xs text-slate-500">Capture thoughts with text, voice, or photos. Use 'Inspire Me' for prompts.</p>
                </div>
             </div>
             <div className="flex gap-3">
                <div className="p-2 bg-teal-100 rounded-lg h-fit shrink-0"><Palette className="w-4 h-4 text-teal-700"/></div>
                <div>
                    <p className="font-bold text-slate-800 text-sm">Creative Space</p>
                    <p className="text-xs text-slate-500">Draw, generate AI art, or listen to soundscapes.</p>
                </div>
             </div>
             <div className="flex gap-3">
                <div className="p-2 bg-amber-100 rounded-lg h-fit shrink-0"><Heart className="w-4 h-4 text-amber-700"/></div>
                <div>
                    <p className="font-bold text-slate-800 text-sm">Kindness</p>
                    <p className="text-xs text-slate-500">Track daily acts of kindness and gratitude.</p>
                </div>
             </div>
             <div className="flex gap-3">
                <div className="p-2 bg-sky-100 rounded-lg h-fit shrink-0"><Quote className="w-4 h-4 text-sky-700"/></div>
                <div>
                    <p className="font-bold text-slate-800 text-sm">Inspiration</p>
                    <p className="text-xs text-slate-500">Find wisdom in daily quotes.</p>
                </div>
             </div>
          </div>
        </section>
      </div>
      
      <div className="p-4 bg-slate-50 border-t border-slate-100 shrink-0">
        <button onClick={onClose} className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-sm hover:bg-indigo-700 active:scale-95 transition-transform">
            Got it
        </button>
      </div>
    </div>
  </div>
);

// --- Games Section ---

// 1. Zen Snake Game
const SnakeGame = () => {
    const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
    const [food, setFood] = useState({ x: 5, y: 5 });
    const [dir, setDir] = useState({ x: 0, y: 0 });
    const [gameOver, setGameOver] = useState(false);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const grid = 20;

    useEffect(() => {
        const saved = localStorage.getItem('lumina_snake_highscore');
        if (saved) setHighScore(parseInt(saved));
    }, []);

    useEffect(() => {
        if (!isPlaying || gameOver) return;
        const interval = setInterval(gameLoop, 150);
        return () => clearInterval(interval);
    }, [isPlaying, gameOver, snake, dir]);

    const gameLoop = () => {
        const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
        
        // Wall collision
        if (head.x < 0 || head.x >= grid || head.y < 0 || head.y >= grid) {
            handleGameOver();
            return;
        }
        // Self collision
        if (snake.some(s => s.x === head.x && s.y === head.y)) {
            handleGameOver();
            return;
        }

        const newSnake = [head, ...snake];
        if (head.x === food.x && head.y === food.y) {
            setScore(s => s + 1);
            playSound('success', 0.5);
            setFood({ x: Math.floor(Math.random() * grid), y: Math.floor(Math.random() * grid) });
        } else {
            newSnake.pop();
        }
        setSnake(newSnake);
    };

    const handleGameOver = () => {
        setGameOver(true);
        setIsPlaying(false);
        playSound('fail', 0.5);
        if (score > highScore) {
            setHighScore(score);
            localStorage.setItem('lumina_snake_highscore', score.toString());
        }
    };

    const reset = () => {
        setSnake([{ x: 10, y: 10 }]);
        setDir({ x: 1, y: 0 });
        setScore(0);
        setGameOver(false);
        setIsPlaying(true);
        setFood({ x: Math.floor(Math.random() * grid), y: Math.floor(Math.random() * grid) });
    };

    const handleDir = (x: number, y: number) => {
        if ((x !== 0 && dir.x === 0) || (y !== 0 && dir.y === 0)) {
            setDir({ x, y });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-4 fade-in bg-slate-900">
             <div className="w-full max-w-sm flex justify-between text-white mb-4 font-bold">
                 <span>Score: {score}</span>
                 <span className="text-teal-400">Best: {highScore}</span>
             </div>
             
             <div className="relative bg-slate-800 rounded-xl shadow-2xl border-4 border-slate-700 overflow-hidden" style={{ width: 300, height: 300 }}>
                 {snake.map((s, i) => (
                     <div key={i} className="absolute bg-teal-500 rounded-sm" style={{ left: s.x * 15, top: s.y * 15, width: 14, height: 14 }} />
                 ))}
                 <div className="absolute bg-rose-500 rounded-full animate-pulse" style={{ left: food.x * 15, top: food.y * 15, width: 14, height: 14 }} />
                 
                 {(gameOver || !isPlaying) && (
                     <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center">
                         <h2 className="text-3xl font-black text-white mb-4">{gameOver ? "GAME OVER" : "ZEN SNAKE"}</h2>
                         <button onClick={reset} className="px-6 py-2 bg-teal-500 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform">
                             {gameOver ? "Try Again" : "Start Game"}
                         </button>
                     </div>
                 )}
             </div>

             <div className="grid grid-cols-3 gap-2 mt-8">
                 <div />
                 <button onClick={() => handleDir(0, -1)} className="p-4 bg-slate-700 rounded-xl text-white active:bg-teal-600"><ChevronUp /></button>
                 <div />
                 <button onClick={() => handleDir(-1, 0)} className="p-4 bg-slate-700 rounded-xl text-white active:bg-teal-600"><ChevronLeft /></button>
                 <button onClick={() => handleDir(0, 1)} className="p-4 bg-slate-700 rounded-xl text-white active:bg-teal-600"><ChevronDown /></button>
                 <button onClick={() => handleDir(1, 0)} className="p-4 bg-slate-700 rounded-xl text-white active:bg-teal-600"><ChevronRight /></button>
             </div>
        </div>
    );
};

// 2. Breakout Game
const BreakoutGame = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [isPlaying, setIsPlaying] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const reqRef = useRef<number>();

    const paddle = useRef({ x: 150, width: 75, height: 10 });
    const ball = useRef({ x: 150, y: 300, dx: 4, dy: -4, radius: 5 });
    const bricks = useRef<{x: number, y: number, status: number}[]>([]);

    useEffect(() => {
        initBricks();
        return () => cancelAnimationFrame(reqRef.current!);
    }, []);

    const initBricks = () => {
        const newBricks = [];
        for(let c=0; c<5; c++) {
            for(let r=0; r<4; r++) {
                newBricks.push({ x: (c*(50+10))+15, y: (r*(20+10))+30, status: 1 });
            }
        }
        bricks.current = newBricks;
    };

    const update = () => {
        if (!canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        // Clear
        ctx.clearRect(0, 0, 300, 400);

        // Draw Bricks
        bricks.current.forEach(b => {
            if (b.status === 1) {
                ctx.fillStyle = '#0d9488';
                ctx.fillRect(b.x, b.y, 50, 20);
            }
        });

        // Draw Paddle
        ctx.fillStyle = '#475569';
        ctx.fillRect(paddle.current.x, 380, paddle.current.width, paddle.current.height);

        // Draw Ball
        ctx.beginPath();
        ctx.arc(ball.current.x, ball.current.y, ball.current.radius, 0, Math.PI*2);
        ctx.fillStyle = '#f43f5e';
        ctx.fill();
        ctx.closePath();

        if (isPlaying) {
             // Move Ball
             ball.current.x += ball.current.dx;
             ball.current.y += ball.current.dy;

             // Wall Collisions
             if (ball.current.x + ball.current.dx > 300 - ball.current.radius || ball.current.x + ball.current.dx < ball.current.radius) {
                 ball.current.dx = -ball.current.dx;
                 playSound('click', 0.3);
             }
             if (ball.current.y + ball.current.dy < ball.current.radius) {
                 ball.current.dy = -ball.current.dy;
                 playSound('click', 0.3);
             } else if (ball.current.y + ball.current.dy > 400 - ball.current.radius) {
                 if (ball.current.x > paddle.current.x && ball.current.x < paddle.current.x + paddle.current.width) {
                     ball.current.dy = -ball.current.dy;
                     // Add spin
                     const hitPoint = ball.current.x - (paddle.current.x + paddle.current.width/2);
                     ball.current.dx = hitPoint * 0.15;
                     playSound('click', 0.5);
                 } else {
                     setLives(l => l - 1);
                     if (lives - 1 <= 0) {
                         setGameOver(true);
                         setIsPlaying(false);
                         playSound('fail', 0.6);
                     } else {
                         ball.current.x = 150;
                         ball.current.y = 300;
                         ball.current.dy = -4;
                         playSound('fail', 0.4);
                     }
                 }
             }

             // Brick Collision
             bricks.current.forEach(b => {
                 if (b.status === 1) {
                     if (ball.current.x > b.x && ball.current.x < b.x + 50 && ball.current.y > b.y && ball.current.y < b.y + 20) {
                         ball.current.dy = -ball.current.dy;
                         b.status = 0;
                         setScore(s => s + 10);
                         playSound('success', 0.3);
                     }
                 }
             });
             
             if (bricks.current.every(b => b.status === 0)) {
                 initBricks();
                 ball.current.dy *= 1.1; // speed up
             }
        }

        reqRef.current = requestAnimationFrame(update);
    };

    useEffect(() => {
        reqRef.current = requestAnimationFrame(update);
        return () => cancelAnimationFrame(reqRef.current!);
    }, [isPlaying, lives]);

    const handleMove = (e: any) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const relativeX = clientX - rect.left;
            if (relativeX > 0 && relativeX < 300) {
                paddle.current.x = relativeX - paddle.current.width / 2;
            }
        }
    };

    const startGame = () => {
        initBricks();
        setScore(0);
        setLives(3);
        setGameOver(false);
        setIsPlaying(true);
        ball.current = { x: 150, y: 300, dx: 4, dy: -4, radius: 5 };
    };

    return (
        <div className="flex flex-col items-center justify-center h-full bg-slate-50 p-4">
             <div className="flex justify-between w-full max-w-[300px] mb-2 font-bold text-slate-700">
                 <span>Score: {score}</span>
                 <div className="flex gap-1">
                     {[...Array(lives)].map((_, i) => <Heart key={i} className="w-5 h-5 text-red-500 fill-current"/>)}
                 </div>
             </div>
             <div className="relative">
                 <canvas 
                    ref={canvasRef} 
                    width={300} 
                    height={400} 
                    className="bg-white rounded-xl shadow-xl border border-slate-200 cursor-none touch-none"
                    onMouseMove={handleMove}
                    onTouchMove={handleMove}
                 />
                 {!isPlaying && (
                     <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
                         <button onClick={startGame} className="px-6 py-3 bg-teal-600 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform">
                             {gameOver ? "Play Again" : "Start Game"}
                         </button>
                     </div>
                 )}
             </div>
             <p className="mt-4 text-slate-400 text-sm">Drag to move paddle</p>
        </div>
    );
};

// 3. Cosmic Dodge
const CosmicDodgeGame = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const player = useRef({ x: 150, y: 350, size: 20 });
    const meteors = useRef<{x: number, y: number, speed: number, size: number}[]>([]);
    const frameRef = useRef(0);
    const scoreRef = useRef(0);

    const update = () => {
        if (!canvasRef.current || !isPlaying) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = '#0f172a'; // Deep space
        ctx.fillRect(0, 0, 300, 400);

        // Starfield effect
        ctx.fillStyle = '#ffffff';
        for(let i=0; i<20; i++) ctx.fillRect(Math.random()*300, Math.random()*400, 1, 1);

        // Player
        ctx.fillStyle = '#06b6d4'; // Cyan ship
        ctx.beginPath();
        ctx.moveTo(player.current.x, player.current.y - 10);
        ctx.lineTo(player.current.x - 10, player.current.y + 10);
        ctx.lineTo(player.current.x + 10, player.current.y + 10);
        ctx.fill();

        // Spawn Meteors
        if (Math.random() < 0.05 + (scoreRef.current * 0.0001)) {
            meteors.current.push({
                x: Math.random() * 300,
                y: -20,
                speed: 3 + Math.random() * 3 + (scoreRef.current * 0.001),
                size: 10 + Math.random() * 20
            });
        }

        // Update & Draw Meteors
        meteors.current.forEach((m, i) => {
            m.y += m.speed;
            ctx.fillStyle = '#f97316'; // Orange Meteor
            ctx.beginPath();
            ctx.arc(m.x, m.y, m.size, 0, Math.PI*2);
            ctx.fill();

            // Collision
            const dx = m.x - player.current.x;
            const dy = m.y - player.current.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < m.size + 10) {
                setGameOver(true);
                setIsPlaying(false);
                playSound('fail', 0.6);
            }

            if (m.y > 420) meteors.current.splice(i, 1);
        });

        scoreRef.current++;
        if (scoreRef.current % 10 === 0) setScore(Math.floor(scoreRef.current / 10));
        
        frameRef.current = requestAnimationFrame(update);
    };

    useEffect(() => {
        if (isPlaying) frameRef.current = requestAnimationFrame(update);
        return () => cancelAnimationFrame(frameRef.current);
    }, [isPlaying]);

    const handleMove = (e: any) => {
        if (!canvasRef.current) return;
        const rect = canvasRef.current.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const x = clientX - rect.left;
        if (x > 0 && x < 300) player.current.x = x;
    };

    const start = () => {
        meteors.current = [];
        scoreRef.current = 0;
        setScore(0);
        setGameOver(false);
        setIsPlaying(true);
        playSound('success', 0.5);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full bg-slate-900 p-4 text-white">
             <div className="mb-4 text-2xl font-mono font-bold text-cyan-400">Score: {score}</div>
             <div className="relative">
                 <canvas 
                     ref={canvasRef} 
                     width={300} 
                     height={400} 
                     className="rounded-xl border-2 border-slate-700 shadow-2xl cursor-none touch-none"
                     onMouseMove={handleMove}
                     onTouchMove={handleMove}
                 />
                 {!isPlaying && (
                     <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-xl">
                         <h2 className="text-3xl font-black text-white mb-4 italic tracking-widest">{gameOver ? "CRASHED" : "COSMIC DODGE"}</h2>
                         <button onClick={start} className="px-8 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-bold rounded-full shadow-[0_0_20px_rgba(6,182,212,0.6)] transition-all transform hover:scale-105">
                             {gameOver ? "Retry Mission" : "Launch"}
                         </button>
                     </div>
                 )}
             </div>
             <p className="mt-4 text-slate-500 text-sm">Slide to steer ship</p>
        </div>
    );
};

const ComedyCorner = ({ userMood }: { userMood: string }) => {
    const [joke, setJoke] = useState("");
    const [loading, setLoading] = useState(false);
    const [category, setCategory] = useState("Dad Joke");
    const [customType, setCustomType] = useState(""); 

    const jokeTypes = ["Dad Joke", "Pun", "One-liner", "Wholesome", "Knock-Knock", "Observational", "Wordplay", "Tech Humor"];

    const fetchJoke = async (selectedType: string) => { 
        setLoading(true); 
        setCategory(selectedType); 
        setJoke(""); 
        try { 
            const response = await ai.models.generateContent({ 
                model: AI_MODEL, 
                contents: `Tell me a clean, funny ${selectedType} joke. Keep it short, witty, and cheerful. The user is currently feeling ${userMood}, so adjust the tone accordingly.`, 
            }); 
            setJoke(response.text?.trim() || "Why don't skeletons fight each other? They don't have the guts."); 
        } catch (e) { 
            setJoke("What do you call a fake noodle? An impasta."); 
        } finally { 
            setLoading(false); 
        } 
    };

    const handleCustomSubmit = () => {
        if (customType.trim()) {
            fetchJoke(customType);
        }
    };

    useEffect(() => { fetchJoke("Dad Joke"); }, []);

    return (
        <div className="p-6 h-full flex flex-col items-center fade-in">
            <div className="w-full max-w-md flex-1 flex flex-col justify-center">
                <div className="bg-amber-50 p-8 rounded-3xl border border-amber-100 shadow-sm relative min-h-[200px] flex items-center justify-center">
                    <Laugh className="w-12 h-12 text-amber-200 absolute top-4 left-4 opacity-50" />
                    <Laugh className="w-8 h-8 text-amber-200 absolute bottom-4 right-4 opacity-50" />
                    {loading ? (
                        <div className="flex flex-col items-center">
                            <Loader2 className="animate-spin w-10 h-10 text-amber-500 mb-2" />
                            <p className="text-amber-700 text-sm font-medium">Cooking up a laugh...</p>
                        </div>
                    ) : (
                        <p className="text-xl md:text-2xl font-bold text-amber-900 text-center leading-relaxed">{joke}</p>
                    )}
                </div>
            </div>
            <div className="w-full max-w-md mt-8">
                <p className="text-center text-slate-500 mb-4 font-medium">Pick your humor style:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                    {jokeTypes.map((type) => (
                        <button key={type} onClick={() => fetchJoke(type)} className={`p-2 rounded-xl font-bold text-xs transition-all ${category === type ? "bg-amber-500 text-white shadow-md transform scale-105" : "bg-white border border-slate-200 text-slate-600 hover:bg-amber-50"}`}>{type}</button>
                    ))}
                </div>
                
                <div className="flex gap-2 mb-4">
                    <input 
                        value={customType} 
                        onChange={(e) => setCustomType(e.target.value)} 
                        placeholder="Or type a topic (e.g. 'Cats')..." 
                        className="flex-1 p-3 rounded-xl border border-slate-200 outline-none focus:border-amber-500 text-sm"
                        onKeyDown={(e) => e.key === 'Enter' && handleCustomSubmit()}
                    />
                    <button onClick={handleCustomSubmit} className="bg-amber-100 text-amber-700 p-3 rounded-xl font-bold hover:bg-amber-200 transition-colors">
                        <Sparkles className="w-5 h-5" />
                    </button>
                </div>

                <button onClick={() => fetchJoke(category)} className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 shadow-lg shadow-slate-200 transition-transform active:scale-95">Another One!</button>
            </div>
        </div>
    );
};

// --- Missing Games Implementation ---

const MemoryGame = () => {
    const icons = [Ghost, Heart, Zap, Circle, User, Mail, Lock, Sparkles];
    const [cards, setCards] = useState<{id: number, icon: any, flipped: boolean, matched: boolean}[]>([]);
    const [flipped, setFlipped] = useState<number[]>([]);
    const [matchedCount, setMatchedCount] = useState(0);

    useEffect(() => {
        const items = [...icons, ...icons].sort(() => Math.random() - 0.5);
        setCards(items.map((icon, i) => ({ id: i, icon, flipped: false, matched: false })));
    }, []);

    useEffect(() => {
        if (flipped.length === 2) {
            const [first, second] = flipped;
            if (cards[first].icon === cards[second].icon) {
                setCards(prev => prev.map((c, i) => i === first || i === second ? { ...c, matched: true } : c));
                setMatchedCount(c => c + 1);
                setFlipped([]);
                playSound('success');
            } else {
                setTimeout(() => {
                    setCards(prev => prev.map((c, i) => i === first || i === second ? { ...c, flipped: false } : c));
                    setFlipped([]);
                    playSound('fail', 0.2);
                }, 1000);
            }
        }
    }, [flipped, cards]);

    const handleCardClick = (index: number) => {
        if (flipped.length < 2 && !cards[index].flipped && !cards[index].matched) {
            setCards(prev => prev.map((c, i) => i === index ? { ...c, flipped: true } : c));
            setFlipped(prev => [...prev, index]);
            playSound('click');
        }
    };

    return (
        <div className="p-4 h-full flex flex-col items-center justify-center bg-slate-50">
            <div className="grid grid-cols-4 gap-3">
                {cards.map((card, i) => {
                    const Icon = card.icon;
                    return (
                        <button key={i} onClick={() => handleCardClick(i)} className={`w-16 h-16 rounded-xl flex items-center justify-center transition-all transform ${card.flipped || card.matched ? "bg-white rotate-y-180 shadow-md" : "bg-indigo-200"}`}>
                            {(card.flipped || card.matched) && <Icon className="w-8 h-8 text-indigo-600" />}
                        </button>
                    )
                })}
            </div>
            {matchedCount === 8 && <div className="mt-8 font-bold text-xl text-indigo-800">Complete!</div>}
        </div>
    );
};

const BubblePopGame = () => {
    const [bubbles, setBubbles] = useState<{id: number, x: number, y: number, size: number, speed: number}[]>([]);
    const [score, setScore] = useState(0);
    
    useEffect(() => {
        const interval = setInterval(() => {
            setBubbles(prev => [
                ...prev.map(b => ({ ...b, y: b.y - b.speed })),
                ...(Math.random() < 0.1 ? [{ id: Date.now(), x: Math.random() * 80 + 10, y: 100, size: Math.random() * 30 + 30, speed: Math.random() * 1 + 0.5 }] : [])
            ].filter(b => b.y > -20));
        }, 50);
        return () => clearInterval(interval);
    }, []);

    const pop = (id: number) => {
        setBubbles(prev => prev.filter(b => b.id !== id));
        setScore(s => s + 1);
        playSound('success', 0.5);
    };

    return (
        <div className="h-full bg-blue-50 overflow-hidden relative">
            <div className="absolute top-4 right-4 font-bold text-blue-900 text-xl">Pop: {score}</div>
            {bubbles.map(b => (
                <button 
                    key={b.id} 
                    onClick={() => pop(b.id)}
                    style={{ left: `${b.x}%`, top: `${b.y}%`, width: b.size, height: b.size }}
                    className="absolute bg-blue-400 rounded-full opacity-60 hover:scale-110 active:scale-90 transition-transform shadow-lg border-2 border-white"
                />
            ))}
        </div>
    );
};

const TowerStackGame = () => {
    const [height, setHeight] = useState(0);
    const [moving, setMoving] = useState(50);
    const [direction, setDirection] = useState(1);
    const [width, setWidth] = useState(50);
    const [playing, setPlaying] = useState(true);

    useEffect(() => {
        if(!playing) return;
        const interval = setInterval(() => {
            setMoving(m => {
                if (m > 90 || m < 10) setDirection(d => -d);
                return m + direction * 2;
            });
        }, 30);
        return () => clearInterval(interval);
    }, [playing, direction]);

    const place = () => {
        if (!playing) {
            setPlaying(true);
            setHeight(0);
            setWidth(50);
            return;
        }
        const diff = Math.abs(moving - 50);
        if (diff < width / 2) {
            setHeight(h => h + 1);
            setWidth(w => Math.max(10, w - diff/2)); 
            playSound('success');
        } else {
            setPlaying(false);
            playSound('fail');
        }
    };

    return (
        <div className="h-full flex flex-col items-center justify-center bg-slate-900 p-4" onClick={place}>
             <div className="text-white font-bold mb-4">Height: {height}</div>
             <div className="relative w-full h-64 bg-slate-800 rounded-lg overflow-hidden border border-slate-700">
                 <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-slate-600" />
                 {playing && <div style={{ left: `${moving}%`, width: `${width}%`, transform: 'translateX(-50%)' }} className="absolute bottom-10 h-8 bg-cyan-500 rounded-md transition-none" />}
             </div>
             <p className="text-slate-400 mt-4">{playing ? "Tap to stack aligned with center!" : "Game Over. Tap to restart."}</p>
        </div>
    );
};

const PatternEchoGame = () => {
    const [sequence, setSequence] = useState<number[]>([]);
    const [playerSeq, setPlayerSeq] = useState<number[]>([]);
    const [playing, setPlaying] = useState(false);
    const [highlight, setHighlight] = useState<number | null>(null);

    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500'];

    useEffect(() => {
        if (playing && sequence.length === 0) nextRound();
    }, [playing]);

    const nextRound = () => {
        const next = [...sequence, Math.floor(Math.random() * 4)];
        setSequence(next);
        setPlayerSeq([]);
        playSequence(next);
    };

    const playSequence = async (seq: number[]) => {
        for (let i = 0; i < seq.length; i++) {
            await new Promise(r => setTimeout(r, 500));
            setHighlight(seq[i]);
            playSound('click', 1);
            await new Promise(r => setTimeout(r, 500));
            setHighlight(null);
        }
    };

    const handleTap = (idx: number) => {
        playSound('click');
        const newSeq = [...playerSeq, idx];
        setPlayerSeq(newSeq);
        if (newSeq[newSeq.length - 1] !== sequence[newSeq.length - 1]) {
            playSound('fail');
            setPlaying(false);
            setSequence([]);
        } else if (newSeq.length === sequence.length) {
            playSound('success');
            setTimeout(nextRound, 1000);
        }
    };

    return (
         <div className="h-full flex flex-col items-center justify-center bg-slate-100">
             {!playing ? (
                 <button onClick={() => setPlaying(true)} className="px-8 py-3 bg-fuchsia-600 text-white rounded-full font-bold shadow-lg">Start Echo</button>
             ) : (
                 <div className="grid grid-cols-2 gap-4">
                     {colors.map((c, i) => (
                         <button 
                            key={i} 
                            onClick={() => handleTap(i)}
                            className={`w-32 h-32 rounded-2xl ${c} ${highlight === i ? 'brightness-125 scale-105' : 'opacity-80'} transition-all`}
                         />
                     ))}
                 </div>
             )}
             <div className="mt-8 text-slate-500 font-bold">Round: {sequence.length}</div>
         </div>
    );
};

const BreathingExercise = () => {
    const [phase, setPhase] = useState('Inhale');
    useEffect(() => {
         const interval = setInterval(() => {
             setPhase(p => p === 'Inhale' ? 'Hold' : (p === 'Hold' ? 'Exhale' : 'Inhale'));
         }, 4000);
         return () => clearInterval(interval);
    }, []);

    return (
        <div className="h-full flex flex-col items-center justify-center bg-sky-50">
            <div className={`w-64 h-64 rounded-full bg-sky-300 flex items-center justify-center transition-all duration-[4000ms] ${phase === 'Inhale' ? 'scale-100 opacity-80' : (phase === 'Hold' ? 'scale-110 opacity-100' : 'scale-75 opacity-60')}`}>
                <span className="text-2xl font-bold text-white">{phase}</span>
            </div>
            <p className="mt-8 text-sky-800 font-medium">Follow the rhythm</p>
        </div>
    );
};

const FocusTimer = () => {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    
    useEffect(() => {
        let interval: any = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft(t => t - 1), 1000);
        } else if (timeLeft === 0) {
            playSound('success');
            setIsActive(false);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const fmt = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

    return (
         <div className="h-full flex flex-col items-center justify-center bg-red-50">
             <div className="text-6xl font-black text-red-900 mb-8 font-mono">{fmt(timeLeft)}</div>
             <div className="flex gap-4">
                 <button onClick={() => setIsActive(!isActive)} className="px-8 py-3 bg-red-600 text-white rounded-xl font-bold">{isActive ? "Pause" : "Start"}</button>
                 <button onClick={() => { setIsActive(false); setTimeLeft(25 * 60); }} className="px-8 py-3 bg-red-200 text-red-800 rounded-xl font-bold">Reset</button>
             </div>
         </div>
    );
};

const WheelGame = () => {
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState("Spin for Activity");
    const options = ["Drink Water", "Stretch", "Deep Breath", "Walk", "Journal", "Call a Friend", "Doodle", "Listen to Music"];

    const spin = () => {
        if(spinning) return;
        setSpinning(true);
        setResult("Spinning...");
        setTimeout(() => {
            setResult(options[Math.floor(Math.random() * options.length)]);
            setSpinning(false);
            playSound('success');
        }, 2000);
    };

    return (
        <div className="h-full flex flex-col items-center justify-center bg-orange-50">
            <div className={`w-64 h-64 rounded-full border-8 border-orange-300 flex items-center justify-center bg-white shadow-xl mb-8 ${spinning ? 'animate-spin' : ''}`}>
                <span className="text-4xl">🎡</span>
            </div>
            <h2 className="text-2xl font-bold text-orange-900 mb-6 text-center px-4">{result}</h2>
            <button onClick={spin} className="px-8 py-3 bg-orange-500 text-white rounded-xl font-bold shadow-lg active:scale-95 transition-transform">
                Spin Wheel
            </button>
        </div>
    );
};

const JournalView = ({ onBack }: { onBack: () => void }) => {
  const [entry, setEntry] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [showGuide, setShowGuide] = useState(false);

  // Camera State
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startCamera = () => setIsCameraOpen(true);
  
  const stopCamera = () => {
      if (videoRef.current && videoRef.current.srcObject) {
          const stream = videoRef.current.srcObject as MediaStream;
          stream.getTracks().forEach(t => t.stop());
      }
      setIsCameraOpen(false);
  };

  const takePhoto = () => {
      if (videoRef.current) {
          const canvas = document.createElement("canvas");
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          const ctx = canvas.getContext("2d");
          if (ctx) {
              // Apply scale-x-[-1] to the capture to match the preview
              ctx.translate(canvas.width, 0);
              ctx.scale(-1, 1);
              ctx.drawImage(videoRef.current, 0, 0);
              setCapturedImage(canvas.toDataURL("image/jpeg"));
          }
          stopCamera();
      }
  };

  useEffect(() => {
      const initCamera = async () => {
          if (isCameraOpen) {
              try {
                  const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
                  if (videoRef.current) videoRef.current.srcObject = stream;
              } catch(e) {
                  console.error(e);
                  alert("Could not access camera");
                  setIsCameraOpen(false);
              }
          }
      };
      if (isCameraOpen) initCamera();
      
      return () => {
          // Cleanup only if we are unmounting or closing
          if (videoRef.current && videoRef.current.srcObject) {
             const stream = videoRef.current.srcObject as MediaStream;
             stream.getTracks().forEach(t => t.stop());
          }
      }
  }, [isCameraOpen]);

  const getPrompt = async () => {
    setLoading(true); try { const response = await ai.models.generateContent({ model: AI_MODEL, contents: "Give me a gentle, thoughtful journaling prompt for self-reflection or anxiety relief.", }); setPrompt(response.text?.trim() || "What are you grateful for today?"); } catch (e) { setPrompt("Write about a moment that made you smile today."); } finally { setLoading(false); }
  };
  const toggleListening = () => {
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); } else { const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition; if (!SpeechRecognition) { alert("Speech recognition is not supported in your browser."); return; } const recognition = new SpeechRecognition(); recognition.continuous = true; recognition.interimResults = true; recognition.lang = 'en-US'; recognition.onstart = () => setIsListening(true); recognition.onend = () => setIsListening(false); recognition.onresult = (event: any) => { let finalChunk = ''; for (let i = event.resultIndex; i < event.results.length; ++i) { if (event.results[i].isFinal) { finalChunk += event.results[i][0].transcript + " "; } } if (finalChunk) { setEntry(prev => (prev + finalChunk).replace(/^\s+/, '')); } }; recognitionRef.current = recognition; recognition.start(); }
  };
  const speakPrompt = () => { if (!prompt) return; window.speechSynthesis.cancel(); const utterance = new SpeechSynthesisUtterance(prompt); utterance.rate = 0.9; utterance.pitch = 1; window.speechSynthesis.speak(utterance); };
  useEffect(() => { return () => { window.speechSynthesis.cancel(); recognitionRef.current?.stop(); }; }, []);

  return (
    <div className="h-full flex flex-col fade-in relative">
        {isCameraOpen && (
            <div className="fixed inset-0 bg-black z-50 flex flex-col animate-in fade-in duration-300">
                <div className="flex-1 relative bg-black flex items-center justify-center">
                    {/* Add muted attribute to allow autoplay and mirroring transform */}
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform scale-x-[-1]" />
                    <button onClick={stopCamera} className="absolute top-4 right-4 p-3 bg-black/40 text-white rounded-full backdrop-blur-sm">
                        <X className="w-8 h-8" />
                    </button>
                </div>
                <div className="p-8 bg-black flex justify-center pb-12">
                     <button onClick={takePhoto} className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center hover:scale-105 transition-transform active:scale-95 bg-white/10">
                         <div className="w-16 h-16 bg-white rounded-full shadow-lg" />
                     </button>
                </div>
            </div>
        )}

       <Header title="Journal" goBack={onBack} rightAction={<button onClick={() => setShowGuide(true)}><HelpCircle className="w-6 h-6 text-slate-400" /></button>} />
       <div className="p-6 flex-1 flex flex-col overflow-y-auto">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-4 relative shrink-0">
             <p className="text-sm font-bold text-teal-600 mb-2 uppercase flex justify-between items-center">
                Writing Prompt
                {prompt && (<button onClick={speakPrompt} className="text-teal-500 hover:text-teal-700 p-1"><Volume2 className="w-4 h-4" /></button>)}
             </p>
             <p className="text-slate-700 italic pr-8">{prompt || "Need inspiration? Tap the button below."}</p>
          </div>

          {capturedImage && (
             <div className="mb-4 relative rounded-xl overflow-hidden shadow-md group shrink-0 h-48 bg-slate-100 w-full border border-slate-200">
                 <img src={capturedImage} alt="Journal attachment" className="w-full h-full object-cover" />
                 <button onClick={() => setCapturedImage(null)} className="absolute top-2 right-2 p-2 bg-white/80 text-red-600 rounded-full shadow-md hover:bg-white transition-all">
                     <Trash2 className="w-4 h-4" />
                 </button>
             </div>
          )}

          <div className="flex gap-2 mb-2 overflow-x-auto no-scrollbar">
             <button 
                 onClick={() => {
                     const d = new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
                     setEntry(prev => (prev ? prev + "\n" : "") + "📅 " + d + "\n");
                 }} 
                 className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-bold text-slate-600 flex items-center gap-1.5 hover:bg-slate-200 transition-colors whitespace-nowrap"
             >
                 <Calendar className="w-3.5 h-3.5" /> Add Date
             </button>
             <button 
                 onClick={() => {
                     const t = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
                     setEntry(prev => (prev ? prev + " " : "") + "⏰ " + t + " ");
                 }} 
                 className="px-3 py-1.5 bg-slate-100 rounded-lg text-xs font-bold text-slate-600 flex items-center gap-1.5 hover:bg-slate-200 transition-colors whitespace-nowrap"
             >
                 <Clock className="w-3.5 h-3.5" /> Add Time
             </button>
          </div>

          <div className="relative flex-1 mb-4 min-h-[200px] flex flex-col">
              <textarea 
                  className="w-full flex-1 p-4 rounded-xl border border-slate-200 focus:border-teal-500 outline-none resize-none bg-white text-slate-800 pb-20" 
                  placeholder="Start writing or speaking your thoughts here..." 
                  value={entry} 
                  onChange={(e) => setEntry(e.target.value)} 
              />
              <div className="absolute bottom-4 right-4 flex gap-3">
                 <button onClick={startCamera} className="p-3 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 bg-slate-200 text-slate-600 hover:bg-slate-300" title="Add Photo">
                    <Camera className="w-6 h-6" />
                 </button>
                 <button onClick={toggleListening} className={`p-3 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 ${isListening ? "bg-red-500 text-white animate-pulse" : "bg-teal-600 text-white"}`} title={isListening ? "Stop Listening" : "Start Dictation"}>
                    {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                 </button>
              </div>
          </div>

          <div className="flex gap-3 shrink-0">
             <button onClick={getPrompt} disabled={loading} className="flex-1 py-3 px-4 bg-indigo-50 text-indigo-700 rounded-xl font-bold hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2">
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <BookHeart className="w-5 h-5" />}Inspire Me
             </button>
             <button onClick={() => { setEntry(""); setCapturedImage(null); alert("Entry saved."); }} className="flex-1 py-3 px-4 bg-teal-600 text-white rounded-xl font-bold hover:bg-teal-700 transition-colors">
                Save Entry
             </button>
          </div>
       </div>
       {showGuide && <GuideModal onClose={() => setShowGuide(false)} />}
    </div>
  );
};

const CreativeView = ({ onBack, user }: { onBack: () => void, user: UserProfile }) => {
  const [activeTab, setActiveTab] = useState<'ART' | 'MUSIC' | 'IMAGE'>('ART');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [color, setColor] = useState("#0d9488");
  const [tool, setTool] = useState<'pen' | 'eraser' | 'fill'>('pen');
  const [lineWidth, setLineWidth] = useState(5);
  const [opacity, setOpacity] = useState(1);
  const [brushType, setBrushType] = useState<'normal' | 'watercolor' | 'chalk' | 'pixel' | 'oil' | 'charcoal' | 'stipple'>('normal');
  const [blendMode, setBlendMode] = useState<GlobalCompositeOperation>('source-over');
  const [guide, setGuide] = useState<'NONE' | 'GRID' | 'ISOMETRIC' | 'FIBONACCI' | 'SYMMETRY_X' | 'SYMMETRY_Y' | 'SYMMETRY_QUAD' | 'RADIAL' | 'RADIAL_6' | 'RADIAL_12' | 'PERSPECTIVE_1' | 'PERSPECTIVE_2' | 'RULE_THIRDS' | 'GOLDEN_RATIO'>('NONE');
  const [showGuides, setShowGuides] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const historyRef = useRef<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [showSaveFeedback, setShowSaveFeedback] = useState(false);
  const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showSoundMenu, setShowSoundMenu] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  
  // Brush Enhancements
  const [scatter, setScatter] = useState(0); // 0 - 50
  const [flow, setFlow] = useState(1); // 0.1 - 1.0
  const [texture, setTexture] = useState('NONE');
  const activePatternRef = useRef<CanvasPattern | string | null>(null);

  const [musicPrompt, setMusicPrompt] = useState("");
  const [loadingMusic, setLoadingMusic] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [soundMode, setSoundMode] = useState<'HARMONY' | 'RAIN' | 'DELTA' | 'CALM' | 'ENERGETIC' | 'FOCUS'>('HARMONY');
  const [sleepTimer, setSleepTimer] = useState<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const musicGainRef = useRef<GainNode | null>(null);
  const [playlist, setPlaylist] = useState<Song[] | null>(null);
  const [loadingPlaylist, setLoadingPlaylist] = useState(false);

  const [imgPrompt, setImgPrompt] = useState("");
  const [negativePrompt, setNegativePrompt] = useState("");
  const [aspectRatio, setAspectRatio] = useState("1:1");
  const [genImgUrl, setGenImgUrl] = useState<string | null>(null);
  const [isGenLoading, setIsGenLoading] = useState(false);
  const [isImgListening, setIsImgListening] = useState(false);
  const [imgStyles, setImgStyles] = useState<string[]>([]);
  const [styleIntensity, setStyleIntensity] = useState<'Subtle' | 'Standard' | 'Intense'>('Standard');
  const imgRecognitionRef = useRef<any>(null);

  const [imgHistory, setImgHistory] = useState<string[]>([]);
  const [imgHistoryIndex, setImgHistoryIndex] = useState(-1);

  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  
  const [pendingImage, setPendingImage] = useState<string | null>(null);

  const lastPos = useRef<{x: number, y: number} | null>(null);

  // --- Art Helper Functions ---

  useEffect(() => {
    // Generate texture pattern when color or texture changes
    if (texture === 'NONE') {
        activePatternRef.current = color;
    } else {
        const pCanvas = document.createElement('canvas');
        pCanvas.width = 64; pCanvas.height = 64;
        const pCtx = pCanvas.getContext('2d');
        if (pCtx) {
            pCtx.fillStyle = color;
            pCtx.fillRect(0, 0, 64, 64);
            
            pCtx.globalCompositeOperation = 'destination-out';
            if (texture === 'CANVAS') {
                pCtx.fillStyle = 'rgba(0,0,0,0.2)';
                for(let i=0; i<64; i+=2) pCtx.fillRect(i,0,1,64);
                for(let i=0; i<64; i+=2) pCtx.fillRect(0,i,64,1);
            } else if (texture === 'NOISE') {
                for(let i=0; i<400; i++) {
                    pCtx.fillStyle = `rgba(0,0,0,${Math.random() * 0.4})`;
                    pCtx.fillRect(Math.random()*64, Math.random()*64, 2, 2);
                }
            }

            const canvas = canvasRef.current;
            const ctx = canvas?.getContext('2d');
            if (ctx) {
                activePatternRef.current = ctx.createPattern(pCanvas, 'repeat');
            }
        }
    }
  }, [color, texture, activeTab]);

  const saveToHistory = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    if (historyIndex < historyRef.current.length - 1) historyRef.current = historyRef.current.slice(0, historyIndex + 1);
    historyRef.current.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
    setHistoryIndex(historyRef.current.length - 1);
  };
  const undo = () => { if (historyIndex > 0) { const newIndex = historyIndex - 1; setHistoryIndex(newIndex); const ctx = canvasRef.current?.getContext('2d'); if (ctx) ctx.putImageData(historyRef.current[newIndex], 0, 0); } };
  const redo = () => { if (historyIndex < historyRef.current.length - 1) { const newIndex = historyIndex + 1; setHistoryIndex(newIndex); const ctx = canvasRef.current?.getContext('2d'); if (ctx) ctx.putImageData(historyRef.current[newIndex], 0, 0); } };
  
  const saveToStorage = (silent: boolean = false) => { 
    const canvas = canvasRef.current; 
    if (canvas) { 
        try {
            localStorage.setItem("mindful_art_autosave", canvas.toDataURL()); 
            setLastSaved(new Date());
            if (!silent) {
                setShowSaveFeedback(true); 
                setTimeout(() => setShowSaveFeedback(false), 2000); 
            }
        } catch(e) {
            console.error("Save error", e);
        }
    } 
  };

  const loadFromStorage = () => { const saved = localStorage.getItem("mindful_art_autosave"); if (saved) { const img = new Image(); img.src = saved; img.onload = () => { const canvas = canvasRef.current; const ctx = canvas?.getContext('2d'); if (canvas && ctx) { ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.drawImage(img, 0, 0); saveToHistory(); } }; } else { alert("No saved drawing found!"); } };
  
  const getSymmetryPoints = (x: number, y: number, prevX: number, prevY: number, w: number, h: number) => {
      const cx = w / 2;
      const cy = h / 2;
      const points = [{x, y, prevX, prevY}];

      if (guide === 'SYMMETRY_X') {
          points.push({x: w - x, y: y, prevX: w - prevX, prevY: prevY});
      } else if (guide === 'SYMMETRY_Y') {
          points.push({x: x, y: h - y, prevX: prevX, prevY: h - prevY});
      } else if (guide === 'SYMMETRY_QUAD') {
          points.push({x: w - x, y: y, prevX: w - prevX, prevY: prevY});
          points.push({x: x, y: h - y, prevX: prevX, prevY: h - prevY});
          points.push({x: w - x, y: h - y, prevX: w - prevX, prevY: h - prevY});
      } else if (guide && guide.startsWith('RADIAL')) {
          let segments = 8;
          if (guide === 'RADIAL_6') segments = 6;
          if (guide === 'RADIAL_12') segments = 12;

          for (let i = 1; i < segments; i++) {
              const angle = (Math.PI * 2 / segments) * i;
              const cos = Math.cos(angle);
              const sin = Math.sin(angle);
              
              const dx = x - cx;
              const dy = y - cy;
              const rotX = dx * cos - dy * sin;
              const rotY = dx * sin + dy * cos;
              
              const pdx = prevX - cx;
              const pdy = prevY - cy;
              const rotPX = pdx * cos - pdy * sin;
              const rotPY = pdx * sin + pdy * cos;

              points.push({
                  x: cx + rotX, 
                  y: cy + rotY, 
                  prevX: cx + rotPX, 
                  prevY: cy + rotPY
              });
          }
      }
      return points;
  }

  const startDrawing = (e: any) => {
    setIsDrawing(true); playSound('draw', volume);
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
    lastPos.current = { x, y };

    if (tool === 'fill') { 
        floodFill(x, y, color);
        // Simple mirroring for fill - apply to symmetrical point if guide is active
        if (guide === 'SYMMETRY_X') floodFill(canvas.width - x, y, color);
        else if (guide === 'SYMMETRY_Y') floodFill(x, canvas.height - y, color);
        else if (guide === 'SYMMETRY_QUAD') {
            floodFill(canvas.width - x, y, color);
            floodFill(x, canvas.height - y, color);
            floodFill(canvas.width - x, canvas.height - y, color);
        }
        setIsDrawing(false); 
        return; 
    }

    const pts = getSymmetryPoints(x, y, x, y, canvas.width, canvas.height);
    pts.forEach(p => performDraw(p.x, p.y, p.x, p.y, ctx));
  };

  const performDraw = (x: number, y: number, prevX: number, prevY: number, ctx: CanvasRenderingContext2D) => {
      ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : blendMode;
      ctx.lineWidth = lineWidth;
      
      const style = tool === 'eraser' ? 'rgba(0,0,0,1)' : (activePatternRef.current || color);
      ctx.strokeStyle = style;
      ctx.fillStyle = style;

      // Apply Flow (build-up) to opacity
      ctx.globalAlpha = (tool === 'eraser' ? 1 : opacity) * flow;
      ctx.lineCap = 'round'; ctx.lineJoin = 'round';

      const getScatter = () => (Math.random() - 0.5) * scatter;

      if (brushType === 'pixel') {
          const size = Math.max(1, Math.floor(lineWidth));
          const px = Math.floor((x + getScatter()) / size) * size;
          const py = Math.floor((y + getScatter()) / size) * size;
          ctx.fillRect(px, py, size, size);
      } else if (brushType === 'chalk') {
          for(let i=0; i<3; i++) {
             const offsetX = (Math.random() - 0.5) * lineWidth + getScatter();
             const offsetY = (Math.random() - 0.5) * lineWidth + getScatter();
             ctx.fillRect(x + offsetX, y + offsetY, 1, 1);
          }
      } else if (brushType === 'charcoal') {
          for(let i=0; i<4; i++) {
             const offsetX = (Math.random() - 0.5) * lineWidth + getScatter();
             const offsetY = (Math.random() - 0.5) * lineWidth + getScatter();
             ctx.fillRect(x + offsetX, y + offsetY, 2, 2);
          }
      } else if (brushType === 'stipple') {
          const radius = lineWidth / 2;
          ctx.beginPath();
          ctx.arc(x + getScatter(), y + getScatter(), radius, 0, Math.PI * 2); 
          ctx.fill();
      } else {
          // Normal, Watercolor, Oil
          if (scatter > 0 && tool !== 'eraser') {
             // For scattered normal brush, draw disconnected segments or dots to simulate jitter
             ctx.beginPath();
             ctx.moveTo(prevX + getScatter(), prevY + getScatter());
             ctx.lineTo(x + getScatter(), y + getScatter());
             ctx.stroke();
          } else {
             ctx.beginPath(); ctx.moveTo(prevX, prevY); ctx.lineTo(x, y); ctx.stroke();
          }
      }
  };

  const draw = (e: any) => {
    if (!isDrawing || !lastPos.current) return;
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
    const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

    const pts = getSymmetryPoints(x, y, lastPos.current.x, lastPos.current.y, canvas.width, canvas.height);
    pts.forEach(p => performDraw(p.x, p.y, p.prevX, p.prevY, ctx));

    lastPos.current = { x, y };
  };
  const stopDrawing = () => { if (isDrawing) { setIsDrawing(false); saveToHistory(); lastPos.current = null; } };
  
  const floodFill = (startX: number, startY: number, fillColor: string) => {
    playSound('color', volume);
    const canvas = canvasRef.current; if(!canvas) return;
    const ctx = canvas.getContext('2d'); if(!ctx) return;
    const imgData = ctx.getImageData(0,0,canvas.width,canvas.height);
    const pixelStack = [[Math.floor(startX), Math.floor(startY)]];
    const width = canvas.width; const height = canvas.height;
    
    // Parse Fill Color
    const div = document.createElement('div'); div.style.color = fillColor; document.body.appendChild(div);
    const c = window.getComputedStyle(div).color.match(/\d+/g)?.map(Number); document.body.removeChild(div);
    if(!c) return;
    const fillR=c[0], fillG=c[1], fillB=c[2], fillA=255; // simple full opacity fill

    const startPos = (Math.floor(startY) * width + Math.floor(startX)) * 4;
    const startR = imgData.data[startPos], startG = imgData.data[startPos+1], startB = imgData.data[startPos+2], startA = imgData.data[startPos+3];
    if (startR===fillR && startG===fillG && startB===fillB && startA===fillA) return;

    while(pixelStack.length) {
       const newPos = pixelStack.pop();
       if(!newPos) continue;
       let x = newPos[0], y = newPos[1];
       let pixelPos = (y*width + x) * 4;
       while(y-- >= 0 && matchStartColor(pixelPos, imgData.data, startR, startG, startB, startA)) pixelPos -= width * 4;
       pixelPos += width * 4; y++;
       let reachLeft = false, reachRight = false;
       while(y++ < height-1 && matchStartColor(pixelPos, imgData.data, startR, startG, startB, startA)) {
           colorPixel(pixelPos, imgData.data, fillR, fillG, fillB, fillA);
           if(x > 0) { if(matchStartColor(pixelPos-4, imgData.data, startR, startG, startB, startA)) { if(!reachLeft) { pixelStack.push([x-1, y]); reachLeft=true; } } else if(reachLeft) reachLeft=false; }
           if(x < width-1) { if(matchStartColor(pixelPos+4, imgData.data, startR, startG, startB, startA)) { if(!reachRight) { pixelStack.push([x+1, y]); reachRight=true; } } else if(reachRight) reachRight=false; }
           pixelPos += width * 4;
       }
    }
    ctx.putImageData(imgData, 0, 0); saveToHistory();
  };
  const matchStartColor = (pos: number, data: Uint8ClampedArray, r:number, g:number, b:number, a:number) => data[pos]===r && data[pos+1]===g && data[pos+2]===b && data[pos+3]===a;
  const colorPixel = (pos: number, data: Uint8ClampedArray, r:number, g:number, b:number, a:number) => { data[pos]=r; data[pos+1]=g; data[pos+2]=b; data[pos+3]=a; };
  const applyPreset = (p: typeof BRUSH_PRESETS[0]) => { setLineWidth(p.size); setOpacity(p.opacity); setBrushType(p.type); setTool('pen'); };
  const applyFilter = (filterId: string) => {
    playSound('click', volume);
    const canvas = canvasRef.current; if(!canvas) return;
    const ctx = canvas.getContext('2d'); if(!ctx) return;
    const imgData = ctx.getImageData(0,0,canvas.width,canvas.height);
    const d = imgData.data;
    for(let i=0; i<d.length; i+=4) {
        const r=d[i], g=d[i+1], b=d[i+2];
        if(filterId === 'grayscale') { const v=0.3*r+0.59*g+0.11*b; d[i]=d[i+1]=d[i+2]=v; }
        else if(filterId === 'sepia') { d[i]=r*0.393+g*0.769+b*0.189; d[i+1]=r*0.349+g*0.686+b*0.168; d[i+2]=r*0.272+g*0.534+b*0.131; }
        else if(filterId === 'invert') { d[i]=255-r; d[i+1]=255-g; d[i+2]=255-b; }
        else if(filterId === 'posterize') { d[i]=Math.floor(r/64)*64; d[i+1]=Math.floor(g/64)*64; d[i+2]=Math.floor(b/64)*64; }
    }
    ctx.putImageData(imgData,0,0); saveToHistory();
  };
  const loadTemplate = (src: string) => {
    setIsLoadingTemplate(true);
    const img = new Image();
    // Only set crossOrigin if NOT data URI to avoid potential issues with local data
    if (!src.startsWith('data:')) {
        img.crossOrigin = "anonymous";
    }
    img.src = src;
    img.onload = () => { 
        const canvas = canvasRef.current; 
        const ctx = canvas?.getContext('2d'); 
        if(canvas && ctx) { 
            ctx.clearRect(0,0,canvas.width,canvas.height); 
            // Calculate scale to fit while maintaining aspect ratio
            const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
            const w = img.width * scale;
            const h = img.height * scale;
            const x = (canvas.width - w) / 2;
            const y = (canvas.height - h) / 2;
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0,0,canvas.width, canvas.height);
            ctx.drawImage(img,x,y,w,h); 
            saveToHistory(); 
        } 
        setIsLoadingTemplate(false);
    };
    img.onerror = () => setIsLoadingTemplate(false);
  };
  
  const clearCanvas = () => {
    if (confirm("Are you sure you want to clear your artwork?")) {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (canvas && ctx) {
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            saveToHistory();
            playSound('clear', volume);
        }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.files && e.target.files[0]) {
        const reader = new FileReader();
        reader.onload = (evt) => {
            const img = new Image(); img.src = evt.target?.result as string;
            img.onload = () => { const canvas = canvasRef.current; const ctx = canvas?.getContext('2d'); if(canvas && ctx) { 
                const scale = Math.min(canvas.width/img.width, canvas.height/img.height);
                const w = img.width*scale; const h = img.height*scale;
                ctx.drawImage(img, (canvas.width-w)/2, (canvas.height-h)/2, w, h);
                saveToHistory();
            }};
        };
        reader.readAsDataURL(e.target.files[0]);
    }
  };
  const downloadDrawing = () => {
      const canvas = canvasRef.current; if(canvas) {
          const link = document.createElement('a'); link.download = 'lumina-art.png'; link.href = canvas.toDataURL(); link.click();
      }
  };

  // --- Tutorial ---
  const startTutorial = () => { setShowTutorial(true); setTutorialStep(0); };
  const nextTutorial = () => { if(tutorialStep < TUTORIAL_STEPS.length - 1) setTutorialStep(s => s + 1); else setShowTutorial(false); };
  const skipTutorial = () => setShowTutorial(false);

  // --- Image Gen Helper ---
  const toggleImgListening = () => {
    if (isImgListening) { imgRecognitionRef.current?.stop(); setIsImgListening(false); } else { const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition; if (!SpeechRecognition) { alert("Not supported"); return; } const recognition = new SpeechRecognition(); recognition.continuous = true; recognition.interimResults = true; recognition.lang = 'en-US'; recognition.onstart = () => setIsImgListening(true); recognition.onend = () => setIsImgListening(false); recognition.onresult = (event: any) => { let finalChunk = ''; for (let i = event.resultIndex; i < event.results.length; ++i) { if (event.results[i].isFinal) finalChunk += event.results[i][0].transcript + " "; } if (finalChunk) setImgPrompt(prev => prev + finalChunk); }; imgRecognitionRef.current = recognition; recognition.start(); }
  };
  const handleImageGeneration = async () => {
      setIsGenLoading(true); 
      try {
          const stylePrompt = imgStyles.length > 0 ? `, ${styleIntensity} intensity ${imgStyles.join(" and ")} style` : "";
          const finalPrompt = imgPrompt + stylePrompt;

          const config: any = { 
              numberOfImages: 1, 
              aspectRatio: aspectRatio, 
              outputMimeType: 'image/jpeg' 
          };
          // Try to pass negative prompt if present (supported by some Imagen endpoints)
          if (negativePrompt.trim()) {
              config.negativePrompt = negativePrompt.trim();
          }

          const response = await ai.models.generateImages({
              model: IMAGEN_MODEL,
              prompt: finalPrompt || "A peaceful landscape",
              config: config
          });
          if(response.generatedImages?.[0]?.image?.imageBytes) {
              const newUrl = `data:image/jpeg;base64,${response.generatedImages[0].image.imageBytes}`;
              
              const newHistory = [...imgHistory.slice(0, imgHistoryIndex + 1), newUrl];
              setImgHistory(newHistory);
              setImgHistoryIndex(newHistory.length - 1);
              setGenImgUrl(newUrl);
          }
      } catch (e) { alert("Could not generate image. Please try a different prompt."); } finally { setIsGenLoading(false); }
  };
  
  const imgUndo = () => {
      if (imgHistoryIndex > 0) {
          const newIndex = imgHistoryIndex - 1;
          setImgHistoryIndex(newIndex);
          setGenImgUrl(imgHistory[newIndex]);
      }
  };

  const imgRedo = () => {
      if (imgHistoryIndex < imgHistory.length - 1) {
          const newIndex = imgHistoryIndex + 1;
          setImgHistoryIndex(newIndex);
          setGenImgUrl(imgHistory[newIndex]);
      }
  };

  const deleteCurrentImage = () => {
      if (imgHistory.length === 0) return;
      const newHistory = [...imgHistory];
      newHistory.splice(imgHistoryIndex, 1);
      setImgHistory(newHistory);
      
      if (newHistory.length === 0) {
          setGenImgUrl(null);
          setImgHistoryIndex(-1);
      } else {
          const newIndex = Math.min(imgHistoryIndex, newHistory.length - 1);
          setImgHistoryIndex(newIndex);
          setGenImgUrl(newHistory[newIndex]);
      }
  };

  const clearHistory = () => {
      if (imgHistory.length > 0 && confirm("Are you sure you want to clear your image history?")) {
          setImgHistory([]);
          setImgHistoryIndex(-1);
          setGenImgUrl(null);
      }
  };

  const handleEditInArt = () => {
      if (genImgUrl) {
          setPendingImage(genImgUrl);
          setActiveTab('ART');
      }
  };

  // --- Music Helper ---
  const getMusicPrompt = async () => {
      setLoadingMusic(true);
      try { const response = await ai.models.generateContent({ model: AI_MODEL, contents: `Suggest a short, specific music therapy activity for someone feeling ${user.mood}.` }); setMusicPrompt(response.text?.trim() || "Listen to 432Hz ambient music."); } catch(e) { setMusicPrompt("Listen to rain sounds."); } finally { setLoadingMusic(false); }
  };

  const generatePlaylist = async () => {
      setLoadingPlaylist(true);
      try {
          const response = await ai.models.generateContent({
              model: AI_MODEL,
              contents: `Generate a music playlist of 5 songs for someone feeling ${user.mood || "calm"}. Return JSON with title and artist.`,
              config: { 
                  responseMimeType: "application/json", 
                  responseSchema: { 
                      type: Type.ARRAY, 
                      items: { 
                          type: Type.OBJECT, 
                          properties: { 
                              title: { type: Type.STRING }, 
                              artist: { type: Type.STRING } 
                          } 
                      } 
                  } 
              }
          });
          setPlaylist(JSON.parse(response.text || "[]"));
      } catch (e) {
          setPlaylist([{ title: "Weightless", artist: "Marconi Union" }, { title: "Clair de Lune", artist: "Debussy" }, { title: "Spiegel im Spiegel", artist: "Arvo Pärt" }]);
      } finally {
          setLoadingPlaylist(false);
      }
  };

  useEffect(() => {
    let timeout: any;
    if (isMusicPlaying && sleepTimer) {
        timeout = setTimeout(() => { setIsMusicPlaying(false); setSleepTimer(null); }, sleepTimer * 60000);
    }
    return () => clearTimeout(timeout);
  }, [isMusicPlaying, sleepTimer]);

  useEffect(() => {
      if (isMusicPlaying) {
          if (musicGainRef.current) musicGainRef.current.gain.setTargetAtTime(volume * 0.3, audioCtxRef.current!.currentTime, 0.1);
      }
  }, [volume]);

  useEffect(() => {
     if (!isMusicPlaying && audioCtxRef.current) {
         const ctx = audioCtxRef.current;
         if (musicGainRef.current) musicGainRef.current.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
         setTimeout(() => { ctx.close(); audioCtxRef.current = null; }, 2000);
     } else if (isMusicPlaying && !audioCtxRef.current) {
         const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
         const ctx = new AudioContext(); audioCtxRef.current = ctx;
         const masterGain = ctx.createGain(); masterGain.gain.value = 0; masterGain.connect(ctx.destination); musicGainRef.current = masterGain;

         if (soundMode === 'HARMONY') {
             const freqs = [130.81, 164.81, 196.00, 246.94];
             freqs.forEach(f => { const osc = ctx.createOscillator(); osc.frequency.value = f; const g = ctx.createGain(); g.gain.value = 0.15; osc.connect(g); g.connect(masterGain); osc.start(); });
         } else if (soundMode === 'CALM') {
             // Soothing, lower frequency sine waves for 'Calm'
             const freqs = [110.00, 164.81, 196.00]; 
             freqs.forEach(f => { const osc = ctx.createOscillator(); osc.type = 'sine'; osc.frequency.value = f; const g = ctx.createGain(); g.gain.value = 0.15; osc.connect(g); g.connect(masterGain); osc.start(); });
         } else if (soundMode === 'RAIN' || soundMode === 'FOCUS') {
             const bufferSize = ctx.sampleRate * 2; const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate); const data = buffer.getChannelData(0);
             for(let i=0; i<bufferSize; i++) data[i] = Math.random() * 2 - 1;
             const noise = ctx.createBufferSource(); noise.buffer = buffer; noise.loop = true;
             const filter = ctx.createBiquadFilter(); filter.type = 'lowpass'; filter.frequency.value = 800;
             noise.connect(filter); filter.connect(masterGain); noise.start();
             if (soundMode === 'FOCUS') {
                 const osc = ctx.createOscillator(); osc.frequency.value = 40; const g = ctx.createGain(); g.gain.value = 0.05; osc.connect(g); g.connect(masterGain); osc.start();
             }
         } else if (soundMode === 'DELTA') {
             const osc1 = ctx.createOscillator(); osc1.frequency.value = 100;
             const osc2 = ctx.createOscillator(); osc2.frequency.value = 104;
             osc1.connect(masterGain); osc2.connect(masterGain); osc1.start(); osc2.start();
         } else if (soundMode === 'ENERGETIC') {
             [261.63, 329.63, 392.00].forEach(f => { const osc = ctx.createOscillator(); osc.type = 'triangle'; osc.frequency.value = f; osc.connect(masterGain); osc.start(); });
             const lfo = ctx.createOscillator(); lfo.frequency.value = 2; const lfoGain = ctx.createGain(); lfoGain.gain.value = 0.2; lfo.connect(lfoGain); lfoGain.connect(masterGain.gain); lfo.start();
         }
         masterGain.gain.linearRampToValueAtTime(volume * 0.3, ctx.currentTime + 2);
     }
  }, [isMusicPlaying, soundMode]);

  useEffect(() => {
    if (activeTab === 'ART' && canvasRef.current) {
        const canvas = canvasRef.current; 
        canvas.width = canvas.offsetWidth; 
        canvas.height = canvas.offsetHeight;
        
        const ctx = canvas.getContext('2d'); 
        if (ctx) { 
            ctx.lineCap = 'round'; 
            ctx.lineJoin = 'round'; 
            
            // If there's a pending image from the Image Generator, prioritize loading it
            if (pendingImage) {
                loadTemplate(pendingImage);
                // We clear pendingImage immediately. Since we omitted pendingImage from the 
                // dependency array, this state update will trigger a re-render but NOT 
                // re-run this effect, preserving the newly loaded image.
                setPendingImage(null);
            } else {
                // Standard initialization: Clear and Restore History
                ctx.fillStyle = '#ffffff'; 
                ctx.fillRect(0,0, canvas.width, canvas.height); 
                
                if (historyIndex >= 0 && historyRef.current[historyIndex]) {
                    ctx.putImageData(historyRef.current[historyIndex], 0, 0); 
                } else {
                    saveToHistory(); 
                }
            }
        }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]); // We depend only on activeTab to handle the initialization logic

  useEffect(() => { let interval: any; if (activeTab === 'ART') interval = setInterval(() => saveToStorage(true), 30000); return () => clearInterval(interval); }, [activeTab]);
  useEffect(() => { return () => { imgRecognitionRef.current?.stop(); }; }, []);
  
  return (
    <div className="h-full flex flex-col fade-in bg-slate-50 relative">
       <Header title="Creative Space" goBack={onBack} rightAction={<button onClick={() => setShowGuide(true)}><HelpCircle className="w-6 h-6 text-slate-400" /></button>} />
       <div className="flex bg-white shadow-sm mb-1 justify-center">
         {['ART', 'MUSIC', 'IMAGE'].map((t) => (
           <button key={t} onClick={() => setActiveTab(t as any)} className={`px-6 py-3 font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === t ? 'border-teal-600 text-teal-700' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
             {t==='ART' && <Palette className="w-4 h-4"/>} {t==='MUSIC' && <Music className="w-4 h-4"/>} {t==='IMAGE' && <ImageIcon className="w-4 h-4"/>} {t}
           </button>
         ))}
       </div>

       {activeTab === 'ART' && (
         <div className="flex-1 flex flex-col overflow-hidden relative">
            <div className="bg-white p-2 border-b border-slate-200 flex flex-wrap items-center gap-2 justify-between">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                 <div className="flex bg-slate-100 p-1 rounded-lg shrink-0">
                    <button onClick={() => setTool('pen')} className={`p-2 rounded-md ${tool==='pen' ? 'bg-white shadow-sm' : ''} hover:scale-110 transition-all`}><Pencil className="w-5 h-5 text-slate-700"/></button>
                    <button onClick={() => setTool('eraser')} className={`p-2 rounded-md ${tool==='eraser' ? 'bg-white shadow-sm' : ''} hover:scale-110 transition-all`}><Eraser className="w-5 h-5 text-slate-700"/></button>
                    <button onClick={() => setTool('fill')} className={`p-2 rounded-md ${tool==='fill' ? 'bg-white shadow-sm' : ''} hover:scale-110 transition-all`}><PaintBucket className="w-5 h-5 text-slate-700"/></button>
                 </div>
                 
                 {/* Enhanced Color Picker */}
                 <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg px-3 shrink-0">
                    <div className="flex gap-1.5">
                        {['#000000', '#ef4444', '#f97316', '#eab308', '#22c55e', '#06b6d4', '#3b82f6', '#a855f7', '#ec4899', '#ffffff'].map(c => (
                            <button 
                                key={c}
                                onClick={() => { setColor(c); playSound('color', volume); }}
                                className={`w-5 h-5 rounded-full border border-slate-300 transition-all hover:scale-110 ${color === c ? 'ring-2 ring-teal-600 scale-110 z-10' : 'opacity-80 hover:opacity-100'}`}
                                style={{backgroundColor: c}}
                                title={c}
                            />
                        ))}
                    </div>
                    <div className="w-px h-5 bg-slate-300 mx-1"></div>
                    <div className="relative group w-7 h-7 shrink-0 cursor-pointer">
                        <div className="w-full h-full rounded-full border-2 border-white shadow-[0_0_0_1px_rgba(203,213,225,1)] transition-transform group-hover:scale-105" style={{backgroundColor: color}} />
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-slate-200 pointer-events-none">
                            <Palette className="w-2.5 h-2.5 text-slate-600" />
                        </div>
                        <input type="color" value={color} onChange={(e) => {setColor(e.target.value); playSound('color', volume);}} className="absolute inset-0 opacity-0 cursor-pointer" title="Custom Color" />
                    </div>
                 </div>

                 <div className="flex bg-slate-100 p-1 rounded-lg items-center gap-2 px-3 shrink-0">
                    <span className="text-xs font-bold text-slate-500">Size</span>
                    <input type="range" min="1" max="50" value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))} className="w-16 accent-teal-600 cursor-pointer" />
                 </div>
                 <div className="flex bg-slate-100 p-1 rounded-lg items-center gap-2 px-3 shrink-0">
                    <span className="text-xs font-bold text-slate-500">Opacity</span>
                    <input type="range" min="0.1" max="1" step="0.1" value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} className="w-16 accent-teal-600 cursor-pointer" />
                 </div>
                 <div className="flex bg-slate-100 p-1 rounded-lg items-center gap-2 px-3">
                    <span className="text-xs font-bold text-slate-500">Flow</span>
                    <input type="range" min="0.1" max="1" step="0.1" value={flow} onChange={(e) => setFlow(Number(e.target.value))} className="w-16 accent-teal-600" />
                 </div>
                 <div className="flex bg-slate-100 p-1 rounded-lg items-center gap-2 px-3">
                    <span className="text-xs font-bold text-slate-500">Scatter</span>
                    <input type="range" min="0" max="50" value={scatter} onChange={(e) => setScatter(Number(e.target.value))} className="w-16 accent-teal-600" />
                 </div>
                 <div className="relative group">
                    <button className={`p-2 hover:bg-slate-100 rounded-full transition-all hover:scale-110 ${texture !== 'NONE' ? 'text-teal-600 bg-teal-50' : 'text-slate-600'}`} title="Texture"><Grip className="w-5 h-5"/></button>
                    <div className="absolute top-full right-0 bg-white shadow-xl rounded-xl p-2 hidden group-hover:block z-20 min-w-[150px]">
                        {TEXTURES.map(t => (
                            <button 
                                key={t.name} 
                                onClick={() => setTexture(t.id)} 
                                className={`block w-full text-left p-2 hover:bg-slate-50 text-sm font-bold ${texture === t.id ? 'text-teal-600' : 'text-slate-700'}`}
                            >
                                {t.name}
                            </button>
                        ))}
                    </div>
                 </div>
              </div>
              <div className="flex items-center gap-1 mt-2 sm:mt-0">
                <button onClick={undo} className="p-2 hover:bg-slate-100 rounded-full transition-all hover:scale-110"><Undo className="w-5 h-5 text-slate-600" /></button>
                <button onClick={redo} className="p-2 hover:bg-slate-100 rounded-full transition-all hover:scale-110"><Redo className="w-5 h-5 text-slate-600" /></button>
                <div className="h-6 w-px bg-slate-300 mx-1" />
                <button onClick={clearCanvas} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 hover:text-red-500 transition-all hover:scale-110" title="Clear Canvas"><Trash2 className="w-5 h-5"/></button>
                <div className="flex items-center gap-1">
                    <button onClick={() => saveToStorage(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 hover:text-teal-600 transition-all hover:scale-110" title="Save"><Save className="w-5 h-5"/></button>
                    {lastSaved && <span className="text-[10px] font-bold text-teal-600 hidden sm:block">Saved {lastSaved.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>}
                </div>
                <button onClick={loadFromStorage} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 hover:text-teal-600 transition-all hover:scale-110" title="Load"><FolderOpen className="w-5 h-5"/></button>
                <button onClick={downloadDrawing} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 hover:text-teal-600 transition-all hover:scale-110" title="Download"><Download className="w-5 h-5"/></button>
                <div className="relative group">
                   <button className="p-2 hover:bg-slate-100 rounded-full text-slate-600 hover:text-teal-600 transition-all hover:scale-110"><LayoutTemplate className="w-5 h-5"/></button>
                   <div className="absolute top-full right-0 bg-white shadow-xl rounded-xl p-2 hidden group-hover:block z-20 min-w-[150px]">
                      {TEMPLATES.map(t => <button key={t.name} onClick={() => loadTemplate(t.src)} className="block w-full text-left p-2 hover:bg-slate-50 text-sm font-bold text-slate-700">{t.name}</button>)}
                   </div>
                </div>
                <div className="relative group">
                   <button className="p-2 hover:bg-slate-100 rounded-full text-slate-600 hover:text-teal-600 transition-all hover:scale-110"><Bookmark className="w-5 h-5"/></button>
                   <div className="absolute top-full right-0 bg-white shadow-xl rounded-xl p-2 hidden group-hover:block z-20 min-w-[150px]">
                      {BRUSH_PRESETS.map(p => <button key={p.name} onClick={() => applyPreset(p)} className="block w-full text-left p-2 hover:bg-slate-50 text-sm font-bold text-slate-700">{p.name}</button>)}
                   </div>
                </div>
                 <div className="relative group">
                   <button className="p-2 hover:bg-slate-100 rounded-full text-slate-600 hover:text-teal-600 transition-all hover:scale-110"><Layers className="w-5 h-5"/></button>
                   <div className="absolute top-full right-0 bg-white shadow-xl rounded-xl p-2 hidden group-hover:block z-20 min-w-[150px]">
                      {BLEND_MODES.map(b => <button key={b.name} onClick={() => setBlendMode(b.mode)} className={`block w-full text-left p-2 hover:bg-slate-50 text-sm font-bold ${blendMode === b.mode ? 'text-teal-600' : 'text-slate-700'}`}>{b.name}</button>)}
                   </div>
                </div>
                <div className="relative group">
                   <button className="p-2 hover:bg-slate-100 rounded-full text-slate-600 hover:text-teal-600 transition-all hover:scale-110"><Wand2 className="w-5 h-5"/></button>
                   <div className="absolute top-full right-0 bg-white shadow-xl rounded-xl p-2 hidden group-hover:block z-20 min-w-[150px]">
                      {FILTERS.map(f => <button key={f.name} onClick={() => applyFilter(f.id)} className="block w-full text-left p-2 hover:bg-slate-50 text-sm font-bold text-slate-700">{f.name}</button>)}
                   </div>
                </div>
                <div className="relative group">
                   <button className={`p-2 hover:bg-slate-100 rounded-full transition-all hover:scale-110 ${guide !== 'NONE' ? 'text-teal-600 bg-teal-50' : 'text-slate-600'}`}><Ruler className="w-5 h-5"/></button>
                   <div className="absolute top-full right-0 bg-white shadow-xl rounded-xl p-2 hidden group-hover:block z-20 min-w-[150px]">
                      {GUIDES.map(g => (
                        <button 
                            key={g.name} 
                            onClick={() => {
                                setGuide(g.id as any);
                                const utterance = new SpeechSynthesisUtterance(g.name);
                                window.speechSynthesis.speak(utterance);
                            }} 
                            className={`block w-full text-left p-2 hover:bg-slate-50 text-sm font-bold ${guide === g.id ? 'text-teal-600' : 'text-slate-700'}`}
                        >
                            {g.name}
                        </button>
                      ))}
                   </div>
                </div>
                {/* Toggle Guides Visibility */}
                <button onClick={() => setShowGuides(!showGuides)} className={`p-2 hover:bg-slate-100 rounded-full transition-all hover:scale-110 ${showGuides ? 'text-teal-600' : 'text-slate-400'}`} title="Toggle Guides">
                    {showGuides ? <Eye className="w-5 h-5"/> : <EyeOff className="w-5 h-5"/>}
                </button>
                
                {/* Background Music Toggle Menu */}
                <div className="relative">
                   <button onClick={() => setShowSoundMenu(!showSoundMenu)} className={`p-2 hover:bg-slate-100 rounded-full transition-all hover:scale-110 ${showSoundMenu ? 'bg-teal-50 text-teal-600' : 'text-slate-600 hover:text-teal-600'}`} title="Background Sounds"><Music className="w-5 h-5"/></button>
                   
                   {showSoundMenu && (
                       <div className="absolute top-full right-0 bg-white shadow-xl rounded-xl p-4 z-20 min-w-[220px] border border-slate-100 mt-2">
                          <div className="flex justify-between items-center mb-3">
                              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ambience</h4>
                              <div className={`w-2 h-2 rounded-full ${isMusicPlaying ? 'bg-teal-500 animate-pulse' : 'bg-slate-300'}`} />
                          </div>
                          
                          <button onClick={() => setIsMusicPlaying(!isMusicPlaying)} className={`w-full py-2 mb-3 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-colors ${isMusicPlaying ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                            {isMusicPlaying ? <Volume2 className="w-3 h-3"/> : <VolumeX className="w-3 h-3"/>}
                            {isMusicPlaying ? "Pause Audio" : "Play Audio"}
                          </button>
    
                          <div className="mb-3">
                             <div className="flex justify-between text-[10px] font-bold text-slate-400 mb-1">
                                <span>VOLUME</span>
                                <span>{Math.round(volume * 100)}%</span>
                             </div>
                             <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-full accent-teal-600 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                          </div>
    
                          <div className="grid grid-cols-3 gap-2">
                             {[
                                { id: 'HARMONY', icon: Music, label: 'Harm.' }, 
                                { id: 'RAIN', icon: CloudRain, label: 'Rain' }, 
                                { id: 'DELTA', icon: Waves, label: 'Delta' },
                                { id: 'FOCUS', icon: Sun, label: 'Focus' },
                                { id: 'CALM', icon: Feather, label: 'Calm' },
                                { id: 'ENERGETIC', icon: Zap, label: 'Energy' }
                             ].map(m => (
                                 <button key={m.id} onClick={() => { setSoundMode(m.id as any); if(!isMusicPlaying) setIsMusicPlaying(true); }} className={`p-2 rounded-lg flex flex-col items-center gap-1 border transition-all ${soundMode === m.id ? 'border-teal-500 bg-teal-50 text-teal-700' : 'border-slate-100 text-slate-400 hover:bg-slate-50'}`}>
                                     <m.icon className="w-4 h-4" /> 
                                     <span className="text-[9px] font-bold">{m.label}</span>
                                 </button>
                             ))}
                          </div>
                       </div>
                   )}
                </div>

                <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-slate-100 rounded-full text-slate-600 hover:text-teal-600 transition-all hover:scale-110"><Upload className="w-5 h-5"/></button>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                <div className="h-6 w-px bg-slate-300 mx-1" />
                <button onClick={startTutorial} className="p-2 hover:bg-slate-100 rounded-full text-teal-600 hover:text-teal-800 transition-all hover:scale-110" title="Tutorial"><HelpCircle className="w-5 h-5"/></button>
              </div>
            </div>
            {showSaveFeedback && <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-teal-600 text-white px-4 py-2 rounded-full shadow-lg z-30 font-bold animate-bounce">Saved!</div>}
            
            {isLoadingTemplate && (
              <div className="absolute inset-0 bg-white/80 z-20 flex flex-col items-center justify-center fade-in">
                  <Loader2 className="w-10 h-10 text-teal-600 animate-spin mb-2" />
                  <p className="text-teal-800 font-bold">Loading Template...</p>
              </div>
            )}

            {showTutorial && (
              <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 fade-in">
                  <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center relative">
                      <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <BrainCircuit className="w-8 h-8 text-teal-600" />
                      </div>
                      <h3 className="text-2xl font-bold text-slate-800 mb-2">{TUTORIAL_STEPS[tutorialStep].title}</h3>
                      <p className="text-slate-600 mb-8 leading-relaxed">{TUTORIAL_STEPS[tutorialStep].desc}</p>
                      <div className="flex gap-3">
                          <button onClick={skipTutorial} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl transition-colors">Skip</button>
                          <button onClick={nextTutorial} className="flex-1 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 shadow-lg transition-transform active:scale-95">
                              {tutorialStep < TUTORIAL_STEPS.length - 1 ? "Next" : "Let's Draw!"}
                          </button>
                      </div>
                      <div className="flex justify-center gap-1 mt-6">
                          {TUTORIAL_STEPS.map((_, i) => (
                              <div key={i} className={`w-2 h-2 rounded-full ${i === tutorialStep ? 'bg-teal-600' : 'bg-slate-200'}`} />
                          ))}
                      </div>
                  </div>
              </div>
            )}
            
            <div className={`absolute inset-0 pointer-events-none z-10 transition-opacity duration-300 ${guide !== 'NONE' && showGuides ? 'opacity-40' : 'opacity-0'}`}>
                {guide === 'GRID' && (
                    <svg width="100%" height="100%">
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-800"/>
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                )}
                {guide === 'ISOMETRIC' && (
                    <svg width="100%" height="100%">
                        <defs>
                            <pattern id="iso" width="40" height="69.28" patternUnits="userSpaceOnUse">
                                <path d="M 0 0 L 20 34.64 L 40 0 M 20 34.64 L 20 69.28 M 0 69.28 L 20 34.64 L 40 69.28" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-200" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#iso)" />
                    </svg>
                )}
                {guide === 'SYMMETRY_X' && (
                    <div className="w-full h-full flex justify-center">
                        <div className="h-full w-0.5 bg-indigo-600 border-l border-dashed border-white"></div>
                    </div>
                )}
                {guide === 'SYMMETRY_Y' && (
                    <div className="w-full h-full flex flex-col justify-center">
                        <div className="w-full h-0.5 bg-indigo-600 border-t border-dashed border-white"></div>
                    </div>
                )}
                {guide === 'SYMMETRY_QUAD' && (
                    <div className="w-full h-full relative">
                        <div className="absolute inset-x-0 top-1/2 h-0.5 bg-indigo-600 border-t border-dashed border-white -mt-px"></div>
                        <div className="absolute inset-y-0 left-1/2 w-0.5 bg-indigo-600 border-l border-dashed border-white -ml-px"></div>
                    </div>
                )}
                {guide && guide.startsWith('RADIAL') && (
                    <svg width="100%" height="100%">
                         {(() => {
                             let segments = 8;
                             if (guide === 'RADIAL_6') segments = 6;
                             if (guide === 'RADIAL_12') segments = 12;
                             const lines = [];
                             for(let i=0; i<segments/2; i++) {
                                 const angle = (180 / (segments/2)) * i;
                                 lines.push(
                                     <line 
                                        key={i} 
                                        x1="0" y1="50%" x2="100%" y2="50%" 
                                        stroke="currentColor" strokeDasharray="4 4" strokeWidth="1.5" className="text-indigo-600"
                                        style={{ transform: `rotate(${angle}deg)`, transformOrigin: 'center' }}
                                     />
                                 );
                             }
                             return lines;
                         })()}
                    </svg>
                )}
                {guide === 'RULE_THIRDS' && (
                    <svg width="100%" height="100%">
                        <line x1="33.33%" y1="0" x2="33.33%" y2="100%" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" className="text-slate-500" />
                        <line x1="66.66%" y1="0" x2="66.66%" y2="100%" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" className="text-slate-500" />
                        <line x1="0" y1="33.33%" x2="100%" y2="33.33%" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" className="text-slate-500" />
                        <line x1="0" y1="66.66%" x2="100%" y2="66.66%" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" className="text-slate-500" />
                    </svg>
                )}
                {guide === 'GOLDEN_RATIO' && (
                    <svg width="100%" height="100%">
                         {/* Phi Grid */}
                        <line x1="38.2%" y1="0" x2="38.2%" y2="100%" stroke="currentColor" strokeWidth="1.5" className="text-amber-600" />
                        <line x1="61.8%" y1="0" x2="61.8%" y2="100%" stroke="currentColor" strokeWidth="1.5" className="text-amber-600" />
                        <line x1="0" y1="38.2%" x2="100%" y2="38.2%" stroke="currentColor" strokeWidth="1.5" className="text-amber-600" />
                        <line x1="0" y1="61.8%" x2="100%" y2="61.8%" stroke="currentColor" strokeWidth="1.5" className="text-amber-600" />
                        {/* Golden Spiral Approximation */}
                        <path d="M 100 0 L 0 0 L 0 100 L 61.8 100 L 61.8 38.2 L 38.2 38.2 L 38.2 61.8" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-600" vectorEffect="non-scaling-stroke"/>
                    </svg>
                )}
                {guide === 'FIBONACCI' && (
                    <svg width="100%" height="100%" viewBox="0 0 89 55" preserveAspectRatio="xMidYMid meet">
                         <rect x="0" y="0" width="89" height="55" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-300" />
                         <path d="M 89 55 A 55 55 0 0 1 34 0" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-500" vectorEffect="non-scaling-stroke"/>
                         <path d="M 34 0 A 34 34 0 0 1 0 34" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-500" vectorEffect="non-scaling-stroke"/>
                         <path d="M 0 34 A 21 21 0 0 1 21 55" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-500" vectorEffect="non-scaling-stroke"/>
                         <path d="M 21 55 A 13 13 0 0 1 34 42" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-500" vectorEffect="non-scaling-stroke"/>
                         <path d="M 34 42 A 8 8 0 0 1 26 34" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-500" vectorEffect="non-scaling-stroke"/>
                         <path d="M 34 0 L 34 55 M 0 34 L 34 34 M 21 34 L 21 55 M 21 42 L 34 42" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-slate-300" vectorEffect="non-scaling-stroke"/>
                    </svg>
                )}
                {guide === 'PERSPECTIVE_1' && (
                     <svg width="100%" height="100%">
                        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeWidth="2" className="text-blue-600" />
                        
                        {[0, 10, 20, 30, 40, 60, 70, 80, 90, 100].map(p => (
                            <line key={`t-${p}`} x1="50%" y1="50%" x2={`${p}%`} y2="0" stroke="currentColor" strokeWidth="0.5" className="text-slate-500" />
                        ))}
                        {[0, 10, 20, 30, 40, 60, 70, 80, 90, 100].map(p => (
                            <line key={`b-${p}`} x1="50%" y1="50%" x2={`${p}%`} y2="100%" stroke="currentColor" strokeWidth="0.5" className="text-slate-500" />
                        ))}
                        <line x1="50%" y1="50%" x2="0" y2="50%" stroke="currentColor" strokeWidth="0.5" className="text-slate-500" />
                        <line x1="50%" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeWidth="0.5" className="text-slate-500" />
                        
                        <circle cx="50%" cy="50%" r="4" fill="currentColor" className="text-red-500" />
                    </svg>
                )}
                {guide === 'PERSPECTIVE_2' && (
                     <svg width="100%" height="100%">
                        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="currentColor" strokeWidth="2" className="text-blue-600" />
                        
                        {[0, 25, 50, 75, 100].map(p => (
                            <line key={`l-${p}`} x1="0" y1="50%" x2="50%" y2={`${p}%`} stroke="currentColor" strokeWidth="0.5" className="text-slate-500" />
                        ))}
                        {[0, 25, 50, 75, 100].map(p => (
                            <line key={`r-${p}`} x1="100%" y1="50%" x2="50%" y2={`${p}%`} stroke="currentColor" strokeWidth="0.5" className="text-slate-500" />
                        ))}
                        
                        <line x1="0" y1="50%" x2="50%" y2="0" stroke="currentColor" strokeWidth="0.5" className="text-slate-500" />
                        <line x1="0" y1="50%" x2="75%" y2="0" stroke="currentColor" strokeWidth="0.5" className="text-slate-500" />
                        <line x1="0" y1="50%" x2="50%" y2="100%" stroke="currentColor" strokeWidth="0.5" className="text-slate-500" />
                        <line x1="0" y1="50%" x2="75%" y2="100%" stroke="currentColor" strokeWidth="0.5" className="text-slate-500" />

                        <line x1="100%" y1="50%" x2="50%" y2="0" stroke="currentColor" strokeWidth="0.5" className="text-slate-500" />
                        <line x1="100%" y1="50%" x2="25%" y2="0" stroke="currentColor" strokeWidth="0.5" className="text-slate-500" />
                        <line x1="100%" y1="50%" x2="50%" y2="100%" stroke="currentColor" strokeWidth="0.5" className="text-slate-500" />
                        <line x1="100%" y1="50%" x2="25%" y2="100%" stroke="currentColor" strokeWidth="0.5" className="text-slate-500" />
                        
                        <circle cx="0" cy="50%" r="4" fill="currentColor" className="text-red-500" />
                        <circle cx="100%" cy="50%" r="4" fill="currentColor" className="text-red-500" />
                    </svg>
                )}
            </div>

            <canvas ref={canvasRef} className="flex-1 touch-none cursor-crosshair bg-white w-full h-full" onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing} onTouchStart={startDrawing} onTouchMove={draw} onTouchEnd={stopDrawing} />
         </div>
       )}

       {activeTab === 'MUSIC' && (
         <div className="p-6 flex-col flex items-center justify-center flex-1 bg-gradient-to-br from-indigo-50 to-purple-50 overflow-y-auto">
             <div className="w-full max-w-md bg-white p-6 rounded-3xl shadow-xl border border-indigo-100 mb-6 text-center">
                 <div className={`w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center transition-all duration-1000 ${isMusicPlaying ? 'bg-indigo-100 shadow-[0_0_30px_rgba(99,102,241,0.4)] scale-110' : 'bg-slate-100'}`}>
                    {isMusicPlaying ? <Volume2 className="w-10 h-10 text-indigo-600 animate-pulse" /> : <VolumeX className="w-10 h-10 text-slate-400" />}
                 </div>
                 <h2 className="text-2xl font-bold text-slate-800 mb-2">{isMusicPlaying ? "Playing..." : "Paused"}</h2>
                 <div className="flex items-center gap-3 justify-center mb-6">
                    <Volume2 className="w-4 h-4 text-slate-400"/>
                    <input type="range" min="0" max="1" step="0.01" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-32 accent-indigo-600" />
                 </div>
                 
                 <div className="grid grid-cols-3 gap-2 mb-6">
                    {[
                        { id: 'HARMONY', icon: Music, label: 'Harmony' }, { id: 'RAIN', icon: CloudRain, label: 'Rain' }, { id: 'DELTA', icon: Waves, label: 'Delta' },
                        { id: 'CALM', icon: Feather, label: 'Calm' }, { id: 'ENERGETIC', icon: Zap, label: 'Energy' }, { id: 'FOCUS', icon: Sun, label: 'Focus' }
                    ].map(m => (
                        <button key={m.id} onClick={() => setSoundMode(m.id as any)} className={`p-3 rounded-xl flex flex-col items-center gap-1 border-2 transition-all ${soundMode === m.id ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-100 bg-slate-50 text-slate-500 hover:bg-white'}`}>
                            <m.icon className="w-5 h-5" /> <span className="text-[10px] font-bold">{m.label}</span>
                        </button>
                    ))}
                 </div>

                 <div className="flex gap-2 justify-center mb-6">
                    {[15, 30, 60].map(m => (
                        <button key={m} onClick={() => setSleepTimer(sleepTimer === m ? null : m)} className={`px-3 py-1 rounded-full text-xs font-bold border ${sleepTimer === m ? 'bg-indigo-600 text-white border-indigo-600' : 'text-slate-500 border-slate-200'}`}>
                            {m}m
                        </button>
                    ))}
                 </div>

                 <button onClick={() => setIsMusicPlaying(!isMusicPlaying)} className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-transform active:scale-95 ${isMusicPlaying ? 'bg-slate-800 text-white' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                     {isMusicPlaying ? "Stop Soundscape" : "Start Soundscape"}
                 </button>
             </div>
             
             <div className="w-full max-w-md bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center mb-6">
                 <p className="text-slate-600 italic mb-4">"{musicPrompt || "Get a personalized music therapy suggestion."}"</p>
                 <button onClick={getMusicPrompt} disabled={loadingMusic} className="text-indigo-600 font-bold hover:text-indigo-800 flex items-center justify-center gap-2 mx-auto">
                     {loadingMusic ? <Loader2 className="animate-spin w-4 h-4"/> : <Sparkles className="w-4 h-4"/>} Suggest Activity
                 </button>
             </div>

             <div className="w-full max-w-md bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center">
                 <div className="flex items-center justify-center gap-2 mb-4 text-slate-800">
                     <ListMusic className="w-6 h-6 text-indigo-600" />
                     <h3 className="text-xl font-bold">Your Mood Playlist</h3>
                 </div>
                 <button onClick={generatePlaylist} disabled={loadingPlaylist} className="w-full py-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold hover:bg-indigo-100 flex items-center justify-center gap-2 mb-4">
                     {loadingPlaylist ? <Loader2 className="animate-spin w-4 h-4"/> : "Generate Playlist"}
                 </button>
                 {playlist && (
                     <ul className="text-left space-y-2">
                         {playlist.map((song, i) => (
                             <li key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                                 <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs shrink-0">{i+1}</div>
                                 <div className="min-w-0">
                                     <p className="font-bold text-slate-800 text-sm truncate">{song.title}</p>
                                     <p className="text-xs text-slate-500 truncate">{song.artist}</p>
                                 </div>
                             </li>
                         ))}
                     </ul>
                 )}
             </div>
         </div>
       )}

       {activeTab === 'IMAGE' && (
         <div className="p-6 flex-1 flex flex-col items-center justify-center bg-slate-50 overflow-y-auto">
             <div className="w-full max-w-md space-y-4">
                 <div className="relative">
                     <textarea 
                        value={imgPrompt} 
                        onChange={(e) => setImgPrompt(e.target.value)}
                        placeholder="Describe an image to generate... (e.g. 'A calm forest at sunrise')"
                        className="w-full p-4 rounded-2xl border-2 border-slate-200 focus:border-purple-500 outline-none h-32 pr-12 resize-none mb-2"
                     />
                     <button onClick={toggleImgListening} className={`absolute bottom-6 right-4 p-2 rounded-full ${isImgListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-200 text-slate-500'}`}>
                         {isImgListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                     </button>
                 </div>
                 
                 <div className="mb-2">
                     <input 
                        type="text" 
                        value={negativePrompt} 
                        onChange={(e) => setNegativePrompt(e.target.value)}
                        placeholder="Negative prompt (what to avoid? e.g. 'blur, dark')"
                        className="w-full p-3 rounded-xl border border-slate-200 focus:border-red-400 outline-none text-sm"
                     />
                 </div>
                 
                 <div className="flex items-center justify-between px-2 mb-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Aspect Ratio</span>
                    <div className="flex bg-slate-200 p-1 rounded-lg gap-1">
                        {['1:1', '3:4', '4:3', '16:9', '9:16'].map((ratio) => (
                            <button
                                key={ratio}
                                onClick={() => setAspectRatio(ratio)}
                                className={`px-2 py-1 rounded-md text-[10px] font-bold transition-all ${aspectRatio === ratio ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {ratio}
                            </button>
                        ))}
                    </div>
                 </div>

                 <div className="flex items-center justify-between px-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Style Intensity</span>
                    <div className="flex bg-slate-200 p-1 rounded-lg">
                        {['Subtle', 'Standard', 'Intense'].map((level) => (
                            <button
                                key={level}
                                onClick={() => setStyleIntensity(level as any)}
                                className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${styleIntensity === level ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                 </div>

                 <div className="flex flex-wrap gap-2 justify-center max-h-32 overflow-y-auto no-scrollbar py-2">
                    {IMAGE_STYLES.map(style => (
                        <button
                            key={style}
                            onClick={() => setImgStyles(prev => prev.includes(style) ? prev.filter(s => s !== style) : [...prev, style])}
                            className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${imgStyles.includes(style) ? 'bg-purple-600 text-white border-purple-600 shadow-md scale-105' : 'bg-white text-slate-600 border-slate-200 hover:border-purple-300'}`}
                        >
                            {style}
                        </button>
                    ))}
                 </div>

                 <button onClick={handleImageGeneration} disabled={isGenLoading || !imgPrompt} className="w-full py-4 bg-purple-600 text-white rounded-2xl font-bold shadow-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-transform active:scale-95">
                     {isGenLoading ? <Loader2 className="animate-spin w-5 h-5"/> : <Sparkles className="w-5 h-5"/>} Generate Art
                 </button>

                 {/* Generated Image Display Area */}
                 {genImgUrl && (
                     <div className="mt-6 w-full fade-in pb-8">
                         <div className="relative aspect-square w-full rounded-2xl overflow-hidden shadow-xl border-4 border-white mb-4 group">
                             <img src={genImgUrl} alt="Generated Art" className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                 <button onClick={() => { const link = document.createElement('a'); link.download = 'lumina-gen.jpg'; link.href = genImgUrl; link.click(); }} className="p-3 bg-white text-slate-800 rounded-full hover:scale-110 transition-transform"><Download className="w-6 h-6"/></button>
                                 <button onClick={handleEditInArt} className="p-3 bg-teal-500 text-white rounded-full hover:scale-110 transition-transform" title="Edit in Art Canvas"><Palette className="w-6 h-6"/></button>
                                 <button onClick={deleteCurrentImage} className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-transform" title="Delete Image"><Trash2 className="w-6 h-6"/></button>
                             </div>
                         </div>
                         
                         {/* History & Controls */}
                         <div className="flex flex-col gap-4">
                             <div className="flex items-center justify-between gap-3">
                                 <div className="flex gap-2">
                                     <button onClick={imgUndo} disabled={imgHistoryIndex <= 0} className="p-3 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-50 transition-colors"><Undo className="w-5 h-5"/></button>
                                     <button onClick={imgRedo} disabled={imgHistoryIndex >= imgHistory.length - 1} className="p-3 rounded-xl bg-white border border-slate-200 text-slate-600 disabled:opacity-30 hover:bg-slate-50 transition-colors"><Redo className="w-5 h-5"/></button>
                                 </div>
                                 
                                 <button onClick={handleEditInArt} className="flex-1 py-3 bg-slate-800 text-white rounded-xl font-bold text-sm shadow-md hover:bg-slate-900 transition-colors flex items-center justify-center gap-2">
                                    <Palette className="w-4 h-4" /> Edit in Art Canvas
                                 </button>
                             </div>

                             {/* Thumbnail Strip */}
                             {imgHistory.length > 0 && (
                                <div className="mt-2 bg-white p-3 rounded-2xl border border-slate-200">
                                    <div className="flex justify-between items-center mb-3 px-1">
                                        <div className="flex items-center gap-2">
                                            <Layers className="w-4 h-4 text-slate-400" />
                                            <span className="text-xs font-bold text-slate-500 uppercase">History ({imgHistory.length})</span>
                                        </div>
                                        <button onClick={clearHistory} className="text-xs text-red-500 hover:text-red-700 font-bold px-2 py-1 rounded hover:bg-red-50 transition-colors">Clear All</button>
                                    </div>
                                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                        {imgHistory.map((url, idx) => (
                                            <button 
                                                key={idx} 
                                                onClick={() => { setGenImgUrl(url); setImgHistoryIndex(idx); }}
                                                className={`relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 transition-all group ${imgHistoryIndex === idx ? 'border-purple-600 ring-2 ring-purple-100 scale-105' : 'border-transparent opacity-70 hover:opacity-100 hover:scale-105'}`}
                                            >
                                                <img src={url} className="w-full h-full object-cover" />
                                                {imgHistoryIndex === idx && <div className="absolute inset-0 bg-purple-500/10 pointer-events-none" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                             )}
                         </div>
                     </div>
                 )}
             </div>
         </div>
       )}
       {showGuide && <GuideModal onClose={() => setShowGuide(false)} />}
    </div>
  );
};

const GratitudeView = ({ onBack }: { onBack: () => void }) => {
    const [items, setItems] = useState<string[]>([]);
    const [newItem, setNewItem] = useState("");
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [showSaveFeedback, setShowSaveFeedback] = useState(false);
    const recognitionRef = useRef<any>(null);
    const [showGuide, setShowGuide] = useState(false);

    // Load saved items on mount
    useEffect(() => {
        const saved = localStorage.getItem("lumina_kindness_list");
        if(saved) {
            try { setItems(JSON.parse(saved)); } catch(e) {}
        }
    }, []);

    const saveList = () => {
        localStorage.setItem("lumina_kindness_list", JSON.stringify(items));
        setShowSaveFeedback(true);
        setTimeout(() => setShowSaveFeedback(false), 2000);
        playSound('success');
    };

    const suggestIdeas = async () => {
        setLoading(true);
        try {
            const response = await ai.models.generateContent({
                model: AI_MODEL,
                contents: "Suggest 3 unique, simple daily acts of kindness. Return JSON array of strings.",
                config: {
                   responseMimeType: "application/json",
                   responseSchema: {
                       type: Type.ARRAY,
                       items: { type: Type.STRING }
                   }
                }
            });
            const suggestions = JSON.parse(response.text || "[]");
            setItems([...items, ...suggestions]);
        } catch (e) {
            setItems([...items, "Smile at a stranger", "Hold the door open", "Send a kind message"]);
        } finally {
            setLoading(false);
        }
    };

    const toggleListening = () => {
        if (isListening) { recognitionRef.current?.stop(); setIsListening(false); }
        else {
             const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
             if (!SpeechRecognition) { alert("Speech recognition is not supported."); return; }
             const recognition = new SpeechRecognition();
             recognition.lang = 'en-US';
             recognition.onstart = () => setIsListening(true);
             recognition.onend = () => setIsListening(false);
             recognition.onresult = (e: any) => {
                 const text = e.results[0][0].transcript;
                 setNewItem(text);
             };
             recognitionRef.current = recognition;
             recognition.start();
        }
    };

    const addItem = () => {
        if (newItem.trim()) {
            setItems([...items, newItem]);
            setNewItem("");
            playSound('success');
        }
    };

    const removeItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    return (
        <div className="h-full flex flex-col fade-in bg-slate-50 relative">
            <Header title="Daily Act of Kindness" goBack={onBack} rightAction={<button onClick={() => setShowGuide(true)}><HelpCircle className="w-6 h-6 text-slate-400" /></button>} />
            
            {showSaveFeedback && (
                 <div className="absolute top-20 left-1/2 -translate-x-1/2 bg-teal-600 text-white px-4 py-2 rounded-full shadow-lg z-50 font-bold animate-in fade-in slide-in-from-top-2 flex items-center gap-2">
                     <CheckCircle2 className="w-4 h-4"/> Saved!
                 </div>
            )}

            <div className="p-6 flex-1 overflow-y-auto">
                <div className="bg-white p-6 rounded-2xl shadow-sm mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-slate-800">Add Act of Kindness</h3>
                        <button onClick={saveList} className="flex items-center gap-2 text-sm font-bold text-teal-600 bg-teal-50 px-3 py-1.5 rounded-lg hover:bg-teal-100 transition-colors">
                            <Save className="w-4 h-4" /> Save List
                        </button>
                    </div>
                    
                    <div className="flex gap-2 mb-4">
                        <input 
                           value={newItem}
                           onChange={(e) => setNewItem(e.target.value)}
                           placeholder="Describe your act of kindness..."
                           className="flex-1 p-3 border border-slate-200 rounded-xl outline-none focus:border-teal-500"
                           onKeyDown={(e) => e.key === 'Enter' && addItem()}
                        />
                        <button onClick={toggleListening} className={`p-3 rounded-xl transition-colors ${isListening ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                           {isListening ? <MicOff className="w-5 h-5"/> : <Mic className="w-5 h-5"/>}
                        </button>
                        <button onClick={addItem} className="p-3 bg-teal-600 text-white rounded-xl hover:bg-teal-700">
                           <Plus className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                         <button onClick={suggestIdeas} disabled={loading} className="w-full py-3 bg-indigo-50 text-indigo-700 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-100 transition-colors">
                            {loading ? <Loader2 className="animate-spin w-5 h-5"/> : <Sparkles className="w-5 h-5"/>} Suggest
                         </button>
                         <button onClick={() => setItems([...items, "List 3 things I am grateful for"])} className="w-full py-3 bg-pink-50 text-pink-700 font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-pink-100 transition-colors">
                            <BookHeart className="w-5 h-5"/> Gratitude List
                         </button>
                    </div>
                </div>

                <div className="space-y-3">
                    {items.map((item, i) => (
                        <div key={i} className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-teal-400 flex items-center justify-between gap-3 fade-in group">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 shrink-0">
                                    <CheckCircle2 className="w-4 h-4" />
                                </div>
                                <span className="font-medium text-slate-700">{item}</span>
                            </div>
                            <button onClick={() => removeItem(i)} className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all p-1">
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {items.length === 0 && (
                        <div className="text-center text-slate-400 py-10">
                            <Heart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                            <p>Start your journey of kindness today.</p>
                        </div>
                    )}
                </div>
            </div>
            {showGuide && <GuideModal onClose={() => setShowGuide(false)} />}
        </div>
    );
};

const QuotesView = ({ onBack }: { onBack: () => void }) => {
    const [quote, setQuote] = useState({ text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" });
    const [loading, setLoading] = useState(false);
    const [theme, setTheme] = useState("Hope");
    const [customTheme, setCustomTheme] = useState("");
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef<any>(null);
    const [showGuide, setShowGuide] = useState(false);

    const themes = ["Hope", "Peace", "Gratitude", "Creativity", "Resilience", "Joy", "Nature", "Friendship", "Courage", "Wisdom"];

    const fetchQuote = async (selectedTheme: string) => {
        setLoading(true);
        try {
            const response = await ai.models.generateContent({
                model: AI_MODEL,
                contents: `Give me an inspiring quote about ${selectedTheme}. JSON: {text: string, author: string}`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            text: { type: Type.STRING },
                            author: { type: Type.STRING }
                        }
                    }
                }
            });
            setQuote(JSON.parse(response.text || "{}"));
        } catch(e) {
            setQuote({ text: "Every moment is a fresh beginning.", author: "T.S. Eliot" });
        } finally {
            setLoading(false);
        }
    };

    const toggleListening = () => {
        if (isListening) { recognitionRef.current?.stop(); setIsListening(false); }
        else {
             const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
             if (!SpeechRecognition) { alert("Speech recognition is not supported."); return; }
             const recognition = new SpeechRecognition();
             recognition.lang = 'en-US';
             recognition.onstart = () => setIsListening(true);
             recognition.onend = () => setIsListening(false);
             recognition.onresult = (e: any) => {
                 const text = e.results[0][0].transcript;
                 setCustomTheme(text);
                 fetchQuote(text);
             };
             recognitionRef.current = recognition;
             recognition.start();
        }
    };

    return (
        <div className="h-full flex flex-col fade-in bg-slate-50 relative">
            <Header title="Daily Inspiration" goBack={onBack} rightAction={<button onClick={() => setShowGuide(true)}><HelpCircle className="w-6 h-6 text-slate-400" /></button>} />
            <div className="p-6 flex-1 flex flex-col items-center justify-center">
                 <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-indigo-50 relative mb-8 text-center min-h-[200px] flex flex-col justify-center">
                     <Quote className="absolute top-6 left-6 text-indigo-200 w-8 h-8 opacity-50" />
                     {loading ? (
                         <div className="flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-indigo-500"/></div>
                     ) : (
                         <>
                             <p className="text-xl font-medium text-slate-800 mb-4 leading-relaxed">"{quote.text}"</p>
                             <p className="text-indigo-600 font-bold text-sm uppercase tracking-wide">— {quote.author}</p>
                         </>
                     )}
                 </div>

                 <div className="w-full max-w-md">
                     <div className="flex gap-2 mb-4">
                         <input 
                            value={customTheme}
                            onChange={(e) => setCustomTheme(e.target.value)}
                            placeholder="Type a theme or use voice..."
                            className="flex-1 p-3 rounded-xl border border-slate-200 outline-none focus:border-indigo-500"
                         />
                         <button onClick={toggleListening} className={`p-3 rounded-xl transition-colors ${isListening ? 'bg-red-500 text-white' : 'bg-indigo-100 text-indigo-600'}`}>
                             {isListening ? <MicOff className="w-5 h-5"/> : <Mic className="w-5 h-5"/>}
                         </button>
                         <button onClick={() => fetchQuote(customTheme)} className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold">
                             <Sparkles className="w-5 h-5" />
                         </button>
                     </div>
                     <div className="flex flex-wrap justify-center gap-2">
                         {themes.map(t => (
                             <button key={t} onClick={() => { setTheme(t); fetchQuote(t); }} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${theme === t ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-500 hover:border-indigo-300'}`}>
                                 {t}
                             </button>
                         ))}
                     </div>
                 </div>
            </div>
            {showGuide && <GuideModal onClose={() => setShowGuide(false)} />}
        </div>
    );
};

const GamesHub = ({ onBack, user, activeGame, setActiveGame }: { onBack: () => void, user: UserProfile, activeGame: GameType, setActiveGame: (g: GameType) => void }) => {
    const [showGuide, setShowGuide] = useState(false);

    if (activeGame !== "NONE") {
        return (
            <div className="h-full flex flex-col fade-in relative">
                <Header 
                    title={
                        activeGame === "SNAKE" ? "Zen Snake" :
                        activeGame === "BREAKOUT" ? "Mindful Breaker" :
                        activeGame === "DODGE" ? "Cosmic Dodge" :
                        activeGame === "MEMORY" ? "Mindful Memory" :
                        activeGame === "POP" ? "Bubble Pop" :
                        activeGame === "STACK" ? "Tower Stack" :
                        activeGame === "ECHO" ? "Pattern Echo" :
                        activeGame === "BREATHING" ? "Breathing" :
                        activeGame === "TIMER" ? "Focus Timer" :
                        activeGame === "COMEDY" ? "Comedy Corner" :
                        activeGame === "WHEEL" ? "Wellness Wheel" : "Game"
                    } 
                    goBack={() => setActiveGame("NONE")}
                    rightAction={<button onClick={() => setShowGuide(true)}><HelpCircle className="w-6 h-6 text-slate-400" /></button>}
                />
                <div className="flex-1 overflow-hidden relative">
                    {activeGame === "SNAKE" && <SnakeGame />}
                    {activeGame === "BREAKOUT" && <BreakoutGame />}
                    {activeGame === "DODGE" && <CosmicDodgeGame />}
                    {activeGame === "MEMORY" && <MemoryGame />}
                    {activeGame === "POP" && <BubblePopGame />}
                    {activeGame === "STACK" && <TowerStackGame />}
                    {activeGame === "ECHO" && <PatternEchoGame />}
                    {activeGame === "BREATHING" && <BreathingExercise />}
                    {activeGame === "TIMER" && <FocusTimer />}
                    {activeGame === "COMEDY" && <ComedyCorner userMood={user.mood} />}
                    {activeGame === "WHEEL" && <WheelGame />}
                </div>
                {showGuide && <GuideModal onClose={() => setShowGuide(false)} />}
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col fade-in bg-slate-50">
            <Header title="Games & Tools" goBack={onBack} rightAction={<button onClick={() => setShowGuide(true)}><HelpCircle className="w-6 h-6 text-slate-400" /></button>} />
            <div className="p-6 flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => setActiveGame("BREATHING")} className="p-4 bg-blue-100 rounded-2xl text-left hover:scale-105 transition-transform">
                        <Wind className="w-8 h-8 text-blue-600 mb-2" />
                        <h3 className="font-bold text-slate-800">Breathing</h3>
                        <p className="text-xs text-slate-600">Calm anxiety</p>
                    </button>
                    <button onClick={() => setActiveGame("TIMER")} className="p-4 bg-red-100 rounded-2xl text-left hover:scale-105 transition-transform">
                        <Timer className="w-8 h-8 text-red-600 mb-2" />
                        <h3 className="font-bold text-slate-800">Focus Timer</h3>
                        <p className="text-xs text-slate-600">Stay present</p>
                    </button>
                    <button onClick={() => setActiveGame("COMEDY")} className="p-4 bg-amber-100 rounded-2xl text-left hover:scale-105 transition-transform">
                        <Laugh className="w-8 h-8 text-amber-600 mb-2" />
                        <h3 className="font-bold text-slate-800">Comedy</h3>
                        <p className="text-xs text-slate-600">Mood booster</p>
                    </button>
                    <button onClick={() => setActiveGame("WHEEL")} className="p-4 bg-orange-100 rounded-2xl text-left hover:scale-105 transition-transform">
                        <CircleDashed className="w-8 h-8 text-orange-600 mb-2" />
                        <h3 className="font-bold text-slate-800">Wheel</h3>
                        <p className="text-xs text-slate-600">Spin for self-care</p>
                    </button>

                    <div className="col-span-2 mt-4 mb-2">
                        <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2"><Gamepad2 className="w-5 h-5" /> Arcade</h3>
                    </div>

                    <button onClick={() => setActiveGame("SNAKE")} className="p-4 bg-emerald-100 rounded-2xl text-left hover:scale-105 transition-transform">
                        <Ghost className="w-8 h-8 text-emerald-600 mb-2" />
                        <h3 className="font-bold text-slate-800">Zen Snake</h3>
                        <p className="text-xs text-slate-600">Classic focus</p>
                    </button>
                    <button onClick={() => setActiveGame("BREAKOUT")} className="p-4 bg-indigo-100 rounded-2xl text-left hover:scale-105 transition-transform">
                        <LayoutTemplate className="w-8 h-8 text-indigo-600 mb-2" />
                        <h3 className="font-bold text-slate-800">Breaker</h3>
                        <p className="text-xs text-slate-600">Smash bricks</p>
                    </button>
                    <button onClick={() => setActiveGame("DODGE")} className="p-4 bg-slate-800 rounded-2xl text-left hover:scale-105 transition-transform">
                        <Rocket className="w-8 h-8 text-cyan-400 mb-2" />
                        <h3 className="font-bold text-white">Dodge</h3>
                        <p className="text-xs text-slate-400">Avoid obstacles</p>
                    </button>
                    <button onClick={() => setActiveGame("ECHO")} className="p-4 bg-fuchsia-100 rounded-2xl text-left hover:scale-105 transition-transform">
                        <Zap className="w-8 h-8 text-fuchsia-600 mb-2" />
                        <h3 className="font-bold text-slate-800">Echo</h3>
                        <p className="text-xs text-slate-600">Pattern memory</p>
                    </button>
                    <button onClick={() => setActiveGame("STACK")} className="p-4 bg-cyan-100 rounded-2xl text-left hover:scale-105 transition-transform">
                        <Layers className="w-8 h-8 text-cyan-600 mb-2" />
                        <h3 className="font-bold text-slate-800">Stack</h3>
                        <p className="text-xs text-slate-600">Build high</p>
                    </button>
                    <button onClick={() => setActiveGame("MEMORY")} className="p-4 bg-purple-100 rounded-2xl text-left hover:scale-105 transition-transform">
                        <Grid2x2 className="w-8 h-8 text-purple-600 mb-2" />
                        <h3 className="font-bold text-slate-800">Memory</h3>
                        <p className="text-xs text-slate-600">Find pairs</p>
                    </button>
                     <button onClick={() => setActiveGame("POP")} className="p-4 bg-blue-100 rounded-2xl text-left hover:scale-105 transition-transform col-span-2">
                        <Circle className="w-8 h-8 text-blue-600 mb-2" />
                        <h3 className="font-bold text-slate-800">Bubble Pop</h3>
                        <p className="text-xs text-slate-600">Stress relief</p>
                    </button>
                </div>
            </div>
            {showGuide && <GuideModal onClose={() => setShowGuide(false)} />}
        </div>
    );
};

// --- Instant Relief Component ---

const InstantReliefOverlay = ({ userMood, onClose, onNavigate }: { userMood: string, onClose: () => void, onNavigate: (view: ViewState, game?: GameType) => void }) => {
  const [loading, setLoading] = useState(true);
  const [suggestion, setSuggestion] = useState<{tool: string, reason: string, gameId?: string} | null>(null);

  useEffect(() => {
    const getSuggestion = async () => {
      try {
        const response = await ai.models.generateContent({
            model: AI_MODEL,
            contents: `The user is feeling ${userMood}. Suggest one immediate, engaging activity from this app to stop rumination.
            Available Tools:
            - BREATHING (Breathing Exercise)
            - SNAKE (Zen Snake Game)
            - BREAKOUT (Mindful Breaker Game)
            - DODGE (Cosmic Dodge Game)
            - MEMORY (Mindful Memory Game)
            - POP (Bubble Pop Game)
            - STACK (Tower Stack Game)
            - ECHO (Pattern Echo Game)
            - COMEDY (Read a joke)
            - QUOTES (Read an inspiring quote)
            - CREATIVE (Draw or paint)
            - JOURNAL (Write thoughts)
            - GRATITUDE (Add act of kindness)
            - WHEEL (Spin the wheel)

            Return JSON: { "tool": "TOOL_ID", "reason": "Short comforting explanation" }`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        tool: { type: Type.STRING },
                        reason: { type: Type.STRING }
                    }
                }
            }
        });
        const data = JSON.parse(response.text || "{}");
        setSuggestion(data);
      } catch (e) {
        setSuggestion({ tool: "BREATHING", reason: "Let's take a moment to breathe and center yourself." });
      } finally {
        setLoading(false);
      }
    };
    getSuggestion();
  }, [userMood]);

  const handleAccept = () => {
     if (!suggestion) return;
     const tool = suggestion.tool;
     if (['BREATHING', 'SNAKE', 'BREAKOUT', 'DODGE', 'COMEDY', 'WHEEL', 'MEMORY', 'POP', 'STACK', 'ECHO'].includes(tool)) {
         onNavigate('GAMES', tool as GameType);
     } else {
         // Map generic tool names to ViewState
         const viewMap: Record<string, ViewState> = {
             'QUOTES': 'QUOTES',
             'CREATIVE': 'CREATIVE',
             'JOURNAL': 'JOURNAL',
             'GRATITUDE': 'GRATITUDE'
         };
         onNavigate(viewMap[tool] || 'HOME');
     }
     onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6 fade-in backdrop-blur-sm">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full relative overflow-hidden">
            <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100"><X className="w-6 h-6 text-slate-400"/></button>
            
            <div className="text-center">
                <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-10 h-10 text-indigo-600" />
                </div>
                
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Instant Relief</h3>
                
                {loading ? (
                    <div className="py-8">
                        <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mx-auto mb-4" />
                        <p className="text-slate-500 animate-pulse">Finding the best distraction for you...</p>
                    </div>
                ) : (
                    <div className="fade-in">
                        <p className="text-lg font-bold text-indigo-700 mb-4">{suggestion?.tool.replace('_', ' ')}</p>
                        <p className="text-slate-600 mb-8 leading-relaxed">"{suggestion?.reason}"</p>
                        
                        <button onClick={handleAccept} className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition-transform active:scale-95 flex items-center justify-center gap-2">
                            Start Now <ArrowLeft className="w-5 h-5 rotate-180" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

// --- Main App Component ---

const App = () => {
  const [view, setView] = useState<ViewState>("HOME");
  const [user, setUser] = useState<UserProfile>({ username: "Guest", mood: "😊 Happy" });
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const [activeGame, setActiveGame] = useState<GameType>("NONE");
  const [showInstantRelief, setShowInstantRelief] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("lumina_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const updateUser = (u: UserProfile) => {
    setUser(u);
    localStorage.setItem("lumina_user", JSON.stringify(u));
  };

  const handleLogin = (e: string, p: string) => {
      // Mock login - in a real app this would verify credentials
      if (e && p) {
          updateUser({ ...user, email: e, username: e.split('@')[0], id: '123' });
          return true;
      }
      return false;
  };

  const handleSignup = (n: string, e: string, p: string) => {
      updateUser({ username: n, email: e, mood: "😊 Happy", id: Date.now().toString() });
  };

  const handleLogout = () => {
      localStorage.removeItem("lumina_user");
      setUser({ username: "Guest", mood: "😊 Happy" });
      setView("HOME");
  };

  return (
    <div className="h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden max-w-md mx-auto shadow-2xl relative">
      {view === "HOME" && (
        <div className="h-full flex flex-col p-6 fade-in">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Hi, {user.username}</h1>
              <button 
                onClick={() => setShowMoodSelector(!showMoodSelector)} 
                className="text-slate-500 text-sm font-medium flex items-center gap-1 hover:text-teal-600 transition-colors"
              >
                Feeling {user.mood} <span className="text-xs">▼</span>
              </button>
            </div>
            <button onClick={() => setView("PROFILE")} className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all">
              <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold">
                 {user.username[0]?.toUpperCase()}
              </div>
            </button>
          </div>

          {showMoodSelector && (
              <div className="mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 animate-in fade-in slide-in-from-top-2">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-3">How are you feeling?</p>
                  <div className="grid grid-cols-4 gap-2">
                      {MOODS.map(m => (
                          <button 
                             key={m.label}
                             onClick={() => { updateUser({...user, mood: m.emoji + " " + m.label}); setShowMoodSelector(false); }}
                             className="flex flex-col items-center p-2 hover:bg-slate-50 rounded-lg transition-colors"
                          >
                              <span className="text-2xl mb-1">{m.emoji}</span>
                              <span className="text-[10px] font-bold text-slate-600">{m.label}</span>
                          </button>
                      ))}
                  </div>
              </div>
          )}

          {/* Instant Relief Button */}
          <button 
            onClick={() => setShowInstantRelief(true)}
            className="w-full bg-indigo-600 text-white p-4 rounded-2xl shadow-lg hover:bg-indigo-700 transition-all active:scale-95 flex items-center justify-between mb-6 group relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 opacity-90 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex items-center gap-3">
              <div className="bg-white/20 p-2 rounded-full">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <h3 className="font-bold text-lg">Instant Relief</h3>
                <p className="text-xs text-indigo-100 font-medium">Quick distraction based on your mood</p>
              </div>
            </div>
            <ArrowLeft className="w-5 h-5 relative z-10 rotate-180" />
          </button>

          <div className="grid grid-cols-1 gap-4 overflow-y-auto pb-20 no-scrollbar">
             <Card title="Games & Tools" icon={Gamepad2} description="Arcade games & Mindful tools" onClick={() => setView("GAMES")} colorClass="bg-indigo-50 text-indigo-900" />
             <Card title="Journal" icon={BookHeart} description="Express your thoughts" onClick={() => setView("JOURNAL")} colorClass="bg-rose-50 text-rose-900" />
             <Card title="Creative Space" icon={Palette} description="Draw, music & imagine" onClick={() => setView("CREATIVE")} colorClass="bg-teal-50 text-teal-900" />
             <Card title="Kindness" icon={Heart} description="Daily acts of kindness" onClick={() => setView("GRATITUDE")} colorClass="bg-amber-50 text-amber-900" />
             <Card title="Inspiration" icon={Quote} description="Daily quotes & wisdom" onClick={() => setView("QUOTES")} colorClass="bg-sky-50 text-sky-900" />
          </div>
        </div>
      )}

      {showInstantRelief && (
        <InstantReliefOverlay 
          userMood={user.mood} 
          onClose={() => setShowInstantRelief(false)}
          onNavigate={(newView, game) => {
             setView(newView);
             if (game) setActiveGame(game);
          }}
        />
      )}

      {view === "GAMES" && <GamesHub onBack={() => { setView("HOME"); setActiveGame("NONE"); }} user={user} activeGame={activeGame} setActiveGame={setActiveGame} />}
      {view === "JOURNAL" && <JournalView onBack={() => setView("HOME")} />}
      {view === "CREATIVE" && <CreativeView onBack={() => setView("HOME")} user={user} />}
      {view === "GRATITUDE" && <GratitudeView onBack={() => setView("HOME")} />}
      {view === "QUOTES" && <QuotesView onBack={() => setView("HOME")} />}
      {view === "PROFILE" && (
          <ProfileView 
             onBack={() => setView("HOME")} 
             currentProfile={user} 
             onUpdate={updateUser}
             onLogin={handleLogin}
             onSignup={handleSignup}
             onLogout={handleLogout}
          />
      )}
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);