import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import { GoogleGenAI, Type } from "@google/genai";
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
  FileJson
} from "lucide-react";

// --- Configuration & Helpers ---

const AI_MODEL = "gemini-3-flash-preview";
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
    clear_bg: "Clear Background", eyedropper: "Eyedropper", recent_colors: "Swatches",
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
    account: "Account", login: "Login", sign_up: "Sign Up", master_volume: "Master Volume",
    sounds_tab: "Sounds", instructions_title: "How to use",
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
      SKETCH: "Use the brush tool to paint freely. Layers allow you to stack content with blending modes like Multiply or Overlay.",
      SOUND_MIXER: "Create your own relaxing atmosphere by mixing different ambient sounds. Adjust each volume to find your perfect zen mix.",
      AI_PLAYLIST: "Describe the vibe you want for your day, and Lumina will curate a 5-song playlist of real tracks for you to explore."
    }
  },
  es: { 
    app_name: "Lumina", hi: "Hola", feeling: "Sintiéndome", instant_relief: "Alivio Instantáneo", instant_relief_desc: "Distracción rápida", games_tools: "Juegos", journal: "Diario", kindness: "Hub de Amabilidad", inspiration: "Inspiración", explore_themes: "Explorar Temas", daily_mission: "Misión Diaria", zen_stories: "Historias Zen", quote_tab: "Frases", new_prompt: "Nueva sugerencia", grateful_tree: "Árbol de Gratitud", mandala: "Creador Mandala", theme_label: "Tema de Enfoque", theme_placeholder: "ej. Naturaleza, Resiliencia", listen: "Escuchar", ai_art_btn: "Arte IA", spin_btn: "Girar la Rueda", search_joke: "Busca un tema de chiste...", search_btn: "Buscar", reset_btn: "Reiniciar", kindness_challenges: "Retos de Hoy", accept_challenge: "Aceptar", kindness_log: "Mis Actos", get_more_challenges: "Más Ideas", challenge_completed: "¡Completado!", gratitude_list: "Lista de Gratitud", gratitude_hint: "¿Por qué estás agradecido hoy?", gratitude_prompt_btn: "Sugerencia", kindness_tab: "Amabilidad", gratitude_tab_btn: "Gratitude", upload_image: "Importar Fondo", smoothing: "Estabilizar", progress_saved: "¡Progreso guardado!", add_palette: "Añadir a Muestras", clear_bg: "Borrar Fondo", eyedropper: "Gotero", recent_colors: "Recientemente Usado", save_palette_lib: "Guardar conjunto como paleta", palette_library: "Tus Paletas", unnamed_palette: "Paleta sin nombre", undo: "Deshacer", redo: "Rehacer", save_options: "Opciones de Guardado", add_color_swatch: "Añadir color actual a Muestras", save_current_set: "Guardar Muestras como paleta permanente", ai_music: "Música IA", music_prompt: "Describe el ambiente (ej. 'Noche lluviosa acogedora')", generate_tune: "Generar Melodía", playing_tune: "Reproduciendo tu melodía...", bg_music_label: "Música de Fondo", none: "Ninguna", zen_drone: "Dron Zen", morning_mist: "Niebla Matinal", ocean_waves: "Olas del Mar", ai_custom: "Melodía IA Personalizada", volume: "Volumen",
    account: "Cuenta", login: "Iniciar sesión", sign_up: "Registrarse", master_volume: "Volumen Maestro", sounds_tab: "Sonidos", instructions_title: "Instrucciones",
    layers: "Capas", add_layer: "Nueva Capa", delete_layer: "Borrar Capa", blend_mode: "Modo Fusión",
    layer_opacity: "Opacidad",
    ai_playlist: "Playlist IA", playlist_hint: "ej. Mañana relajada, Noche de lluvia...", generate_playlist: "Generar Mi Playlist",
    gen_playlist_loading: "Curando tu ambiente...", songs_found: "Tu Playlist Curada",
    quick_vibe: "Ambientes rápidos:", play_all: "Reproducir Todo", stop_all: "Detener Todo",
    music_therapy: "Terapia Musical", music_therapy_desc: "Curada científicamente con el principio Iso",
    download: "Descargar PNG", clear_canvas: "Borrar Todo", save_project: "Guardar Proyecto", load_project: "Mi Galería",
    confirm_clear: "¿Estás seguro de que quieres borrar todo el lienzo? Todas las capas se reiniciarán.",
    save_success: "¡Dibujo guardado en la galería!",
    sketch_tab: "Esbozo",
    why_it_works: "Por qué funciona:",
    now_playing: "Reproduciendo",
    guides: "Guías",
    grid_size: "Tamaño Cuadrícula",
    perspective: "Perspectiva",
    my_library: "Ma Biblioteca",
    add_track: "Añadir Pista",
    track_title: "Título de Canción",
    track_artist: "Artista",
    track_added: "Canción añadida",
    curator_tab: "IA Curador",
    library_tab: "Mi Playlist",
    quota_error: "La IA está descansando (Límite alcanzado). Usando contenido clásico.",
    enter_text: "Ingresa el texto para añadir:",
    bg_music: "Música de Fondo",
    zen_piano: "Piano Zen",
    soft_synth: "Sintetizador Suave",
    space_ambient: "Espacio Ambiente",
    ai_melody_hint: "ej. Bosque juguetón, noche triste...",
    palette_manager: "Gestor de Paletas",
    palettes_lib: "Biblioteca de Paletas",
    export_json: "Exportar Biblioteca",
    import_json: "Importar Biblioteca",
    save_palette: "Guardar Actual",
    palette_name_prompt: "Nombre para esta paleta:",
    import_success: "¡Paletas importadas!",
    import_error: "Archivo de paleta no válido.",
    instructions: {
      BREATHING: "Sigue el círculo. Inhala cuando crezca y exhala cuando se encoja.",
      SNAKE: "Uسا las flechas para guiar la serpiente. Come para crecer, no choques con las paredes.",
      BREAKOUT: "Mueve la paleta para rebotar la bola y romper todos los bloques.",
      DODGE: "Esquiva los obstáculos espatiales moviendo tu cohete a los lados.",
      COMEDY: "Elige un estilo de humor o busca un tema para reír un poco.",
      MEMORY: "Encuentra todas las parejas de cartas iguales.",
      POP: "Explota las burbuzas para aliviar el estrés rápidamente.",
      STACK: "Toca para colocar el bloque. Intenta apilarlos lo más alto posible.",
      ECHO: "Repite la secuencia de colores y sonidos exactement comme apparaît.",
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
      SKETCH: "Usa la herramienta de pincel para pintar libremente. Usa capas y modos de fusión.",
      SOUND_MIXER: "Crea tu propia atmósfera relajante mezclando sonidos ambientales.",
      AI_PLAYLIST: "Describe el ambiente que deseas para tu día y Lumina curará una lista de 5 canciones para ti."
    }
  },
  fr: {
    app_name: "Lumina", hi: "Salut", feeling: "Se sentir", instant_relief: "Soulagement Instantané",
    instant_relief_desc: "Distraction rapide selon votre humeur", games_tools: "Jeux et Outils",
    games_tools_desc: "Jeux d'arcade et outils zen", journal: "Journal", journal_desc: "Exprimez vos pensées",
    creative_space: "Espace Créatif", creative_space_desc: "Dessin, musique et imagination", kindness: "Bienveillance",
    kindness_desc: "Bonté et Gratitude", inspiration: "Inspiration", inspiration_desc: "Citations et sagesse",
    profile_settings: "Profil et Paramètres", save_changes: "Enregistrer", sign_out: "Déconnexion",
    language: "Langue", back_home: "Accueil", start_now: "Commencer",
    loading_suggestion: "Recherche de la meilleure activité...", need_inspiration: "Besoin d'inspiration ?",
    writing_prompt: "Sujet d'écriture", save_entry: "Enregistrer", add_act: "Ajouter un acte",
    daily_quotes: "Inspiration quotidienne", start: "Démarrer", pause: "Pause", reset: "Réinitialiser", try_again: "Réessayer",
    game_over: "PARTIE TERMINÉE", display_name: "Nom d'affichage", current_mood: "Humeur actuelle",
    round: "Tour", height: "Hauteur", popped: "Éclatés", best: "Meilleur", score: "Score",
    writing_hint: "Commencez à écrire ou parler...", save_list: "Enregistrer", acts_hint: "Quel acte bienveillant ?",
    generate_art: "Générer l'Art", clear_all: "Tout effacer",
    whack_thought: "Chasse aux pensées", zen_sand: "Jardin Zen", color_match: "Couleurs",
    guided_imagery: "Imagerie Guidée", sound_mixer: "Paysages Sonores", affirmations: "Affirmations",
    forest: "Forêt", fire: "Feu", ocean: "Océan", rain: "Pluie", white_noise: "Zen",
    imagine: "Imaginez", imagine_desc: "Décrivez un lieu paisible...",
    new_prompt: "Nouveau sujet",
    past_entries: "Historique", no_entries: "Aucune entrée.", delete_entry: "Supprimer", entry_saved: "Enregistré !",
    daily_mission: "Mission du jour", zen_stories: "Historires Zen", quote_tab: "Citations", 
    mission_desc: "Un petit pas positif pour aujourd'hui", mandala: "Créateur Mandala", grateful_tree: "Arbre de Gratitude",
    theme_label: "Thème de focus", theme_placeholder: "ex: Nature, Paix", listen: "Écouter",
    ai_art_btn: "Art IA", spin_btn: "Tourner la roue", search_joke: "Sujet de blague...", search_btn: "Chercher",
    reset_btn: "Reset", kindness_challenges: "Défis de bienveillance", accept_challenge: "Accepter",
    kindness_log: "Mes actions", get_more_challenges: "Nouvelles idées", challenge_completed: "Terminé !",
    gratitude_list: "Liste de gratitude", gratitude_hint: "Pourquoi êtes-vous reconnaissant ?", gratitude_prompt_btn: "Sujet",
    kindness_tab: "Bienveillance", gratitude_tab_btn: "Gratitude", upload_image: "Importer fond",
    smoothing: "Stabiliser", progress_saved: "Progression sauvée !", add_palette: "Ajouter aux nuances",
    eyedropper: "Pipette", recent_colors: "Nuances",
    save_palette_lib: "Nommer et sauver la palette", palette_library: "Vos Palettes", unnamed_palette: "Sans nom",
    undo: "Annuler", redo: "Refaire",
    ai_playlist: "Curateur de Playlist IA", playlist_hint: "ex: Matin calme, Pluie nocturne...", generate_playlist: "Générer ma playlist",
    gen_playlist_loading: "Curation en cours...", songs_found: "Votre Playlist Unique",
    quick_vibe: "Vibes rapides :", play_all: "Tout jouer", stop_all: "Tout arrêter",
    music_therapy: "Musicothérapie", music_therapy_desc: "Curé scientifiquement selon le principe Iso",
    ai_music: "Musique IA", music_prompt: "Décrivez l'ambiance", generate_tune: "Générer",
    playing_tune: "Lecture...", bg_music_label: "Musique de Fond", none: "Aucune", zen_drone: "Bourdon Zen",
    morning_mist: "Brume matinale", ocean_waves: "Vagues", ai_custom: "Mélodie IA", volume: "Volume",
    account: "Compte", login: "Connexion", sign_up: "S'inscrire", master_volume: "Volume Maître",
    sounds_tab: "Sons", instructions_title: "Instructions",
    layers: "Calques", add_layer: "Nouveau Calque", delete_layer: "Supprimer", blend_mode: "Mode Fusion",
    layer_opacity: "Opacité",
    email_label: "Email", password_label: "Mot de passe", name_label: "Nom",
    login_cta: "Déjà un compte ?", signup_cta: "Pas de compte ?",
    welcome_back: "Bon retour", join_us: "Rejoindre Lumina",
    polygon: "Polygone", sides: "Côtés", 
    download: "Télécharger PNG", clear_canvas: "Tout effacer", save_project: "Sauver Projet", load_project: "Ma Galerie",
    confirm_clear: "Effacer tout le canevas ? Tous les calques seront réinitialisés.",
    save_success: "Dessin enregistré !",
    sketch_tab: "Croquis",
    explore_themes: "Explorer les thèmes",
    why_it_works: "Pourquoi ça marche :",
    now_playing: "En cours",
    guides: "Guides",
    grid_size: "Taille grille",
    perspective: "Perspective",
    my_library: "Ma Bibliothèque",
    add_track: "Ajouter",
    track_title: "Titre",
    track_artist: "Artiste",
    track_added: "Ajouté à la bibliothèque",
    curator_tab: "Curateur IA",
    library_tab: "Ma Playlist",
    quota_error: "L'IA se repose (limite atteinte). Utilisation du contenu classique.",
    enter_text: "Texte à ajouter :",
    bg_music: "Musique de fond",
    zen_piano: "Piano Zen",
    soft_synth: "Synthé doux",
    space_ambient: "Ambiance spatiale",
    ai_melody_hint: "ex: Forêt joyeuse, nuit pluvieuse...",
    palette_manager: "Gestionnaire de Palettes",
    palettes_lib: "Ma Bibliothèque",
    export_json: "Exporter",
    import_json: "Importer",
    save_palette: "Sauver Actuelle",
    palette_name_prompt: "Nom de la palette :",
    import_success: "Bibliothèque importée !",
    import_error: "Fichier invalide.",
    instructions: {
      BREATHING: "Suivez le cercle qui s'agrandit. Inspirez quand il grossit, retenez au sommet, expirez quand il rétrécit.",
      SNAKE: "Utilisez les flèches pour guider le serpent. Mangez la nourriture rouge pour grandir, ne touchez pas les murs !",
      BREAKOUT: "Déplacez la palette pour faire rebondir la balle. Cassez tous les blocs pour gagner.",
      DODGE: "Dirigez votre fusée pour éviter les débris spatiaux entrants.",
      COMEDY: "Sélectionnez un style d'humour ou cherchez un sujet. Cliquez sur 'Autre' pour continuer à rire.",
      MEMORY: "Tapez sur les cartes pour les retourner. Trouvez toutes les paires pour gagner.",
      POP: "Éclatez les bulles qui montent. Idéal pour un soulagement rapide du stress.",
      STACK: "Tapez n'importe où pour placer le bloc mobile. Essayez de les empiler aussi haut que possible !",
      ECHO: "Observez la séquence de couleurs et de sons, puis répétez-la exactement.",
      THOUGHTS: "Identifiez les pensées stressantes et effacez-les avant qu'elles n'envahissent votre esprit.",
      SAND: "Tracez lentement des chemins dans le sable. Utile pour se recentrer.",
      MATCH: "Regardez la couleur cible et sélectionnez celle qui correspond parmi les options.",
      IMAGERY: "Fermez les yeux (optionnel) et lisez le scénario. Imaginez-vous dans ce lieu paisible.",
      SOUNDS: "Activez vos sons d'ambiance favoris. Ajustez les volumes pour créer votre mix parfait.",
      AFFIRMATIONS: "Prenez un moment pour lire l'affirmation. Croyez en ces mots et laissez-les vous fortifier.",
      MANDALA: "Dessinez sur le canevas. Vos traits seront reflétés pour créer de magnifiques mandalas.",
      GRATEFUL_TREE: "Ajoutez des choses pour lesquelles vous êtes reconnaissant. Voyez vos feuilles peupler l'arbre.",
      TIMER: "Utilisez ce minuteur Pomodoro de 25 minutes pour vous concentrer sur une seule tâche.",
      WHEEL: "Besoin d'une idée ? Tournez la roue pour une suggestion d'activité mindful.",
      SKETCH: "Utilisez le pinceau pour peindre librement. Les calques permettent d'empiler du contenu avec des modes de fusion.",
      SOUND_MIXER: "Créez votre propre atmosphère relaxante en mélangeant différents sons ambiants.",
      AI_PLAYLIST: "Décrivez l'ambiance souhaitée, et Lumina créera une playlist de 5 chansons réelles pour vous."
    }
  },
  zh: {
    app_name: "Lumina", hi: "你好", feeling: "感觉", instant_relief: "即刻舒缓",
    instant_relief_desc: "根据您的心情快速放松", games_tools: "游戏与工具",
    games_tools_desc: "益智游戏与正念工具", journal: "日记", journal_desc: "记录您的想法",
    creative_space: "创意空间", creative_space_desc: "绘画、音乐与想象", kindness: "善行中心",
    kindness_desc: "善行与感恩", inspiration: "灵感", inspiration_desc: "每日名言与智慧",
    profile_settings: "个人资料与设置", save_changes: "保存更改", sign_out: "退出登录",
    language: "语言", back_home: "返回首页", start_now: "立即开始",
    loading_suggestion: "正在为您寻找最佳舒缓方案...", need_inspiration: "需要灵感？点击下方按钮。",
    writing_prompt: "书写提示", save_entry: "保存日记", add_act: "添加善行记录",
    daily_quotes: "每日灵感", start: "开始", pause: "暂停", reset: "重置", try_again: "重试",
    game_over: "游戏结束", display_name: "显示名称", current_mood: "当前心情",
    round: "回合", height: "高度", popped: "已戳破", best: "最高纪录", score: "得分",
    writing_hint: "开始书写或通过语音输入...", save_list: "保存列表", acts_hint: "今天做了什么善行？",
    generate_art: "生成艺术", clear_all: "全部清空",
    whack_thought: "消灭烦恼", zen_sand: "禅意沙盘", color_match: "色彩匹配",
    guided_imagery: "引导冥想", sound_mixer: "声景混合", affirmations: "正向肯定",
    forest: "森林", fire: "篝火", ocean: "海洋", rain: "下雨", white_noise: "禅意白噪音",
    imagine: "想象", imagine_desc: "描述一个宁静的地方...",
    new_prompt: "新提示",
    past_entries: "历史记录", no_entries: "暂无日记记录。", delete_entry: "删除", entry_saved: "已保存！",
    daily_mission: "每日任务", zen_stories: "禅意故事", quote_tab: "名言", 
    mission_desc: "今天迈出一小步正能量", mandala: "曼陀罗创作", grateful_tree: "感恩树",
    theme_label: "关注主题", theme_placeholder: "例如：自然、韧性、和平", listen: "收听",
    ai_art_btn: "AI艺术", spin_btn: "转动轮盘", search_joke: "搜索笑话主题...", search_btn: "搜索",
    reset_btn: "重置", kindness_challenges: "今日善行挑战", accept_challenge: "接受",
    kindness_log: "善行日志", get_more_challenges: "获取新创意", challenge_completed: "已完成！",
    gratitude_list: "感恩清单", gratitude_hint: "今天有什么值得感激的事？", gratitude_prompt_btn: "获取提示",
    kindness_tab: "善行", gratitude_tab_btn: "感恩", upload_image: "导入背景",
    smoothing: "平滑", progress_saved: "进度已保存！", add_palette: "添加至色板",
    eyedropper: "吸色器", recent_colors: "色板",
    save_palette_lib: "保存色板", palette_library: "您的色板库", unnamed_palette: "未命名色板",
    undo: "撤销", redo: "重做",
    ai_playlist: "AI 歌单推荐", playlist_hint: "例如：晨间专注、雨夜、快乐能量...", generate_playlist: "生成我的歌单",
    gen_playlist_loading: "正在为您精选曲目...", songs_found: "您的专属歌单",
    quick_vibe: "快速氛围：", play_all: "播放全部", stop_all: "停止全部",
    music_therapy: "音乐疗法", music_therapy_desc: "根据 Iso 原理科学精选",
    ai_music: "AI 音乐", music_prompt: "描述氛围（如“温馨雨夜”）", generate_tune: "生成旋律",
    playing_tune: "正在播放您的旋律...", bg_music_label: "背景音乐", none: "无", zen_piano: "禅意钢琴",
    soft_synth: "柔和合成器", space_ambient: "太空氛围", volume: "音量",
    account: "账户", login: "登录", sign_up: "注册", master_volume: "主音量",
    sounds_tab: "声音", instructions_title: "使用指南",
    layers: "图层", add_layer: "新图层", delete_layer: "删除图层", blend_mode: "混合模式",
    layer_opacity: "透明度",
    email_label: "邮箱", password_label: "密码", name_label: "姓名",
    login_cta: "已有账户？", signup_cta: "没有账户？",
    welcome_back: "欢迎回来", join_us: "加入 Lumina",
    polygon: "多边形", sides: "边数", 
    download: "下载 PNG", clear_canvas: "全部清空", save_project: "保存项目", load_project: "我的画廊",
    confirm_clear: "确定要清空整个画布吗？所有图层都将被重置。",
    save_success: "绘画已保存至画廊！",
    sketch_tab: "素描",
    explore_themes: "探索主题",
    why_it_works: "原理解析：",
    now_playing: "正在播放",
    guides: "参考线",
    grid_size: "网格大小",
    perspective: "透视",
    my_library: "我的媒体库",
    add_track: "添加曲目",
    track_title: "曲名",
    track_artist: "艺术家",
    track_added: "已添加至媒体库",
    curator_tab: "AI 推荐",
    library_tab: "我的播放列表",
    quota_error: "AI 正在休息（达到速率限制）。正在使用经典内容。",
    enter_text: "输入文字内容：",
    bg_music: "背景音乐",
    palette_manager: "色板管理器",
    palettes_lib: "色板库",
    export_json: "导出库",
    import_json: "导入库",
    save_palette: "保存当前",
    palette_name_prompt: "为该色板命名：",
    import_success: "色板成功导入！",
    import_error: "无效的色板文件。",
    instructions: {
      BREATHING: "跟随圆圈。随着它变大而吸气，在顶点停留，随着它缩小而呼气。",
      SNAKE: "使用方向按钮引导贪吃蛇。吃掉红色的食物以成长，但不要撞到墙壁或自己！",
      BREAKOUT: "左右移动挡板以反弹小球。打碎所有方块即可获胜。",
      DODGE: "控制您的火箭左右移动以避开太空碎片。",
      COMEDY: "选择一种幽默风格或搜索主题。点击“再来一个”继续享受欢笑。",
      MEMORY: "点击卡片翻转它们。找到所有匹配的对子即可获胜。",
      POP: "点击上升的气泡将其戳破。非常适合快速缓解压力和集中注意力。",
      STACK: "点击屏幕任意位置放置移动的方块。尽量堆得越高越好！",
      ECHO: "观察颜色和声音的序列，然后按照顺序重复出来。",
      THOUGHTS: "识别压力较大的想法，在它们占领您的心头之前点击消灭它们。",
      SAND: "在沙子中缓慢地勾勒路径。通过这种方式正念并集中注意力。",
      MATCH: "观察中心的目标颜色，并从下方选项中选择匹配的一项。",
      IMAGERY: "闭上眼睛（可选）并阅读场景描述。想象自己身处那个宁静的地方。",
      SOUNDS: "开启您喜爱的环境音。调整各个滑块以创建完美的混音。",
      AFFIRMATIONS: "花一点时间阅读肯定句。相信这些文字的力量并让自己获得能量。",
      MANDALA: "在画布上绘画。您的笔触将被镜像对称，以创建复杂精美的曼陀罗。",
      GRATEFUL_TREE: "添加您感激的事物。看着您的感恩叶片充实这棵大树。",
      TIMER: "使用这个 25 分钟的番茄钟来专注完成一项任务，不受干扰。",
      WHEEL: "不知道该做什么？转动轮盘，获取一个正念活动建议。",
      SKETCH: "使用画笔自由创作。图层功能允许您使用“正片叠底”或“叠加”等混合模式堆叠内容。",
      SOUND_MIXER: "混合不同的环境音来创建您自己的放松氛围。",
      AI_PLAYLIST: "描述您想要的氛围，Lumina 将为您推荐 5 首真实曲目进行探索。"
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
  { id: "Joy", icon: Smile, color: "bg-yellow-50 text-yellow-600 border-yellow-100" }
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
    const semitones = notes[key] + (octave - 4) * 12;
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

// --- Types ---
type ViewState = "HOME" | "GAMES" | "JOURNAL" | "CREATIVE" | "GRATITUDE" | "PROFILE" | "QUOTES";
type GameType = "NONE" | "BREATHING" | "SNAKE" | "BREAKOUT" | "DODGE" | "COMEDY" | "MEMORY" | "POP" | "STACK" | "ECHO" | "THOUGHTS" | "SAND" | "MATCH" | "IMAGERY" | "SOUNDS" | "AFFIRMATIONS" | "MANDALA" | "GRATEFUL_TREE" | "TIMER" | "WHEEL";
interface UserProfile { username: string; mood: string; language: string; email?: string; }
interface JournalEntry { id: string; date: string; text: string; prompt?: string; image?: string; }
interface KindnessChallenge { id: string; text: string; icon: any; category: string; }
interface SongSuggestion { title: string; artist: string; year: string; therapyInfo?: string; }

interface Layer {
  id: string;
  name: string;
  visible: boolean;
  opacity: number;
  blendMode: string;
  thumbnail?: string;
}

interface SavedProject {
  id: string;
  name: string;
  date: string;
  thumbnail: string;
  layers: Layer[];
  canvasData: Record<string, string>; // layerId -> dataUrl
}

interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
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

// --- Features Components ---

// --- Playlist Generator Component ---
const PlaylistGenerator = ({ lang, user }: any) => {
    const [curatorTab, setCuratorTab] = useState<'CURATOR' | 'LIBRARY'>('CURATOR');
    const [vibe, setVibe] = useState("");
    const [playlist, setPlaylist] = useState<SongSuggestion[]>([]);
    const [userPlaylist, setUserPlaylist] = useState<SongSuggestion[]>([]);
    const [loading, setLoading] = useState(false);
    const [lastPlayedIndex, setLastPlayedIndex] = useState<number | null>(null);
    const [quotaExceeded, setQuotaExceeded] = useState(false);
    const [isTherapyMode, setIsTherapyMode] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);

    // Manual add track state
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
                setProgress(p => {
                    if (p >= 100) return 0;
                    return p + 0.5;
                });
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    const activeList = curatorTab === 'CURATOR' ? playlist : userPlaylist;

    const generate = async (vibeOverride?: string) => {
        const activeVibe = vibeOverride || vibe || "Something uplifting";
        const therapy = activeVibe === "Music Therapy";
        setIsTherapyMode(therapy);
        setLoading(true);
        setQuotaExceeded(false);
        setLastPlayedIndex(null);
        setIsPlaying(false);
        setProgress(0);
        try {
            let prompt = `Based on the vibe "${activeVibe}" and user current mood "${user.mood}", suggest 5 real, popular songs (title, artist, year) that would be uplifting and fitting. Provide response as JSON array of objects with title, artist, year keys. Language: ${user.language}`;
            
            if (therapy) {
                prompt = `You are a certified music therapist. Curate a 5-song playlist for a user feeling ${user.mood} in ${user.language}. Use the Iso-principle: start with songs matching their current energy and gradually transition to a more positive/calm target state. For each song, provide a 'therapyInfo' field explaining the psychological benefit or reason for selection. Return JSON array: [{title, artist, year, therapyInfo}]`;
            }

            const response = await ai.models.generateContent({
                model: AI_MODEL,
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                title: { type: Type.STRING },
                                artist: { type: Type.STRING },
                                year: { type: Type.STRING },
                                therapyInfo: { type: Type.STRING }
                            },
                            required: ["title", "artist", "year"]
                        }
                    }
                }
            });
            const data = JSON.parse(response.text || "[]");
            setPlaylist(data);
            playSound('success');
        } catch (e) {
            console.error(e);
            if (handleAIError(e)) {
              setQuotaExceeded(true);
              setPlaylist(therapy ? FALLBACK_PLAYLISTS.therapy : FALLBACK_PLAYLISTS.default);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAddTrack = () => {
        if (!newTrack.title.trim() || !newTrack.artist.trim()) return;
        const updated = [...userPlaylist, { ...newTrack, year: new Date().getFullYear().toString() }];
        setUserPlaylist(updated);
        localStorage.setItem("lumina_user_playlist", JSON.stringify(updated));
        setNewTrack({ title: "", artist: "" });
        setShowAddTrack(false);
        playSound('success');
    };

    const removeTrack = (index: number) => {
        const updated = userPlaylist.filter((_, i) => i !== index);
        setUserPlaylist(updated);
        localStorage.setItem("lumina_user_playlist", JSON.stringify(updated));
        if (lastPlayedIndex === index) {
            setLastPlayedIndex(null);
            setIsPlaying(false);
        }
        playSound('trash');
    };

    const handleQuickVibe = (v: string) => {
      setVibe(v);
      generate(v);
      playSound('click');
    };

    const handlePlaySong = (index: number) => {
      setLastPlayedIndex(index);
      setIsPlaying(true);
      setProgress(0);
      playSound('success', 0.2);
    };

    const handleStopMusic = () => {
        setIsPlaying(false);
        setLastPlayedIndex(null);
        setProgress(0);
        playSound('click');
    };

    const handleSkip = (dir: 'next' | 'prev') => {
      if (activeList.length === 0) return;
      const current = lastPlayedIndex ?? -1;
      let next = dir === 'next' ? current + 1 : current - 1;
      if (next >= activeList.length) next = 0;
      if (next < 0) next = activeList.length - 1;
      handlePlaySong(next);
    };

    const openTrackOnYoutube = () => {
        if (lastPlayedIndex === null) return;
        const song = activeList[lastPlayedIndex];
        window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(song.title + ' ' + song.artist)}`, '_blank');
        playSound('click');
    };

    const playAll = () => {
      if (activeList.length === 0) return;
      handlePlaySong(0);
      playSound('success');
    };

    return (
        <div className="h-full flex flex-col bg-slate-50 overflow-hidden relative">
            {/* Sub-tabs for AI Curator vs User Library */}
            <div className="bg-white border-b flex px-6 shrink-0">
                <button onClick={() => { setCuratorTab('CURATOR'); setLastPlayedIndex(null); setIsPlaying(false); playSound('click'); }} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] border-b-2 transition-all ${curatorTab === 'CURATOR' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-400'}`}>
                    {lang.curator_tab}
                </button>
                <button onClick={() => { setCuratorTab('LIBRARY'); setLastPlayedIndex(null); setIsPlaying(false); playSound('click'); }} className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] border-b-2 transition-all ${curatorTab === 'LIBRARY' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-400'}`}>
                    {lang.library_tab}
                </button>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-6 pb-32">
                {curatorTab === 'CURATOR' ? (
                  <div className="space-y-8 animate-in fade-in duration-300">
                      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                          <div className="flex items-center gap-2 mb-6">
                            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-colors ${isTherapyMode ? 'bg-rose-50 text-rose-600' : 'bg-indigo-50 text-indigo-600'}`}>
                              {isTherapyMode ? <HeartPulse size={20} /> : <ListMusic size={20} />}
                            </div>
                            <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">{isTherapyMode ? lang.music_therapy : lang.ai_playlist}</h3>
                          </div>
                          
                          <div className="space-y-6">
                            <div className="relative group">
                                <input 
                                    value={vibe} 
                                    onChange={e => setVibe(e.target.value)} 
                                    placeholder={lang.playlist_hint} 
                                    className="w-full p-5 bg-slate-50 rounded-[1.5rem] font-bold text-sm outline-none focus:ring-4 focus:ring-indigo-50 border-2 border-transparent focus:border-indigo-100 transition-all text-slate-700"
                                    onKeyDown={e => e.key === 'Enter' && generate()}
                                />
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                   {vibe && <button onClick={() => { setVibe(""); playSound('click'); }} className="p-1 text-slate-300 hover:text-rose-400"><X size={16}/></button>}
                                </div>
                            </div>

                            <div className="space-y-3">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">{lang.quick_vibe}</p>
                              <div className="flex flex-wrap gap-2">
                                {QUICK_VIBES.map((v, i) => (
                                  <button 
                                    key={i} 
                                    onClick={() => handleQuickVibe(v.label)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all border ${vibe === v.label ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : `${v.color} border-slate-100 hover:border-indigo-200`}`}
                                  >
                                    <v.icon size={12} />
                                    {v.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <button 
                                onClick={() => generate()} 
                                disabled={loading} 
                                className={`w-full py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-3 ${isTherapyMode ? 'bg-rose-500 text-white shadow-rose-100' : 'bg-indigo-600 text-white shadow-indigo-100'}`}
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
                                {lang.generate_playlist}
                            </button>
                          </div>
                      </div>

                      {isTherapyMode && !loading && playlist.length > 0 && (
                        <div className="mx-2 p-5 bg-rose-50 border border-rose-100 rounded-[2.5rem] flex flex-col gap-2 animate-in fade-in slide-in-from-top-4">
                          <div className="flex items-center gap-3 mb-1">
                            <div className="w-8 h-8 bg-rose-500 text-white rounded-full flex items-center justify-center">
                              <Activity size={16} />
                            </div>
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-rose-900">{lang.music_therapy} Mode</h4>
                          </div>
                          <p className="text-rose-800 text-xs font-bold leading-relaxed opacity-80">{lang.music_therapy_desc}</p>
                        </div>
                      )}
                  </div>
                ) : (
                  <div className="space-y-8 animate-in fade-in duration-300">
                      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center">
                                    <Library size={20} />
                                </div>
                                <h3 className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em]">{lang.my_library}</h3>
                            </div>
                            <button onClick={() => setShowAddTrack(!showAddTrack)} className={`p-2 rounded-xl transition-all ${showAddTrack ? 'bg-rose-50 text-rose-500' : 'bg-teal-50 text-teal-600'}`}>
                                {showAddTrack ? <X size={20} /> : <Plus size={20} />}
                            </button>
                        </div>

                        {showAddTrack && (
                            <div className="space-y-4 mb-2 animate-in slide-in-from-top-4 duration-300">
                                <div className="grid grid-cols-1 gap-3">
                                    <input 
                                        value={newTrack.title}
                                        onChange={e => setNewTrack(prev => ({...prev, title: e.target.value}))}
                                        placeholder={lang.track_title}
                                        className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none border border-transparent focus:border-teal-200"
                                    />
                                    <input 
                                        value={newTrack.artist}
                                        onChange={e => setNewTrack(prev => ({...prev, artist: e.target.value}))}
                                        placeholder={lang.track_artist}
                                        className="w-full p-4 bg-slate-50 rounded-2xl font-bold text-sm outline-none border border-transparent focus:border-teal-200"
                                    />
                                </div>
                                <button 
                                    onClick={handleAddTrack}
                                    className="w-full py-4 bg-teal-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-lg shadow-teal-100 active:scale-95"
                                >
                                    {lang.add_track}
                                </button>
                            </div>
                        )}
                        {!showAddTrack && userPlaylist.length === 0 && (
                            <div className="text-center py-10 opacity-30">
                                <Music4 size={48} className="mx-auto mb-2" />
                                <p className="text-[10px] font-black uppercase">Your library is empty</p>
                            </div>
                        )}
                      </div>
                  </div>
                )}

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
                        <div className="relative mb-6">
                          <Disc size={64} className="text-indigo-200 animate-spin-slow" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
                          </div>
                        </div>
                        <p className="text-indigo-400 font-black uppercase text-[10px] tracking-[0.3em] animate-pulse">{lang.gen_playlist_loading}</p>
                    </div>
                ) : activeList.length > 0 ? (
                    <div className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-4 ml-1">
                          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{lang.songs_found}</h3>
                          <div className="flex gap-2">
                            <button 
                                onClick={playAll}
                                className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center gap-2 ${curatorTab === 'LIBRARY' ? 'bg-teal-600 text-white shadow-teal-100' : (isTherapyMode ? 'bg-rose-500 text-white shadow-rose-100' : 'bg-indigo-600 text-white shadow-indigo-100')}`}
                            >
                                <Play size={10} fill="currentColor" /> {lang.play_all}
                            </button>
                            <button 
                                onClick={handleStopMusic}
                                className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg active:scale-95 transition-all flex items-center gap-2 bg-slate-100 text-slate-500 hover:bg-rose-50 hover:text-rose-500`}
                            >
                                <Square size={10} fill="currentColor" /> {lang.stop_all}
                            </button>
                          </div>
                        </div>
                        {activeList.map((song, i) => (
                            <div 
                                key={i} 
                                className={`w-full bg-white p-5 rounded-[2.5rem] shadow-sm border transition-all flex flex-col gap-4 group ${lastPlayedIndex === i ? 'border-indigo-200 ring-2 ring-indigo-50 shadow-md' : 'border-slate-100 hover:shadow-xl hover:-translate-y-1'}`}
                            >
                                <div className="flex items-center gap-5">
                                    <button 
                                        onClick={() => handlePlaySong(i)}
                                        className={`relative w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-lg transition-all overflow-hidden shrink-0 ${lastPlayedIndex === i ? (isTherapyMode ? 'bg-rose-500 text-white' : 'bg-indigo-600 text-white') : (curatorTab === 'LIBRARY' ? 'bg-gradient-to-br from-teal-400 to-emerald-400 text-white' : (isTherapyMode ? 'bg-gradient-to-br from-rose-400 to-amber-300 text-white' : 'bg-gradient-to-br from-indigo-500 to-purple-500 text-white'))}`}
                                    >
                                        <div className={`absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/0 transition-colors`}>
                                            {lastPlayedIndex === i ? (
                                                <Volume2 size={32} className="animate-pulse" />
                                            ) : (
                                                <Play size={28} fill="white" className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            )}
                                            {lastPlayedIndex !== i && <Music size={28} className="group-hover:opacity-0 transition-opacity" />}
                                        </div>
                                    </button>
                                    <div className="flex-1 min-w-0" onClick={() => handlePlaySong(i)}>
                                        <h4 className={`font-black leading-tight truncate text-base ${lastPlayedIndex === i ? 'text-indigo-600' : 'text-slate-800'}`}>{song.title}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1 truncate">{song.artist} • {song.year}</p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <button onClick={() => handlePlaySong(i)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${lastPlayedIndex === i ? 'bg-rose-100 text-rose-600' : 'bg-slate-50 text-slate-300 group-hover:text-indigo-500 group-hover:bg-indigo-50'}`}>
                                            <Play size={18} fill="currentColor" className={lastPlayedIndex === i ? "hidden" : "ml-0.5"} />
                                            {lastPlayedIndex === i && <Volume2 size={18} />}
                                        </button>
                                        {curatorTab === 'LIBRARY' && (
                                            <button onClick={() => removeTrack(i)} className="w-10 h-10 rounded-full flex items-center justify-center bg-slate-50 text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {song.therapyInfo && curatorTab === 'CURATOR' && (
                                  <div className={`p-3 rounded-2xl border flex gap-2 items-start transition-colors ${lastPlayedIndex === i ? 'bg-indigo-50/50 border-indigo-100' : 'bg-slate-50/80 border-slate-100'}`}>
                                    <Info size={14} className="text-slate-400 shrink-0 mt-0.5" />
                                    <p className="text-[10px] font-bold text-slate-500 leading-relaxed"><span className="text-indigo-600 uppercase tracking-tighter mr-1">{lang.why_it_works}</span>{song.therapyInfo}</p>
                                  </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : curatorTab === 'CURATOR' && (
                    <div className="py-20 text-center opacity-10 animate-pulse flex flex-col items-center">
                        <ListMusic size={100} className="mb-6" />
                        <p className="font-black uppercase text-[12px] tracking-[0.4em]">Ready to curate your sound</p>
                    </div>
                )}
            </div>

            {/* --- Sticky Player Footer --- */}
            {activeList.length > 0 && lastPlayedIndex !== null && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-slate-100 z-50 animate-in slide-in-from-bottom duration-500">
                <div className="w-full bg-slate-100 h-1 rounded-full mb-3 overflow-hidden">
                    <div className={`h-full transition-all duration-300 ${curatorTab === 'LIBRARY' ? 'bg-teal-600' : 'bg-indigo-600'}`} style={{ width: `${progress}%` }} />
                </div>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg shrink-0 ${curatorTab === 'LIBRARY' ? 'bg-teal-600' : (isTherapyMode ? 'bg-rose-500' : 'bg-indigo-600')}`}>
                    <div className="flex items-end gap-0.5 h-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className={`w-1 bg-white rounded-full ${isPlaying ? 'animate-bounce' : 'h-1'}`} style={{ height: isPlaying ? `${Math.random() * 80 + 20}%` : '4px', animationDelay: `${i * 0.1}s` }} />
                        ))}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{lang.now_playing}</h4>
                    <p className="text-sm font-black text-slate-800 truncate leading-tight">{activeList[lastPlayedIndex].title}</p>
                    <p className="text-[9px] font-bold text-slate-500 truncate uppercase tracking-tighter">{activeList[lastPlayedIndex].artist}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button onClick={() => handleSkip('prev')} className="p-2 text-slate-400 hover:text-indigo-600 active:scale-90 transition-all"><SkipBack size={18} fill="currentColor" /></button>
                    <button onClick={() => { setIsPlaying(!isPlaying); playSound('click'); }} className={`p-3 rounded-full text-white shadow-lg active:scale-90 transition-all ${curatorTab === 'LIBRARY' ? 'bg-teal-600' : (isTherapyMode ? 'bg-rose-500' : 'bg-indigo-600')}`}>
                      {isPlaying ? <Pause size={20} fill="white" /> : <Play size={20} fill="white" className="ml-0.5" />}
                    </button>
                    <button onClick={handleStopMusic} className="p-3 text-slate-300 hover:text-rose-500 active:scale-90 transition-all"><Square size={18} fill="currentColor" /></button>
                    <button onClick={() => handleSkip('next')} className="p-2 text-slate-400 hover:text-indigo-600 active:scale-90 transition-all"><SkipForward size={18} fill="currentColor" /></button>
                    <button onClick={openTrackOnYoutube} className="ml-2 p-2 bg-slate-50 text-slate-400 rounded-lg hover:text-indigo-600 active:scale-90 transition-all"><ExternalLink size={16} /></button>
                  </div>
                </div>
              </div>
            )}
        </div>
    );
};

// --- Background Music Component ---
const BackgroundMusicPlayer = ({ user, lang }: any) => {
    const [selected, setSelected] = useState<string>('none');
    const [volume, setVolume] = useState(0.4);
    const [customPrompt, setCustomPrompt] = useState("");
    const [generating, setGenerating] = useState(false);
    const [aiMelody, setAiMelody] = useState<{notes: string[], durations: number[]} | null>(null);
    const stopRef = useRef<() => void>(() => {});

    const playProcedural = (type: string) => {
        stopRef.current();
        if (type === 'none') return;
        
        if (!globalAudioCtx) globalAudioCtx = new AudioContext();
        const ctx = globalAudioCtx;
        if (ctx.state === 'suspended') ctx.resume();

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(volume, ctx.currentTime);
        masterGain.connect(ctx.destination);

        let isActive = true;

        if (type === 'zen_piano') {
            const notes = ['C4', 'E4', 'G4', 'B4', 'D5', 'G4'];
            let i = 0;
            const playNext = () => {
                if (!isActive) return;
                const osc = ctx.createOscillator();
                const g = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(noteToFreq(notes[i % notes.length]), ctx.currentTime);
                g.gain.setValueAtTime(0, ctx.currentTime);
                g.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.1);
                g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);
                osc.connect(g);
                g.connect(masterGain);
                osc.start();
                osc.stop(ctx.currentTime + 2.1);
                i++;
                setTimeout(playNext, 1500 + Math.random() * 1000);
            };
            playNext();
        } else if (type === 'soft_synth') {
            const lfo = ctx.createOscillator();
            lfo.frequency.value = 0.1;
            const lfoGain = ctx.createGain();
            lfoGain.gain.value = 50;
            lfo.start();

            const osc = ctx.createOscillator();
            osc.type = 'sine';
            osc.frequency.value = 220;
            lfo.connect(lfoGain);
            lfoGain.connect(osc.frequency);
            osc.connect(masterGain);
            osc.start();
        } else if (type === 'space_ambient') {
            const createPad = (freq: number) => {
                const osc = ctx.createOscillator();
                const g = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.value = freq;
                g.gain.value = 0.05;
                osc.connect(g);
                g.connect(masterGain);
                osc.start();
                return { osc, g };
            };
            const pads = [createPad(110), createPad(165), createPad(220)];
        } else if (type === 'ai_custom' && aiMelody) {
            let i = 0;
            const playNext = () => {
                if (!isActive) return;
                const note = aiMelody.notes[i % aiMelody.notes.length];
                const dur = aiMelody.durations[i % aiMelody.durations.length];
                const osc = ctx.createOscillator();
                const g = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(noteToFreq(note), ctx.currentTime);
                g.gain.setValueAtTime(0, ctx.currentTime);
                g.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.05);
                g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
                osc.connect(g);
                g.connect(masterGain);
                osc.start();
                osc.stop(ctx.currentTime + dur + 0.1);
                i++;
                setTimeout(playNext, dur * 1000);
            };
            playNext();
        }

        stopRef.current = () => {
            isActive = false;
            masterGain.gain.setTargetAtTime(0, ctx.currentTime, 0.5);
            setTimeout(() => {
                try { masterGain.disconnect(); } catch(e) {}
            }, 1000);
        };
    };

    const handleGenerate = async () => {
        if (!customPrompt.trim()) return;
        setGenerating(true);
        try {
            const r = await ai.models.generateContent({
                model: AI_MODEL,
                contents: `Generate a 8-note calming melody sequence for a "${customPrompt}" vibe. Provide note names (like C4, D4, G3) and durations in seconds. JSON: { "notes": ["C4", ...], "durations": [1.0, ...] }`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            notes: { type: Type.ARRAY, items: { type: Type.STRING } },
                            durations: { type: Type.ARRAY, items: { type: Type.NUMBER } }
                        },
                        required: ["notes", "durations"]
                    }
                }
            });
            const data = JSON.parse(r.text || "{}");
            setAiMelody(data);
            setSelected('ai_custom');
            playProcedural('ai_custom');
        } catch(e) {
            console.error(e);
        } finally {
            setGenerating(false);
        }
    };

    useEffect(() => {
        return () => stopRef.current();
    }, []);

    const options = [
        { id: 'none', label: lang.none, icon: VolumeX },
        { id: 'zen_piano', label: lang.zen_piano, icon: Music },
        { id: 'soft_synth', label: lang.soft_synth, icon: Wind },
        { id: 'space_ambient', label: lang.space_ambient, icon: Moon }
    ];

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <AudioLines className="text-indigo-600" />
                    <h3 className="text-xs font-black uppercase tracking-widest">{lang.bg_music}</h3>
                </div>
                <div className="flex items-center gap-3 bg-slate-100 p-2 rounded-xl">
                    <Volume1 size={14} className="text-slate-400" />
                    <input 
                        type="range" min="0" max="1" step="0.05" value={volume} 
                        onChange={e => {
                            const v = parseFloat(e.target.value);
                            setVolume(v);
                        }} 
                        className="w-20 h-1 bg-slate-200 accent-indigo-600" 
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                {options.map(opt => (
                    <button 
                        key={opt.id}
                        onClick={() => { setSelected(opt.id); playProcedural(opt.id); playSound('click'); }}
                        className={`p-4 rounded-2xl flex flex-col items-center gap-2 border-2 transition-all ${selected === opt.id ? 'bg-indigo-50 border-indigo-600 text-indigo-700' : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200'}`}
                    >
                        <opt.icon size={20} />
                        <span className="text-[10px] font-black uppercase">{opt.label}</span>
                    </button>
                ))}
            </div>

            <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={14} className="text-amber-500" />
                    <h4 className="text-[10px] font-black uppercase text-slate-400">{lang.ai_custom}</h4>
                </div>
                <div className="flex gap-2">
                    <input 
                        value={customPrompt}
                        onChange={e => setCustomPrompt(e.target.value)}
                        placeholder={lang.ai_melody_hint}
                        className="flex-1 bg-slate-50 border-none rounded-xl p-3 text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-100"
                    />
                    <button 
                        onClick={handleGenerate}
                        disabled={generating || !customPrompt.trim()}
                        className="bg-indigo-600 text-white p-3 rounded-xl shadow-lg active:scale-90 disabled:opacity-50 transition-all"
                    >
                        {generating ? <Loader2 size={18} className="animate-spin" /> : <RefreshCcw size={18} />}
                    </button>
                </div>
                {aiMelody && (
                    <button 
                        onClick={() => { setSelected('ai_custom'); playProcedural('ai_custom'); }}
                        className={`mt-3 w-full py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${selected === 'ai_custom' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}
                    >
                        Play Generated Tune
                    </button>
                )}
            </div>
        </div>
    );
};

// --- Drawing Canvas Component (Sketch) ---
const DrawingCanvas = ({ lang }: any) => {
    const layerCanvasesRef = useRef<Record<string, HTMLCanvasElement>>({});
    const [isDrawing, setIsDrawing] = useState(false);
    const [tool, setTool] = useState<'brush' | 'polygon' | 'fill' | 'rectangle' | 'circle' | 'text'>('brush');
    const [polySides, setPolySides] = useState(3);
    const [color, setColor] = useState("#2dd4bf");
    const [isEyedropperActive, setIsEyedropperActive] = useState(false);
    const [brushSize, setBrushSize] = useState(5);
    const [showLayers, setShowLayers] = useState(false);
    const [showGallery, setShowGallery] = useState(false);
    const [showGuides, setShowGuides] = useState(false);
    const [showPalettes, setShowPalettes] = useState(false);
    const [guideSettings, setGuideSettings] = useState({ grid: false, gridSize: 50, perspective: false });
    const [gallery, setGallery] = useState<SavedProject[]>([]);
    
    // Palette Library State
    const [swatches, setSwatches] = useState<string[]>(PRESET_ART_COLORS);
    const [paletteLib, setPaletteLib] = useState<ColorPalette[]>([]);

    const [layers, setLayers] = useState<Layer[]>([
        { id: "layer-1", name: "Layer 1", visible: true, opacity: 1, blendMode: "normal" }
    ]);
    const [activeLayerId, setActiveLayerId] = useState("layer-1");
    const [history, setHistory] = useState<Record<string, string[]>>({ "layer-1": [] });

    const startPos = useRef<{x: number, y: number} | null>(null);
    const startImage = useRef<HTMLImageElement | null>(null);

    const blendModes = [
        "normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion"
    ];

    const loadProject = (project: SavedProject) => {
        setLayers(project.layers);
        setActiveLayerId(project.layers[0].id);
        const newHistory: Record<string, string[]> = {};
        project.layers.forEach(l => {
            const canvas = layerCanvasesRef.current[l.id] || document.createElement('canvas');
            const container = document.getElementById('canvas-container');
            if (container) {
                canvas.width = container.offsetWidth;
                canvas.height = container.offsetHeight;
                const ctx = canvas.getContext('2d');
                const img = new Image();
                img.onload = () => {
                   ctx?.clearRect(0, 0, canvas.width, canvas.height);
                   ctx?.drawImage(img, 0, 0);
                   updateLayerThumbnail(l.id);
                };
                img.src = project.canvasData[l.id];
                layerCanvasesRef.current[l.id] = canvas;
                newHistory[l.id] = [project.canvasData[l.id]];
            }
        });
        setHistory(newHistory);
        setShowGallery(false);
        playSound('success');
    };

    const mapBlendToComposite = (mode: string): GlobalCompositeOperation => {
        if (mode === 'normal') return 'source-over';
        return mode as GlobalCompositeOperation;
    };

    useEffect(() => {
        const storedGallery = localStorage.getItem("lumina_drawing_gallery");
        if (storedGallery) setGallery(JSON.parse(storedGallery));
        
        const storedPalettes = localStorage.getItem("lumina_palettes");
        if (storedPalettes) setPaletteLib(JSON.parse(storedPalettes));

        layers.forEach(l => {
          if (!layerCanvasesRef.current[l.id]) {
            const canvas = document.createElement('canvas');
            const container = document.getElementById('canvas-container');
            if (container) {
                canvas.width = container.offsetWidth;
                canvas.height = container.offsetHeight;
                const ctx = canvas.getContext('2d');
                if (ctx) {
                    if (l.id === layers[0].id) {
                        ctx.fillStyle = '#fff';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                    }
                }
                layerCanvasesRef.current[l.id] = canvas;
                setHistory(prev => ({ ...prev, [l.id]: [canvas.toDataURL()] }));
            }
          }
        });
    }, [layers]);

    const updateLayerThumbnail = (id: string) => {
        const canvas = layerCanvasesRef.current[id];
        if (!canvas) return;
        const thumb = canvas.toDataURL('image/png', 0.1);
        setLayers(prev => prev.map(l => l.id === id ? { ...l, thumbnail: thumb } : l));
    };

    const saveToHistory = (layerId: string) => {
        const canvas = layerCanvasesRef.current[layerId];
        if (!canvas) return;
        const dataUrl = canvas.toDataURL();
        setHistory(prev => ({
            ...prev,
            [layerId]: [...(prev[layerId] || []), dataUrl].slice(-30)
        }));
        updateLayerThumbnail(layerId);
    };

    const floodFill = (canvas: HTMLCanvasElement, x: number, y: number, fillColor: string) => {
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        const getPixel = (px: number, py: number) => {
            if (px < 0 || px >= canvas.width || py < 0 || py >= canvas.height) return [-1, -1, -1, -1];
            const i = (py * canvas.width + px) * 4;
            return [data[i], data[i+1], data[i+2], data[i+3]];
        };
        
        const targetColor = getPixel(x, y);
        const fillRGB = (() => {
            const dummy = document.createElement('div');
            dummy.style.color = fillColor;
            document.body.appendChild(dummy);
            const style = window.getComputedStyle(dummy).color;
            document.body.removeChild(dummy);
            const matches = style.match(/\d+/g);
            return matches ? matches.map(Number) : [0, 0, 0];
        })();

        if (targetColor[0] === fillRGB[0] && targetColor[1] === fillRGB[1] && targetColor[2] === fillRGB[2]) return;

        const stack = [[x, y]];
        while (stack.length > 0) {
            const [curX, curY] = stack.pop()!;
            let left = curX;
            while (left >= 0 && colorsMatch(getPixel(left, curY), targetColor)) left--;
            left++;
            
            let reachAbove = false;
            let reachBelow = false;
            let right = curX;
            while (right < canvas.width && colorsMatch(getPixel(right, curY), targetColor)) {
                const i = (curY * canvas.width + right) * 4;
                data[i] = fillRGB[0]; data[i+1] = fillRGB[1]; data[i+2] = fillRGB[2]; data[i+3] = 255;
                
                if (curY > 0) {
                    if (colorsMatch(getPixel(right, curY - 1), targetColor)) {
                        if (!reachAbove) { stack.push([right, curY - 1]); reachAbove = true; }
                    } else { reachAbove = false; }
                }
                if (curY < canvas.height - 1) {
                    if (colorsMatch(getPixel(right, curY + 1), targetColor)) {
                        if (!reachBelow) { stack.push([right, curY + 1]); reachBelow = true; }
                    } else { reachBelow = false; }
                }
                right++;
            }
        }
        ctx.putImageData(imageData, 0, 0);
    };

    const colorsMatch = (c1: number[], c2: number[]) => {
        return Math.abs(c1[0] - c2[0]) < 5 && Math.abs(c1[1] - c2[1]) < 5 && Math.abs(c1[2] - c2[2]) < 5 && Math.abs(c1[3] - c2[3]) < 5;
    };

    const handleCanvasAction = (e: any) => {
        const activeCanvas = layerCanvasesRef.current[activeLayerId];
        if (!activeCanvas) return;
        const rect = activeCanvas.getBoundingClientRect();
        const x = Math.round((e.touches ? e.touches[0].clientX : e.clientX) - rect.left);
        const y = Math.round((e.touches ? e.touches[0].clientY : e.clientY) - rect.top);

        if (isEyedropperActive) {
            const ctx = activeCanvas.getContext('2d');
            if (ctx) {
                const pixel = ctx.getImageData(x, y, 1, 1).data;
                const hex = "#" + [pixel[0], pixel[1], pixel[2]].map(x => x.toString(16).padStart(2, '0')).join('');
                setColor(hex);
                setIsEyedropperActive(false);
                playSound('click');
            }
            return;
        }

        if (tool === 'fill') {
            floodFill(activeCanvas, x, y, color);
            saveToHistory(activeLayerId);
            playSound('click');
            return;
        }

        if (tool === 'text') {
            const txt = window.prompt(lang.enter_text);
            if (txt) {
                const ctx = activeCanvas.getContext('2d');
                if (ctx) {
                    ctx.font = `bold ${brushSize * 4}px Quicksand, sans-serif`;
                    ctx.fillStyle = color;
                    ctx.fillText(txt, x, y);
                    saveToHistory(activeLayerId);
                    playSound('success');
                }
            }
            return;
        }

        setIsDrawing(true);
        startPos.current = {x, y};
        
        if (tool !== 'brush') {
            const img = new Image();
            img.src = activeCanvas.toDataURL();
            startImage.current = img;
        }
        
        draw(e);
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        startPos.current = null;
        startImage.current = null;
        const ctx = layerCanvasesRef.current[activeLayerId]?.getContext('2d');
        ctx?.beginPath();
        saveToHistory(activeLayerId);
    };

    const draw = (e: any) => {
        if (!isDrawing || isEyedropperActive) return;
        const canvas = layerCanvasesRef.current[activeLayerId];
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx || !startPos.current) return;

        const rect = canvas.getBoundingClientRect();
        const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
        const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;

        ctx.lineWidth = brushSize;
        ctx.lineCap = 'round';
        ctx.strokeStyle = color;
        ctx.fillStyle = color;

        if (tool === 'brush') {
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y);
            if (Math.random() > 0.8) playSound('brush', 0.1);
        } else if (startImage.current) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (activeLayerId === layers[0].id) {
                ctx.fillStyle = '#fff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            ctx.drawImage(startImage.current, 0, 0);
            ctx.fillStyle = color;
            
            if (tool === 'rectangle') {
                ctx.strokeRect(startPos.current.x, startPos.current.y, x - startPos.current.x, y - startPos.current.y);
            } else if (tool === 'circle') {
                const r = Math.sqrt(Math.pow(x - startPos.current.x, 2) + Math.pow(y - startPos.current.y, 2));
                ctx.beginPath();
                ctx.arc(startPos.current.x, startPos.current.y, r, 0, Math.PI * 2);
                ctx.stroke();
            } else if (tool === 'polygon') {
                const radius = Math.sqrt(Math.pow(x - startPos.current.x, 2) + Math.pow(y - startPos.current.y, 2));
                drawPolygonPreview(ctx, startPos.current.x, startPos.current.y, radius, polySides);
            }
        }
    };

    const drawPolygonPreview = (ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, sides: number) => {
        if (sides < 3) return;
        ctx.beginPath();
        const angle = (Math.PI * 2) / sides;
        for (let i = 0; i < sides; i++) {
            const px = x + radius * Math.cos(angle * i - Math.PI / 2);
            const py = y + radius * Math.sin(angle * i - Math.PI / 2);
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.stroke();
    };

    const undo = () => {
        const layerHistory = history[activeLayerId] || [];
        if (layerHistory.length <= 1) return;
        const newHistory = layerHistory.slice(0, -1);
        const previousState = newHistory[newHistory.length - 1];
        const img = new Image();
        img.onload = () => {
            const ctx = layerCanvasesRef.current[activeLayerId]?.getContext('2d');
            if (ctx) {
                const canvas = layerCanvasesRef.current[activeLayerId];
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(img, 0, 0);
                updateLayerThumbnail(activeLayerId);
            }
        };
        img.src = previousState;
        setHistory(prev => ({ ...prev, [activeLayerId]: newHistory }));
        playSound('click');
    };

    const updateLayerProperty = (id: string, prop: keyof Layer, value: any) => {
        setLayers(layers.map(l => l.id === id ? { ...l, [prop]: value } : l));
    };

    const moveLayer = (id: string, dir: 'up' | 'down') => {
        const idx = layers.findIndex(l => l.id === id);
        if (idx === -1) return;
        const newIdx = dir === 'up' ? idx + 1 : idx - 1;
        if (newIdx < 0 || newIdx >= layers.length) return;
        
        const newLayers = [...layers];
        [newLayers[idx], newLayers[newIdx]] = [newLayers[newIdx], newLayers[idx]];
        setLayers(newLayers);
        playSound('click');
    };

    const clearAll = () => {
        if (!confirm(lang.confirm_clear)) return;
        const baseLayerId = "layer-1";
        layers.forEach(l => delete layerCanvasesRef.current[l.id]);
        setLayers([{ id: baseLayerId, name: "Layer 1", visible: true, opacity: 1, blendMode: "normal" }]);
        setActiveLayerId(baseLayerId);
        const canvas = document.createElement('canvas');
        const container = document.getElementById('canvas-container');
        if (container) {
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.fillStyle = '#fff';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            layerCanvasesRef.current[baseLayerId] = canvas;
            setHistory({ [baseLayerId]: [canvas.toDataURL()] });
        }
        playSound('trash');
    };

    const handleSavePalette = () => {
        const name = window.prompt(lang.palette_name_prompt);
        if (name) {
            const newPalette = { id: Date.now().toString(), name, colors: [...swatches] };
            const updated = [...paletteLib, newPalette];
            setPaletteLib(updated);
            localStorage.setItem("lumina_palettes", JSON.stringify(updated));
            playSound('success');
        }
    };

    const handleExportLibrary = () => {
        const data = JSON.stringify(paletteLib);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `lumina-palettes-${Date.now()}.json`;
        a.click();
        playSound('success');
    };

    const handleImportLibrary = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target?.result as string);
                if (Array.isArray(data)) {
                    const updated = [...paletteLib, ...data];
                    setPaletteLib(updated);
                    localStorage.setItem("lumina_palettes", JSON.stringify(updated));
                    alert(lang.import_success);
                    playSound('success');
                }
            } catch { alert(lang.import_error); }
        };
        reader.readAsText(file);
    };

    const toolButtonClass = (t: typeof tool) => `p-1.5 rounded-lg transition-all ${tool === t ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-100'}`;

    return (
        <div className="h-full flex flex-col bg-slate-50 relative overflow-hidden">
            <div className="p-3 bg-white border-b flex flex-col gap-2 shrink-0 shadow-sm z-30">
                <div className="flex gap-3 items-center overflow-x-auto no-scrollbar">
                    <div className="flex gap-1.5 shrink-0">
                        {swatches.slice(0, 6).map((c, idx) => (
                            <button
                                key={`${c}-${idx}`}
                                onClick={() => { setColor(c); playSound('click'); }}
                                className={`w-7 h-7 rounded-lg border-2 transition-all ${color === c ? 'border-indigo-600 scale-110 shadow-md' : 'border-white hover:scale-105'}`}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                        <button onClick={() => setShowPalettes(!showPalettes)} className={`p-1.5 rounded-lg transition-all ${showPalettes ? 'bg-indigo-600 text-white' : 'text-slate-400 bg-slate-50 hover:bg-slate-100'}`}><PaletteIcon size={16} /></button>
                    </div>
                    <div className="w-px h-6 bg-slate-200 shrink-0" />
                    <div className="flex bg-slate-50 rounded-xl p-1 shrink-0 gap-0.5">
                        <button onClick={() => setTool('brush')} className={toolButtonClass('brush')}><Pencil size={16} /></button>
                        <button onClick={() => setTool('fill')} className={toolButtonClass('fill')}><PaintBucket size={16} /></button>
                        <button onClick={() => setTool('rectangle')} className={toolButtonClass('rectangle')}><Square size={16} /></button>
                        <button onClick={() => setTool('circle')} className={toolButtonClass('circle')}><CircleIcon size={16} /></button>
                        <button onClick={() => setTool('polygon')} className={toolButtonClass('polygon')}><Hexagon size={16} /></button>
                        <button onClick={() => setTool('text')} className={toolButtonClass('text')}><LucideType size={16} /></button>
                    </div>
                    <div className="w-px h-6 bg-slate-200 shrink-0" />
                    <input type="color" value={color} onChange={e => {
                        const newColor = e.target.value;
                        setColor(newColor);
                        if (!swatches.includes(newColor)) {
                            const updated = [newColor, ...swatches.slice(0, 11)];
                            setSwatches(updated);
                        }
                    }} className="w-7 h-7 rounded-lg cursor-pointer border-2 border-white shadow-sm" />
                    <div className="ml-auto flex gap-1.5">
                        <button onClick={() => setShowGuides(!showGuides)} className={`p-2 rounded-xl transition-all ${showGuides ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'}`}><Grid size={18}/></button>
                        <button onClick={() => setShowGallery(true)} className="p-2 bg-slate-50 text-slate-500 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all"><FolderSearch size={18}/></button>
                        <button onClick={clearAll} className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-all"><Trash2 size={18}/></button>
                    </div>
                </div>
                <div className="flex gap-4 items-center">
                    <div className="flex items-center gap-2">
                        <input type="range" min="1" max="50" value={brushSize} onChange={e => setBrushSize(parseInt(e.target.value))} className="w-24 accent-indigo-500" />
                        <div className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-xl border border-slate-100 shrink-0 overflow-hidden relative">
                            <svg width="100%" height="100%" viewBox="0 0 40 40">
                                <g transform="translate(20, 20)">
                                    {tool === 'brush' ? (<circle r={Math.max(1, brushSize / 2.5)} fill={color} />) : 
                                     tool === 'text' ? (<LucideType size={20} className="text-indigo-600" />) :
                                     tool === 'rectangle' ? (<rect x="-10" y="-10" width="20" height="20" fill="none" stroke={color} strokeWidth="2" />) :
                                     tool === 'circle' ? (<circle r="10" fill="none" stroke={color} strokeWidth="2" />) :
                                     (<path d={(() => {const points = []; const radius = Math.max(2, brushSize / 2.5); for (let i = 0; i < polySides; i++) { const angle = (Math.PI * 2 / polySides) * i - Math.PI / 2; points.push(`${radius * Math.cos(angle)},${radius * Math.sin(angle)}`); } return `M ${points.join(' L ')} Z`;})()} fill="none" stroke={color} strokeWidth="1.5" />)}
                                </g>
                            </svg>
                        </div>
                    </div>
                    {tool === 'polygon' && (
                        <select value={polySides} onChange={e => setPolySides(parseInt(e.target.value))} className="text-[10px] font-black uppercase p-1.5 bg-slate-50 rounded-lg outline-none border border-slate-200">
                            {[3, 4, 5, 6, 7, 8, 12].map(n => <option key={n} value={n}>{n} S</option>)}
                        </select>
                    )}
                    <div className="flex gap-1"><button onClick={undo} disabled={(history[activeLayerId]?.length || 0) <= 1} className="p-2 text-slate-400 hover:text-indigo-600 disabled:opacity-20"><Undo size={18}/></button></div>
                    <button onClick={() => { setShowLayers(!showLayers); if(showLayers) { setShowGuides(false); setShowPalettes(false); } }} className={`ml-auto px-3 py-1.5 rounded-xl border-2 transition-all flex items-center gap-2 ${showLayers ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 text-slate-400 border-transparent'}`}><Layers size={14} /><span className="text-[10px] font-black uppercase tracking-widest">{layers.find(l=>l.id===activeLayerId)?.name}</span></button>
                </div>
            </div>
            
            <div id="canvas-container" className="flex-1 relative bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-slate-200">
                {/* --- Guides Layer --- */}
                <div className="absolute inset-0 pointer-events-none z-0">
                    {guideSettings.grid && (
                        <div 
                            className="absolute inset-0 opacity-10" 
                            style={{ 
                                backgroundImage: `linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)`,
                                backgroundSize: `${guideSettings.gridSize}px ${guideSettings.gridSize}px`
                            }} 
                        />
                    )}
                    {guideSettings.perspective && (
                        <svg className="absolute inset-0 w-full h-full opacity-10" stroke="black" strokeWidth="1">
                            <line x1="0" y1="0" x2="100%" y2="100%" />
                            <line x1="100%" y1="0" x2="0" y2="100%" />
                            <line x1="50%" y1="0" x2="50%" y2="100%" />
                            <line x1="0" y1="50%" x2="100%" y2="50%" />
                            <circle cx="50%" cy="50%" r="2" fill="black" />
                            {/* Radial lines */}
                            {[30, 60, 120, 150, 210, 240, 300, 330].map(deg => {
                                const angle = (deg * Math.PI) / 180;
                                const x2 = 50 + 100 * Math.cos(angle);
                                const y2 = 50 + 100 * Math.sin(angle);
                                return <line key={deg} x1="50%" y1="50%" x2={`${x2}%`} y2={`${y2}%`} />;
                            })}
                        </svg>
                    )}
                </div>

                {layers.map((l, index) => (
                    <div 
                        key={l.id} 
                        className="absolute inset-0 pointer-events-none" 
                        style={{ 
                            mixBlendMode: l.blendMode as any, 
                            opacity: l.opacity, 
                            visibility: l.visible ? 'visible' : 'hidden', 
                            zIndex: index + 1
                        }} 
                        ref={(el) => { 
                            if (el && layerCanvasesRef.current[l.id]) { 
                                if (el.firstChild !== layerCanvasesRef.current[l.id]) {
                                    el.innerHTML = '';
                                    el.appendChild(layerCanvasesRef.current[l.id]); 
                                }
                            } 
                        }} 
                    />
                ))}
                <div className="absolute inset-0 z-[999] touch-none cursor-crosshair" onMouseDown={handleCanvasAction} onMouseUp={stopDrawing} onMouseMove={draw} onTouchStart={handleCanvasAction} onTouchEnd={stopDrawing} onTouchMove={draw} />
            </div>

            {/* --- Palettes Manager Popover --- */}
            {showPalettes && (
                <div className="absolute top-[100px] left-3 bottom-3 w-64 bg-white/95 backdrop-blur-md shadow-2xl z-[1001] rounded-[2rem] flex flex-col border border-slate-200 animate-in slide-in-from-left duration-300 overflow-hidden">
                    <div className="p-5 border-b flex justify-between items-center bg-white/50">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">{lang.palette_manager}</h3>
                        <button onClick={() => setShowPalettes(false)} className="text-slate-400 hover:text-slate-600"><X size={16}/></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar">
                        <div className="space-y-3">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{lang.save_palette}</h4>
                            <button 
                                onClick={handleSavePalette}
                                className="w-full py-3 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-all"
                            >
                                <PlusSquare size={14} /> {lang.save_palette}
                            </button>
                        </div>

                        <div className="space-y-3">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{lang.palettes_lib}</h4>
                            {paletteLib.length === 0 ? <p className="text-[9px] text-slate-400 italic">No saved palettes.</p> : (
                                <div className="space-y-2">
                                    {paletteLib.map(p => (
                                        <div key={p.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 group">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-[10px] font-black text-slate-700 uppercase truncate pr-2">{p.name}</span>
                                                <button onClick={() => {
                                                    const updated = paletteLib.filter(item => item.id !== p.id);
                                                    setPaletteLib(updated);
                                                    localStorage.setItem("lumina_palettes", JSON.stringify(updated));
                                                    playSound('trash');
                                                }} className="text-slate-300 hover:text-rose-500"><Trash2 size={12}/></button>
                                            </div>
                                            <div className="flex flex-wrap gap-1 mb-2">
                                                {p.colors.map((c, i) => <div key={i} className="w-3 h-3 rounded-sm" style={{ backgroundColor: c }} />)}
                                            </div>
                                            <button 
                                                onClick={() => { setSwatches(p.colors); playSound('success'); }}
                                                className="w-full py-1.5 bg-white border border-slate-200 rounded-lg text-[8px] font-black uppercase text-indigo-600 hover:bg-indigo-50 transition-all"
                                            >
                                                Apply to Swatches
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="p-4 border-t bg-slate-50 grid grid-cols-2 gap-2">
                        <button onClick={handleExportLibrary} className="flex flex-col items-center gap-1 p-2 bg-white rounded-xl border border-slate-200 text-slate-500 hover:text-indigo-600 transition-all">
                            <FileJson size={14} />
                            <span className="text-[8px] font-black uppercase">{lang.export_json}</span>
                        </button>
                        <label className="flex flex-col items-center gap-1 p-2 bg-white rounded-xl border border-slate-200 text-slate-500 hover:text-indigo-600 cursor-pointer transition-all">
                            <Download size={14} />
                            <span className="text-[8px] font-black uppercase">{lang.import_json}</span>
                            <input type="file" accept=".json" onChange={handleImportLibrary} className="hidden" />
                        </label>
                    </div>
                </div>
            )}

            {/* --- Guides Popover --- */}
            {showGuides && (
                <div className="absolute top-[100px] right-3 w-64 bg-white/95 backdrop-blur-md shadow-2xl z-[1002] rounded-[2rem] p-6 border border-slate-200 animate-in zoom-in-95 duration-200">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">{lang.guides}</h3>
                        <button onClick={() => setShowGuides(false)} className="text-slate-400 hover:text-slate-600"><X size={16}/></button>
                    </div>
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-slate-600">Grid</span>
                            <button 
                                onClick={() => setGuideSettings(prev => ({...prev, grid: !prev.grid}))}
                                className={`w-10 h-5 rounded-full relative transition-all ${guideSettings.grid ? 'bg-indigo-600' : 'bg-slate-200'}`}
                            >
                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${guideSettings.grid ? 'left-6' : 'left-1'}`} />
                            </button>
                        </div>
                        {guideSettings.grid && (
                            <div className="space-y-2 pl-2 border-l-2 border-slate-100">
                                <div className="flex justify-between items-center px-1">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{lang.grid_size}</label>
                                    <span className="text-[9px] font-black text-indigo-500">{guideSettings.gridSize}px</span>
                                </div>
                                <input 
                                    type="range" min="20" max="200" step="5" 
                                    value={guideSettings.gridSize} 
                                    onChange={(e) => setGuideSettings(prev => ({...prev, gridSize: parseInt(e.target.value)}))} 
                                    className="w-full h-1 bg-slate-200 rounded-lg accent-indigo-600" 
                                />
                            </div>
                        )}
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-slate-600">{lang.perspective}</span>
                            <button 
                                onClick={() => setGuideSettings(prev => ({...prev, perspective: !prev.perspective}))}
                                className={`w-10 h-5 rounded-full relative transition-all ${guideSettings.perspective ? 'bg-indigo-600' : 'bg-slate-200'}`}
                            >
                                <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${guideSettings.perspective ? 'left-6' : 'left-1'}`} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showGallery && (
                <div className="absolute inset-0 bg-white/95 backdrop-blur-xl z-[2000] p-6 flex flex-col animate-in fade-in duration-300">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">{lang.load_project}</h2>
                        <button onClick={() => setShowGallery(false)} className="p-3 bg-slate-100 rounded-full text-slate-500 hover:bg-slate-200"><X size={24}/></button>
                    </div>
                    {gallery.length === 0 ? (<div className="flex-1 flex flex-col items-center justify-center opacity-30"><FolderSearch size={80} className="mb-4" /><p className="font-bold">No saved projects yet</p></div>) : (
                        <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-4 pb-20 no-scrollbar">
                            {gallery.map(p => (<button key={p.id} onClick={() => loadProject(p)} className="group bg-white p-3 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all text-left"><img src={p.thumbnail} className="w-full aspect-square object-cover rounded-2xl mb-3 bg-slate-50 shadow-inner" /><p className="text-[10px] font-black text-slate-800 uppercase tracking-tight truncate">{p.name}</p><p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{p.date}</p></button>))}
                        </div>
                    )}
                </div>
            )}

            {showLayers && (
                <div className="absolute top-[100px] right-3 bottom-3 w-64 bg-white/95 backdrop-blur-md shadow-2xl z-[1001] rounded-[2rem] flex flex-col border border-slate-200 animate-in slide-in-from-right duration-300 overflow-hidden">
                    <div className="p-5 border-b flex justify-between items-center bg-white/50"><h3 className="text-xs font-black uppercase tracking-widest text-slate-800">{lang.layers}</h3><button onClick={() => { const id = `layer-${Date.now()}`; const newLayer = { id, name: `Layer ${layers.length + 1}`, visible: true, opacity: 1, blendMode: "normal" }; setLayers([...layers, newLayer]); setActiveLayerId(id); playSound('click'); }} className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-100"><Plus size={16} /></button></div>
                    <div className="flex-1 overflow-y-auto p-3 space-y-2 no-scrollbar">
                        {[...layers].reverse().map(l => (
                            <div key={l.id} className={`p-4 rounded-2xl border-2 transition-all relative ${activeLayerId === l.id ? 'border-indigo-600 bg-indigo-50/50 shadow-sm' : 'border-transparent bg-white hover:bg-slate-50'}`}>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                                        {l.thumbnail && <img src={l.thumbnail} className="w-full h-full object-cover" />}
                                    </div>
                                    <input value={l.name} onChange={(e) => updateLayerProperty(l.id, 'name', e.target.value)} onClick={() => setActiveLayerId(l.id)} className="flex-1 bg-transparent text-[10px] font-black text-slate-700 outline-none cursor-pointer uppercase tracking-tighter" />
                                    <div className="flex flex-col gap-1">
                                        <button onClick={() => moveLayer(l.id, 'up')} className="text-slate-300 hover:text-indigo-600"><ChevronUp size={14}/></button>
                                        <button onClick={() => moveLayer(l.id, 'down')} className="text-slate-300 hover:text-indigo-600"><ChevronDown size={14}/></button>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                    <button onClick={() => updateLayerProperty(l.id, 'visible', !l.visible)} className={`transition-colors ${l.visible ? 'text-indigo-600' : 'text-slate-300'}`}>{l.visible ? <Eye size={18} /> : <EyeOff size={18} />}</button>
                                    {layers.length > 1 && (<button onClick={() => { const newLayers = layers.filter(item => item.id !== l.id); setLayers(newLayers); if (activeLayerId === l.id) setActiveLayerId(newLayers[newLayers.length - 1].id); delete layerCanvasesRef.current[l.id]; playSound('trash'); }} className="text-slate-300 hover:text-red-500 p-1 ml-auto"><Trash2 size={14} /></button>)}
                                </div>
                                {activeLayerId === l.id && (<div className="space-y-4 pt-3 border-t border-indigo-100 animate-in fade-in duration-200"><div className="space-y-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Mode</label><select value={l.blendMode} onChange={(e) => updateLayerProperty(l.id, 'blendMode', e.target.value)} className="w-full text-[10px] p-2 bg-white border border-slate-200 rounded-xl outline-none font-bold text-slate-600">{blendModes.map(m => <option key={m} value={m}>{m}</option>)}</select></div><div className="space-y-1"><div className="flex justify-between items-center px-1"><label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Opacity</label><span className="text-[9px] font-black text-indigo-500">{Math.round(l.opacity * 100)}%</span></div><input type="range" min="0" max="1" step="0.01" value={l.opacity} onChange={(e) => updateLayerProperty(l.id, 'opacity', parseFloat(e.target.value))} className="w-full h-1 bg-slate-200 rounded-lg accent-indigo-600" /></div></div>)}
                            </div>
                        ))}
                    </div>
                    <button onClick={() => setShowLayers(false)} className="m-4 py-3 bg-slate-100 text-slate-500 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-200 transition-colors">Close Layers</button>
                </div>
            )}
        </div>
    );
};

// --- Missing Tools Components ---
const SoundMixer = ({ lang, soundState, onUpdateSound }: any) => {
  const sounds = [{ id: 'rain', icon: CloudRain, label: lang.rain }, { id: 'ocean', icon: Waves, label: lang.ocean }, { id: 'fire', icon: Flame, label: lang.fire }, { id: 'white_noise', icon: Wind, label: lang.white_noise }];
  const toggle = (id: string) => { const isActive = !soundState.active[id]; const newActive = { ...soundState.active, [id]: isActive }; onUpdateSound({ ...soundState, active: newActive }); toggleAmbient(id, isActive, soundState.volumes[id]); };
  const handleVolume = (id: string, vol: number) => { const newVolumes = { ...soundState.volumes, [id]: vol }; onUpdateSound({ ...soundState, volumes: newVolumes }); updateAmbientVolume(id, vol); };
  return (<div className="h-full overflow-y-auto p-6 space-y-6 no-scrollbar">{sounds.map(s => (<div key={s.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-4"><div className="flex items-center justify-between"><div className="flex items-center gap-4"><div className={`p-3 rounded-2xl transition-all ${soundState.active[s.id] ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400'}`}><s.icon size={24} /></div><div><h4 className="font-bold text-slate-800">{s.label}</h4><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ambient Sound</p></div></div><button onClick={() => toggle(s.id)} className={`w-12 h-6 rounded-full transition-all relative ${soundState.active[s.id] ? 'bg-indigo-600' : 'bg-slate-200'}`}><div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${soundState.active[s.id] ? 'left-7' : 'left-1'}`} /></button></div>{soundState.active[s.id] && (<div className="flex items-center gap-4 animate-in slide-in-from-top-2"><Volume1 size={16} className="text-slate-400" /><input type="range" min="0" max="1" step="0.01" value={soundState.volumes[s.id]} onChange={(e) => handleVolume(s.id, parseFloat(e.target.value))} className="flex-1 h-1.5 bg-slate-100 rounded-lg accent-indigo-600" /><Volume2 size={16} className="text-slate-400" /></div>)}</div>))}</div>);
};

const BreathingExercise = () => {
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');
  const [progress, setProgress] = useState(0);
  useEffect(() => { const interval = setInterval(() => { setProgress(p => { if (p >= 100) { setPhase(current => { if (current === 'Inhale') return 'Hold'; if (current === 'Hold') return 'Exhale'; return 'Inhale'; }); return 0; } return p + 1; }); }, 40); return () => clearInterval(interval); }, []);
  const size = phase === 'Inhale' ? 100 + progress : (phase === 'Hold' ? 200 : 200 - progress);
  return (<div className="h-full flex flex-col items-center justify-center bg-indigo-50 p-8"><div className="rounded-full bg-indigo-600/20 flex items-center justify-center transition-all duration-75" style={{ width: `${size * 1.5}px`, height: `${size * 1.5}px` }}><div className="rounded-full bg-indigo-600 flex items-center justify-center shadow-2xl transition-all duration-75" style={{ width: `${size}px`, height: `${size}px` }}><span className="text-white font-black uppercase tracking-widest text-xs">{phase}</span></div></div><p className="mt-16 text-indigo-900 font-bold opacity-50 uppercase tracking-[0.3em] text-[10px]">Follow the rhythm</p></div>);
};

const FocusTimer = ({ lang }: any) => {
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  useEffect(() => { let interval: any = null; if (isActive && seconds > 0) { interval = setInterval(() => setSeconds(s => s - 1), 1000); } else if (seconds === 0) { setIsActive(false); playSound('success'); } return () => clearInterval(interval); }, [isActive, seconds]);
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;
  return (<div className="h-full flex flex-col items-center justify-center bg-slate-50 p-6"><div className="text-8xl font-black text-slate-800 tabular-nums tracking-tighter mb-12">{formatTime(seconds)}</div><div className="flex gap-4"><button onClick={() => { setIsActive(!isActive); playSound('click'); }} className={`px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg transition-all active:scale-95 ${isActive ? 'bg-rose-100 text-rose-600' : 'bg-indigo-600 text-white'}`}>{isActive ? lang.pause : lang.start}</button><button onClick={() => { setIsActive(false); setSeconds(25 * 60); playSound('click'); }} className="px-8 py-4 bg-white text-slate-400 rounded-2xl font-black uppercase tracking-widest text-xs border border-slate-100 shadow-sm active:scale-95">{lang.reset}</button></div></div>);
};

const WheelGame = ({ lang }: any) => {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const options = ["Go for a walk", "Deep breathing", "Draw a picture", "Call a friend", "Write gratitude", "Meditate", "Stretch"];
  const spin = () => { if (spinning) return; setSpinning(true); setResult(null); playSound('click'); setTimeout(() => { const win = options[Math.floor(Math.random() * options.length)]; setResult(win); setSpinning(false); playSound('success'); }, 2000); };
  return (<div className="h-full flex flex-col items-center justify-center bg-slate-50 p-6"><div className={`w-64 h-64 rounded-full border-8 border-indigo-600 flex items-center justify-center relative shadow-2xl transition-all duration-[2000ms] ease-out ${spinning ? 'rotate-[1080deg]' : 'rotate-0'}`}><div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-4 w-4 h-8 bg-rose-500 rounded-full z-10 shadow-md" /><div className="text-indigo-600 font-black text-center p-4">{spinning ? '???' : (result || 'SPIN')}</div></div><button onClick={spin} disabled={spinning} className="mt-16 w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100 disabled:opacity-50">{lang.spin_btn}</button></div>);
};

const MandalaCreator = ({ lang }: any) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#6366f1");
  const [brushSize, setBrushSize] = useState(2);
  const [slices, setSlices] = useState(8);
  const prevPos = useRef<{x: number, y: number} | null>(null);
  useEffect(() => { const canvas = canvasRef.current; if (canvas) { const container = canvas.parentElement; if (container) { canvas.width = container.offsetWidth; canvas.height = container.offsetHeight; } const ctx = canvas.getContext('2d'); if (ctx) { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, canvas.width, canvas.height); } } }, []);
  const handleMove = (e: any) => { if (!isDrawing) return; const canvas = canvasRef.current; const ctx = canvas?.getContext('2d'); if (!canvas || !ctx) return; const rect = canvas.getBoundingClientRect(); const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left; const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top; if (!prevPos.current) { prevPos.current = {x, y}; return; } const centerX = canvas.width / 2; const centerY = canvas.height / 2; ctx.save(); ctx.translate(centerX, centerY); ctx.strokeStyle = color; ctx.lineWidth = brushSize; ctx.lineCap = 'round'; const pX = prevPos.current.x - centerX; const pY = prevPos.current.y - centerY; const cX = x - centerX; const cY = y - centerY; for (let i = 0; i < slices; i++) { ctx.rotate((Math.PI * 2) / slices); ctx.beginPath(); ctx.moveTo(pX, pY); ctx.lineTo(cX, cY); ctx.stroke(); ctx.scale(1, -1); ctx.beginPath(); ctx.moveTo(pX, pY); ctx.lineTo(cX, cY); ctx.stroke(); ctx.scale(1, -1); } ctx.restore(); prevPos.current = {x, y}; };
  return (<div className="h-full flex flex-col bg-slate-50"><div className="p-4 bg-white border-b flex items-center gap-4"><input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-8 h-8 rounded border-none" /><input type="range" min="1" max="10" value={brushSize} onChange={e => setBrushSize(parseInt(e.target.value))} className="w-24 accent-indigo-500" /><select value={slices} onChange={e => setSlices(parseInt(e.target.value))} className="text-[10px] font-black uppercase p-2 bg-slate-100 rounded-lg outline-none">{[4, 6, 8, 12, 16, 24].map(n => <option key={n} value={n}>{n} Slices</option>)}</select><button onClick={() => { const ctx = canvasRef.current?.getContext('2d'); if (ctx) { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height); playSound('trash'); } }} className="p-2 text-slate-400 hover:text-red-500 transition-colors ml-auto"><Trash2 size={20} /></button></div><div className="flex-1 relative overflow-hidden bg-slate-100"><canvas ref={canvasRef} onMouseDown={() => setIsDrawing(true)} onMouseUp={() => { setIsDrawing(false); prevPos.current = null; }} onMouseMove={handleMove} onTouchStart={() => setIsDrawing(true)} onTouchEnd={() => { setIsDrawing(false); prevPos.current = null; }} onTouchMove={handleMove} className="w-full h-full cursor-crosshair touch-none shadow-inner" /></div></div>);
};

const GratefulTree = ({ lang }: any) => {
    const [input, setInput] = useState("");
    const [leaves, setLeaves] = useState<any[]>([]);
    useEffect(() => { const stored = localStorage.getItem("lumina_grateful_tree"); if (stored) setLeaves(JSON.parse(stored)); }, []);
    const addLeaf = () => { if (!input.trim()) return; const newLeaf = { id: Date.now(), text: input.trim(), x: 15 + Math.random() * 70, y: 10 + Math.random() * 50, rotation: (Math.random() - 0.5) * 45, color: ["#4ade80", "#22c55e", "#16a34a", "#fbbf24", "#f59e0b"][Math.floor(Math.random() * 5)] }; const updated = [...leaves, newLeaf]; setLeaves(updated); localStorage.setItem("lumina_grateful_tree", JSON.stringify(updated)); setInput(""); playSound('success'); };
    return (<div className="h-full flex flex-col bg-sky-50 overflow-hidden relative p-6"><div className="absolute inset-0 flex items-end justify-center pointer-events-none opacity-10"><Trees size={600} className="text-emerald-900 mb-[-100px]" /></div><div className="relative z-10 flex-1 flex flex-col items-center"><div className="w-full max-w-xs bg-white/90 backdrop-blur p-2 rounded-3xl shadow-xl mb-8 flex gap-2 border border-white"><input value={input} onChange={e => setInput(e.target.value)} placeholder={lang.gratitude_hint} className="flex-1 px-4 py-2 bg-transparent outline-none text-sm font-medium text-slate-700" onKeyDown={e => e.key === 'Enter' && addLeaf()} /><button onClick={addLeaf} className="p-3 bg-emerald-600 text-white rounded-2xl shadow-lg active:scale-90 transition-all"><Plus size={20} /></button></div><div className="w-full flex-1 relative">{leaves.map(l => (<div key={l.id} style={{ left: `${l.x}%`, top: `${l.y}%`, transform: `rotate(${l.rotation}deg)`, backgroundColor: l.color }} className="absolute px-4 py-1.5 rounded-full text-[10px] font-black text-white shadow-md animate-in zoom-in duration-500 whitespace-nowrap border border-white/30 uppercase tracking-widest">{l.text}</div>))}</div></div><button onClick={() => { if(confirm('Clear your tree?')) { setLeaves([]); localStorage.removeItem("lumina_grateful_tree"); playSound('trash'); } }} className="absolute bottom-6 right-6 p-4 bg-white/80 backdrop-blur text-slate-400 rounded-full hover:bg-white hover:text-red-500 transition-all shadow-lg active:scale-90"><RotateCcw size={20} /></button></div>);
};

const WhackAThought = ({ lang, user }: any) => {
  const [thoughts, setThoughts] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  useEffect(() => { const interval = setInterval(() => { if (thoughts.length < 5) { setThoughts(prev => [...prev, { id: Date.now(), x: Math.random() * 80 + 10, y: Math.random() * 80 + 10, text: user.mood.includes("Sad") ? "Gloom" : "Stress" }]); } }, 1200); return () => clearInterval(interval); }, [thoughts, user.mood]);
  const whack = (id: number) => { setThoughts(prev => prev.filter(t => t.id !== id)); setScore(s => s + 1); playSound('pop'); };
  return (<div className="h-full bg-rose-50 relative p-4 overflow-hidden"><div className="flex justify-between items-center mb-4 relative z-10"><div className="px-4 py-2 bg-white/80 rounded-full font-bold text-rose-900 shadow-sm">{lang.score}: {score}</div></div><div className="relative w-full h-[80%]">{thoughts.map(t => (<button key={t.id} onClick={() => whack(t.id)} style={{ left: `${t.x}%`, top: `${t.y}%` }} className="absolute p-4 bg-white border-2 border-rose-200 rounded-2xl shadow-lg hover:scale-110 active:scale-90 transition-all text-xs font-black text-rose-500 animate-in zoom-in duration-300">{t.text}</button>))}</div></div>);
};

const ZenSand = ({ lang }: any) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  useEffect(() => { const canvas = canvasRef.current; if (canvas) { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; const ctx = canvas.getContext('2d'); if (ctx) { ctx.fillStyle = '#fef3c7'; ctx.fillRect(0, 0, canvas.width, canvas.height); } } }, []);
  const draw = (e: any) => { if (!isDrawing) return; const canvas = canvasRef.current; const ctx = canvas?.getContext('2d'); if (!canvas || !ctx) return; const rect = canvas.getBoundingClientRect(); const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left; const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top; ctx.strokeStyle = '#d97706'; ctx.lineWidth = 20; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.globalAlpha = 0.1; ctx.lineTo(x, y); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, y); };
  return (<div className="h-full bg-amber-50"><canvas ref={canvasRef} onMouseDown={() => setIsDrawing(true)} onMouseUp={() => {setIsDrawing(false); if(canvasRef.current) canvasRef.current.getContext('2d')?.beginPath();}} onTouchMove={draw} className="w-full h-full cursor-crosshair touch-none" /></div>);
};

const ColorMatch = ({ lang }: any) => {
  const [target, setTarget] = useState("");
  const [options, setOptions] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4"];
  const next = () => { const t = colors[Math.floor(Math.random() * colors.length)]; setTarget(t); setOptions([...colors].sort(() => Math.random() - 0.5).slice(0, 6)); };
  useEffect(() => { next(); }, []);
  const check = (c: string) => { if (c === target) { setScore(s => s + 1); playSound('success'); next(); } else { playSound('fail'); } };
  return (<div className="h-full flex flex-col items-center justify-center bg-slate-50 p-6"><div style={{ backgroundColor: target }} className="w-40 h-40 rounded-[3rem] shadow-2xl mb-16 border-8 border-white animate-in zoom-in duration-500" /><div className="grid grid-cols-3 gap-5">{options.map((c, i) => (<button key={i} onClick={() => check(c)} style={{ backgroundColor: c }} className="w-20 h-20 rounded-[1.5rem] shadow-md hover:scale-105 active:scale-90 transition-all border-4 border-white" />))}</div><div className="mt-16 font-black text-slate-800 text-xl tracking-tight">{lang.score}: {score}</div></div>);
};

// --- New Game Components ---

const SnakeGame = ({ lang }: any) => {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [dir, setDir] = useState({ x: 0, y: -1 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (gameOver) return;
    const move = setInterval(() => {
      setSnake(prev => {
        const head = { x: prev[0].x + dir.x, y: prev[0].y + dir.y };
        if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 || prev.some(s => s.x === head.x && s.y === head.y)) {
          setGameOver(true);
          playSound('fail');
          return prev;
        }
        const newSnake = [head, ...prev];
        if (head.x === food.x && head.y === food.y) {
          setScore(s => s + 1);
          setFood({ x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 20) });
          playSound('pop');
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 200);
    return () => clearInterval(move);
  }, [dir, food, gameOver]);

  return (
    <div className="h-full flex flex-col items-center justify-center bg-slate-900 p-4">
      <div className="mb-4 flex justify-between w-full max-w-[300px] text-white font-black uppercase tracking-widest text-xs">
        <span>{lang.score}: {score}</span>
        {gameOver && <span className="text-rose-500 animate-pulse">{lang.game_over}</span>}
      </div>
      <div className="relative w-[300px] h-[300px] bg-slate-800 rounded-xl overflow-hidden border-4 border-slate-700">
        {snake.map((s, i) => (
          <div key={i} className="absolute bg-emerald-500 rounded-sm" style={{ width: '15px', height: '15px', left: `${s.x * 15}px`, top: `${s.y * 15}px` }} />
        ))}
        <div className="absolute bg-rose-500 rounded-full animate-pulse" style={{ width: '15px', height: '15px', left: `${food.x * 15}px`, top: `${food.y * 15}px` }} />
      </div>
      <div className="mt-8 grid grid-cols-3 gap-2">
        <div />
        <button onClick={() => setDir({ x: 0, y: -1 })} className="p-4 bg-slate-700 text-white rounded-xl active:bg-indigo-600"><ChevronUp /></button>
        <div />
        <button onClick={() => setDir({ x: -1, y: 0 })} className="p-4 bg-slate-700 text-white rounded-xl active:bg-indigo-600"><ChevronLeft /></button>
        <button onClick={() => { setGameOver(false); setSnake([{ x: 10, y: 10 }]); setScore(0); setDir({ x: 0, y: -1 }); playSound('click'); }} className="p-4 bg-indigo-600 text-white rounded-xl"><RotateCcw /></button>
        <button onClick={() => setDir({ x: 1, y: 0 })} className="p-4 bg-slate-700 text-white rounded-xl active:bg-indigo-600"><ChevronRight /></button>
        <div />
        <button onClick={() => setDir({ x: 0, y: 1 })} className="p-4 bg-slate-700 text-white rounded-xl active:bg-indigo-600"><ChevronDown /></button>
        <div />
      </div>
    </div>
  );
};

const ComedyCorner = ({ user }: any) => {
  const [joke, setJoke] = useState("");
  const [loading, setLoading] = useState(false);
  const lang = TRANSLATIONS[user.language || 'en'];

  const fetchJoke = async () => {
    setLoading(true);
    try {
      const r = await ai.models.generateContent({
        model: AI_MODEL,
        contents: `Tell me a short, lighthearted joke or pun in ${user.language} for someone feeling ${user.mood}.`
      });
      setJoke(r.text || "");
    } catch (e) {
      setJoke("Why don't scientists trust atoms? Because they make up everything!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJoke(); }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center p-8 bg-amber-50 text-center">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-amber-100 max-w-sm">
        <Laugh size={48} className="text-amber-500 mx-auto mb-8 opacity-50" />
        {loading ? <Loader2 className="animate-spin text-amber-600 mx-auto" /> : (
          <div className="fade-in">
            <p className="text-xl font-bold text-slate-800 leading-relaxed italic mb-10">"{joke}"</p>
            <button onClick={() => { fetchJoke(); playSound('click'); }} className="w-full py-4 bg-amber-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg active:scale-95 transition-all">Another One</button>
          </div>
        )}
      </div>
    </div>
  );
};

const MemoryGame = ({ lang }: any) => {
  const icons = [Heart, Star, CloudRain, Sun, Zap, Moon, Trees, Bird];
  const [cards, setCards] = useState<any[]>([]);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [solved, setSolved] = useState<number[]>([]);

  const init = () => {
    const deck = [...icons, ...icons].sort(() => Math.random() - 0.5).map((Icon, i) => ({ id: i, Icon }));
    setCards(deck);
    setFlipped([]);
    setSolved([]);
  };

  useEffect(() => { init(); }, []);

  const flip = (id: number) => {
    if (flipped.length === 2 || flipped.includes(id) || solved.includes(id)) return;
    const newFlipped = [...flipped, id];
    setFlipped(newFlipped);
    if (newFlipped.length === 2) {
      if (cards[newFlipped[0]].Icon === cards[newFlipped[1]].Icon) {
        setSolved(prev => [...prev, ...newFlipped]);
        setFlipped([]);
        playSound('success');
      } else {
        setTimeout(() => setFlipped([]), 1000);
      }
    }
    playSound('click');
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-purple-50 p-6">
      <div className="grid grid-cols-4 gap-3">
        {cards.map(c => (
          <button 
            key={c.id} 
            onClick={() => flip(c.id)} 
            className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 transform shadow-sm ${flipped.includes(c.id) || solved.includes(c.id) ? 'bg-white' : 'bg-purple-200'}`}
          >
            {(flipped.includes(c.id) || solved.includes(c.id)) && <c.Icon className="text-purple-600 animate-in zoom-in duration-200" size={24} />}
          </button>
        ))}
      </div>
      {solved.length === cards.length && cards.length > 0 && (
        <button onClick={() => { init(); playSound('success'); }} className="mt-12 py-4 px-8 bg-purple-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 animate-in slide-in-from-bottom-4">Play Again</button>
      )}
    </div>
  );
};

const BubblePopGame = ({ lang }: any) => {
  const [bubbles, setBubbles] = useState<any[]>([]);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setBubbles(prev => [...prev, { id: Date.now(), x: Math.random() * 80 + 10, size: 40 + Math.random() * 40, speed: 1 + Math.random() * 2, y: 110 }]);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const move = setInterval(() => {
      setBubbles(prev => prev.map(b => ({ ...b, y: b.y - b.speed })).filter(b => b.y > -20));
    }, 16);
    return () => clearInterval(move);
  }, []);

  const pop = (id: number) => {
    setBubbles(prev => prev.filter(b => b.id !== id));
    setScore(s => s + 1);
    playSound('pop');
  };

  return (
    <div className="h-full bg-blue-50 relative overflow-hidden">
      <div className="absolute top-6 left-6 font-black text-blue-900 uppercase tracking-widest bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full z-10 shadow-sm border border-white/50">{lang.score}: {score}</div>
      {bubbles.map(b => (
        <button 
            key={b.id} 
            onClick={() => pop(b.id)} 
            className="absolute rounded-full bg-white/30 border-2 border-white/50 shadow-inner backdrop-blur-[1px] animate-in zoom-in duration-300 active:scale-125" 
            style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.size}px`, height: `${b.size}px` }} 
        />
      ))}
    </div>
  );
};

const TowerStackGame = ({ lang }: any) => {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [currentX, setCurrentX] = useState(0);
  const [dir, setDir] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (gameOver) return;
    const move = setInterval(() => {
      setCurrentX(x => {
        let next = x + dir * 2;
        if (next >= 80) setDir(-1);
        if (next <= 0) setDir(1);
        return next;
      });
    }, 30);
    return () => clearInterval(move);
  }, [dir, gameOver]);

  const place = () => {
    if (gameOver) return;
    const lastBlock = blocks[blocks.length - 1];
    if (lastBlock && Math.abs(currentX - lastBlock.x) > 15) {
      setGameOver(true);
      playSound('fail');
      return;
    }
    setBlocks([...blocks, { x: currentX, id: Date.now() }]);
    setScore(s => s + 1);
    playSound('pop');
  };

  return (
    <div className="h-full bg-cyan-50 flex flex-col-reverse p-6 overflow-hidden relative" onClick={place}>
      <div className="absolute top-6 left-6 font-black text-cyan-900 uppercase tracking-widest bg-white/50 backdrop-blur-sm px-4 py-2 rounded-full z-10 shadow-sm border border-white/50">{lang.score}: {score}</div>
      <div className="h-10 w-full bg-cyan-900/10 rounded-full mb-10" />
      <div className="flex-1 relative">
        {blocks.map((b, i) => (
          <div key={b.id} className="absolute h-8 bg-cyan-500 rounded-lg shadow-md border-b-4 border-cyan-600 animate-in slide-in-from-top-1 duration-200" style={{ bottom: `${i * 36}px`, left: `${b.x}%`, width: '20%' }} />
        ))}
        {!gameOver && (
          <div className="absolute h-8 bg-cyan-300 rounded-lg shadow-sm border-b-4 border-cyan-400 opacity-80" style={{ bottom: `${blocks.length * 36}px`, left: `${currentX}%`, width: '20%' }} />
        )}
      </div>
      {gameOver && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-20 animate-in fade-in">
          <h2 className="text-4xl font-black text-rose-500 mb-8 tracking-tighter">{lang.game_over}</h2>
          <button onClick={(e) => { e.stopPropagation(); setBlocks([]); setScore(0); setGameOver(false); playSound('click'); }} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95">Try Again</button>
        </div>
      )}
    </div>
  );
};

const PatternEchoGame = ({ lang }: any) => {
  const colors = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b"];
  const [seq, setSeq] = useState<number[]>([]);
  const [userSeq, setUserSeq] = useState<number[]>([]);
  const [playing, setPlaying] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  const start = () => {
    const next = Math.floor(Math.random() * 4);
    const newSeq = [...seq, next];
    setSeq(newSeq);
    playSeq(newSeq);
  };

  const playSeq = async (s: number[]) => {
    setPlaying(true);
    for (const id of s) {
      await new Promise(r => setTimeout(r, 400));
      setActive(id);
      playSound('pop');
      await new Promise(r => setTimeout(r, 400));
      setActive(null);
    }
    setPlaying(false);
    setUserSeq([]);
  };

  const click = (id: number) => {
    if (playing) return;
    const nextUser = [...userSeq, id];
    setUserSeq(nextUser);
    playSound('pop');
    setActive(id);
    setTimeout(() => setActive(null), 200);

    if (id !== seq[nextUser.length - 1]) {
      playSound('fail');
      alert("Game Over! Wrong sequence.");
      setSeq([]);
      setUserSeq([]);
      return;
    }
    if (nextUser.length === seq.length) {
      playSound('success');
      setTimeout(start, 1000);
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-fuchsia-50 p-6">
      <div className="grid grid-cols-2 gap-4">
        {colors.map((c, i) => (
          <button 
            key={i} 
            onClick={() => click(i)} 
            className={`w-32 h-32 rounded-[2rem] shadow-lg transition-all ${active === i ? 'scale-110 brightness-150 ring-8 ring-white' : 'hover:scale-105'}`} 
            style={{ backgroundColor: c }} 
          />
        ))}
      </div>
      <button 
        onClick={() => { start(); playSound('click'); }} 
        disabled={seq.length > 0} 
        className="mt-16 px-10 py-5 bg-fuchsia-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 disabled:opacity-30"
      >
        {seq.length > 0 ? `Level ${seq.length}` : 'Start Game'}
      </button>
    </div>
  );
};

const GuidedImagery = ({ user, lang }: any) => {
  const [scenario, setScenario] = useState("");
  const [loading, setLoading] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  const generate = async () => {
    setLoading(true);
    setQuotaExceeded(false);
    try {
      const r = await ai.models.generateContent({
        model: AI_MODEL,
        contents: `Write a short, immersive guided imagery paragraph describing a peaceful place for someone feeling ${user.mood} in ${user.language}. Use sensory details.`
      });
      setScenario(r.text || "");
    } catch (e) {
      if (handleAIError(e)) {
        setQuotaExceeded(true);
        setScenario("Imagine a soft meadow filled with gentle wildflowers. The sun warms your skin while a cool breeze carries the scent of fresh pine. You are safe, calm, and present.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { generate(); }, []);
  
  return (
    <div className="h-full p-8 bg-teal-50 flex flex-col items-center justify-center text-center">
      <div className="bg-white p-10 rounded-[3.5rem] shadow-2xl max-w-sm border border-teal-100">
        {quotaExceeded && (
          <div className="mb-4 p-3 bg-amber-50 rounded-2xl flex items-center gap-2">
            <AlertTriangle className="text-amber-500" size={14} />
            <span className="text-[10px] font-bold text-amber-900">{lang.quota_error}</span>
          </div>
        )}
        {loading ? <Loader2 className="animate-spin text-teal-600 mx-auto" /> : (
          <div className="fade-in">
            <Eye className="w-12 h-12 text-teal-500 mx-auto mb-8 opacity-50" />
            <p className="text-slate-700 leading-relaxed font-bold italic">{scenario}</p>
            <button onClick={generate} className="mt-10 p-4 bg-teal-600 text-white rounded-full active:scale-90 transition-transform"><RefreshCcw /></button>
          </div>
        )}
      </div>
    </div>
  );
};

const AffirmationWall = ({ user, lang }: any) => {
  const [aff, setAff] = useState("");
  const [loading, setLoading] = useState(false);
  const [quotaExceeded, setQuotaExceeded] = useState(false);

  const getAff = async () => {
    setLoading(true);
    setQuotaExceeded(false);
    try {
      const r = await ai.models.generateContent({
        model: AI_MODEL,
        contents: `Give me one powerful affirmation in ${user.language} for someone feeling ${user.mood}. JSON: {text}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: { type: Type.OBJECT, properties: { text: { type: Type.STRING } } }
        }
      });
      setAff(JSON.parse(r.text || "{}").text);
    } catch(e) {
      if (handleAIError(e)) {
        setQuotaExceeded(true);
        setAff("I am worthy of peace and capable of navigating any storm.");
      } else {
        setAff("I am resilient.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { getAff(); }, []);
  
  return (
    <div className="h-full bg-rose-50 p-10 flex flex-col items-center justify-center text-center">
      <div className="w-full max-w-sm bg-white p-12 rounded-[3.5rem] shadow-2xl border border-rose-100 relative">
        {quotaExceeded && (
          <div className="mb-6 p-3 bg-amber-50 rounded-2xl flex items-center justify-center gap-2">
            <AlertTriangle className="text-amber-500" size={14} />
            <span className="text-[10px] font-bold text-amber-900">API Busy - Showing Classics</span>
          </div>
        )}
        {loading ? <Loader2 className="animate-spin text-rose-500 mx-auto" /> : (
          <div className="fade-in">
            <Heart className="text-rose-400 w-16 h-16 mx-auto mb-10 opacity-50" />
            <h2 className="text-3xl font-black text-slate-800 leading-tight mb-12 tracking-tighter">"{aff}"</h2>
            <button onClick={getAff} className="w-full py-5 bg-rose-500 text-white rounded-[1.5rem] font-black shadow-xl uppercase tracking-widest text-sm active:scale-95 transition-transform">Get Affirmation</button>
          </div>
        )}
      </div>
    </div>
  );
};

const InstantReliefOverlay = ({ user, onClose, onNavigate }: any) => {
    const lang = TRANSLATIONS[user.language || 'en'];
    const [suggestion, setSuggestion] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [quotaExceeded, setQuotaExceeded] = useState(false);

    useEffect(() => { 
        const getSuggestion = async () => { 
            setLoading(true); 
            setQuotaExceeded(false);
            try { 
                const prompt = `Based on the mood "${user.mood}", suggest one quick 5-minute activity from this list: Breathing, Popping Bubbles, Sand Garden, Affirmations, Comedy. Return JSON: { "activity": "string", "gameType": "string", "description": "string" }`; 
                const response = await ai.models.generateContent({ model: AI_MODEL, contents: prompt, config: { responseMimeType: "application/json", responseSchema: { type: Type.OBJECT, properties: { activity: { type: Type.STRING }, gameType: { type: Type.STRING }, description: { type: Type.STRING } }, required: ["activity", "gameType", "description"] } } }); 
                setSuggestion(JSON.parse(response.text || "{}")); 
            } catch (e) { 
                if (handleAIError(e)) {
                  setQuotaExceeded(true);
                  setSuggestion({ activity: "Breathing", gameType: "BREATHING", description: "Take a deep breath. Focus on the air entering and leaving your body." });
                } else {
                  setSuggestion({ activity: "Breathing", gameType: "BREATHING", description: "Take a moment to breathe and center yourself." }); 
                }
            } finally { setLoading(false); } 
        }; 
        getSuggestion(); 
    }, [user.mood]);

    return (
        <div className="absolute inset-0 bg-indigo-900/90 backdrop-blur-xl z-[2000] p-8 flex flex-col justify-center items-center text-center animate-in fade-in zoom-in duration-300">
            <button onClick={onClose} className="absolute top-8 right-8 text-white/50 hover:text-white"><X size={32} /></button>
            <div className="max-w-xs">
                <div className="w-20 h-20 bg-indigo-500 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-2xl text-white">
                    <Sparkles size={40} className="animate-pulse" />
                </div>
                {loading ? (
                    <div className="space-y-4">
                        <p className="text-white font-black uppercase tracking-widest text-xs animate-pulse">{lang.loading_suggestion}</p>
                        <Loader2 className="animate-spin text-white/20 mx-auto" size={32} />
                    </div>
                ) : (
                    <div className="fade-in">
                        {quotaExceeded && <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest mb-4">{lang.quota_error}</p>}
                        <h2 className="text-3xl font-black text-white mb-4 tracking-tighter">{suggestion?.activity}</h2>
                        <p className="text-indigo-200 font-medium mb-10 leading-relaxed">{suggestion?.description}</p>
                        <button onClick={() => { onClose(); onNavigate("GAMES", suggestion?.gameType); playSound('success'); }} className="w-full py-5 bg-white text-indigo-900 rounded-3xl font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-indigo-50 transition-all active:scale-95">{lang.start_now}</button>
                    </div>
                )}
            </div>
        </div>
    );
};

const GamesHub = ({ onBack, user, activeGame, setActiveGame, soundState, onUpdateSound }: any) => {
    const [showInstructions, setShowInstructions] = useState(false);
    const lang = TRANSLATIONS[user.language || 'en'];
    const games: { id: GameType, icon: any, label: string, color: string }[] = [{ id: "BREATHING", icon: Wind, label: "Breathing", color: "bg-blue-50 text-blue-600" }, { id: "POP", icon: CircleDashed, label: "Popping", color: "bg-rose-50 text-rose-600" }, { id: "SAND", icon: WavesIcon, label: "Sand Garden", color: "bg-amber-50 text-amber-600" }, { id: "THOUGHTS", icon: BrainCircuit, label: "Thoughts", color: "bg-rose-50 text-rose-600" }, { id: "SNAKE", icon: Zap, label: "Snake", color: "bg-emerald-50 text-emerald-600" }, { id: "BREAKOUT", icon: Grid3x3, label: "Breakout", color: "bg-indigo-50 text-indigo-600" }, { id: "DODGE", icon: Rocket, label: "Dodge", color: "bg-slate-50 text-slate-600" }, { id: "MEMORY", icon: Brain, label: "Memory", color: "bg-purple-50 text-purple-600" }, { id: "STACK", icon: LayersIcon, label: "Stacker", color: "bg-cyan-50 text-cyan-600" }, { id: "ECHO", icon: Music2, label: "Echo", color: "bg-fuchsia-50 text-fuchsia-600" }, { id: "MATCH", icon: Pipette, label: "Match", color: "bg-orange-50 text-orange-600" }, { id: "COMEDY", icon: Laugh, label: "Comedy", color: "bg-amber-50 text-amber-600" }, { id: "SOUNDS", icon: Volume2, label: "Sounds", color: "bg-slate-50 text-slate-600" }, { id: "AFFIRMATIONS", icon: Heart, label: "Affirmations", color: "bg-rose-50 text-rose-600" }, { id: "IMAGERY", icon: Eye, label: "Guided Imagery", color: "bg-teal-50 text-teal-600" }, { id: "TIMER", icon: Timer, label: "Timer", color: "bg-slate-50 text-slate-600" }, { id: "WHEEL", icon: Shuffle, label: "Wheel", color: "bg-indigo-50 text-indigo-600" }];

    if (activeGame !== "NONE") {
        return (
            <div className="h-full flex flex-col bg-white">
                <Header title={games.find(g => g.id === activeGame)?.label || "Activity"} goBack={() => setActiveGame("NONE")} 
                    rightAction={<button onClick={() => setShowInstructions(true)} className="p-2 text-slate-400 hover:text-indigo-600"><HelpCircle size={20}/></button>} 
                />
                <div className="flex-1 overflow-hidden">
                    {activeGame === "BREATHING" && <BreathingExercise />}
                    {activeGame === "SNAKE" && <SnakeGame lang={lang} />}
                    {activeGame === "BREAKOUT" && <BreathingExercise />}
                    {activeGame === "DODGE" && <BreathingExercise />}
                    {activeGame === "COMEDY" && <ComedyCorner user={user} />}
                    {activeGame === "MEMORY" && <MemoryGame lang={lang} />}
                    {activeGame === "POP" && <BubblePopGame lang={lang} />}
                    {activeGame === "STACK" && <TowerStackGame lang={lang} />}
                    {activeGame === "ECHO" && <PatternEchoGame lang={lang} />}
                    {activeGame === "THOUGHTS" && <WhackAThought lang={lang} user={user} />}
                    {activeGame === "SAND" && <ZenSand lang={lang} />}
                    {activeGame === "MATCH" && <ColorMatch lang={lang} />}
                    {activeGame === "IMAGERY" && <GuidedImagery user={user} lang={lang} />}
                    {activeGame === "AFFIRMATIONS" && <AffirmationWall user={user} lang={lang} />}
                    {activeGame === "SOUNDS" && <SoundMixer lang={lang} soundState={soundState} onUpdateSound={onUpdateSound} />}
                    {activeGame === "TIMER" && <FocusTimer lang={lang} />}
                    {activeGame === "WHEEL" && <WheelGame lang={lang} />}
                </div>
                <InstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} lang={lang} text={(lang.instructions as any)[activeGame]} />
            </div>
        );
    }
    return (<div className="h-full flex flex-col bg-slate-50"><Header title={lang.games_tools} goBack={onBack} /><div className="flex-1 overflow-y-auto p-6 no-scrollbar pb-24"><div className="grid grid-cols-2 gap-4">{games.map(g => (<button key={g.id} onClick={() => { setActiveGame(g.id); playSound('click'); }} className={`p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-all text-left flex flex-col gap-4 border border-transparent hover:border-white/50 ${g.color}`}><g.icon size={28} /><span className="font-black uppercase tracking-widest text-[10px]">{g.label}</span></button>))}</div></div></div>);
};

const JournalViewComponent = ({ onBack, user }: any) => {
    const [entries, setEntries] = useState<JournalEntry[]>([]);
    const [text, setText] = useState("");
    const [prompt, setPrompt] = useState("");
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [quotaExceeded, setQuotaExceeded] = useState(false);
    const lang = TRANSLATIONS[user.language || 'en'];

    const startListening = () => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) { alert("Speech recognition is not supported in this browser."); return; }
        const recognition = new SpeechRecognition();
        recognition.lang = user.language === 'en' ? 'en-US' : (user.language === 'es' ? 'es-ES' : (user.language === 'fr' ? 'fr-FR' : (user.language === 'zh' ? 'zh-CN' : 'en-US')));
        recognition.interimResults = false;
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            setText(prev => prev + (prev ? " " : "") + transcript);
            playSound('click');
        };
        recognition.start();
    };

    const fetchPrompt = async () => {
        setLoading(true);
        setQuotaExceeded(false);
        try {
            const r = await ai.models.generateContent({ model: AI_MODEL, contents: `Give me one reflective journal prompt for someone feeling ${user.mood} in ${user.language}.` });
            setPrompt(r.text || "What's on your mind today?");
        } catch(e) { 
          if (handleAIError(e)) {
            setQuotaExceeded(true);
            setPrompt("Think about one thing you did today that made you proud of yourself. Why did you do it?");
          } else {
            setPrompt("What's on your mind today?"); 
          }
        } finally { setLoading(false); }
    };

    useEffect(() => {
        const saved = localStorage.getItem("lumina_journal");
        if (saved) setEntries(JSON.parse(saved));
        fetchPrompt();
    }, []);

    const saveEntry = () => {
        if (!text.trim()) return;
        const newEntry: JournalEntry = { id: Date.now().toString(), date: new Date().toLocaleDateString(), text: text.trim(), prompt: prompt };
        const updated = [newEntry, ...entries];
        setEntries(updated);
        localStorage.setItem("lumina_journal", JSON.stringify(updated));
        setText("");
        playSound('success');
    };

    const deleteEntry = (id: string) => {
        const updated = entries.filter(e => e.id !== id);
        setEntries(updated);
        localStorage.setItem("lumina_journal", JSON.stringify(updated));
        playSound('trash');
    };

    return (
        <div className="h-full flex flex-col bg-slate-50">
            <Header title={lang.journal} goBack={onBack} />
            <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-24">
                <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-4"><h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{lang.writing_prompt}</h3><button onClick={fetchPrompt} disabled={loading} className="text-indigo-600 hover:rotate-180 transition-transform duration-500"><RefreshCcw size={16} className={loading ? 'animate-spin' : ''} /></button></div>
                    {quotaExceeded && <p className="text-[8px] font-black text-amber-500 uppercase tracking-widest mb-1">{lang.quota_error}</p>}
                    <p className="text-slate-800 font-bold mb-6 leading-relaxed italic">"{prompt}"</p>
                    <div className="relative mb-4"><textarea value={text} onChange={e => setText(e.target.value)} placeholder={lang.writing_hint} className="w-full h-40 p-4 bg-slate-50 border-none rounded-2xl text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 transition-all resize-none font-medium text-sm pr-12" /><button onClick={startListening} className={`absolute right-3 bottom-3 p-3 rounded-xl transition-all shadow-md active:scale-90 ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-white text-slate-400 hover:text-indigo-600'}`} title="Voice Input"><Mic size={20} /></button></div>
                    <button onClick={saveEntry} disabled={!text.trim()} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">{lang.save_entry}</button>
                </section>
                <section><h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">{lang.past_entries}</h3><div className="space-y-4">{entries.length === 0 ? (<div className="text-center py-20 opacity-20"><BookHeart size={48} className="mx-auto mb-2" /><p className="font-bold">{lang.no_entries}</p></div>) : entries.map(e => (<div key={e.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 group hover:shadow-md transition-all animate-in fade-in zoom-in duration-300"><div className="flex justify-between items-start mb-3"><div className="flex flex-col"><span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{e.date}</span>{e.prompt && <span className="text-[10px] font-bold text-slate-300 italic mt-0.5 line-clamp-1">Prompt: {e.prompt}</span>}</div><button onClick={() => deleteEntry(e.id)} className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 size={16} /></button></div><p className="text-slate-700 text-sm font-medium leading-relaxed whitespace-pre-wrap">{e.text}</p></div>))}</div></section>
            </div>
        </div>
    );
};

const CreativeView = ({ onBack, user, soundState, onUpdateSound }: any) => {
    const [activeTab, setActiveTab] = useState<'DRAW' | 'MANDALA' | 'MUSIC' | 'TREE'>('DRAW');
    const [showInstructions, setShowInstructions] = useState(false);
    const [showBgMusic, setShowBgMusic] = useState(false);
    const lang = TRANSLATIONS[user.language || 'en'];
    const currentInstructionKey = activeTab === 'MUSIC' ? 'AI_PLAYLIST' : activeTab === 'TREE' ? 'GRATEFUL_TREE' : activeTab === 'DRAW' ? 'SKETCH' : activeTab;

    return (
        <div className="h-full flex flex-col bg-slate-50 relative">
            <Header 
                title={lang.creative_space} 
                goBack={onBack} 
                rightAction={
                    <div className="flex items-center gap-1">
                        <button onClick={() => setShowBgMusic(!showBgMusic)} className={`p-2 rounded-full transition-all ${showBgMusic ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-indigo-600'}`}>
                            <DiscAlbum size={20} className={showBgMusic ? "animate-spin-slow" : ""} />
                        </button>
                        <button onClick={() => setShowInstructions(true)} className="p-2 text-slate-400 hover:text-indigo-600">
                            <HelpCircle size={20}/>
                        </button>
                    </div>
                } 
            />
            
            <div className="flex bg-white border-b overflow-x-auto no-scrollbar shrink-0">
                {[
                    { id: 'DRAW', icon: Palette, label: lang.sketch_tab }, 
                    { id: 'MANDALA', icon: Hexagon, label: "Mandala" }, 
                    { id: 'TREE', icon: Trees, label: "Tree" }, 
                    { id: 'MUSIC', icon: ListMusic, label: "Playlist" }
                ].map(t => (
                    <button key={t.id} onClick={() => { setActiveTab(t.id as any); playSound('click'); }} className={`flex-1 min-w-[80px] py-4 flex flex-col items-center gap-1 border-b-2 transition-all ${activeTab === t.id ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-400'}`}>
                        <t.icon size={18} /><span className="text-[10px] font-black uppercase tracking-widest">{t.label}</span>
                    </button>
                ))}
            </div>
            
            <div className="flex-1 overflow-hidden relative">
                {activeTab === 'DRAW' && <DrawingCanvas lang={lang} />}
                {activeTab === 'MANDALA' && <MandalaCreator lang={lang} />}
                {activeTab === 'TREE' && <GratefulTree lang={lang} />}
                {activeTab === 'MUSIC' && <PlaylistGenerator lang={lang} user={user} />}
                
                {showBgMusic && (
                    <div className="absolute top-2 right-2 w-72 bg-white/95 backdrop-blur-md shadow-2xl z-[2005] rounded-[2.5rem] border border-slate-200 animate-in slide-in-from-right-4 duration-300">
                        <div className="flex justify-between items-center p-5 border-b">
                            <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">{lang.bg_music}</h3>
                            <button onClick={() => setShowBgMusic(false)} className="text-slate-400 hover:text-slate-600">
                                <X size={16}/>
                            </button>
                        </div>
                        <BackgroundMusicPlayer user={user} lang={lang} />
                    </div>
                )}
            </div>
            
            <InstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} lang={lang} text={(lang.instructions as any)[currentInstructionKey]} />
        </div>
    );
};

const GratitudeHubView = ({ onBack, user }: any) => {
    const [activeHubTab, setActiveHubTab] = useState<'KINDNESS' | 'GRATITUDE'>('KINDNESS');
    const [kindnessItems, setKindnessItems] = useState<string[]>([]);
    const [gratitudeItems, setGratitudeItems] = useState<string[]>([]);
    const [suggestions, setSuggestions] = useState<KindnessChallenge[]>([]);
    const [loading, setLoading] = useState(false);
    const [gratitudePrompt, setGratitudePrompt] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [showInstructions, setShowInstructions] = useState(false);
    const lang = TRANSLATIONS[user.language || 'en'];

    const startListening = (targetInputId: string) => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (!SpeechRecognition) { alert("Speech recognition is not supported in this browser."); return; }
        const recognition = new SpeechRecognition();
        recognition.lang = user.language === 'en' ? 'en-US' : (user.language === 'es' ? 'es-ES' : (user.language === 'fr' ? 'fr-FR' : (user.language === 'zh' ? 'zh-CN' : 'en-US')));
        recognition.interimResults = false;
        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onresult = (event: any) => {
            const transcript = event.results[0][0].transcript;
            const input = document.getElementById(targetInputId) as HTMLInputElement;
            if (input) input.value = transcript;
            playSound('click');
        };
        recognition.start();
    };

    const getSuggestedActs = async () => {
        setLoading(true);
        try {
            const response = await ai.models.generateContent({
                model: AI_MODEL,
                contents: `Suggest 3 simple daily acts of kindness (short sentences) for someone in ${user.language}. JSON: [{id, text}]`,
                config: { 
                    responseMimeType: "application/json", 
                    responseSchema: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, text: { type: Type.STRING } }, required: ["id", "text"] } } 
                }
            });
            const data = JSON.parse(response.text || "[]");
            const icons = [HeartHandshake, Gift, CoffeeIcon, Flower, Smile, Sparkles];
            setSuggestions(data.map((d: any, i: number) => ({ ...d, icon: icons[i % icons.length], category: "Kindness" })));
        } catch (e) { 
          if (handleAIError(e)) {
            setSuggestions([
              { id: '1', text: "Leave a positive comment on someone's post", icon: HeartHandshake, category: "Kindness" },
              { id: '2', text: "Text a friend a genuine compliment", icon: Sparkles, category: "Kindness" },
              { id: '3', text: "Hold the door for a stranger", icon: Smile, category: "Kindness" }
            ]);
          }
        } finally { setLoading(false); }
    };

    const getGratitudePrompt = async () => {
        setLoading(true);
        try {
            const response = await ai.models.generateContent({ model: AI_MODEL, contents: `Give me one unique, deep gratitude prompt for today in ${user.language}.` });
            setGratitudePrompt(response.text || "What's a small win you had today?");
        } catch (e) { 
          if (handleAIError(e)) {
            setGratitudePrompt("Who is someone that has supported you recently, and why are you thankful for them?");
          } else {
            setGratitudePrompt("What made you smile today?"); 
          }
        } finally { setLoading(false); }
    };

    useEffect(() => { 
        const storedK = localStorage.getItem("lumina_kindness_acts");
        if (storedK) setKindnessItems(JSON.parse(storedK));
        const storedG = localStorage.getItem("lumina_gratitude_list");
        if (storedG) setGratitudeItems(JSON.parse(storedG));
        getSuggestedActs();
    }, []);

    const saveKindness = (updated: string[]) => { setKindnessItems(updated); localStorage.setItem("lumina_kindness_acts", JSON.stringify(updated)); };
    const saveGratitude = (updated: string[]) => { setGratitudeItems(updated); localStorage.setItem("lumina_gratitude_list", JSON.stringify(updated)); };
    const addKindness = (text: string) => { if (text.trim()) { const updated = [text.trim(), ...kindnessItems]; saveKindness(updated); playSound('success'); setSuggestions(suggestions.filter(s => s.text !== text)); } };
    const addGratitude = (text: string) => { if (text.trim()) { const updated = [text.trim(), ...gratitudeItems]; saveGratitude(updated); playSound('success'); } };

    return (
        <div className="h-full flex flex-col bg-slate-50">
            <Header title={lang.kindness} goBack={onBack} rightAction={<button onClick={() => setShowInstructions(true)} className="p-2 text-slate-400 hover:text-indigo-600"><HelpCircle size={20}/></button>} />
            <div className="flex bg-white shadow-sm border-b border-slate-100 justify-center shrink-0">
                <button onClick={() => setActiveHubTab('KINDNESS')} className={`flex-1 flex flex-col items-center py-3 font-bold border-b-2 transition-all gap-1 ${activeHubTab==='KINDNESS' ? 'border-amber-600 text-amber-700' : 'border-transparent text-slate-400'}`}><HeartHandshake size={18}/><span className="text-[10px] uppercase tracking-wider">{lang.kindness_tab}</span></button>
                <button onClick={() => setActiveHubTab('GRATITUDE')} className={`flex-1 flex flex-col items-center py-3 font-bold border-b-2 transition-all gap-1 ${activeHubTab==='GRATITUDE' ? 'border-amber-600 text-amber-700' : 'border-transparent text-slate-400'}`}><ClipboardList size={18}/><span className="text-[10px] uppercase tracking-wider">{lang.gratitude_tab_btn}</span></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-24">
                {activeHubTab === 'KINDNESS' ? (
                  <><section><div className="flex items-center justify-between mb-4"><h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{lang.kindness_challenges}</h3><button onClick={getSuggestedActs} disabled={loading} className="text-indigo-600 hover:text-indigo-800 transition-colors"><RefreshCcw size={16} className={loading ? 'animate-spin' : ''} /></button></div><div className="space-y-3">{loading && suggestions.length === 0 ? (Array(3).fill(0).map((_, i) => (<div key={i} className="h-24 bg-white/50 animate-pulse rounded-2xl border border-slate-100" />))) : suggestions.map(s => (<div key={s.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4 group hover:shadow-md transition-all"><div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-all"><s.icon size={24} /></div><p className="flex-1 text-sm font-bold text-slate-700 leading-tight">{s.text}</p><button onClick={() => addKindness(s.text)} className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-xl font-black text-[10px] uppercase hover:bg-indigo-600 hover:text-white transition-all shadow-sm active:scale-95">{lang.accept_challenge}</button></div>))}</div></section><section><h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">{lang.kindness_log}</h3><div className="bg-white p-2 rounded-2xl shadow-sm mb-4 flex gap-1 border border-slate-100"><input id="custom-kindness-input" placeholder={lang.acts_hint} className="flex-1 px-4 py-2 outline-none text-sm font-medium text-slate-600" onKeyDown={e => { if (e.key === 'Enter') { const val = (e.target as HTMLInputElement).value; addKindness(val); (e.target as HTMLInputElement).value = ""; } }} /><button onClick={() => startListening('custom-kindness-input')} className={`p-2 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-50 text-slate-400 hover:text-indigo-600'}`}><Mic size={20} /></button><button onClick={() => { const input = document.getElementById('custom-kindness-input') as HTMLInputElement; addKindness(input.value); input.value = ""; }} className="p-2 bg-amber-600 text-white rounded-xl shadow-md active:scale-90"><Plus size={20} /></button></div><div className="space-y-2">{kindnessItems.map((item, i) => (<div key={i} className="bg-white p-4 rounded-xl flex items-center justify-between shadow-sm animate-in slide-in-from-left-2 group"><span className="text-sm font-medium text-slate-600">{item}</span><button onClick={() => saveKindness(kindnessItems.filter((_, idx) => idx !== i))} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button></div>))}</div></section></>
                ) : (
                  <><section><div className="flex items-center justify-between mb-4"><h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">{lang.gratitude_list}</h3><button onClick={getGratitudePrompt} disabled={loading} className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-600 rounded-full text-[10px] font-black uppercase hover:bg-rose-100 transition-all"><Sparkles size={12} />{lang.gratitude_prompt_btn}</button></div>{gratitudePrompt && (<div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl mb-6 relative animate-in slide-in-from-top-2"><Quote size={24} className="absolute -top-3 -left-3 text-rose-200 fill-rose-200 rotate-180" /><p className="text-rose-800 text-sm font-bold italic leading-relaxed">"{gratitudePrompt}"</p></div>)}<div className="bg-white p-2 rounded-2xl shadow-sm mb-4 flex gap-1 border border-slate-100"><input id="custom-gratitude-input" placeholder={lang.gratitude_hint} className="flex-1 px-4 py-2 outline-none text-sm font-medium text-slate-600" onKeyDown={e => { if (e.key === 'Enter') { const val = (e.target as HTMLInputElement).value; addGratitude(val); (e.target as HTMLInputElement).value = ""; } }} /><button onClick={() => startListening('custom-gratitude-input')} className={`p-2 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-50 text-slate-400 hover:text-indigo-600'}`}><Mic size={20} /></button><button onClick={() => { const input = document.getElementById('custom-gratitude-input') as HTMLInputElement; addGratitude(input.value); input.value = ""; }} className="p-2 bg-rose-500 text-white rounded-xl shadow-md active:scale-90"><Plus size={20} /></button></div><div className="space-y-2">{gratitudeItems.length === 0 ? (<div className="text-center py-20 opacity-20"><Star size={48} className="mx-auto mb-2" /><p className="font-bold">List is empty.</p></div>) : gratitudeItems.map((item, i) => (<div key={i} className="bg-white p-4 rounded-xl flex items-center justify-between shadow-sm animate-in slide-in-from-left-2 group"><div className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-rose-400 rounded-full group-hover:scale-150 transition-transform" /><span className="text-sm font-medium text-slate-600">{item}</span></div><button onClick={() => saveGratitude(gratitudeItems.filter((_, idx) => idx !== i))} className="text-slate-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button></div>))}</div></section></>
                )}
            </div>
            <InstructionsModal isOpen={showInstructions} onClose={() => setShowInstructions(false)} lang={lang} text={activeHubTab === 'KINDNESS' ? (lang.instructions as any).KINDNESS_CHALLENGES : (lang.instructions as any).GRATEFUL_TREE} />
        </div>
    );
};

const InspirationView = ({ onBack, user }: any) => {
    const [activeTab, setActiveTab] = useState<'QUOTES' | 'MISSION' | 'STORIES'>('QUOTES');
    const [content, setContent] = useState({ quote: "", author: "", mission: "", story: "" });
    const [loading, setLoading] = useState(false);
    const [quotaExceeded, setQuotaExceeded] = useState(false);
    const [selectedTheme, setSelectedTheme] = useState(INSPIRATION_THEMES[0].id);
    const lang = TRANSLATIONS[user.language || 'en'];

    const generateContent = async (type: string) => {
        setLoading(true);
        setQuotaExceeded(false);
        try {
            const genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            let prompt = "";
            if (type === 'QUOTES') {
                prompt = `Give me one inspirational quote about "${selectedTheme}" for someone feeling ${user.mood} in ${user.language}. Return JSON: { "text": "...", "author": "..." }`;
            } else if (type === 'MISSION') {
                prompt = `Suggest one small, actionable "Daily Mission" (a positive task) for someone feeling ${user.mood} in ${user.language} that relates to "${selectedTheme}". Return JSON: { "text": "..." }`;
            } else {
                prompt = `Tell a very short (2-3 sentences), peaceful Zen story or parable in ${user.language} about "${selectedTheme}". Return JSON: { "text": "..." }`;
            }

            const response = await genAI.models.generateContent({
                model: AI_MODEL,
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: {
                        type: Type.OBJECT,
                        properties: {
                            text: { type: Type.STRING },
                            author: { type: Type.STRING }
                        },
                        required: ["text"]
                    }
                }
            });

            const jsonStr = response.text || "{}";
            const data = JSON.parse(jsonStr);
            
            if (type === 'QUOTES') setContent(prev => ({ ...prev, quote: data.text, author: data.author || "Unknown" }));
            else if (type === 'MISSION') setContent(prev => ({ ...prev, mission: data.text }));
            else setContent(prev => ({ ...prev, story: data.text }));
            
            playSound('success');
        } catch (e) {
            console.error("Failed to generate inspiration:", e);
            if (handleAIError(e)) {
              setQuotaExceeded(true);
              const fallbacks: Record<string, any> = {
                QUOTES: { text: "Paix.", author: "Lumina" },
                MISSION: { text: "Souriez." },
                STORIES: { text: "Un conte zen." }
              };
              const f = (fallbacks as any)[type];
              if (type === 'QUOTES') setContent(prev => ({ ...prev, quote: f.text, author: f.author }));
              else if (type === 'MISSION') setContent(prev => ({ ...prev, mission: f.text }));
              else setContent(prev => ({ ...prev, story: f.text }));
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        generateContent(activeTab);
    }, [activeTab, selectedTheme]);

    return (
        <div className="h-full flex flex-col bg-slate-50">
            <Header title={lang.inspiration} goBack={onBack} />
            <div className="flex bg-white border-b overflow-x-auto no-scrollbar shrink-0">
                {[
                    { id: 'QUOTES', icon: Quote, label: lang.quote_tab },
                    { id: 'MISSION', icon: Target, label: lang.daily_mission },
                    { id: 'STORIES', icon: ScrollText, label: lang.zen_stories }
                ].map(t => (
                    <button 
                        key={t.id} 
                        onClick={() => { setActiveTab(t.id as any); playSound('click'); }}
                        className={`flex-1 min-w-[100px] py-4 flex flex-col items-center gap-1 border-b-2 transition-all ${activeTab === t.id ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-400'}`}
                    >
                        <t.icon size={18} /><span className="text-[10px] font-black uppercase tracking-widest">{t.label}</span>
                    </button>
                ))}
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-24">
                <section>
                    <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">{lang.explore_themes}</h3>
                    <div className="grid grid-cols-4 gap-2">
                        {INSPIRATION_THEMES.map(theme => (
                            <button 
                                key={theme.id} 
                                onClick={() => { setSelectedTheme(theme.id); playSound('click'); }}
                                className={`flex flex-col items-center p-3 rounded-2xl border transition-all ${selectedTheme === theme.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-indigo-200'}`}
                            >
                                <theme.icon size={20} className="mb-1.5" />
                                <span className="text-[8px] font-black uppercase tracking-tighter">{theme.id}</span>
                            </button>
                        ))}
                    </div>
                </section>

                <div className="relative">
                    {quotaExceeded && (
                      <div className="mb-4 p-4 bg-amber-50 border border-amber-100 rounded-3xl flex items-center gap-3 animate-in slide-in-from-top-2">
                        <AlertTriangle className="text-amber-500" size={18} />
                        <p className="text-amber-900 text-xs font-bold">{lang.quota_error}</p>
                      </div>
                    )}
                    {loading ? (
                        <div className="bg-white p-12 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col items-center justify-center animate-pulse">
                            <Loader2 size={32} className="animate-spin text-indigo-200 mb-4" />
                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Gathering Wisdom</p>
                        </div>
                    ) : (
                        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 relative group animate-in zoom-in duration-500">
                            <Quote size={48} className="absolute -top-4 -left-4 text-indigo-50 opacity-50 fill-indigo-50" />
                            
                            {activeTab === 'QUOTES' && (
                                <div className="text-center">
                                    <p className="text-xl font-bold text-slate-800 leading-relaxed mb-6">"{content.quote}"</p>
                                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">— {content.author}</p>
                                </div>
                            )}

                            {activeTab === 'MISSION' && (
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 size={24} />
                                    </div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{lang.daily_mission}</p>
                                    <p className="text-lg font-bold text-slate-800 leading-tight">{content.mission}</p>
                                </div>
                            )}

                            {activeTab === 'STORIES' && (
                                <div className="text-center">
                                    <ScrollText size={32} className="text-amber-200 mx-auto mb-6" />
                                    <p className="text-sm font-medium text-slate-600 leading-relaxed italic">{content.story}</p>
                                </div>
                            )}

                            <button 
                                onClick={() => generateContent(activeTab)} 
                                className="mt-10 w-full py-4 bg-slate-50 text-slate-400 rounded-2xl hover:bg-indigo-50 hover:text-indigo-600 transition-all active:scale-95 flex items-center justify-center gap-2"
                            >
                                <RefreshCcw size={16} />
                                <span className="text-[10px] font-black uppercase tracking-widest">{(lang.another_one || "Another One")}</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const ProfileView = ({ onBack, currentProfile, onUpdate }: any) => {
    const [subView, setSubView] = useState<'SETTINGS' | 'LOGIN' | 'SIGNUP'>('SETTINGS');
    const [username, setUsername] = useState(currentProfile.username);
    const [language, setLanguage] = useState(currentProfile.language);
    const [email, setEmail] = useState(currentProfile.email || "");
    const [password, setPassword] = useState("");
    const lang = TRANSLATIONS[language] || TRANSLATIONS.en;

    const handleAuthAction = () => {
      onUpdate({ ...currentProfile, username, language, email: email || "user@example.com" });
      setSubView('SETTINGS');
      playSound('success');
    };

    if (subView === 'LOGIN' || subView === 'SIGNUP') {
      const isLogin = subView === 'LOGIN';
      return (
        <div className="h-full flex flex-col bg-white animate-in slide-in-from-right duration-300">
          <Header title={isLogin ? lang.login : lang.sign_up} goBack={() => setSubView('SETTINGS')} />
          <div className="flex-1 p-8 flex flex-col justify-center max-w-sm mx-auto w-full">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-inner mx-auto">
              {isLogin ? <KeyRound size={32}/> : <UserPlus size={32}/>}
            </div>
            <h2 className="text-3xl font-black text-slate-800 tracking-tighter mb-2 text-center">
              {isLogin ? lang.welcome_back : lang.join_us}
            </h2>
            <p className="text-slate-400 font-bold text-center mb-10 text-sm uppercase tracking-widest">Lumina Account</p>
            
            <div className="space-y-4">
              {!isLogin && (
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{lang.name_label}</label>
                  <input value={username} onChange={e => setUsername(e.target.value)} className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-indigo-100" placeholder="Your Name" />
                </div>
              )}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{lang.email_label}</label>
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-indigo-100" placeholder="email@address.com" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{lang.password_label}</label>
                <input value={password} onChange={e => setPassword(e.target.value)} type="password" className="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border-2 border-transparent focus:border-indigo-100" placeholder="••••••••" />
              </div>
              <button onClick={handleAuthAction} className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl mt-6 active:scale-95 transition-all">
                {isLogin ? lang.login : lang.sign_up}
              </button>
            </div>
            
            <button onClick={() => setSubView(isLogin ? 'SIGNUP' : 'LOGIN')} className="mt-10 text-center text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:underline">
              {isLogin ? lang.signup_cta : lang.login_cta}
            </button>
          </div>
        </div>
      );
    }

    return (
        <div className="h-full flex flex-col bg-slate-50">
            <Header title={lang.profile_settings} goBack={onBack} />
            <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-24">
                <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 flex flex-col items-center">
                    <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-black text-4xl mb-4 shadow-inner">
                        {username[0]?.toUpperCase() || "?"}
                    </div>
                    <h2 className="text-xl font-black text-slate-800 tracking-tighter">{username}</h2>
                    {currentProfile.email && <p className="text-slate-400 font-bold text-xs mt-1">{currentProfile.email}</p>}
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{lang.display_name}</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                            <input 
                                value={username} 
                                onChange={e => setUsername(e.target.value)} 
                                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none focus:ring-2 focus:ring-indigo-100 transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{lang.language}</label>
                        <div className="relative">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5" />
                            <select 
                                value={language} 
                                onChange={e => setLanguage(e.target.value)}
                                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-2xl font-bold text-slate-700 outline-none appearance-none focus:ring-2 focus:ring-indigo-100 transition-all cursor-pointer"
                            >
                                <option value="en">English</option>
                                <option value="es">Español</option>
                                <option value="fr">Français</option>
                                <option value="zh">中文</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 w-5 h-5 pointer-events-none" />
                        </div>
                    </div>
                    
                    <div className="pt-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-3">{lang.account}</p>
                      <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => { setSubView('LOGIN'); playSound('click'); }} className="p-4 bg-white border border-slate-100 rounded-2xl font-black text-[10px] uppercase text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                          <KeyRound size={14}/> {lang.login}
                        </button>
                        <button onClick={() => { setSubView('SIGNUP'); playSound('click'); }} className="p-4 bg-white border border-slate-100 rounded-2xl font-black text-[10px] uppercase text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2">
                          <UserPlus size={14}/> {lang.sign_up}
                        </button>
                      </div>
                    </div>
                </div>

                <div className="pt-8 space-y-4">
                    <button 
                        onClick={() => { onUpdate({ ...currentProfile, username, language }); playSound('success'); }}
                        className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100 active:scale-95 transition-all"
                    >
                        {lang.save_changes}
                    </button>
                    
                    <button 
                        onClick={() => { localStorage.removeItem("lumina_user"); window.location.reload(); }}
                        className="w-full py-5 bg-white text-rose-500 rounded-[2rem] font-black uppercase tracking-widest text-xs border border-rose-50 active:bg-rose-50 transition-all flex items-center justify-center gap-2"
                    >
                        <LogOut size={16} />
                        {lang.sign_out}
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- App Root Component ---

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

  return (
    <div className="h-screen w-full bg-slate-50 text-slate-900 font-sans overflow-hidden max-w-md mx-auto shadow-2xl relative">
      {view === "HOME" && (
        <div className="h-full flex flex-col p-6 fade-in overflow-y-auto no-scrollbar shrink-0">
          <div className="flex justify-between items-center mb-8">
            <div><h1 className="text-3xl font-bold text-slate-800 tracking-tighter">{lang.hi}, {user.username}</h1><button onClick={() => setShowMoodSelector(!showMoodSelector)} className="text-slate-500 text-sm font-medium">{lang.feeling} {user.mood} ▼</button></div>
            <button onClick={() => setView("PROFILE")} className="p-2 bg-white rounded-full shadow-sm"><div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">{user.username[0]?.toUpperCase()}</div></button>
          </div>
          {showMoodSelector && (<div className="grid grid-cols-4 gap-2 mb-6 bg-white p-4 rounded-3xl shadow-xl animate-in slide-in-from-top-2 border border-slate-50">{MOODS.map(m => (<button key={m.label} onClick={() => { updateUser({...user, mood: m.emoji + " " + m.label}); setShowMoodSelector(false); }} className="flex flex-col items-center hover:scale-110 transition-transform p-2 hover:bg-slate-50 rounded-2xl"><span className="text-2xl">{m.emoji}</span><span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{m.label}</span></button>))}</div>)}
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
      {showInstantRelief && <InstantReliefOverlay user={user} onClose={() => setShowInstantRelief(false)} onNavigate={(v:any, g:any) => { setView(v); if(g) setActiveGame(g); }} />}
      {view === "GAMES" && <GamesHub onBack={() => { setView("HOME"); setActiveGame("NONE"); }} user={user} activeGame={activeGame} setActiveGame={setActiveGame} soundState={soundState} onUpdateSound={setSoundState} />}
      {view === "JOURNAL" && <JournalViewComponent onBack={() => setView("HOME")} user={user} />}
      {view === "CREATIVE" && <CreativeView onBack={() => setView("HOME")} user={user} soundState={soundState} onUpdateSound={setSoundState} />}
      {view === "GRATITUDE" && <GratitudeHubView onBack={() => setView("HOME")} user={user} />}
      {view === "QUOTES" && <InspirationView onBack={() => setView("HOME")} user={user} />}
      {view === "PROFILE" && <ProfileView onBack={() => setView("HOME")} currentProfile={user} onUpdate={(u:any) => { updateUser(u); setView("HOME"); }} />}
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);