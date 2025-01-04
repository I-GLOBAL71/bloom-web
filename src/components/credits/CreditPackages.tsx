import { useDispatch } from 'react-redux';
import { addPetals } from './store/creditStore';

const packages = [
  {
    id: 1,
    petals: 100,
    price: 4.99,
    bonus: 0,
    popular: false,
  },
  {
    id: 2,
    petals: 250,
    price: 9.99,
    bonus: 25,
    popular: true,
  },
  {
    id: 3,
    petals: 500,
    price: 19.99,
    bonus: 100,
    popular: false,
  },
];

const CreditPackages = () => {
  const dispatch = useDispatch();

  const handlePurchase = (packageId: number) => {
    const selectedPackage = packages.find(pkg => pkg.id === packageId);
    if (selectedPackage) {
      const totalPetals = selectedPackage.petals + selectedPackage.bonus;
      dispatch(addPetals(totalPetals));
      // TODO: Intégrer le système de paiement
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Acheter des pétales</h2>
      
      {packages.map(pkg => (
        <div
          key={pkg.id}
          className={`relative p-6 border rounded-lg ${
            pkg.popular ? 'border-pink-500' : 'border-gray-200'
          }`}
        >
          {pkg.popular && (
            <div className="absolute top-0 right-0 bg-pink-500 text-white px-2 py-1 text-xs rounded-bl-lg">
              Populaire
            </div>
          )}
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold">
                {pkg.petals} pétales {pkg.bonus > 0 && `+ ${pkg.bonus} bonus`}
              </h3>
              <p className="text-gray-500">${pkg.price.toFixed(2)}</p>
            </div>
            
            <button
              onClick={() => handlePurchase(pkg.id)}
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg"
            >
              Acheter
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CreditPackages;
