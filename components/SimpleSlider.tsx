"use client";
import Image from "next/image";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function SimpleSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };
  return (
    <div className="slider-container max-w-screen-2xl mx-auto px-16 max-md:px-10">
      <Slider {...settings}>
        <div className="h-[500px] max-lg:h-[400px] max-md:h-[250px] max-[500px]:h-[200px] max-[400px]:h-[150px]">
          <img src="/slider image 1.webp" alt="slider 1" className="h-full" />
        </div>
        <div className="h-[500px] max-lg:h-[400px] max-md:h-[250px] max-[500px]:h-[200px] max-[400px]:h-[150px]">
          <img src="/slider image 2.jpg" alt="slider 1" className="h-full" />
        </div>
      </Slider>
    </div>
  );
}

export default SimpleSlider;