import React from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";

export const Page = (): JSX.Element => {
  // Data for the page
  const userData = {
    name: "Khusan Akhmedov",
    profileImage: "https://c.animaapp.com/m8kpk79kRrqI9L/img/ellipse-4.png",
  };

  return (
    <div className="bg-transparent flex flex-row justify-center w-full h-screen items-center">
      <Card className="relative w-[1126px] h-[675px] border-0 overflow-hidden">
        <CardContent className="p-0 h-full">
          {/* Background image */}
          <img
            className="absolute w-full h-full object-cover"
            alt="Background"
            src="https://c.animaapp.com/m8kpk79kRrqI9L/img/page-3.png"
          />

          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
            {/* Logo images */}
            <img
              className="absolute w-[273px] h-[318px] top-0 left-0 object-cover"
              alt="DaVinci Logo"
              src="https://c.animaapp.com/m8kpk79kRrqI9L/img/logo-1.png"
            />
            <img
              className="absolute w-[273px] h-[318px] top-0 right-0 object-cover"
              alt="DaVinci Logo"
              src="https://c.animaapp.com/m8kpk79kRrqI9L/img/logo-1.png"
            />

            {/* Main heading */}
            <h1 className="font-['Inria_Serif'] font-normal text-[#8a5d3d] text-5xl text-center leading-normal mb-8 max-w-[440px]">
              Type it, and watch the story unfold
            </h1>

            {/* Input field */}
            <div className="w-[404px] mb-8">
              <div className="flex items-center bg-white rounded border-2 border-solid border-[#8a5d3d] px-2 py-[7px]">
                <Input
                  className="border-0 shadow-none h-6 p-0 text-xs font-['Roboto'] text-[#404040] focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
                  placeholder="Type here"
                />
                <div className="relative w-0.5 h-4 bg-[#404040] animate-pulse" />
              </div>
            </div>

            {/* User profile section */}
            <div className="absolute bottom-10 right-32 flex items-center gap-3">
              <span className="font-['Helvetica'] font-light text-[#a0a0a0] text-lg">
                {userData.name}
              </span>
              <Avatar className="w-[50px] h-[50px]">
                <AvatarImage src={userData.profileImage} alt="Profile" />
                <AvatarFallback>KA</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
