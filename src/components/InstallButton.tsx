import { useState, useEffect, MouseEvent } from 'react';

// Interfaz para el evento de instalación de PWA
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // 1. Verificar si ya está en modo standalone (instalada y abierta como app)
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');

    // 2. Verificar si el usuario ya la marcó como instalada en esta sesión o permanentemente
    const wasInstalled = localStorage.getItem('pwa-installed') === 'true';
    const dismissedThisSession = sessionStorage.getItem('pwa-dismissed') === 'true';

    if (isStandalone || wasInstalled || dismissedThisSession) {
      setIsVisible(false);
      return;
    }

    const handler = (e: Event) => {
      // Previene que el navegador muestre el mensaje de instalación automática
      e.preventDefault();
      // Guarda el evento para que se pueda activar más tarde
      setDeferredPrompt(e as BeforeInstallPromptEvent);

      // Solo mostramos si no ha sido descartado en esta sesión
      if (!sessionStorage.getItem('pwa-dismissed')) {
        setIsVisible(true);
      }
    };

    const appInstalledHandler = () => {
      console.log('Aplicación instalada con éxito');
      setDeferredPrompt(null);
      setIsVisible(false);
      localStorage.setItem('pwa-installed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handler as any);
    window.addEventListener('appinstalled', appInstalledHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler as any);
      window.removeEventListener('appinstalled', appInstalledHandler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Muestra el mensaje de instalación
    try {
      await deferredPrompt.prompt();

      // Espera a que el usuario responda al mensaje
      const { outcome } = await deferredPrompt.userChoice;
      console.log(`User response to the install prompt: ${outcome}`);

      if (outcome === 'accepted') {
        localStorage.setItem('pwa-installed', 'true');
      }

      // Limpia el evento guardado
      setDeferredPrompt(null);
      // Oculta el botón
      setIsVisible(false);
    } catch (error) {
      console.error('Error al intentar instalar:', error);
    }
  };

  const handleDismiss = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Evita que el clic llegue al botón de instalar si está superpuesto
    setIsVisible(false);
    setIsDismissed(true);
    // Guardamos en sessionStorage para que no vuelva a aparecer en esta sesión
    sessionStorage.setItem('pwa-dismissed', 'true');
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div className="fixed bottom-6 left-4 right-4 md:right-auto md:w-auto z-50 flex items-center justify-center pointer-events-none">
      <div className="pointer-events-auto bg-gray-800 border border-amber-500/30 text-white p-3 rounded-2xl shadow-2xl flex items-center space-x-3 backdrop-blur-lg">
        <button
          onClick={handleInstallClick}
          className="bg-amber-500 hover:bg-amber-600 text-black font-bold py-2.5 px-5 rounded-xl shadow-lg flex items-center space-x-2 transition-all active:scale-95"
          aria-label="Instalar aplicación"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          <span className="text-sm">Instalar Aplicación</span>
        </button>

        <button
          onClick={handleDismiss}
          className="p-1 px-2 text-white/50 hover:text-white transition-colors"
          aria-label="Cerrar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};
