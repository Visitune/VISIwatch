import React from 'react';
import { RiskLevel } from '../types';

export const RiskBadge: React.FC<{ level: RiskLevel }> = ({ level }) => {
  const styles = {
    [RiskLevel.LOW]: 'bg-blue-100 text-blue-800 border-blue-200',
    [RiskLevel.MEDIUM]: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    [RiskLevel.HIGH]: 'bg-orange-100 text-orange-800 border-orange-200',
    [RiskLevel.CRITICAL]: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[level]}`}>
      {level}
    </span>
  );
};
