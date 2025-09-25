import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ArrowsRightLeftIcon } from './Icons';

interface ImageComparatorProps {
  original: string | null;
  enhanced: string | null;
}

const ImageCard: React.FC<{ src: string | null; title: string; isPlaceholder?: boolean }> = ({ src, title, isPlaceholder = false }) => (
    <div className="flex flex-col items-center gap-4 w-full">
      <h3 className="text-xl font-semibold text-gray-300">{title}</h3>
      <div className="w-full aspect-square bg-gray-800 rounded-lg overflow-hidden border-2 border-gray-700 flex items-center justify-center">
        {src ? (
          <img src={src} alt={title} className="w-full h-full object-contain" />
        ) : isPlaceholder && (
           <div className="w-full h-full flex items-center justify-center p-4 text-center">
              <p className="text-gray-500">The AI-enhanced image will appear here.</p>
           </div>
        )}
      </div>
    </div>
  );

export const ImageComparator: React.FC<ImageComparatorProps> = ({ original, enhanced }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!containerRef.current || !isDragging) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    const currentRef = containerRef.current;
    
    const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const handleTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [handleMove]);

  if (!original) return null;
  if (!enhanced) {
    return (
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8 p-4 bg-gray-900/50 rounded-xl">
        <ImageCard src={original} title="Original" />
        <ImageCard src={null} title="Enhanced" isPlaceholder={true}/>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div
        ref={containerRef}
        className="relative w-full aspect-square rounded-lg overflow-hidden select-none cursor-ew-resize border-2 border-gray-700"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <img
          src={original}
          alt="Original"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          draggable="false"
        />
        <div
          className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none"
          style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
        >
          <img
            src={enhanced}
            alt="Enhanced"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            draggable="false"
          />
        </div>
        <div
          className="absolute top-0 bottom-0 w-1 bg-white/75 cursor-ew-resize"
          style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 w-12 h-12 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl text-gray-800">
            <ArrowsRightLeftIcon className="w-6 h-6" />
          </div>
        </div>
        <div className="absolute top-3 left-3 px-3 py-1 bg-black/60 text-white rounded-full pointer-events-none text-sm font-semibold">Original</div>
        <div className="absolute top-3 right-3 px-3 py-1 bg-black/60 text-white rounded-full pointer-events-none text-sm font-semibold">Enhanced</div>
      </div>
    </div>
  );
};