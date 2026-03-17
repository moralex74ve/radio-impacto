import React from 'react';
import { ShareButton } from './ShareButton';

export const SocialIcons = () => {
  const links = {
    facebook: {
      web: "https://www.facebook.com/ImpactoDigital106.9/",
      ios: "fb://profile/ImpactoDigital106.9",
      android: "intent://www.facebook.com/ImpactoDigital106.9/#Intent;package=com.facebook.katana;scheme=https;S.browser_fallback_url=https%3A%2F%2Fwww.facebook.com%2FImpactoDigital106.9%2F;end"
    },
    instagram: {
      web: "https://www.instagram.com/impactodigitalfm/",
      ios: "instagram://user?username=impactodigitalfm",
      android: "intent://www.instagram.com/impactodigitalfm/#Intent;package=com.instagram.android;scheme=https;S.browser_fallback_url=https%3A%2F%2Fwww.instagram.com%2Fimpactodigitalfm%2F;end"
    },
    youtube: {
      web: "https://www.youtube.com/channel/UCx4MLsOlxBOWSRwIxLAjf9A",
      ios: "youtube://www.youtube.com/channel/UCx4MLsOlxBOWSRwIxLAjf9A",
      android: "intent://www.youtube.com/channel/UCx4MLsOlxBOWSRwIxLAjf9A/#Intent;package=com.google.android.youtube;scheme=https;S.browser_fallback_url=https%3A%2F%2Fwww.youtube.com%2Fchannel%2FUCx4MLsOlxBOWSRwIxLAjf9A;end"
    }
  };

  const handleDeepLink = (e: React.MouseEvent<HTMLAnchorElement>, platform: keyof typeof links) => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isAndroid) {
      e.preventDefault();
      // Brave en Android tiene problemas con los enlaces 'intent://' directos para YouTube.
      // Para YouTube usamos la URL web estándar (https), la cual Android redirigirá a la app automáticamente 
      // si el usuario lo tiene configurado, siendo mucho más compatible con Brave.
      if (platform === 'youtube') {
        window.open(links[platform].web, '_blank');
      } else {
        // Facebook e Instagram suelen funcionar mejor con intents para forzar la app
        window.location.href = links[platform].android;
      }
    } else if (isIOS) {
      e.preventDefault();
      const start = Date.now();
      
      // Intentamos abrir la app en iOS
      window.location.href = links[platform].ios;

      // Timeout como fallback: si la app no abre (el JS no se congela), abrimos web
      setTimeout(() => {
        if (Date.now() - start < 1500) {
          window.open(links[platform].web, '_blank');
        }
      }, 500);
    }
    // En escritorio, dejamos que actúe el comportamiento por defecto del link (href + target=_blank)
  };

  return (
    <div className="flex justify-center items-center space-x-4 mt-2">
      {/* Facebook */}
      <a
        href={links.facebook.web}
        onClick={(e) => handleDeepLink(e, 'facebook')}
        target="_blank"
        rel="noopener noreferrer"
        className="group transition-transform duration-200 hover:scale-110"
        aria-label="Facebook de Radio Impacto Digital"
      >
        <div className="w-10 h-10 rounded-full bg-[#1877F2] flex items-center justify-center shadow-md">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </div>
      </a>

      {/* Instagram */}
      <a
        href={links.instagram.web}
        onClick={(e) => handleDeepLink(e, 'instagram')}
        target="_blank"
        rel="noopener noreferrer"
        className="group transition-transform duration-200 hover:scale-110"
        aria-label="Instagram de Radio Impacto Digital"
      >
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center shadow-md">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        </div>
      </a>

      {/* YouTube */}
      <a
        href={links.youtube.web}
        onClick={(e) => handleDeepLink(e, 'youtube')}
        target="_blank"
        rel="noopener noreferrer"
        className="group transition-transform duration-200 hover:scale-110"
        aria-label="Canal de YouTube de Radio Impacto Digital"
      >
        <div className="w-10 h-10 rounded-full bg-[#FF0000] flex items-center justify-center shadow-md">
          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        </div>
      </a>

      {/* APK Download (Play Store Icon) */}
      <a
        href={`${(import.meta as any).env.BASE_URL}ImpactoDigitalFM.apk`}
        download="ImpactoDigitalFM.apk"
        className="group transition-transform duration-200 hover:scale-110"
        aria-label="Descargar aplicación para Android (APK)"
      >
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg border border-white/20 overflow-hidden">
          <svg className="w-7 h-7" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#4285F4" d="M46.105,21.657L11.535,1.751C10.74,1.294,9.757,1.294,8.963,1.751c-1.258,0.725-1.963,2.053-1.963,3.504V42.74 c0,1.451,0.706,2.779,1.963,3.504c0.794,0.457,1.777,0.457,2.571,0.001l34.57-19.904 c1.256-0.723,2-2.052,2-3.502S47.361,22.381,46.105,21.657z" opacity="0.1"/>
            <path fill="#EA4335" d="M10.246,46.17c-0.421,0-0.841-0.111-1.222-0.33c-0.463-0.267-0.814-0.671-0.988-1.139L24.161,28.6l3.961,3.961 L11.468,45.839C11.087,46.06,10.667,46.17,10.246,46.17z"/>
            <path fill="#FBBC04" d="M46.105,26.343l-13.3-7.665l-4.683,4.683l4.683,4.683l13.3-7.665c0.559-0.322,0.895-0.908,0.895-1.519 S46.664,26.665,46.105,26.343z"/>
            <path fill="#34A853" d="M28.122,17.139l-3.961,3.961L8.036,4.975c0.174-0.468,0.525-0.871,0.988-1.139 c0.381-0.22,0.801-0.33,1.222-0.33c0.421,0,0.841,0.11,1.222,0.33L28.122,17.139z"/>
            <path fill="#4285F4" d="M8.036,4.975C7.382,6.155,7,7.531,7,9v30c0,1.469,0.382,2.845,1.036,4.025L24.161,24.961L8.036,4.975z"/>
          </svg>
        </div>
      </a>

      {/* Botón de Compartir */}
      <ShareButton />
    </div>
  );
};
