import React from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";

export const page = () => {
  // Data for the page
  const pageData = {
    logoSrc: "https://c.animaapp.com/m8khb4rqiPdpFQ/img/logo.png",
    logoAlt: "DaVinci Logo",
    backgroundImageSrc: "https://c.animaapp.com/m8khb4rqiPdpFQ/img/page-1.png",
    buttonText: "Get Started",
  };

  return (
    <div className="flex justify-center w-full min-h-screen">
      <Card className="relative w-full max-w-[1063px] h-[662px] border-0">
        <CardContent className="p-0 h-full">
          {/* Background image */}
          <div
            className="relative w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${pageData.backgroundImageSrc})` }}
          >
            {/* Logo */}
            <img
              className="absolute w-[432px] h-[503px] top-3.5 left-1/2 -translate-x-1/2 object-cover"
              alt={pageData.logoAlt}
              src={pageData.logoSrc}
            />

            {/* Button container */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-[180px] w-full flex justify-center">
              <Button className="w-[301px] h-[51px] bg-[#20146e] text-[#895f36] rounded-[100px] border-[3px] border-solid border-[#895f36] font-['Inria_Serif',Helvetica] font-normal text-2xl hover:bg-[#20146e]/90">
                {pageData.buttonText}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
