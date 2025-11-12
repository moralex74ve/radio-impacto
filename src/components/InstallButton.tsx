import { useState, useEffect } from 'react';

export const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      // Previene que el navegador muestre el mensaje de instalación automática
      e.preventDefault();
      // Guarda el evento para que se pueda activar más tarde
      setDeferredPrompt(e);
      // Muestra el botón de instalación
      setIsVisible(true);
    };

    window.addEventListener('beforeinstallprompt', handler as any);

    // Comprueba si la aplicación ya está instalada
    window.addEventListener('appinstalled', () => {
      console.log('Aplicación instalada con éxito');
      setDeferredPrompt(null);
      setIsVisible(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler as any);
      window.removeEventListener('appinstalled', () => {});
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    
    // Muestra el mensaje de instalación
    deferredPrompt.prompt();
    
    // Espera a que el usuario responda al mensaje
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    
    // Limpia el evento guardado
    setDeferredPrompt(null);
    // Oculta el botón
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={handleInstallClick}
      className="fixed bottom-4 left-4 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded-full shadow-lg flex items-center space-x-2 z-50"
      aria-label="Instalar aplicación"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
      <span>Instalar</span>
    </button>
  );
};
