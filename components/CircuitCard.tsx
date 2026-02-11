
import React from 'react';

interface Props {
  title?: string;
  children: React.ReactNode;
  className?: string;
  accent?: 'green' | 'red' | 'blue' | 'yellow';
}

export const CircuitCard: React.FC<Props> = ({ title, children, className = '', accent = 'blue' }) => {
  const accentClasses = {
    green: 'border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.1)]',
    red: 'border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]',
    blue: 'border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]',
    yellow: 'border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.1)]',
  };

  return (
    <div className={`relative bg-[#16161a] border rounded-xl overflow-hidden ${accentClasses[accent]} ${className}`}>
      {title && (
        <div className="px-4 py-2 bg-black/20 border-b border-inherit flex justify-between items-center">
          <h3 className="font-orbitron text-xs font-bold uppercase tracking-widest opacity-80">{title}</h3>
          <div className="flex gap-1">
            <div className={`w-2 h-2 rounded-full bg-${accent}-500 opacity-50`}></div>
            <div className="w-2 h-2 rounded-full bg-gray-600"></div>
          </div>
        </div>
      )}
      <div className="p-4">
        {children}
      </div>
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20"></div>
    </div>
  );
};
