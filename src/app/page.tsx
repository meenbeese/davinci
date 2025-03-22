"use client";

import VoiceSettingsPopup from "@/components/VoiceSettingsPopup";
import * as React from "react";
import { FiVolume2, FiSettings, FiUploadCloud } from "react-icons/fi";

export default function Home() {
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [utterance, setUtterance] = React.useState<SpeechSynthesisUtterance | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);

  React.useEffect(() => {
    const utterance = new SpeechSynthesisUtterance();
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find((voice) => voice.lang.includes("en-"));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    setUtterance(utterance);

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const handleVoiceClick = () => {
    if (utterance) {
      const text = "This is a sample text for voice synthesis.";
      utterance.text = text;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceSettingsClick = () => {
    setIsSettingsOpen(true);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedFiles(filesArray);
      console.log("Selected files:", filesArray);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-12 row-start-2 items-center sm:items-center">
        {/* File Upload Area */}
        <div className="flex flex-col items-center gap-4">
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center w-full max-w-md p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition"
          >
            <FiUploadCloud className="text-4xl text-blue-500 mb-2" />
            <p className="text-lg font-medium text-gray-700">
              Drag & drop files or{" "}
              <span className="text-blue-500 underline">Browse</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Supported formats: JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word, PPT
            </p>
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".jpeg,.png,.gif,.mp4,.pdf,.psd,.ai,.docx,.pptx"
            multiple
            className="hidden"
            onChange={handleFileChange}
          />
          {selectedFiles.length > 0 && (
            <div className="mt-4 text-sm text-gray-600">
              <p>Selected Files:</p>
              <ul className="list-disc pl-5">
                {selectedFiles.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-4 items-center flex-wrap justify-center">
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-12 px-6 w-auto space-x-2"
            onClick={() => handleVoiceClick()}
            rel="noopener noreferrer"
          >
            <span>Voice</span> <FiVolume2 />
          </a>

          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-12 px-6 w-auto space-x-2"
            onClick={() => handleVoiceSettingsClick()}
            rel="noopener noreferrer"
          >
            <span>Voice Settings</span> <FiSettings />
          </a>
        </div>
      </main>

      {/* Voice Settings Popup */}
      {utterance && (
        <VoiceSettingsPopup
          utterance={utterance}
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </div>
  );
}
