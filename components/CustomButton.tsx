import React from "react";

interface CustomButtonProps {
  paddingX: number;
  paddingY: number;
  text: string;
  buttonType: "submit" | "reset" | "button";
  customWidth: string;
  textSize: string;
}

const CustomButton = ({
  paddingX,
  paddingY,
  text,
  buttonType,
  customWidth,
  textSize
}: CustomButtonProps) => {


  return (
    <button
      type={`${buttonType}`}
      className={`btn ${customWidth !== "no" && `w-${customWidth}`} rounded-md border border-black border-1 bg-custom-yellow px-${paddingX} py-${paddingY} text-${textSize} font-bold text-black shadow-sm hover:bg-black hover:text-custom-yellow focus:outline-none focus:ring-2`}
    >
      {text}
    </button>
  );
};

export default CustomButton;
