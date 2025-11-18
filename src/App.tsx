import React, { useState, useRef, useEffect, useCallback } from "react";
import { StreamStatus } from "../types";
import { PlayIcon } from "./components/PlayIcon";
import { PauseIcon } from "./components/PauseIcon";
import { SpinnerIcon } from "./components/SpinnerIcon";
import { OfflineIcon } from "./components/OfflineIcon";
import { VolumeIcon } from "./components/VolumeIcon";
import { InstallButton } from "./components/InstallButton";
import { SocialIcons } from "./components/SocialIcons";

/* const STREAM_URL = "https://node-17.zeno.fm/9hfny901wwzuv";
// Zeno.fm metadata API endpoint
const METADATA_URL =
  "https://stream.zeno.fm/api/v2/public/nowplaying/9hfny901wwzuv"; */

const PRIMARY_STREAM_URL = "https://control.voztream.com/8126/stream";
const BACKUP_STREAM_URL = "https://stream.zeno.fm/9hfny901wwzuv";
// Voztream metadata API endpoint
const METADATA_URL = "https://control.voztream.com/cp/get_info.php?p=8126";
const STREAM_CHECK_INTERVAL = 600000; // 10 minutos

const App: React.FC = () => {
  const [streamStatus, setStreamStatus] = useState<StreamStatus>(
    StreamStatus.Paused
  );
  const [volume, setVolume] = useState(0.4);
  const [nowPlaying, setNowPlaying] = useState<string>("Impacto Digital");
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isUsingBackupRef = useRef(false);

  const fetchMetadata = useCallback(async () => {
    try {
      const response = await fetch(METADATA_URL);
      if (!response.ok) {
        // Si hay un error en la respuesta, usamos el título por defecto
        setNowPlaying("Impacto Digital");
        return;
      }
      
      const data = await response.json();
      
      // Verificamos la estructura de la respuesta de Voztream
      if (data?.song) {
        // Si hay información de la canción en la respuesta
        setNowPlaying(data.song);
      } else if (data?.current_song) {
        // Otra posible estructura de respuesta
        setNowPlaying(data.current_song);
      } else if (data?.now_playing?.song) {
        // Estructura alternativa que usa Zeno.fm
        const { title, artist } = data.now_playing.song;
        setNowPlaying(artist ? `${title} - ${artist}` : title);
      } else if (data?.title) {
        // Si la respuesta tiene un campo 'title' directo
        setNowPlaying(data.title);
      } else {
        // Si no encontramos la información esperada, mostramos el título por defecto
        setNowPlaying("Impacto Digital");
      }
    } catch (error) {
      console.error("Error fetching metadata:", error);
      setNowPlaying("Impacto Digital");
    }
  }, []);

  useEffect(() => {
    fetchMetadata();
    const interval = setInterval(fetchMetadata, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [fetchMetadata]);

  useEffect(() => {
    const audio = new Audio(PRIMARY_STREAM_URL);
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;

    const handleCanPlay = () => setStreamStatus(StreamStatus.Paused);
    const handlePlaying = () => setStreamStatus(StreamStatus.Playing);
    const handleError = () => {
      if (!audioRef.current) return;

      if (!isUsingBackupRef.current) {
        isUsingBackupRef.current = true;
        audioRef.current.src = BACKUP_STREAM_URL;
        audioRef.current.load();
        audioRef.current
          .play()
          .then(() => {
            setStreamStatus(StreamStatus.Playing);
          })
          .catch(() => {
            setStreamStatus(StreamStatus.Offline);
          });
      } else {
        setStreamStatus(StreamStatus.Offline);
      }
    };
    const handlePause = () => setStreamStatus(StreamStatus.Paused);
    const handleEnded = () => setStreamStatus(StreamStatus.Offline);

    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("error", handleError);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.pause();
      audioRef.current = null;
    };
  }, []);

  // Revisa periódicamente si el stream principal está disponible cuando
  // se está usando la URL de respaldo.
  useEffect(() => {
    const interval = setInterval(() => {
      if (!audioRef.current || !isUsingBackupRef.current) return;

      const audio = audioRef.current;
      const wasPlaying = !audio.paused;

      audio.src = PRIMARY_STREAM_URL;
      audio.load();
      audio
        .play()
        .then(() => {
          // Se pudo reproducir la URL principal, dejamos de usar el backup
          isUsingBackupRef.current = false;
          setStreamStatus(StreamStatus.Playing);
        })
        .catch(() => {
          // No se pudo reproducir la principal, volvemos al backup
          audio.src = BACKUP_STREAM_URL;
          audio.load();
          if (wasPlaying) {
            audio
              .play()
              .then(() => {
                setStreamStatus(StreamStatus.Playing);
              })
              .catch(() => {
                setStreamStatus(StreamStatus.Offline);
              });
          }
          isUsingBackupRef.current = true;
        });
    }, STREAM_CHECK_INTERVAL);

    return () => clearInterval(interval);
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
        return <PlayIcon className="w-10 h-10 text-amber-400" />;
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
      className="flex flex-col items-center justify-start pt-4 text-center min-h-screen bg-gray-900 text-white font-sans overflow-hidden bg-cover bg-center p-4"
      style={{
        backgroundImage:
          "linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent, rgba(0, 0, 0, 0.7)), url('https://i.imgur.com/E93AJqd.jpeg')",
      }}
    >
      <img
        src={`${(import.meta as any).env.BASE_URL}Logo.svg`}
        alt="Impacto Digital Logo"
        className="block w-72 md:w-80 h-40 md:h-44 mb-0 p-0 object-cover"
      />

      <button
        onClick={togglePlayPause}
        className="w-24 h-24 bg-black/40 rounded-full flex items-center justify-center mb-2 transition-transform duration-200 active:scale-95 overflow-hidden"
        aria-label={
          streamStatus === StreamStatus.Playing ? "Pausar" : "Reproducir"
        }
      >
        {renderStatusIcon()}
      </button>

      <div className="flex flex-col items-center my-6 space-y-4">
        <p className="text-sm tracking-widest text-white/80 h-4">
          {getStatusText()}
        </p>
        <p className="text-white text-lg h-6">{nowPlaying}</p>
      </div>

      <div className="flex items-center space-x-3 w-full max-w-xs mt-6">
        <VolumeIcon className="w-6 h-6 text-amber-400" />
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-amber-400"
          aria-label="Control de volumen"
        />
      </div>
      
      {/* Iconos de redes sociales */}
      <div className="mt-1 ">
        <SocialIcons />
      </div>

      <div className="mt-3 pt-6 w-full flex items-center justify-center">
        <span className="inline-block bg-gradient-to-r from-red-600 to-red-500 text-white text-sm font-semibold px-4 py-2 rounded-full shadow-md tracking-wide text-center max-w-xs">
          La Radio del Pueblo de Dios
          <span className="block text-xs font-semibold opacity-90">
            Renovando Tu Vida.
          </span>
        </span>
      </div>
      {/* WhatsApp button aligned to the right */}
      <div className="w-full flex justify-end mt-4">
        <a
          href="https://wa.me/584267793042"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center bg-green-500 hover:bg-green-600 text-white px-3 py-2 pt-2 rounded-full shadow-md transition"
          aria-label="Contactar por WhatsApp"
        >
          <svg
            className="w-5 h-5 mr-2"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path d="M20.52 3.48A11.93 11.93 0 0012 0C5.373 0 .01 5.373 0 12c0 2.116.55 4.142 1.6 5.95L0 24l6.264-1.627A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12 0-3.204-1.248-6.206-3.48-8.52zM12 22.08c-1.9 0-3.74-.5-5.36-1.44l-.38-.23-3.72.97.99-3.62-.24-.37A9.07 9.07 0 013 11.99c0-5 4.01-9.01 9-9.01 2.41 0 4.68.94 6.39 2.66A8.99 8.99 0 0121 11.99c0 4.97-4.03 9-9 9.01z" />
            <path d="M17.3 14.07c-.28-.14-1.65-.81-1.9-.9-.26-.09-.45-.14-.64.14-.2.28-.78.9-.96 1.08-.18.18-.36.2-.64.07-.28-.14-1.18-.43-2.25-1.39-.83-.74-1.39-1.66-1.55-1.94-.16-.28-.02-.43.12-.57.12-.12.28-.31.42-.47.14-.16.19-.28.28-.46.09-.18.05-.35-.02-.49-.07-.14-.64-1.54-.88-2.12-.23-.56-.47-.48-.64-.49l-.55-.01c-.18 0-.47.07-.72.34-.25.28-.96.94-.96 2.3 0 1.36.98 2.68 1.12 2.86.14.18 1.94 3 4.7 4.2 2.76 1.2 2.76.8 3.26.75.5-.05 1.65-.67 1.88-1.32.23-.65.23-1.2.16-1.32-.07-.12-.26-.18-.54-.32z" />
          </svg>
          <span className="text-sm font-medium">Contactar</span>
        </a>
      </div>
      
      {/* Botón de instalación para PWA */}
      <InstallButton />
    </div>
  );
};

export default App;
