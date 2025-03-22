import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

export const page3 = () => {
  // Education levels data
  const educationLevels = [
    { id: 1, name: "Kindergarten", selected: true },
    { id: 2, name: "Elementary", selected: false },
    { id: 3, name: "Middle", selected: false },
    { id: 4, name: "High", selected: false },
  ];

  // Learning categories data
  const learningCategories = [
    { id: 1, name: "Art", selected: false },
    { id: 2, name: "Business", selected: false },
    { id: 3, name: "English", selected: false },
    { id: 4, name: "French", selected: false },
    { id: 5, name: "Math", selected: false },
    { id: 6, name: "Music", selected: false },
    { id: 7, name: "Science", selected: false },
    { id: 8, name: "Social Sciences", selected: false },
  ];

  return (
    <div className="bg-transparent flex flex-row justify-center w-full min-h-screen">
      <div className="w-full max-w-[1105px] relative py-7">
        {/* Background image */}
        <img
          className="absolute w-full h-full max-w-[1063px] mx-auto inset-0 z-0"
          alt="Page background"
          src="https://c.animaapp.com/m8kopnww3v9c2V/img/page-5.png"
        />

        <div className="relative z-10 w-full h-full flex flex-col items-center">
          {/* Top section with logos and profile */}
          <div className="w-full flex justify-between mb-8">
            {/* Left logo */}
            <div className="w-[273px] h-[318px]">
              <img
                className="w-full h-full object-cover"
                alt="Logo"
                src="https://c.animaapp.com/m8kopnww3v9c2V/img/logo-1.png"
              />
            </div>

            {/* Profile section */}
            <div className="flex flex-col items-center">
              <Avatar className="w-[74px] h-[75px] mb-5">
                <AvatarImage
                  src="https://c.animaapp.com/m8kopnww3v9c2V/img/ellipse-6.png"
                  alt="Profile"
                />
                <AvatarFallback>KA</AvatarFallback>
              </Avatar>
              <h2 className="font-normal text-[28px] text-[#895c3b] [font-family:'Abhaya_Libre',Helvetica]">
                Khusan Akhmedov
              </h2>
            </div>

            {/* Right logo */}
            <div className="w-[273px] h-[318px]">
              <img
                className="w-full h-full object-cover"
                alt="Logo"
                src="https://c.animaapp.com/m8kopnww3v9c2V/img/logo-1.png"
              />
            </div>
          </div>

          {/* Main content card */}
          <Card className="w-[538px] border-[#895c3b] border rounded-md bg-transparent">
            <CardContent className="p-0">
              <div className="flex">
                {/* Education level section */}
                <div className="w-1/2 p-5 border-r border-[#895c3b]">
                  <h3 className="[font-family:'Abhaya_Libre',Helvetica] font-normal text-[#895c3b] text-[28px] mb-6">
                    Edu Level
                  </h3>
                  <div className="flex flex-col space-y-4">
                    {educationLevels.map((level) => (
                      <Button
                        key={level.id}
                        variant="outline"
                        className={`w-[211px] h-[45px] rounded-md border border-[#895c3b] justify-start px-6 ${
                          level.selected ? "bg-[#895c3b]/20" : "bg-transparent"
                        }`}
                      >
                        <span className="[font-family:'Abhaya_Libre',Helvetica] font-normal text-[#895c3b] text-xl">
                          {level.name}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Learning categories section */}
                <div className="w-1/2 p-5">
                  <h3 className="[font-family:'Abhaya_Libre',Helvetica] font-normal text-[#895c3b] text-[28px] text-center mb-6">
                    Learning Categories
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {learningCategories.map((category) => (
                      <Button
                        key={category.id}
                        variant="outline"
                        className={`w-[111px] h-[42px] rounded-md border border-[#895c3b] ${
                          category.selected
                            ? "bg-[#895c3b]/20"
                            : "bg-transparent"
                        }`}
                      >
                        <span className="[font-family:'Abhaya_Libre',Helvetica] font-normal text-[#895c3b] text-[15px] text-center">
                          {category.name}
                        </span>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
