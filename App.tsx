import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ImageComparator } from './components/ImageComparator';
import { ActionPanel } from './components/ActionPanel';
import { Loader } from './components/Loader';
import { enhanceImage as enhanceImageApi, EnhancementMode } from './services/geminiService';
import { ModeSelector } from './components/ModeSelector';

const loadingMessages = [
  "Consulting with AI artists...",
  "Sharpening details...",
  "Balancing colors...",
  "Adjusting lighting...",
  "Adding a touch of magic...",
  "Almost there, preparing the masterpiece...",
];

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  const [mode, setMode] = useState<EnhancementMode | null>(null);

  useEffect(() => {
    let intervalId: number | undefined;
    if (isLoading) {
      intervalId = window.setInterval(() => {
        setLoadingMessage(prev => {
          const currentIndex = loadingMessages.indexOf(prev);
          const nextIndex = (currentIndex + 1) % loadingMessages.length;
          return loadingMessages[nextIndex];
        });
      }, 2000);
    } else {
      setLoadingMessage(loadingMessages[0]);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isLoading]);

  const handleImageUpload = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImage(reader.result as string);
      setEnhancedImage(null);
      setError(null);
      setMode(null);
    };
    reader.readAsDataURL(file);
  };
  
  const handleStartOver = () => {
    setOriginalImage(null);
    setEnhancedImage(null);
    setError(null);
    setMode(null);
  };

  const handleEnhanceImage = useCallback(async () => {
    if (!originalImage || !mode) return;

    setIsLoading(true);
    setError(null);
    setEnhancedImage(null);

    try {
      const { base64Data, mimeType } = parseDataUrl(originalImage);
      const enhancedBase64 = await enhanceImageApi(base64Data, mimeType, mode);
      setEnhancedImage(`data:image/png;base64,${enhancedBase64}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, mode]);

  const parseDataUrl = (dataUrl: string): { base64Data: string; mimeType: string } => {
    const parts = dataUrl.split(',');
    const mimeType = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const base64Data = parts[1];
    return { base64Data, mimeType };
  };

  const handleDownload = () => {
    if (!enhancedImage) return;
    const link = document.createElement('a');
    link.href = enhancedImage;
    link.download = 'enhanced-image.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center p-4 sm:p-6 md:p-8">
      <Header />
      <main className="w-full max-w-7xl mx-auto flex flex-col items-center gap-8 mt-8">
        {!originalImage ? (
          <ImageUploader onImageUpload={handleImageUpload} />
        ) : (
          <>
            <ActionPanel
              onEnhance={handleEnhanceImage}
              onDownload={handleDownload}
              isEnhancing={isLoading}
              isEnhanced={!!enhancedImage}
              isModeSelected={!!mode}
              onClear={handleStartOver}
            />

            {error && (
              <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative w-full max-w-4xl text-center" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            {!isLoading && !enhancedImage && (
              <ModeSelector selectedMode={mode} onSelectMode={setMode} />
            )}

            {isLoading && (
              <div className="flex flex-col items-center justify-center gap-4 p-8">
                <Loader />
                <p className="text-lg text-blue-300 animate-pulse">{loadingMessage}</p>
              </div>
            )}
            
            <ImageComparator original={originalImage} enhanced={enhancedImage} />
          </>
        )}
      </main>
    </div>
  );
};

export default App;