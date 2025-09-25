
import React from 'react';
import { SparklesIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="w-full text-center p-4">
      <div className="flex items-center justify-center gap-3">
        <SparklesIcon className="w-8 h-8 text-blue-400" />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 text-transparent bg-clip-text">
          AI Image Enhancer
        </h1>
      </div>
      <p className="mt-2 text-lg text-gray-400">by Mr/ Ahmed Wael</p>
    </header>
  );
};
