import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const CreditBalance = () => {
  const { petals } = useSelector((state: RootState) => state.credits);

  return (
    <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg shadow p-6 text-white">
      <h2 className="text-2xl font-bold mb-2">Votre solde</h2>
      <p className="text-4xl font-bold mb-4">{petals} pétales</p>
      <p className="text-sm opacity-80">
        Utilisez vos pétales pour booster votre expérience Bloom
      </p>
    </div>
  );
};

export default CreditBalance;
