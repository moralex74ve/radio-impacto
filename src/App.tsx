import React, { useState, useRef, useEffect, useCallback } from "react";
import { StreamStatus } from "./types";
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
  const loadTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

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
    audio.preload = "none";
    audioRef.current = audio;

    console.log('[AUDIO] Inicializando Audio element con URL:', STREAM_URL);

    const handleLoadStart = () => {
      console.log('[AUDIO] Evento: loadstart - Comienza la carga');
      loadTimeoutRef.current = setTimeout(() => {
        console.log('[AUDIO] Timeout: Carga inicial demasiado lenta, reintentando...');
        if (audioRef.current && streamStatus === StreamStatus.Loading) {
          audioRef.current.src = STREAM_URL;
          audioRef.current.load();
        }
      }, 5000); // 5 segundos timeout
    };

    const handleProgress = () => {
      if (audio.buffered.length > 0) {
        const bufferedEnd = audio.buffered.end(audio.buffered.length - 1);
        const duration = audio.duration || 0;
        if (duration > 0) {
          console.log(`[AUDIO] Evento: progress - Buffer: ${(bufferedEnd / duration * 100).toFixed(1)}%`);
          // Si hay suficiente buffer y estamos en Loading, limpiar timeout
          if (streamStatus === StreamStatus.Loading && bufferedEnd > 5 && loadTimeoutRef.current) {
            console.log('[AUDIO] Buffer suficiente (>5s), limpiando timeout');
            clearTimeout(loadTimeoutRef.current);
            loadTimeoutRef.current = null;
          }
        }
      }
    };

    const handleWaiting = () => {
      console.log('[AUDIO] Evento: waiting - Buffering... (reproducción pausada por falta de datos)');
      // Si está waiting durante la carga inicial, establecer timeout para reintento
      if (streamStatus === StreamStatus.Loading) {
        if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
        loadTimeoutRef.current = setTimeout(() => {
          if (audioRef.current && streamStatus === StreamStatus.Loading) {
            console.log('[AUDIO] Waiting timeout: reintentando carga...');
            audioRef.current.src = STREAM_URL;
            audioRef.current.load();
          }
        }, 3000);
      }
    };

    const handleCanPlay = () => {
      console.log('[AUDIO] Evento: canplay - Puede reproducirse (buffer suficiente)');
      // Intentar reproducir automáticamente si está en estado Loading
      if (streamStatus === StreamStatus.Loading && audioRef.current) {
        audioRef.current.play().catch(() => {
          // Si falla, mantener el estado y esperar interacción del usuario
          console.log('[AUDIO] canplay: autoplay fallido, esperando interacción');
        });
      }
    };

    const handleCanPlayThrough = () => {
      console.log('[AUDIO] Evento: canplaythrough - Puede reproducirse sin interrupciones');
    };

    const handlePlaying = () => {
      console.log('[AUDIO] Evento: playing - Reproduciendo');
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
      retryCountRef.current = 0; // Resetear retries al lograr reproducir
      setStreamStatus(StreamStatus.Playing);
    };

    const handleError = (e: Event) => {
      console.error('[AUDIO] Evento: error - Error en reproducción:', e);
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
      // Reintentar en cualquier estado si no excedemos maxRetries
      if (retryCountRef.current < maxRetries && audioRef.current) {
        retryCountRef.current++;
        console.log(`[AUDIO] Error: reintento ${retryCountRef.current}/${maxRetries}`);
        setStreamStatus(StreamStatus.Loading);
        audioRef.current.src = STREAM_URL;
        audioRef.current.load();
      } else {
        console.log('[AUDIO] Error: max retries alcanzados');
        setStreamStatus(StreamStatus.Offline);
        retryCountRef.current = 0;
      }
    };

    const handlePause = () => {
      console.log('[AUDIO] Evento: pause - Pausado');
      // Solo actualizar estado si no estamos en Loading (evita conflictos)
      setStreamStatus(prev => prev !== StreamStatus.Loading ? StreamStatus.Paused : prev);
    };

    const handleEnded = () => {
      console.log('[AUDIO] Evento: ended - Fin del stream, reconectando...');
      // Para streams continuos, intentar reconectar automáticamente
      if (retryCountRef.current < maxRetries && audioRef.current) {
        retryCountRef.current++;
        setStreamStatus(StreamStatus.Loading);
        audioRef.current.src = STREAM_URL;
        audioRef.current.load();
      } else {
        setStreamStatus(StreamStatus.Offline);
        retryCountRef.current = 0;
      }
    };

    const handleStalled = () => {
      console.log('[AUDIO] Evento: stalled - Flujo de datos detenido');
      // Reintentar carga en cualquier estado si no excedemos maxRetries
      if (retryCountRef.current < maxRetries && audioRef.current) {
        retryCountRef.current++;
        console.log(`[AUDIO] Stalled: reintento ${retryCountRef.current}/${maxRetries}`);
        audioRef.current.src = STREAM_URL;
        audioRef.current.load();
        loadTimeoutRef.current = setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play().catch(() => {});
          }
        }, 3000);
      } else {
        console.log('[AUDIO] Stalled: max retries alcanzados');
        setStreamStatus(StreamStatus.Offline);
        retryCountRef.current = 0;
      }
    };

    const handleAbort = () => {
      console.log('[AUDIO] Evento: abort - Carga abortada');
      if (streamStatus === StreamStatus.Loading && loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };

    const handleEmptied = () => {
      console.log('[AUDIO] Evento: emptied - Buffer vaciado');
      if (streamStatus === StreamStatus.Loading && loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };

    const handleSuspend = () => {
      console.log('[AUDIO] Evento: suspend - Carga suspendida');
      if (streamStatus === StreamStatus.Loading && loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };

    const handleLoadedMetadata = () => {
      console.log('[AUDIO] Evento: loadedmetadata - Metadata cargada');
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
    };

    const handleLoadedData = () => {
      console.log('[AUDIO] Evento: loadeddata - Datos cargados');
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
    };

    // Aplicar volumen guardado inicialmente
    audio.volume = volume;

    // Agregar TODOS los event listeners
    audio.addEventListener("loadstart", handleLoadStart);
    audio.addEventListener("progress", handleProgress);
    audio.addEventListener("waiting", handleWaiting);
    audio.addEventListener("canplay", handleCanPlay);
    audio.addEventListener("canplaythrough", handleCanPlayThrough);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("error", handleError);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("stalled", handleStalled);
    audio.addEventListener("abort", handleAbort);
    audio.addEventListener("emptied", handleEmptied);
    audio.addEventListener("suspend", handleSuspend);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("loadeddata", handleLoadedData);

    // NO intentar autoplay aquí - se intentará cuando el usuario haga clic
    console.log('[AUDIO] Listo para reproducir a la espera de interacción del usuario');

    return () => {
      // Limpiar timeout de carga
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
      // Limpiar TODOS los event listeners para evitar fugas de memoria
      audio.removeEventListener("loadstart", handleLoadStart);
      audio.removeEventListener("progress", handleProgress);
      audio.removeEventListener("waiting", handleWaiting);
      audio.removeEventListener("canplay", handleCanPlay);
      audio.removeEventListener("canplaythrough", handleCanPlayThrough);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("stalled", handleStalled);
      audio.removeEventListener("abort", handleAbort);
      audio.removeEventListener("emptied", handleEmptied);
      audio.removeEventListener("suspend", handleSuspend);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("loadeddata", handleLoadedData);

      audio.pause();
      audio.src = "";
      audio.load();
      audioRef.current = null;
    };
  }, []); // Solo ejecutar una vez al montar



  useEffect(() => {
    return () => {
      // Limpiar cualquier timeout pendiente al desmontar el componente
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
    };
  }, []);

  // Limpiar timeout cuando el estado cambie a Playing o Paused
  useEffect(() => {
    if (streamStatus === StreamStatus.Playing || streamStatus === StreamStatus.Paused) {
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
      loadTimeoutRef.current = null;
    }
  }, [streamStatus]);

  // Manejar visibilidad de la pestaña - reintentar si vuelve a estar activa
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && streamStatus === StreamStatus.Loading) {
        console.log('[AUDIO] Pestaña visible, verificando estado...');
        // Si está loading y la pestaña vuelve a estar visible, verificar si el audio está cargado
        if (audioRef.current && audioRef.current.readyState >= 3) {
          console.log('[AUDIO] Audio listo, intentando reproducir...');
          audioRef.current.play().catch(() => {
            console.log('[AUDIO] Error al reproducir');
          });
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [streamStatus]);

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
      retryCountRef.current = 0; // Resetear retries al iniciar
      setStreamStatus(StreamStatus.Loading);
      // Limpiar cualquier timeout pendiente
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
      // Recargar el stream para obtener un punto fresco en vivo
      audioRef.current.src = STREAM_URL;
      audioRef.current.load();
      // Establecer timeout para detectar si la reproducción tarda demasiado
      loadTimeoutRef.current = setTimeout(() => {
        console.log('[AUDIO] Timeout en play(): reintentando carga...');
        if (audioRef.current && streamStatus === StreamStatus.Loading) {
          audioRef.current.src = STREAM_URL;
          audioRef.current.load();
        }
      }, 8000);
      audioRef.current.play().catch(() => {
        setStreamStatus(StreamStatus.Offline);
        if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
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
