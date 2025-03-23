import React from "react";
import { Button } from "../../components/button";
import { Card, CardContent } from "../../components/card";
import { useRouter } from "next/router";

export const Page = () => {
  const [eduLevel, setEduLevel] = React.useState(null);
  const [learningCategories, setLearningCategories] = React.useState(null);

  const router = useRouter();
  const { eduBin, learnBin } = router.query;

  const allLearningCategories = [
    { id: 1, name: "Art"},
    { id: 2, name: "Business"},
    { id: 3, name: "English"},
    { id: 4, name: "French"},
    { id: 5, name: "Math"},
    { id: 6, name: "Music"},
    { id: 7, name: "Science"},
    { id: 8, name: "Social Sciences",}
  ];
  const allEduLevels = [
    { id: 1, name: "Kindergarten"},
    { id: 2, name: "Elementary"},
    { id: 3, name: "Middle"},
    { id: 4, name: "High"},
  ];
  function binaryStringToCategoryIds(binaryString) {
    if (!binaryString) return [];
    
    return Array.from(binaryString)
      .map((bit, index) => bit === '1' ? index : null)
      .filter(id => id !== null);
  }
  function binaryStringToCategories(binaryString, categoriesArray) {
    if (!binaryString || !categoriesArray) return [];
    
    const selectedIds = binaryStringToCategoryIds(binaryString);
    
    return categoriesArray.filter(category => 
      selectedIds.includes(category.id - 1)
    );
  }
  setLearningCategories(binaryStringToCategories(learnBin, allLearningCategories));
  setEduLevel(binaryStringToCategories(eduBin, allEduLevels)[0]);
  
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
