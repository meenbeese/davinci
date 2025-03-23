"use client";

import * as React from "react";
import { FiVolume2, FiSettings, FiUploadCloud } from 'react-icons/fi'; // Feather icons

import { textToSpeech } from "./text_to_speech";
import VoiceSettingsPopup from "./VoiceSettingsPopup.tsx";

export default function Home() {
  const [selectedFiles, setSelectedFiles] = React.useState<File[]>([]);
  const [utterance, setUtterance] = React.useState<SpeechSynthesisUtterance | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [curr_left_page, setCurrLeftPage] = React.useState(0);

  const [prompt, setPrompt] = React.useState("");
  const [storyPrompt, setStoryPrompt] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [story, setStory] = React.useState<string | null>(null);
  const [pages, setPages] = React.useState<{ content: string; imageUrl: string | null }[]>([]);

  const handleGenerateStory = async () => {
    setLoading(true);
    setError(null);
    setStory(null);
    setPages([]); // Clear previous pages
  
    const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
  
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
  
      const data = await response.json();
      console.log(data.story);
      setStory(data.story);
  
      // Split the story into pages
      const storyPages = data.story.split("<scene>").filter((page) => page.trim() !== "");
  
      // Initialize pages with content and null images
      const initialPages = storyPages.map((content) => ({ content, imageUrl: null }));
      setPages(initialPages);
  
      // Generate images for each page with a delay
      for (let index = 0; index < storyPages.length; index++) {
        const pageContent = storyPages[index];
  
        try {
          // Step 1: Summarize the page content
          const summaryResponse = await fetch("/api/summarizePage", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ content: pageContent }),
          });
  
          if (!summaryResponse.ok) {
            console.error(`Failed to summarize page ${index + 1}`);
            continue;
          }
  
          const summaryData = await summaryResponse.json();
          const summary = summaryData.summary;
  
          // Step 2: Generate an image based on the summary
          const imagePrompt = `Create an abstract and symbolic illustration suitable for children based on the following description: ${summary}`;
          const imageResponse = await fetch("/api/generateImage", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: imagePrompt }),
          });
  
          if (!imageResponse.ok) {
            console.error(`Failed to generate image for page ${index + 1}`);
            continue;
          }
  
          const imageData = await imageResponse.json();
  
          // Update the page with the generated image
          setPages((prevPages) =>
            prevPages.map((page, i) =>
              i === index ? { ...page, imageUrl: imageData.imageUrl } : page
            )
          );
        } catch (err) {
          console.error(`Error generating image for page ${index + 1}:`, err);
        }
  
        // Add a delay before the next request
        await delay(100); // 100ms delay
      }
    } catch (err) {
      console.error("Error generating story:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  // const handleGenerateStory = async () => {
  //   if (!storyPrompt.trim()) {
  //     setStoryError("Please enter a prompt.");
  //     return;
  //   }
  
  //   setLoadingStory(true);
  //   setStoryError(null);
  //   setStory(null);
  
  //   try {
  //     const response = await fetch("/api/generateStory", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ prompt: storyPrompt }),
  //     });
  
  //     if (!response.ok) {
  //       const errorData = await response.json();
  //       setStoryError(errorData.message || "Failed to generate story.");
  //       return;
  //     }
  
  //     const data = await response.json();
  //     setStory(data.story);
  //   } catch (err) {
  //     console.error("Error generating story:", err);
  //     setStoryError("An unexpected error occurred.");
  //   } finally {
  //     setLoadingStory(false);
  //   }
  // };

  const handleGenerateImage = async () => {
    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const response = await fetch("/api/generateImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Failed to generate image.");
        return;
      }

      const data = await response.json();
      setImageUrl(data.imageUrl);
    } catch (err) {
      console.error("Error generating image:", err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
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
      let text = pages[curr_left_page]
      if (curr_left_page+1<pages.length) {
        text += " " + pages[curr_left_page+1];
      }
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
          Drag & drop files or <span className="text-blue-500 underline">Browse</span>
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

        {/* Generate Image Section */}
        <div className="flex flex-col items-center gap-4 mt-8">
          <h2 className="text-xl font-bold">Generate AI Image</h2>
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
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Story"}
          </button>
          <button
            onClick={handleGenerateImage}
            disabled={loading || !prompt}
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? "Generating..." : "Generate Image"}
          </button>
        </div>
        {/* Generate Story Section
          <div className="flex flex-col items-center gap-4 mt-8">
            <h2 className="text-xl font-bold">Generate Story</h2>
            <textarea
              value={storyPrompt}
              onChange={(e) => setStoryPrompt(e.target.value)}
              placeholder="Enter a text prompt (e.g., 'Write a short story about a futuristic city.')"
              className="w-full max-w-md p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
            />
            <button
              onClick={handleGenerateStory}
              disabled={loadingStory || !storyPrompt.trim()}
              className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
            >
              {loadingStory ? "Generating..." : "Generate Story"}
            </button>
            {storyError && <p className="text-red-500">{storyError}</p>}
            {story && (
              <div className="mt-4">
                <h3 className="text-lg font-bold">Generated Story:</h3>
                <p className="text-gray-700 whitespace-pre-line">{story}</p>
              </div>
            )}
          </div> */}
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
            <div className="h-[500px] w-[300px] flex flex-col gap-4 items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg overflow-hidden">
              <p className="text-sm sm:text-base">
                {curr_left_page < pages.length ? `Page ${curr_left_page + 1}` : ""}
              </p>
              <div className="flex-1 overflow-y-auto">
                {curr_left_page < pages.length ? pages[curr_left_page].content : ""}
              </div>
              {curr_left_page < pages.length && pages[curr_left_page].imageUrl && (
                <div className="w-full h-48 flex items-center justify-center">
                  <img
                    src={pages[curr_left_page].imageUrl}
                    alt={`Page ${curr_left_page + 1} Illustration`}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                  />
                </div>
              )}
            </div>

            {/* Page 2 */}
            <div className="h-[500px] w-[300px] flex flex-col gap-4 items-center bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg overflow-hidden">
              <p className="text-sm sm:text-base">
                {curr_left_page + 1 < pages.length ? `Page ${curr_left_page + 2}` : ""}
              </p>
              <div className="flex-1 overflow-y-auto">
                {curr_left_page + 1 < pages.length ? pages[curr_left_page + 1].content : ""}
              </div>
              {curr_left_page + 1 < pages.length && pages[curr_left_page + 1].imageUrl && (
                <div className="w-full h-48 flex items-center justify-center">
                  <img
                    src={pages[curr_left_page + 1].imageUrl}
                    alt={`Page ${curr_left_page + 2} Illustration`}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-row justify-between gap-4 mt-4">
            <button
              className="bg-blue-500 text-white h-10 w-10 rounded-full flex items-center justify-center shadow-md hover:bg-blue-600 transition transform hover:scale-110"
              onClick={() => handlePrevPage()}
            >
              &lt;
            </button>
            <button
              className="bg-blue-500 text-white h-10 w-10 rounded-full flex items-center justify-center shadow-md hover:bg-blue-600 transition transform hover:scale-110"
              onClick={() => handleNextPage()}
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
