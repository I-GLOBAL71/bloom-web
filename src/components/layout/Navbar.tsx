import React from 'react';

interface NavbarProps {
  onAuthClick: () => void;
}

export function Navbar({ onAuthClick }: NavbarProps) {
  return (
    <nav className="backdrop-blur-md bg-white/30 fixed w-full z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-pink-500 bg-clip-text text-transparent">
            Bloom
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-800 hover:text-pink-500 transition-colors">Comment ça marche</a>
            <a href="#" className="text-gray-800 hover:text-pink-500 transition-colors">Témoignages</a>
            <a href="#" className="text-gray-800 hover:text-pink-500 transition-colors">Blog</a>
          </div>
          <div className="space-x-4">
            <button 
              onClick={onAuthClick}
              className="px-6 py-2 text-pink-600 hover:text-pink-700 transition-colors"
            >
              Connexion
            </button>
            <button 
              onClick={onAuthClick}
              className="px-6 py-2 bg-gradient-to-r from-amber-400 to-pink-500 text-white rounded-full hover:opacity-90 transition-opacity shadow-lg"
            >
              S'inscrire
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}