import { useDispatch, useSelector } from 'react-redux';
import { spendPetals } from './store/creditStore';
import { RootState } from '../../store';

const spendingOptions = [
  {
    id: 1,
    label: 'Booster mon profil',
    cost: 50,
    description: 'Augmentez votre visibilité pendant 24h',
  },
  {
    id: 2,
    label: 'Voir qui m\'a liké',
    cost: 100,
    description: 'Débloquez la liste des personnes qui vous ont liké',
  },
  {
    id: 3,
    label: 'Envoyer un super like',
    cost: 25,
    description: 'Attirez l\'attention avec un like spécial',
  },
];

const SpendingOptions = () => {
  const dispatch = useDispatch();
  const { petals } = useSelector((state: RootState) => state.credits);

  const handleSpend = (optionId: number) => {
    const selectedOption = spendingOptions.find(opt => opt.id === optionId);
    if (selectedOption) {
      if (petals >= selectedOption.cost) {
        dispatch(spendPetals(selectedOption.cost));
        // TODO: Implémenter l'effet de l'option choisie
      } else {
        alert('Pas assez de pétales !');
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Dépenser mes pétales</h2>
      
      <div className="space-y-3">
        {spendingOptions.map(option => (
          <div
            key={option.id}
            className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
          >
            <div>
              <h3 className="font-medium">{option.label}</h3>
              <p className="text-sm text-gray-500">{option.description}</p>
            </div>
            
            <button
              onClick={() => handleSpend(option.id)}
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg"
            >
              {option.cost} pétales
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SpendingOptions;
