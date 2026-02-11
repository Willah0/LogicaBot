
import React from 'react';
import { AlgorithmStatus } from '../types';

interface Props {
  status: AlgorithmStatus;
}

export const StatusBadge: React.FC<Props> = ({ status }) => {
  const config = {
    [AlgorithmStatus.SUCCESS]: {
      label: '🟢 MISSÃO CUMPRIDA',
      classes: 'bg-green-900/50 border-green-500 text-green-400',
    },
    [AlgorithmStatus.SYNTAX_ERROR]: {
      label: '🟡 ERRO DE SINTAXE',
      classes: 'bg-yellow-900/50 border-yellow-500 text-yellow-400',
    },
    [AlgorithmStatus.SYSTEM_CRASH]: {
      label: '🔴 CRASH DO SISTEMA',
      classes: 'bg-red-900/50 border-red-500 text-red-400',
    },
  };

  const { label, classes } = config[status];

  return (
    <span className={`px-3 py-1 border rounded-full text-xs font-bold font-orbitron tracking-wider ${classes}`}>
      {label}
    </span>
  );
};
