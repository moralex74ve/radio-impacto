import React, { useState, useRef, useEffect, useCallback } from "react";
import { StreamStatus } from "../types";
import { PlayIcon } from "./components/PlayIcon";
import { PauseIcon } from "./components/PauseIcon";
import { SpinnerIcon } from "./components/SpinnerIcon";
import { OfflineIcon } from "./components/OfflineIcon";
import { VolumeIcon } from "./components/VolumeIcon";
import { InstallButton } from "./components/InstallButton";
import { SocialIcons } from "./components/SocialIcons";
import { PrivacyPolicy } from "./components/PrivacyPolicy";


const STREAM_URL = "https://stream.zeno.fm/9hfny901wwzuv";
// Zeno.fm metadata API (SSE endpoint used as polling)
const METADATA_URL = "https://api.zeno.fm/mounts/metadata/subscribe/9hfny901wwzuv";

const App: React.FC = () => {
  const [streamStatus, setStreamStatus] = useState<StreamStatus>(
    StreamStatus.Paused
  );
  const [volume, setVolume] = useState(() => {
    const savedVolume = localStorage.getItem("radio-volume");
    return savedVolume ? parseFloat(savedVolume) : 0.4;
  });
  const [nowPlaying, setNowPlaying] = useState<string>("Radio Impacto Digital");
  const [showPrivacy, setShowPrivacy] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchMetadata = useCallback(async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    try {
      const response = await fetch(METADATA_URL, { signal: controller.signal });
      if (!response.ok) {
        setNowPlaying("Radio Impacto Digital");
        return;
      }

      const reader = response.body?.getReader();
      if (!reader) {
        setNowPlaying("Radio Impacto Digital");
        return;
      }

      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');

          for (const line of lines) {
            if (line.trim().startsWith('data:')) {
              const jsonStr = line.replace(/^data:\s*/, '').trim();
              // Avoid empty json objects if Zeno pushes a blank data event
              if (jsonStr && jsonStr !== '{}') {
                try {
                  const data = JSON.parse(jsonStr);
                  if (data?.streamTitle) {
                    setNowPlaying(data.streamTitle);
                    reader.cancel();
                    return;
                  }
                } catch (err) {
                  // Ignore parse error from partial streaming chunks
                }
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (e) {
      console.error("Error fetching metadata:", e);
      setNowPlaying("Radio Impacto Digital");
    } finally {
      clearTimeout(timeoutId);
    }
  }, []);

  useEffect(() => {
    fetchMetadata();
    const interval = setInterval(fetchMetadata, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [fetchMetadata]);

  useEffect(() => {
    const audio = new Audio(STREAM_URL);
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;

    const handleCanPlay = () => setStreamStatus(StreamStatus.Paused);
    const handlePlaying = () => setStreamStatus(StreamStatus.Playing);
    const handleError = () => {
      setStreamStatus(StreamStatus.Offline);
    };
    const handlePause = () => setStreamStatus(StreamStatus.Paused);
    const handleEnded = () => setStreamStatus(StreamStatus.Offline);

    audio.volume = volume; // Aplicar volumen guardado inicialmente
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("error", handleError);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    // Intentar reproducción automática (reproducción por mejor esfuerzo)
    // Nota: Muchos navegadores bloquean el autoplay sin interacción previa.
    const startAutoplay = async () => {
      try {
        setStreamStatus(StreamStatus.Loading);
        await audio.play();
      } catch (error) {
        console.log("Autoplay bloqueado por el navegador, se requiere interacción del usuario.");
        setStreamStatus(StreamStatus.Paused);
      }
    };

    startAutoplay();

    return () => {
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
      audioRef.current = null;
    };
  }, []); // El array vacío es correcto porque volume solo se usa al inicio.
  // Sin embargo, handleVolumeChange se encarga de las actualizaciones posteriores.



  // Verificar hash para política de privacidad
  useEffect(() => {
    if (window.location.hash === "#privacy") {
      setShowPrivacy(true);
    }

    const handleHashChange = () => {
      if (window.location.hash === "#privacy") {
        setShowPrivacy(true);
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);


  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return;

    if (streamStatus === StreamStatus.Playing) {
      audioRef.current.pause();
    } else {
      setStreamStatus(StreamStatus.Loading);
      // If offline, reload the source
      if (streamStatus === StreamStatus.Offline) {
        audioRef.current.load();
      }
      audioRef.current.play().catch(() => {
        setStreamStatus(StreamStatus.Offline);
      });
    }
  }, [streamStatus]);

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(event.target.value);
    setVolume(newVolume);
    localStorage.setItem("radio-volume", newVolume.toString());
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const getStatusText = () => {
    switch (streamStatus) {
      case StreamStatus.Playing:
        return "EN VIVO";
      case StreamStatus.Paused:
        return "TOCA PARA ESCUCHAR";
      case StreamStatus.Loading:
        return "CONECTANDO...";
      case StreamStatus.Offline:
        return "FUERA DE LÍNEA - TOCA PARA REINTENTAR";
      default:
        return "";
    }
  };

  const renderStatusIcon = () => {
    switch (streamStatus) {
      case StreamStatus.Playing:
        return <PauseIcon className="w-10 h-10 text-amber-400" />;
      case StreamStatus.Paused:
        return <PlayIcon className="w-10 h-10 text-amber-400 pl-1" />;
      case StreamStatus.Loading:
        return (
          <SpinnerIcon className="w-10 h-10 text-amber-400 animate-spin" />
        );
      case StreamStatus.Offline:
        return <OfflineIcon className="w-10 h-10 text-amber-400" />;
      default:
        return null;
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-start pt-4 text-center min-h-screen bg-gray-900 text-white font-sans overflow-hidden bg-no-repeat bg-cover bg-center bg-fixed p-4"
      style={{
        backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent, rgba(0, 0, 0, 0.7)), url(${(import.meta as any).env.BASE_URL}Imgur.webp)`,
      }}
    >
      <header className="flex flex-col items-center">
        <h1 className="sr-only">Radio Impacto Digital - La Radio del Pueblo de Dios - Transmisión en vivo 24/7</h1>
        <img
          src={`${(import.meta as any).env.BASE_URL}Logo.svg`}
          alt="Radio Impacto Digital - La Radio del Pueblo de Dios - Logo oficial"
          className="block w-72 md:w-80 h-40 md:h-44 mb-0 p-0 object-cover"
        />
      </header>

      <main className="flex flex-col items-center w-full">
        <nav aria-label="Navegación principal" className="sr-only">
          <ul className="flex flex-wrap justify-center gap-4 text-sm">
            <li><a href="#player" className="hover:text-amber-400 transition"> Reproductor</a></li>
            <li><a href="#volume" className="hover:text-amber-400 transition"> Volumen</a></li>
            <li><a href="#social" className="hover:text-amber-400 transition"> Redes Sociales</a></li>
            <li><a href="#contact" className="hover:text-amber-400 transition"> Contacto</a></li>
          </ul>
        </nav>

        <section id="player" aria-labelledby="player-heading" className="flex flex-col items-center">
          <h2 id="player-heading" className="sr-only">Reproductor de radio en vivo</h2>
          <button
            onClick={togglePlayPause}
            className="w-24 h-24 bg-black/40 rounded-full flex items-center justify-center mb-2 transition-transform duration-200 active:scale-95 overflow-hidden"
            aria-label={
              streamStatus === StreamStatus.Playing ? "Pausar transmisión de radio" : "Reproducir transmisión de radio en vivo"
            }
          >
            {renderStatusIcon()}
          </button>

          <div className="flex flex-col items-center my-6 space-y-4">
            <p className="text-sm tracking-widest text-white/80 h-4" role="status" aria-live="polite">
              {getStatusText()}
            </p>
            <p className="text-white text-lg h-6" role="status" aria-live="polite" aria-label="Canción actual">{nowPlaying}</p>
          </div>
        </section>

        <section id="volume" aria-labelledby="volume-heading">
          <h2 id="volume-heading" className="sr-only">Control de volumen</h2>
          <div className="flex items-center space-x-3 w-full max-w-xs mt-6">
            <VolumeIcon className="w-6 h-6 text-amber-400" aria-hidden="true" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400"
              aria-label="Control de volumen de la transmisión"
            />
          </div>
        </section>

        {/* Iconos de redes sociales */}
        <nav id="social" aria-label="Redes sociales">
          <h2 className="sr-only">Síguenos en redes sociales</h2>
          <div className="mt-1 ">
            <SocialIcons />
          </div>
        </nav>
      </main>

      <footer className="flex flex-col items-center w-full">
        <div className="mt-3 pt-6 w-full flex items-center justify-center">
          <span className="inline-block bg-gradient-to-r from-red-600 to-red-500 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md tracking-wide text-center max-w-xs">
            La Radio del Pueblo de Dios
            <span className="block text-xs font-semibold opacity-90">
              Renovando Tu Vida.
            </span>
          </span>
        </div>
        {/* WhatsApp button aligned to the right */}
        <div id="contact" className="w-full flex justify-end mt-4">
          <a
            href="https://wa.me/584267793042"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white px-3 py-2 pt-2 rounded-full shadow-md transition"
            aria-label="Contactar por WhatsApp al +58 426 779 3042"
          >
            <svg
              className="w-5 h-5 mr-2"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M20.52 3.48A11.93 11.93 0 0012 0C5.373 0 .01 5.373 0 12c0 2.116.55 4.142 1.6 5.95L0 24l6.264-1.627A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12 0-3.204-1.248-6.206-3.48-8.52zM12 22.08c-1.9 0-3.74-.5-5.36-1.44l-.38-.23-3.72.97.99-3.62-.24-.37A9.07 9.07 0 013 11.99c0-5 4.01-9.01 9-9.01 2.41 0 4.68.94 6.39 2.66A8.99 8.99 0 0121 11.99c0 4.97-4.03 9-9 9.01z" />
              <path d="M17.3 14.07c-.28-.14-1.65-.81-1.9-.9-.26-.09-.45-.14-.64.14-.2.28-.78.9-.96 1.08-.18.18-.36.2-.64.07-.28-.14-1.18-.43-2.25-1.39-.83-.74-1.39-1.66-1.55-1.94-.16-.28-.02-.43.12-.57.12-.12.28-.31.42-.47.14-.16.19-.28.28-.46.09-.18.05-.35-.02-.49-.07-.14-.64-1.54-.88-2.12-.23-.56-.47-.48-.64-.49l-.55-.01c-.18 0-.47.07-.72.34-.25.28-.96.94-.96 2.3 0 1.36.98 2.68 1.12 2.86.14.18 1.94 3 4.7 4.2 2.76 1.2 2.76.8 3.26.75.5-.05 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.26-.18-.54-.32z" />
            </svg>
            <span className="text-sm font-medium">Escríbenos</span>
          </a>
        </div>

        {/* Botón de instalación para PWA */}
        <InstallButton />

        <div className="mt-6 mb-4">
          <button
            onClick={() => setShowPrivacy(true)}
            className="text-xs text-white/40 hover:text-white/80 transition-colors underline bg-transparent border-none cursor-pointer"
          >
            Política de Privacidad
          </button>
        </div>
      </footer>

      {showPrivacy && <PrivacyPolicy onClose={() => {
        setShowPrivacy(false);
        if (window.location.hash === "#privacy") {
          window.history.pushState("", document.title, window.location.pathname + window.location.search);
        }
      }} />}
    </div>

  );
};

export default App;
