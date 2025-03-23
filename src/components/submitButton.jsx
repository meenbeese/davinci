import React from "react";

const SubmitButton = ({ onClick, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full max-w-md h-14 
        bg-black border border-white/30 
        rounded-lg 
        flex items-center justify-center 
        text-white font-medium text-lg
        mt-8 mb-4 mx-auto
        transition-all duration-300 ease-in-out
        group relative overflow-hidden
        ${disabled 
          ? "opacity-50 cursor-not-allowed" 
          : "hover:bg-white/10 hover:border-white active:scale-95 cursor-pointer"
        }
      `}
      style={{
        boxShadow: "0 0 15px rgba(255,255,255,0.1)",
      }}
    >
      <span className="mr-2">Submit</span>
      
      {/* Arrow icon */}
      <svg 
        width="20" 
        height="20" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 group-hover:translate-x-1"
      >
        <path 
          d="M5 12H19M19 12L12 5M19 12L12 19" 
          stroke="white" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
      
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
  );
};

// If you need to forward refs, use this version instead:
/*
const SubmitButton = React.forwardRef(({ onClick, disabled = false }, ref) => {
  return (
    <button
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      // Rest of the code
    </button>
  );
});
*/

export default SubmitButton;