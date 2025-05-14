import React, { useState } from 'react';
import BudgetTrackingPage from './BudgetTrackingPage';

const BudgetTrackingPageWrapper = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to trigger a refresh of the budget data
  const refreshBudget = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  // Store the refresh function in localStorage so it can be accessed by other components
  React.useEffect(() => {
    localStorage.setItem('refreshBudget', refreshBudget.toString());
    return () => {
      localStorage.removeItem('refreshBudget');
    };
  }, []);

  return <BudgetTrackingPage refreshTrigger={refreshTrigger} />;
};

export default BudgetTrackingPageWrapper; 