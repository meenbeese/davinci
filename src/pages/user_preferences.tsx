import React, { useState } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../components/avatar";
import { Button } from "../components/button";
import { Card, CardContent } from "../components/card";
import SubmitButton from "../components/submitButton";
import "../app/globals.css";
import { useRouter } from "next/router";
import { signIn } from "next-auth/react";


export default function Page3() {
  const [error, setError] = useState("");
  const router = useRouter();
  const { username, email, password } = router.query

  const convertToBinaryString = (items) => {
    return items.map(item => item.selected ? '1' : '0').join('');
  };
  
  const handleSubmit = async () => {
    // Handle sign-in
    const res = await signIn("credentials", {
      redirect: false,
      email: email,
      password: password,
    });

    if (res?.ok) {
      const educationLevelsBinary = convertToBinaryString(educationLevels);
      const learningCategoriesBinary = convertToBinaryString(learningCategories);
      router.push({pathname: "/", query: {education_level : educationLevelsBinary, learning_categories : learningCategoriesBinary}}); // Redirect to home page after successful login
    } else {
      setError("Invalid email or password");
    }
  };

  // Education levels data - using state to manage selection
  const [educationLevels, setEducationLevels] = useState([
    { id: 1, name: "Kindergarten", selected: true },
    { id: 2, name: "Elementary", selected: false },
    { id: 3, name: "Middle", selected: false },
    { id: 4, name: "High", selected: false },
  ]);

  // Learning categories data - using state to manage selection
  const [learningCategories, setLearningCategories] = useState([
    { id: 1, name: "Art", selected: false },
    { id: 2, name: "Business", selected: false },
    { id: 3, name: "English", selected: false },
    { id: 4, name: "French", selected: false },
    { id: 5, name: "Math", selected: false },
    { id: 6, name: "Music", selected: false },
    { id: 7, name: "Science", selected: false },
    { id: 8, name: "Social Sciences", selected: false },
  ]);

  // Handler for selecting education level
  const handleSelectLevel = (id) => {
    setEducationLevels(
      educationLevels.map(level => ({
        ...level,
        selected: level.id === id
      }))
    );
  };

  // Handler for toggling category selection
  const handleToggleCategory = (id) => {
    setLearningCategories(
      learningCategories.map(category => ({
        ...category,
        selected: category.id === id ? !category.selected : category.selected
      }))
    );
  };

  return (
    <div className="bg-black/90 flex flex-row justify-center w-full min-h-screen">
      <div className="w-full relative py-7">
        {/* Subtle gradient background */}
        <div 
          className="absolute w-full h-full inset-0 z-0 bg-gradient-to-b from-black to-gray-900"
        />
        
        {/* Glowing accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-0">
          <div 
            className="h-full w-1/3 bg-white/90 rounded-full relative"
            style={{
              boxShadow: "0 0 20px 5px rgba(255,255,255,0.5), 0 0 40px 10px rgba(255,255,255,0.2)"
            }}
          />
        </div>

        <div className="relative z-10 w-full h-full flex flex-col items-center">
          {/* Top section with logos and profile */}
          <div className="w-full flex justify-between mb-8 px-8">
            {/* Left logo - replaced with a sleek icon */}
            <div className="w-24 h-24 flex items-center justify-center">
              <div className="text-white text-4xl font-black bg-black p-4 rounded-lg shadow-lg border border-white/10">
                Da
              </div>
            </div>

            {/* Profile section */}
            <div className="flex flex-col items-center backdrop-blur-md bg-black/30 py-6 px-10 rounded-xl border border-white/10 shadow-lg" 
                style={{ boxShadow: "0 0 15px rgba(255,255,255,0.1)" }}>
              <Avatar className="w-24 h-24 mb-5 ring-2 ring-white/50 ring-offset-2 ring-offset-black">
                <AvatarImage
                  src="https://c.animaapp.com/m8kopnww3v9c2V/img/ellipse-6.png"
                  alt="Profile"
                />
                <AvatarFallback className="bg-gradient-to-br from-gray-700 to-black text-white">KA</AvatarFallback>
              </Avatar>
              <h2 className="font-medium text-3xl text-white">
                {username}
              </h2>
            </div>

            {/* Right logo - replaced with a sleek icon */}
            <div className="w-24 h-24 flex items-center justify-center">
              <div className="text-white text-4xl font-black bg-black p-4 rounded-lg shadow-lg border border-white/10">
                Vinci
              </div>
            </div>
          </div>

          {/* Main content card */}
          <Card className="w-[700px] border-white/20 border rounded-xl bg-black/50 backdrop-blur-md shadow-2xl overflow-hidden"
               style={{ boxShadow: "0 0 30px rgba(0,0,0,0.5), 0 0 15px rgba(255,255,255,0.1)" }}>
            <CardContent className="p-0">
              <div className="flex">
                {/* Education level section */}
                <div className="w-1/2 p-8 border-r border-white/10">
                  <h3 className="font-medium text-white text-2xl mb-8 tracking-wide">
                    Education Level
                  </h3>
                  <div className="flex flex-col space-y-5">
                    {educationLevels.map((level) => (
                      <Button
                        key={level.id}
                        variant="outline"
                        onClick={() => handleSelectLevel(level.id)}
                        className={`hover:cursor-pointer h-12 rounded-md border transition-all duration-300 ease-in-out ${
                          level.selected 
                            ? "border-white bg-white/10 text-white" 
                            : "border-white/30 bg-transparent text-white/70 hover:border-white/50 hover:text-white/90"
                        }`}
                        style={level.selected ? {
                          boxShadow: "0 0 10px rgba(255,255,255,0.2)"
                        } : {}}
                      >
                        <span className="font-medium text-lg">
                          {level.name}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Learning categories section */}
                <div className="w-1/2 p-8">
                  <h3 className="font-medium text-white text-2xl mb-8 tracking-wide text-center">
                    Learning Categories
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {learningCategories.map((category) => (
                      <Button
                        key={category.id}
                        variant="outline"
                        onClick={() => handleToggleCategory(category.id)}
                        className={`hover:cursor-pointer h-12 rounded-md border transition-all duration-300 ease-in-out ${
                          category.selected 
                            ? "border-white bg-white/10 text-white" 
                            : "border-white/30 bg-transparent text-white/70 hover:border-white/50 hover:text-white/90"
                        }`}
                        style={category.selected ? {
                          boxShadow: "0 0 10px rgba(255,255,255,0.2)"
                        } : {}}
                      >
                        <span className="font-medium text-base">
                          {category.name}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Bottom accent - similar to loading bar */}
              <div className="h-1 w-full bg-gray-800 relative">
                <div 
                  className="absolute bottom-0 left-0 h-full w-2/3 bg-gradient-to-r from-white to-white/90 rounded-full"
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
            </CardContent>
          </Card>

          <SubmitButton onClick={handleSubmit} className="w-full max-w-md mt-8" />
        </div>
      </div>
    </div>
  );
}