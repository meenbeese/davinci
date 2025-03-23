"use client";

import * as React from "react";
import { FiVolume2, FiSettings, FiUploadCloud } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";

import { textToSpeech } from "./text_to_speech";
import VoiceSettingsPopup from "./VoiceSettingsPopup.tsx";
import LoadingOverlay from "./LoadingOverlay";

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
        body: JSON.stringify({
          scenes: storyPages,
          art_style: "minimalist, watercolor",
          education_topic: "history",
          lang: "English",
          story_characters: key_features.characters,
        }),
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
          console.log("Upload success:", data);

          // Update the prompt state to the description received from the server
          setPrompt(data.description); // Use the description from the response
        }
      } catch (err) {
        console.error("Error uploading files:", err);
      }
    }
  };

  return (
    <div className="min-h-screen w-full bg-black relative">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900 z-0" />
      
      {/* Subtle glow effect at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 z-10">
        <div 
          className="h-full w-1/3 mx-auto bg-white/20 rounded-full"
          style={{
            boxShadow: "0 0 30px 5px rgba(255,255,255,0.2)"
          }}
        />
      </div>
      
      {/* Main content */}
      <div className="grid grid-rows-[auto_1fr_auto] items-start justify-items-center min-h-screen py-8 gap-6 sm:p-6 relative z-20">
        {/* Show loading overlay when loading is true */}
        {loading && <LoadingOverlay />}

        <main className="flex flex-row gap-[32px] items-center sm:items-start">
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-white">
              Generate AI Story
            </h2>

            <div className="flex flex-col gap-6">
              {/* File Upload Area */}
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-[384px] h-[200px] p-6 border-2 border-dashed border-white/20 rounded-lg cursor-pointer hover:border-white/50 transition-all duration-300 backdrop-blur-sm bg-black/30"
                  style={{ boxShadow: "0 0 15px rgba(255,255,255,0.05)" }}
                >
                  <FiUploadCloud className="text-4xl text-white mb-2" />
                  <p className="text-lg font-medium text-white">
                    Drag & drop files or{" "}
                    <span className="text-white underline">Browse</span>
                  </p>
                  <p className="text-sm text-white/70 mt-1">
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
                <div className="w-1/3 h-px bg-white/10"></div>
                <p className="text-center text-white/40 px-4 text-sm">
                  or type naturally
                </p>
                <div className="w-1/3 h-px bg-white/10"></div>
              </div>

              {/* Generate Story Section */}
              <div className="flex flex-col items-center gap-4 mt-2">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter a text prompt (e.g., 'A futuristic cityscape at sunset')"
                  className="w-full max-w-md p-4 bg-black/50 border border-white/20 text-white placeholder-white/40 rounded-lg focus:outline-none focus:border-white/50 focus:ring-1 focus:ring-white/30 transition-all duration-300"
                  rows={4}
                  style={{ boxShadow: "0 0 15px rgba(255,255,255,0.05)" }}
                />

                <button
                  onClick={handleGenerateStory}
                  disabled={loading || !prompt}
                  className="hover:cursor-pointer w-full h-14 bg-black border border-white/30 rounded-lg flex items-center justify-center text-white font-medium text-lg transition-all duration-300 ease-in-out hover:bg-white/10 hover:border-white active:scale-95 disabled:opacity-50 disabled:hover:bg-transparent group relative overflow-hidden"
                  style={{
                    boxShadow: "0 0 15px rgba(255,255,255,0.1)",
                  }}
                >
                  <span className="mr-2">{loading ? "Generating..." : "Generate Story"}</span>
                  <HiSparkles className="w-5 h-5" />
                  
                  {/* Bottom bar with glow - similar to loading bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-800">
                    <div 
                      className="h-full w-0 group-hover:w-full bg-gradient-to-r from-white to-white/90 rounded-full transition-all duration-500"
                      style={{ 
                        boxShadow: "0 0 10px 1px rgba(255,255,255,0.5), 0 0 14px 3px rgba(255,255,255,0.2)" 
                      }}
                    >
                      {/* Glowing edge */}
                      <div 
                        className="absolute right-0 top-0 h-full w-4 bg-white rounded-full blur-sm"
                        style={{
                          boxShadow: "0 0 15px 5px rgba(255,255,255,0.7)"
                        }}
                      />
                    </div>
                  </div>
                </button>
              </div>

              {selectedFiles.length > 0 && (
                <div className="text-sm text-white/70 mt-2 backdrop-blur-sm bg-white/5 p-3 rounded-lg border border-white/10">
                  <p>Selected Files:</p>
                  <ul className="list-disc pl-5 mt-1">
                    {selectedFiles.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Book Div */}
          {!pages.length ? (
            // Show large logo when no content
            <div className="flex flex-col items-center justify-center h-[500px] w-[632px] backdrop-blur-sm bg-black/20 rounded-xl border border-white/10"
                style={{ boxShadow: "0 0 20px rgba(0,0,0,0.5), 0 0 10px rgba(255,255,255,0.05)" }}
            >
              <div className="text-6xl font-black text-white mb-6">DA VINCI</div>
              <p className="text-xl text-white/60">
                Enter a prompt or upload files to begin
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 items-center backdrop-blur-sm bg-black/20 p-6 rounded-xl border border-white/10"
                 style={{ boxShadow: "0 0 20px rgba(0,0,0,0.5), 0 0 10px rgba(255,255,255,0.05)" }}
            >
              <p className="text-2xl sm:text-3xl font-bold text-white">{title}</p>
              <p className="text-sm sm:text-base text-white/70">Author: Gemini</p>
              <div className="relative w-[632px] h-[500px]">
                <div
                  className="flex flex-row gap-4 items-center absolute left-0 transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${curr_left_page * 316}px)` }}
                >
                  {pages.map((page, index) => (
                    <div
                      key={index}
                      className={`h-[500px] w-[300px] flex flex-col gap-4 items-center bg-black/50 border border-white/20 p-4 rounded-lg shadow-lg overflow-hidden
              transform transition-all duration-700 ease-in-out ${
                index === curr_left_page || index === curr_left_page + 1
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95"
              }`}
                      style={{ boxShadow: "0 0 15px rgba(255,255,255,0.05)" }}
                    >
                      <p className="text-sm sm:text-base text-white/80">{`Page ${index + 1}`}</p>
                      {cardsLoading ? (
                        <div className="flex-1 w-full animate-pulse">
                          <div className="h-4 bg-white/20 rounded w-3/4 mb-2"></div>
                          <div className="h-4 bg-white/20 rounded w-1/2 mb-2"></div>
                          <div className="h-4 bg-white/20 rounded w-5/6"></div>
                        </div>
                      ) : (
                        <div className="flex-1 overflow-y-auto transition-opacity duration-300 text-white">
                          {pages[index]}
                        </div>
                      )}
                      {allImageUrls && (
                        <div className="w-full h-48 flex items-center justify-center transition-opacity duration-300">
                          {allImageUrls[index] ? (
                            imagesLoading[index] ? (
                              <div className="w-full h-full rounded-lg bg-white/10 animate-pulse flex items-center justify-center">
                                <svg
                                  className="w-10 h-10 text-white/30"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
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

              <div className="flex flex-row justify-between gap-4 mt-4 w-full max-w-md">
                <button
                  className="hover:cursor-pointer bg-black border border-white/30 text-white h-10 w-10 rounded-full flex items-center justify-center shadow-md hover:bg-white/10 hover:border-white transition-all duration-300 transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-transparent"
                  onClick={() => handlePrevPage()}
                  disabled={curr_left_page <= 1}
                  style={{ boxShadow: "0 0 10px rgba(255,255,255,0.1)" }}
                >
                  &lt;
                </button>
                <button
                  className="hover:cursor-pointer bg-black border border-white/30 text-white h-10 w-10 rounded-full flex items-center justify-center shadow-md hover:bg-white/10 hover:border-white transition-all duration-300 transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-transparent"
                  onClick={() => handleNextPage()}
                  disabled={curr_left_page >= pages.length - 2}
                  style={{ boxShadow: "0 0 10px rgba(255,255,255,0.1)" }}
                >
                  &gt;
                </button>
              </div>
            </div>
          )}

          {/* Options Div */}
          <div className="h-[500] flex flex-col gap-4 place-content-center m-auto p-4 backdrop-blur-sm bg-black/30 rounded-lg border border-white/10"
               style={{ boxShadow: "0 0 15px rgba(255,255,255,0.05)" }}
          >
            <button
              className="flex flex-row rounded-full border border-white/30 transition-all duration-300 flex items-center justify-between hover:bg-white/10 hover:border-white font-medium text-white text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px] space-x-8 hover:cursor-pointer"
              onClick={() => handleVoiceClick()}
              style={{ boxShadow: "0 0 10px rgba(255,255,255,0.05)" }}
            >
              <p className="self-center justify-self-start">Voice</p>
              <FiVolume2 className="self-center justify-self-end" />
            </button>

            <button
              className="flex flex-row rounded-full border border-white/30 transition-all duration-300 flex items-center justify-between hover:bg-white/10 hover:border-white font-medium text-white text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px] space-x-6 hover:cursor-pointer"
              onClick={() => handleVoiceSettingsClick()}
              style={{ boxShadow: "0 0 10px rgba(255,255,255,0.05)" }}
            >
              <p className="self-center justify-self-start">Settings</p>
              <FiSettings className="self-center justify-self-end" />
            </button>
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
    </div>
  );
}