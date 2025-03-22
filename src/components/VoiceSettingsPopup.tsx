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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Voice Settings</h2>
        <div className="flex flex-col gap-4">
          <label className="flex flex-col">
            <span>Rate</span>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              defaultValue={utterance.rate}
              onChange={handleRateChange}
            />
          </label>
          <label className="flex flex-col">
            <span>Pitch</span>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              defaultValue={utterance.pitch}
              onChange={handlePitchChange}
            />
          </label>
          <label className="flex flex-col">
            <span>Volume</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              defaultValue={utterance.volume}
              onChange={handleVolumeChange}
            />
          </label>
        </div>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}
