import React from 'react';
import { EnhancementMode } from '../services/geminiService';
import { WandIcon, FaceIcon, LandscapeIcon } from './Icons';

interface ModeSelectorProps {
  selectedMode: EnhancementMode | null;
  onSelectMode: (mode: EnhancementMode) => void;
}

type Mode = {
  id: EnhancementMode;
  title: string;
  description: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
};

const modes: Mode[] = [
  {
    id: 'face',
    title: 'Face Focus',
    description: 'Ideal for portraits. Reconstructs facial details, skin texture, and sharpens eyes.',
    icon: FaceIcon,
  },
  {
    id: 'landscape',
    title: 'Vivid Landscape',
    description: 'Perfect for scenery. Enhances colors, sky details, and atmospheric depth.',
    icon: LandscapeIcon,
  },
  {
    id: 'general',
    title: 'General Pro',
    description: 'A versatile choice for any photo. Balances sharpness, lighting, and color.',
    icon: WandIcon,
  },
];

export const ModeSelector: React.FC<ModeSelectorProps> = ({ selectedMode, onSelectMode }) => {
  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-blue-300 to-indigo-400 text-transparent bg-clip-text">Choose Enhancement Mode</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {modes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => onSelectMode(mode.id)}
            className={`p-6 bg-gray-800 rounded-2xl border-2 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/20 text-left flex flex-col items-center text-center
              ${selectedMode === mode.id ? 'border-blue-500 ring-2 ring-blue-500/50 bg-gray-700/50' : 'border-gray-700'}`}
          >
            <mode.icon className="w-10 h-10 mb-4 text-blue-400" />
            <h3 className="text-xl font-semibold text-white mb-2">{mode.title}</h3>
            <p className="text-gray-400 text-sm">{mode.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};