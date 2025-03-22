"use client";

import * as React from "react";
import { FiVolume2, FiSettings, FiUploadCloud } from 'react-icons/fi'; // Feather icons

import { textToSpeech } from "./text_to_speech";
import VoiceSettingsPopup from "./VoiceSettingsPopup.tsx";

const pages = ["READING TEXT OUTLOUD", "YES I AM ON THE SECOND PAGE", "Page 3", "Page 4"];
// const curr_left_page = 0;
// const settingsOrder = ['voice', 'lang', 'rate', 'pitch', 'volume'];

export default function Home() {
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [utterance, setUtterance] = React.useState<SpeechSynthesisUtterance | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [curr_left_page, setCurrLeftPage] = React.useState(0);

  React.useEffect(() => {
    const utterance = new SpeechSynthesisUtterance();
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    // Load voices when available
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find((voice) => voice.lang.includes("en-"));
      if (englishVoice) {
        utterance.voice = englishVoice;
      }
    };
    
    // Try loading immediately
    loadVoices();
    
    // Also set up event listener for when voices change
    window.speechSynthesis.onvoiceschanged = loadVoices;
    
    setUtterance(utterance);
    
    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const handleVoiceClick = () => {
    if (utterance) {
      const text = pages[curr_left_page] + " " + pages[curr_left_page+1];
      textToSpeech(text, utterance);
    }
  }

  const handleVoiceSettingsClick = () => {
    setIsSettingsOpen(true);
  }

  const handlePrevPage = () => {
    if (curr_left_page > 1) {
      setCurrLeftPage(curr_left_page - 2);
    }
  }

  const handleNextPage = () => {
    if (curr_left_page < pages.length - 2) {
      setCurrLeftPage(curr_left_page + 2);
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedFiles(filesArray);
      console.log("Selected files:", filesArray);
    }
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">

      <main className="flex flex-row gap-[32px] row-start-2 items-center sm:items-start">

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

        {/* Options Div */}
        <div className="h-[500] flex flex-col gap-4 place-content-center m-auto p-4 rounded-lg shadow-lg">
          <a
            className="flex flex-row rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px] space-x-8 hover:cursor-pointer"
            onClick={() => handleVoiceClick()}
            rel="noopener noreferrer"
          >
            <p className="self-center justify-self-start">Voice</p> <FiVolume2 className="self-center justify-self-end" />
          </a>

          <a
            className="flex flex-row rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px] space-x-6 hover:cursor-pointer"
            onClick={() => handleVoiceSettingsClick()}
            rel="noopener noreferrer"
          >
            <p className="self-center justify-self-start">Settings</p> <FiSettings className="self-center justify-self-end" />
          </a>
        </div>

        {/* Book Div */}
        <div className="flex flex-col gap-4 items-center">
          <p className="text-2xl sm:text-3xl font-bold">Book Title</p>
          <p className="text-sm sm:text-base">Author Name</p>
          <div className="flex flex-row gap-4 items-center">

            {/* Page 1 */}
            <div className="h-[500] w-[300] flex flex-col gap-4 items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
              <p className="text-sm sm:text-base"> { curr_left_page<pages.length ? `Page ${curr_left_page+1}` : "" } </p>
              { curr_left_page<pages.length ? pages[curr_left_page] : "" }
            </div>



            {/* Page 2 */}
            <div className="h-[500] w-[300] flex flex-col gap-4 items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
            <p className="text-sm sm:text-base"> { curr_left_page+1<pages.length ? `Page ${curr_left_page+2}` : "" } </p>
            { curr_left_page+1<pages.length ? pages[curr_left_page+1] : "" }
            </div>
          </div>

          <div className="flex flex-row justify-between">
            <button className="bg-white text-black h-8 w-8 hover:cursor-pointer" onClick={() => handlePrevPage()}>&lt;</button>
            <button className="bg-white text-black h-8 w-8 hover:cursor-pointer" onClick={() => handleNextPage()}>&gt;</button>
          </div>
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
