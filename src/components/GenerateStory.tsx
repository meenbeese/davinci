// "use client";

// import React, { useState } from "react";

// export default function GenerateStory() {
//   const [prompt, setPrompt] = useState<string>("");
//   const [story, setStory] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleGenerateStory = async () => {
//     if (!prompt.trim()) {
//       setError("Please enter a prompt.");
//       return;
//     }

//     setLoading(true);
//     setError(null);
//     setStory(null);

//     try {
//       const response = await fetch("/api/generateStory", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ prompt }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         setError(errorData.message || "Failed to generate story.");
//         return;
//       }

//       const data = await response.json();
//       setStory(data.story);
//     } catch (err) {
//       console.error("Error generating story:", err);
//       setError("An unexpected error occurred.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const splitStoryIntoPages = (story: string) => {
//     return story.split("\n").filter((page) => page.trim() !== "");
//   };

//   return (
//     <div className="flex flex-col items-center gap-4 p-8">
//       <h1 className="text-2xl font-bold">AI Story Generator</h1>
//       <textarea
//         value={prompt}
//         onChange={(e) => setPrompt(e.target.value)}
//         placeholder="Enter a text prompt (e.g., 'Write a short story about a futuristic city.')"
//         className="w-full max-w-md p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//         rows={4}
//       />
//       <button
//         onClick={handleGenerateStory}
//         disabled={loading || !prompt.trim()}
//         className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition disabled:opacity-50"
//       >
//         {loading ? "Generating..." : "Generate Story"}
//       </button>
//       {error && <p className="text-red-500">{error}</p>}
//       {story && (
//         <div className="mt-4">
//           <h2 className="text-lg font-bold">Generated Story:</h2>
//           {splitStoryIntoPages(story).map((page, index) => (
//             <div key={index} className="mb-4">
//               <h3 className="text-md font-semibold">Page {index + 1}</h3>
//               <p className="text-gray-700">{page}</p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
