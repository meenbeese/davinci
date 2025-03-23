// LoadingOverlay.tsx
import React, { useState, useEffect } from 'react';

const LoadingOverlay = () => {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [fadeState, setFadeState] = useState('in');
  
  const loadingMessages = [
    "Generating story...",
    "Personalizing to your learning style...",
    "Making sure you'll love it...",
    "Creating magical worlds...",
    "Weaving tales just for you...",
    "Adding creative elements..."
  ];
  
  // Simulate progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prevProgress => {
        const newProgress = prevProgress + (1.5);
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 200);
    
    return () => clearInterval(interval);
  }, []);
  
  // Rotate messages with fade effect
  useEffect(() => {
    const fadeInterval = setInterval(() => {
      if (fadeState === 'in') {
        setFadeState('out');
      } else {
        setMessageIndex(prevIndex => (prevIndex + 1) % loadingMessages.length);
        setFadeState('in');
      }
    }, 2500);
    
    return () => clearInterval(fadeInterval);
  }, [fadeState]);
  
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 rounded-xl">
      <div className="bg-black rounded-xl p-8 w-[85%] max-w-[600px] shadow-2xl">
        <div 
          className={`text-white text-center text-xl mb-6 font-medium transition-opacity duration-500 ${fadeState === 'in' ? 'opacity-100' : 'opacity-0'}`}
        >
          {loadingMessages[messageIndex]}
        </div>
        <div className="h-3 bg-gray-800 rounded-full overflow-hidden relative">
          <div 
            className="h-full bg-gradient-to-r from-white to-white/90 rounded-full transition-all duration-300 ease-out relative"
            style={{ 
              width: `${progress}%`,
              boxShadow: "0 0 10px 1px rgba(255,255,255,0.7), 0 0 14px 3px rgba(255,255,255,0.3)"
            }}
          >
            {/* Glowing edge */}
            <div 
              className="absolute right-0 top-0 h-full w-4 bg-white rounded-full blur-sm"
              style={{
                boxShadow: "0 0 15px 5px rgba(255,255,255,0.9)"
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;