import React from 'react';
import { DownloadIcon, SparklesIcon, TrashIcon } from './Icons';

interface ActionPanelProps {
  onEnhance: () => void;
  onDownload: () => void;
  onClear: () => void;
  isEnhancing: boolean;
  isEnhanced: boolean;
  isModeSelected: boolean;
}

const Button: React.FC<React.PropsWithChildren<React.ButtonHTMLAttributes<HTMLButtonElement>>> = ({ children, className, ...props }) => (
  <button
    {...props}
    className={`flex items-center justify-center gap-2 px-5 sm:px-6 py-3 font-semibold text-white rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-lg ${className || ''}`}
  >
    {children}
  </button>
);


export const ActionPanel: React.FC<ActionPanelProps> = ({ onEnhance, onDownload, onClear, isEnhancing, isEnhanced, isModeSelected }) => {
  return (
    <div className="w-full max-w-lg flex flex-wrap justify-center items-center gap-3 sm:gap-4 p-4 bg-gray-800/60 rounded-xl shadow-lg">
       <Button
        onClick={onClear}
        className="bg-gradient-to-br from-red-500 to-red-700 focus:ring-red-400/50"
        title="Start Over"
      >
        <TrashIcon className="w-5 h-5" />
        <span className="hidden sm:inline">Start Over</span>
      </Button>
      <Button
        onClick={onEnhance}
        disabled={isEnhancing || !isModeSelected}
        className="bg-gradient-to-br from-blue-500 to-blue-700 focus:ring-blue-400/50 text-lg px-8 py-4"
        title={!isModeSelected ? "Please select an enhancement mode first" : "Enhance Image"}
      >
        <SparklesIcon className="w-6 h-6" />
        {isEnhancing ? 'Enhancing...' : 'Enhance'}
      </Button>
      <Button
        onClick={onDownload}
        disabled={!isEnhanced || isEnhancing}
        className="bg-gradient-to-br from-green-500 to-green-700 focus:ring-green-400/50"
      >
        <DownloadIcon className="w-5 h-5" />
        <span className="hidden sm:inline">Download</span>
      </Button>
    </div>
  );
};