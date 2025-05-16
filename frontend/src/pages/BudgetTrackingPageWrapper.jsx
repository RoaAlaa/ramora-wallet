import React, { useState } from 'react';
import BudgetTrackingPage from './BudgetTrackingPage';

const BudgetTrackingPageWrapper = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  
  const refreshBudget = () => {
    setRefreshTrigger(prev => prev + 1);
  };

 
  React.useEffect(() => {
    localStorage.setItem('refreshBudget', refreshBudget.toString());
    return () => {
      localStorage.removeItem('refreshBudget');
    };
  }, []);

  return <BudgetTrackingPage refreshTrigger={refreshTrigger} />;
};

export default BudgetTrackingPageWrapper; 