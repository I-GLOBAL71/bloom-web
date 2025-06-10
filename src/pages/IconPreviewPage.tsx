import FlowerIconsPreview from '../components/ui/FlowerIconsPreview';

export const IconPreviewPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sélection d'Icône de Fleur</h1>
          <p className="text-gray-600">
            Choisissez parmi une variété d'icônes de fleurs de différentes bibliothèques.
            Cliquez sur une icône pour voir ses différentes variations et couleurs.
          </p>
        </header>

        <FlowerIconsPreview />

        <footer className="mt-8 text-center text-gray-600 text-sm">
          <p>Chaque icône est présentée avec différentes tailles et couleurs pour vous aider à faire le meilleur choix.</p>
          <p>Les icônes sont regroupées par bibliothèque pour une meilleure organisation.</p>
        </footer>
      </div>
    </div>
  );
};