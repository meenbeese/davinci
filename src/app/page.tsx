"use client";

import * as React from "react";
import { FiVolume2, FiSettings, FiUploadCloud } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import Link from "next/link";

import { textToSpeech } from "./text_to_speech";
import VoiceSettingsPopup from "./VoiceSettingsPopup.tsx";
import LoadingOverlay from "./LoadingOverlay"; // Import the new component

export default function Home() {
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [utterance, setUtterance] =
    React.useState<SpeechSynthesisUtterance | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [curr_left_page, setCurrLeftPage] = React.useState(0);

  const [prompt, setPrompt] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [, setError] = React.useState<string | null>(null);
  const [pages, setPages] = React.useState<string[]>([]);
  const [title, setTitle] = React.useState<string | null>(null);
  const [allImageUrls, setAllImageUrls] = React.useState<string[]>([]);

  const [imagesLoading, setImagesLoading] = React.useState<boolean[]>([]);
  const [cardsLoading, setCardsLoading] = React.useState(false);

  const extractKeyFeatures = async (story: string) => {
    // setStory(null);

    try {
      const response = await fetch("/api/extractKeyFeatures", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ story }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Failed to extract features.");
        return;
      }

      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error extracting features:", err);
      setError("An unexpected error occurred.");
    }
  };

  const handleGenerateStory = async () => {
    setLoading(true);
    setCardsLoading(true);
    setError(null);
    setPages([]); // Clear previous pages
    setAllImageUrls([]); // Clear previous image URLs
  
    try {
      const response = await fetch("/api/generateStory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Failed to generate story.");
        return;
      }

      const story_response = await response.json();
  
      // Split the story into pages
      const storyPages = story_response.story.split("<scene>");
      setPages(storyPages);
      setImagesLoading(new Array(storyPages.length).fill(true));

      const key_features = await extractKeyFeatures(story_response.story);
      setTitle(key_features.title);
      console.log(key_features.characters);

      const imageResponse = await fetch("/api/generateImage", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ scenes: storyPages, art_style: "minimalist, watercolor", education_topic: "history", lang: "English", story_characters: key_features.characters }),
            });

      if (!imageResponse.ok) {
        console.error(`Failed to generate images`);
        return;
      }

      const imageData = await imageResponse.json();
      setAllImageUrls(imageData.images);
      setImagesLoading(new Array(storyPages.length).fill(false));

    } catch (err) {
      console.error("Error generating story:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
      setCardsLoading(false);
    }
  };

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
      let text = pages[curr_left_page];
      if (curr_left_page + 1 < pages.length) {
        text += " " + pages[curr_left_page + 1];
      }
      textToSpeech(text, utterance);
    }
  };

  const handleVoiceSettingsClick = () => {
    setIsSettingsOpen(true);
  };

  const handlePrevPage = () => {
    if (curr_left_page > 1) {
      setCurrLeftPage(curr_left_page - 2);
    }
  };

  const handleNextPage = () => {
    if (curr_left_page < pages.length - 2) {
      setCurrLeftPage(curr_left_page + 2);
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      setSelectedFiles(filesArray);
      console.log("Selected files:", filesArray);

      const formData = new FormData();
      filesArray.forEach((file) => {
        formData.append("file", file);
      });

      try {
        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Upload error:", errorData);
        } else {
          const data = await response.json();
          console.log('Upload success:', data);
          
          // Update the prompt state to the description received from the server
          setPrompt(data.description); // Use the description from the response
        }
      } catch (err) {
        console.error("Error uploading files:", err);
      }
    }
  };

  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-start justify-items-center min-h-screen py-4 gap-4 sm:p-4 font-[family-name:var(--font-geist-sans)]">
      {/* Show loading overlay when loading is true */}
      {loading && <LoadingOverlay />}
      
      <main className="flex flex-row gap-[32px] items-center sm:items-start">
        <div className="flex flex-col items-center gap-6">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">
            Generate AI Story
          </h2>

          <div className="flex flex-col gap-6">
            {/* File Upload Area */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="file-upload"
                className="flex flex-col items-center justify-center w-[384px] h-[200px] p-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition"
              >
                <FiUploadCloud className="text-4xl text-blue-500 mb-2" />
                <p className="text-lg font-medium text-gray-700">
                  Drag & drop files or{" "}
                  <span className="text-blue-500 underline">Browse</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Supported formats: JPEG, PNG, GIF, MP4, PDF, PSD, AI, Word,
                  PPT
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
            </div>

            {/* Divider text */}
            <div className="flex items-center justify-center -my-2">
              <p className="text-center text-gray-400 px-4">
                or type naturally
              </p>
            </div>

        {/* Generate Image Section */}
        <div className="flex flex-col items-center gap-4 mt-2">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a text prompt (e.g., 'A futuristic cityscape at sunset')"
            className="w-full max-w-md p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />

            <button
              onClick={handleGenerateStory}
              disabled={loading || !prompt}
              className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <span>{loading ? "Generating..." : "Generate Story"}</span>
              <HiSparkles className="w-5 h-5" />
            </button>
          </div>

          {selectedFiles.length > 0 && (
            <div className="text-sm text-gray-600">
              <p>Selected Files:</p>
              <ul className="list-disc pl-5">
                {selectedFiles.map((file, index) => (
                  <li key={index}>{file.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

        {/* Options Div */}
        <div className="h-[500] flex flex-col gap-4 place-content-center m-auto p-4 rounded-lg shadow-lg">
          <a
            className="flex flex-row rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px] space-x-8 hover:cursor-pointer"
            onClick={() => handleVoiceClick()}
            rel="noopener noreferrer"
          >
            <p className="self-center justify-self-start">Voice</p>{" "}
            <FiVolume2 className="self-center justify-self-end" />
          </a>

          <a
            className="flex flex-row rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px] space-x-6 hover:cursor-pointer"
            onClick={() => handleVoiceSettingsClick()}
            rel="noopener noreferrer"
          >
            <p className="self-center justify-self-start">Settings</p>{" "}
            <FiSettings className="self-center justify-self-end" />
          </a>
        </div>

        {/* Book Div */}
        <div className="flex flex-col gap-4 items-center">
          <p className="text-2xl sm:text-3xl font-bold">{title}</p>
          <p className="text-sm sm:text-base">Author: Gemini</p>
          <div className="relative w-[632px] h-[500px]">
            <div
              className="flex flex-row gap-4 items-center absolute left-0 transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${curr_left_page * 316}px)` }}
            >
              {pages.map((page, index) => (
                <div
                  key={index}
                  className={`h-[500px] w-[300px] flex flex-col gap-4 items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg overflow-hidden
            transform transition-all duration-700 ease-in-out ${
              index === curr_left_page || index === curr_left_page + 1
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95"
            }`}
                >
                  <p className="text-sm sm:text-base">{`Page ${index + 1}`}</p>
                  {cardsLoading ? (
                    <div className="flex-1 w-full animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  ) : (
                    <div className="flex-1 overflow-y-auto transition-opacity duration-300">
                      {pages[index]}
                    </div>
                  )}
                  {allImageUrls && (
                    <div className="w-full h-48 flex items-center justify-center transition-opacity duration-300">
                      {allImageUrls[index] ? (
                        imagesLoading[index] ? (
                          <div className="w-full h-full rounded-lg bg-gray-200 animate-pulse flex items-center justify-center">
                            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                        ) : (
                          <img
                            src={allImageUrls[index]}
                            alt={`Page ${index + 1} Illustration`}
                            className="max-w-full max-h-full object-contain rounded-lg shadow-lg transform transition-all duration-500"
                            onLoad={() => {
                              const newLoadingStates = [...imagesLoading];
                              newLoadingStates[index] = false;
                              setImagesLoading(newLoadingStates);
                            }}
                          />
                        )
                      ) : null}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-row justify-between gap-4 mt-4">
            <button
              className="bg-blue-500 text-white h-10 w-10 rounded-full flex items-center justify-center shadow-md hover:bg-blue-600 transition-all duration-300 transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
              onClick={() => handlePrevPage()}
              disabled={curr_left_page <= 1}
            >
              &lt;
            </button>
            <button
              className="bg-blue-500 text-white h-10 w-10 rounded-full flex items-center justify-center shadow-md hover:bg-blue-600 transition-all duration-300 transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
              onClick={() => handleNextPage()}
              disabled={curr_left_page >= pages.length - 2}
            >
              &gt;
            </button>
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