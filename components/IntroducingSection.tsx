import React from "react";

const IntroducingSection = () => {
  return (
    <div className="py-20 pt-24 bg-blue-500">
      <div className="text-center flex flex-col gap-y-5 items-center">
        <h2 className="text-white text-8xl font-extrabold text-center mb-2">
          INTRODUCING SINGITRONIC
        </h2>
        <div>
          <p className="text-white text-center text-2xl font-semibold">
            Buy the latest electronics.
          </p>
          <p className="text-white text-center text-2xl font-semibold">
            The best electronics for tech lovers.
          </p>
          <button className="bg-white text-blue-600 font-bold px-12 py-3 max-lg:text-xl max-sm:text-lg hover:bg-gray-100 w-96 mt-2">
            SHOP NOW
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntroducingSection;
