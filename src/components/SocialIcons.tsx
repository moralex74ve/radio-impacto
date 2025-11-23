import React from 'react';
import { ShareButton } from './ShareButton';

export const SocialIcons = () => {
  return (
    <div className="flex justify-center items-center space-x-4 mt-2">
      {/* Instagram */}
      <a 
        href="https://www.instagram.com/impactodigitalfm/" 
        target="_blank" 
        rel="noopener noreferrer"
        className="group transition-transform duration-200 hover:scale-110"
        aria-label="Instagram de Impacto Digital FM"
      >
        <img
          src={`${(import.meta as any).env.BASE_URL}instagram.svg`}
          alt="Instagram de Impacto Digital FM"
          className="w-12 h-9"
        />
      </a>
      
      {/* YouTube */}
      <a 
        href="https://www.youtube.com/@ImpactoDigitalFM" 
        target="_blank" 
        rel="noopener noreferrer"
        className="group transition-transform duration-200 hover:scale-110"
        aria-label="Canal de YouTube de Impacto Digital FM"
      >
        <svg className="w-8 h-9" viewBox="0 0 24 24" aria-hidden="true">
          <path 
            fill="#FF0000"
            d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
          />
          <path 
            fill="#FFFFFF"
            d="M9.545 15.568L15.818 12 9.545 8.432z"
          />
        </svg>
      </a>
      
      {/* Botón de Compartir */}
      <ShareButton />
    </div>
  );
};
