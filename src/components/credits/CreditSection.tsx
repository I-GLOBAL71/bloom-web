import CreditBalance from './CreditBalance';
import CreditPackages from './CreditPackages';
import SpendingOptions from './SpendingOptions';
import TransactionHistory from './TransactionHistory';

const CreditSection = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-8">
        <CreditBalance />
        <TransactionHistory />
      </div>
      
      <div className="space-y-8">
        <CreditPackages />
        <SpendingOptions />
      </div>
    </div>
  );
};

export default CreditSection;
