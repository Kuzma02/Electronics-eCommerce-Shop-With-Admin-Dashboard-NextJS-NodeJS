import React from "react";

const IntroducingSection = () => {
  return (
    <div className="py-20 pt-24 bg-gradient-to-l from-white to-blue-600">
      <div className="text-center flex flex-col gap-y-5 items-center">
        <h2 className="text-white text-8xl font-extrabold text-center mb-2">
          INTRODUCING <span className="text-black">SINGI</span><span className="text-blue-600">TRONIC</span>
        </h2>
        <div>
          <p className="text-white text-center text-2xl font-semibold">
            Buy the latest electronics.
          </p>
          <p className="text-white text-center text-2xl font-semibold">
            The best electronics for tech lovers.
          </p>
          <button className="text-blue-600 bg-white font-bold px-12 py-3 text-xl hover:bg-gray-100 w-96 mt-2">
            SHOP NOW
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntroducingSection;
