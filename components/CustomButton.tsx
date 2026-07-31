// *********************
// Role of the component: Custom button component
// Name of the component: CustomButton.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <CustomButton paddingX={paddingX} paddingY={paddingY} text={text} buttonType={buttonType} customWidth={customWidth} textSize={textSize} />
// Input parameters: CustomButtonProps interface
// Output: custom button component
// *********************

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
      className={`${customWidth !== "no" && `w-${customWidth}`} uppercase bg-brand-surface px-${paddingX} py-${paddingY} text-${textSize} border border-brand-border font-bold text-brand-primary shadow-sm transition-colors hover:bg-brand-surface-alt hover:text-brand-primary-hover focus:outline-none focus:ring-2 focus:ring-brand-primary disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {text}
    </button>
  );
};

export default CustomButton;
