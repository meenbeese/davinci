import React from "react";

interface VoiceSettingsPopupProps {
  utterance: SpeechSynthesisUtterance;
  isOpen: boolean;
  onClose: () => void;
}

export default function VoiceSettingsPopup({
  utterance,
  isOpen,
  onClose,
}: VoiceSettingsPopupProps) {
  if (!isOpen) return null;

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    utterance.rate = parseFloat(e.target.value);
  };

  const handlePitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    utterance.pitch = parseFloat(e.target.value);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    utterance.volume = parseFloat(e.target.value);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Voice Settings
        </h2>
        <div className="flex flex-col gap-6">
          {/* Rate Slider */}
          <div className="flex flex-col gap-2">
            <label className="text-white font-medium">Rate</label>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              defaultValue={utterance.rate}
              onChange={handleRateChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Pitch Slider */}
          <div className="flex flex-col gap-2">
            <label className="text-white font-medium">Pitch</label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              defaultValue={utterance.pitch}
              onChange={handlePitchChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* Volume Slider */}
          <div className="flex flex-col gap-2">
            <label className="text-white font-medium">Volume</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              defaultValue={utterance.volume}
              onChange={handleVolumeChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
