import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const TransactionHistory = () => {
  const { transactions } = useSelector((state: RootState) => state.credits);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">Historique des transactions</h2>
      
      {transactions.length === 0 ? (
        <p className="text-gray-500">Aucune transaction pour le moment</p>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <p className="font-medium">{transaction.description}</p>
                <p className="text-sm text-gray-500">
                  {format(new Date(transaction.date), 'PPpp', { locale: fr })}
                </p>
              </div>
              
              <p className={`font-semibold ${
                transaction.type === 'earn' ? 'text-green-600' : 'text-red-600'
              }`}>
                {transaction.type === 'earn' ? '+' : '-'}{transaction.amount}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;
