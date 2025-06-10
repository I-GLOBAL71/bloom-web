import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { AuthForm } from '../components/auth/AuthForm';
import { useAuth } from '../contexts/AuthContext';

export const HomePage: React.FC = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  const openAuth = () => setIsAuthOpen(true);
  const closeAuth = () => setIsAuthOpen(false);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Main content */}
      <div className="relative px-6 lg:px-8">
        <div className="mx-auto max-w-7xl py-20 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Découvrez Bloom
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Une nouvelle façon de gérer vos projets et collaborer avec votre équipe.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={isAuthenticated ? () => window.location.href = '/app/dashboard' : openAuth}
                className="rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105"
              >
                {isAuthenticated ? 'Accéder au Dashboard' : 'Commencer maintenant'}
              </button>
              <a href="#features" className="text-base font-semibold leading-7 text-gray-900 hover:text-blue-600 transition-colors duration-200">
                En savoir plus <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Floating authentication button */}
      {!isAuthenticated && (
        <button
          onClick={openAuth}
          className="fixed bottom-8 right-8 flex items-center space-x-2 bg-white/90 backdrop-blur-sm text-gray-900 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 group"
        >
          <span className="text-sm font-medium">Se connecter</span>
          <svg
            className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-200"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}

      {/* Authentication modal */}
      <Transition appear show={isAuthOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeAuth}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                  <div className="relative">
                    <button
                      onClick={closeAuth}
                      className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                    <AuthForm />
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* Features section */}
      <section id="features" className="py-24 bg-white/50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="group hover:bg-white/80 p-6 rounded-2xl transition-all duration-200">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Collaboration en temps réel
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Travaillez ensemble sur vos projets avec une synchronisation instantanée.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="group hover:bg-white/80 p-6 rounded-2xl transition-all duration-200">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Analytics avancés
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Suivez la progression de vos projets avec des analyses détaillées.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="group hover:bg-white/80 p-6 rounded-2xl transition-all duration-200">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900">
                  Sécurité renforcée
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Protection de vos données avec un chiffrement de bout en bout.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;