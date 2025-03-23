import React from "react";
import { Avatar, AvatarImage } from "../components/avatar";
import { Button } from "../components/button";
import { Card, CardContent } from "../components/card";

export const page5 = () => {
  // Data for page numbers
  const pageNumbers = [
    { number: "1", position: "left" },
    { number: "2", position: "right" },
  ];

  return (
    <main className="bg-transparent flex flex-row justify-center w-full">
      <div className="relative overflow-hidden w-[1136px] h-[686px]">
        {/* Background image - adjusted position */}
        <img
          className="absolute w-[1064px] h-[664px] top-[20px] left-[49px]"
          alt="Page background"
          src="https://c.animaapp.com/m8kpsft4rbbf53/img/page-4.png"
        />

        {/* Title - adjusted position */}
        <header className="absolute w-[440px] h-48 top-8 left-[361px] [font-family:'Inria_Serif',Helvetica] font-normal text-[#8a5d3d] text-5xl text-center tracking-[0] leading-[normal]">
          Story time
        </header>

        {/* Left logo - adjusted position */}
        <img
          className="absolute w-[273px] h-[318px] top-[1px] left-[10px] object-cover"
          alt="Logo"
          src="https://c.animaapp.com/m8kpsft4rbbf53/img/logo-1.png"
        />

        {/* Right logo - adjusted position */}
        <img
          className="absolute w-[273px] h-[318px] top-[-10px] left-[873px] object-cover"
          alt="Logo"
          src="https://c.animaapp.com/m8kpsft4rbbf53/img/logo-1.png"
        />

        {/* Navigation arrows - adjusted positions */}
        <Button
          variant="ghost"
          className="absolute p-0 w-[61px] h-10 top-[553px] left-[857px]"
          aria-label="Next page"
        >
          <img
            className="w-full h-full"
            alt="Right arrow"
            src="https://c.animaapp.com/m8kpsft4rbbf53/img/arrow-1.svg"
          />
        </Button>

        <Button
          variant="ghost"
          className="absolute p-0 w-[60px] h-10 top-[554px] left-[223px]"
          aria-label="Previous page"
        >
          <img
            className="w-full h-full"
            alt="Left arrow"
            src="https://c.animaapp.com/m8kpsft4rbbf53/img/arrow-2.svg"
          />
        </Button>

        {/* Author name - adjusted position */}
        <div className="absolute top-[603px] left-[857px] [font-family:'Helvetica-Light',Helvetica] font-light text-[#a0a0a0] text-lg tracking-[0] leading-[normal]">
          Khusan Akhmedov
        </div>

        {/* Author avatar - adjusted position */}
        <Avatar className="absolute w-[50px] h-[50px] top-[591px] left-[1023px]">
          <AvatarImage
            src="https://c.animaapp.com/m8kpsft4rbbf53/img/ellipse-5.png"
            alt="Author avatar"
          />
        </Avatar>

        {/* Main book image - adjusted position */}
        <Card className="absolute w-[612px] h-[429px] top-[174px] left-[261px] border-0 bg-transparent">
          <CardContent className="p-0">
            <img
              className="w-full h-full object-cover"
              alt="Open book"
              src="https://c.animaapp.com/m8kpsft4rbbf53/img/istockphoto-487810965-612x612-1.png"
            />
          </CardContent>
        </Card>

        {/* Page numbers - adjusted positions */}
        {pageNumbers.map((page, index) => (
          <div
            key={index}
            className={`absolute w-[34px] top-[517px] ${
              page.position === "left" ? "left-[391px]" : "left-[747px]"
            } [font-family:'Abhaya_Libre',Helvetica] font-normal text-black text-xl tracking-[0] leading-[normal]`}
          >
            {page.number}
          </div>
        ))}
      </div>
    </main>
  );
};
