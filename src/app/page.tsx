'use client';

import * as React from "react";
import { FiVolume2, FiSettings } from 'react-icons/fi'; // Feather icons

import { textToSpeech } from "./text_to_speech";

const pages = ["READING TEXT OUTLOUD", "YES I AM ON THE SECOND PAGE"];
const curr_left_page = 0;

// Create a new SpeechSynthesisUtterance object
// function SpeechComponent() {
// }
// const msg = new SpeechSynthesisUtterance();

// // Configure language (BCP 47 language tag)
// msg.lang = "en-US";  // English (US)
// // Other examples: "fr-FR" (French), "es-ES" (Spanish), "de-DE" (German)

// // Set speech rate (0.1 to 10, default is 1)
// msg.rate = 1.0;  // Normal speed
// // Lower values slow down speech, higher values speed it up

// // Set pitch (0 to 2, default is 1)
// msg.pitch = 1.0;  // Normal pitch

// // Set volume (0 to 1)
// msg.volume = 1.0;  // Full volume

// // Select a specific voice (optional)
// // First get available voices
// const voices = window.speechSynthesis.getVoices();
// const englishVoice = voices.find(voice => voice.lang.includes('en-'));
// if (englishVoice) {
//     msg.voice = englishVoice;
// }


export default function Home() {
  const [utterance, setUtterance] = React.useState<SpeechSynthesisUtterance | null>(null);

  React.useEffect(() => {
    const utterance = new SpeechSynthesisUtterance();
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(voice => voice.lang.includes('en-'));
    if (englishVoice) {
        utterance.voice = englishVoice;
    }
    setUtterance(utterance);
  }, []);

  const handleVoiceClick = () => {
    if (utterance) {
      const text = pages[curr_left_page] + " " + pages[curr_left_page+1];
      textToSpeech(text, utterance);
    }
  }

  const handleVoiceSettingsClick = () => {
    if (utterance) {
      const text = pages[curr_left_page] + " " + pages[curr_left_page+1];
      textToSpeech(text, utterance);
    }
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px] space-x-5"
            onClick={() => handleVoiceClick()}
            rel="noopener noreferrer"
          >
            Voice <FiVolume2 />
          </a>

          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            onClick={() => handleVoiceSettingsClick()}
            rel="noopener noreferrer"
          >
            Voice Settings <FiSettings />
          </a>

        </div>
      </main>
    </div>
  );
}
